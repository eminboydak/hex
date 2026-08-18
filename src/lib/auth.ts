/**
 * Authentication middleware for Cloudflare Access JWT + dev fallback.
 *
 * Production: Verifies cf-access-jwt-assertion via jose (signature + AUD)
 * Development: Fallback to shared-secret header (x-admin-token vs ADMIN_TOKEN)
 */

import * as jose from 'jose';

/**
 * JWKS cache for Cloudflare Access public keys.
 * Caches across Worker invocations to avoid repeated fetches.
 */
let JWKS: any[] = [];
let JWKS_FETCH_TIME = 0;
const JWKS_CACHE_TTL = 300000; // 5 minutes

/**
 * Fetch and cache Cloudflare Access JWKS.
 */
async function fetchJWKS(audience: string): Promise<any[]> {
  const now = Date.now();
  if (JWKS && JWKS.length > 0 && (now - JWKS_FETCH_TIME < JWKS_CACHE_TTL)) {
    return JWKS;
  }

  // Cloudflare Access JWKS endpoint
  const jwksUrl = `https://${audience}.cloudflareaccess.com/cdn-cgi/access/certs`;
  const response = await fetch(jwksUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS: ${response.status}`);
  }

  const jwks: any = await response.json();
  JWKS = jwks.keys || [];
  JWKS_FETCH_TIME = now;
  return JWKS;
}

/**
 * Verify Cloudflare Access JWT.
 * @param token - JWT token string
 * @param audience - Cloudflare Access Application Audience
 * @returns Decoded JWT payload
 */
export async function verifyCfAccessToken(
  token: string,
  audience: string
): Promise<jose.JWTPayload> {
  try {
    const jwks = await fetchJWKS(audience);
    
    const { payload } = await jose.jwtVerify(token, jose.createRemoteJWKSet(
      new URL(`https://${audience}.cloudflareaccess.com/cdn-cgi/access/certs`)
    ), {
      issuer: `https://${audience}.cloudflareaccess.com`,
      audience,
    });

    return payload;
  } catch (error) {
    throw new Error(`JWT verification failed: ${error}`);
  }
}

/**
 * Admin authentication check.
 * Returns true if request is authenticated, false otherwise.
 */
export async function requireAdmin(
  request: Request,
  env: any
): Promise<{ authenticated: boolean; error?: string }> {
  const url = new URL(request.url);
  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  // Production: Verify Cloudflare Access JWT
  if (!isLocal) {
    const jwtHeader = request.headers.get('cf-access-jwt-assertion');
    if (!jwtHeader) {
      return { authenticated: false, error: 'Missing cf-access-jwt-assertion header' };
    }

    try {
      const audience = env.ADMIN_AUD;
      if (!audience) {
        return { authenticated: false, error: 'ADMIN_AUD not configured' };
      }

      await verifyCfAccessToken(jwtHeader, audience);
      return { authenticated: true };
    } catch (error) {
      return { authenticated: false, error: 'JWT verification failed' };
    }
  }

  // Development: Fallback to shared-secret
  const tokenHeader = request.headers.get('x-admin-token');
  if (!tokenHeader) {
    return { authenticated: false, error: 'Missing x-admin-token header' };
  }

  if (tokenHeader === env.ADMIN_TOKEN) {
    return { authenticated: true };
  }

  return { authenticated: false, error: 'Invalid admin token' };
}

/**
 * Hono middleware for admin authentication.
 */
export function adminAuthMiddleware() {
  return async (c: any, next: () => Promise<void>) => {
    const { authenticated, error } = await requireAdmin(c.req.raw, c.env);
    if (!authenticated) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }
    await next();
  };
}