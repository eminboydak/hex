/**
 * WordPress-style slug generator with Turkish character support.
 * Generates SEO-friendly slugs from titles, handling conflicts by suffixing.
 */

/**
 * Generate a URL-friendly slug from a title.
 * Preserves Turkish characters (çğıöşü), follows WordPress sanitization pattern.
 * @param title - The source title to slugify
 * @returns A URL-safe slug (60 char max, lowercase, hyphen-separated)
 */
export function generateSlug(title: string): string {
  // WordPress style: Turkish characters preserve + sanitize
  let slug = title.toLowerCase().trim();

  // Replace special characters with hyphens (WordPress pattern)
  slug = slug.replace(/[^a-z0-9\s-çğıöşü]/g, '');

  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-');

  // Remove multiple hyphens
  slug = slug.replace(/-+/g, '-');

  // Trim hyphens from ends
  slug = slug.trim().replace(/^-+|-+$/g, '');

  // Limit to 60 characters (SEO optimal)
  slug = slug.substring(0, 60);

  // Fallback if empty
  if (!slug) {
    slug = `post-${crypto.randomUUID().substring(0, 8)}`;
  }

  return slug;
}

/**
 * Generate a unique slug by adding suffixes if conflicts exist.
 * WordPress style: slug, slug-2, slug-3, etc.
 * @param title - The source title
 * @param existingSlugs - Array of existing slugs to check for conflicts
 * @returns A unique slug not in existingSlugs
 */
export async function generateUniqueSlug(
  title: string,
  existingSlugs: string[]
): Promise<string> {
  let slug = generateSlug(title);
  let counter = 2;
  let uniqueSlug = slug;

  // Check for conflicts and add suffixes
  while (existingSlugs.includes(uniqueSlug)) {
    const slugWithSuffix = `${slug}-${counter}`;
    // Ensure slug with suffix doesn't exceed 60 chars
    if (slugWithSuffix.length > 60) {
      // Truncate base slug to fit suffix
      const baseMaxLength = 60 - `-${counter}`.length;
      uniqueSlug = `${slug.substring(0, baseMaxLength)}-${counter}`;
    } else {
      uniqueSlug = slugWithSuffix;
    }
    counter++;
  }

  return uniqueSlug;
}

/**
 * Check if a slug would be unique against existing slugs.
 * @param slug - The slug to check
 * @param existingSlugs - Array of existing slugs
 * @returns Object with isUnique boolean and suggested alternatives if not unique
 */
export function checkSlugUniqueness(
  slug: string,
  existingSlugs: string[]
): { isUnique: boolean; alternatives: string[] } {
  const isUnique = !existingSlugs.includes(slug);
  const alternatives: string[] = [];

  if (!isUnique) {
    // Generate 5 alternatives
    for (let i = 2; i <= 6; i++) {
      const alternative = `${slug}-${i}`;
      if (!existingSlugs.includes(alternative)) {
        alternatives.push(alternative);
      }
      // Stop if we have enough alternatives
      if (alternatives.length >= 3) {
        break;
      }
    }
  }

  return { isUnique, alternatives };
}