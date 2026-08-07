/**
 * Guestbook identity — DESIGN.md §3.3.
 *
 * `permute32` is a 4-round Feistel network over the full 32-bit space, so it is
 * a bijection (permutation): every distinct input maps to a distinct output →
 * 0% collision. The integer db id is thus obfuscated into a stable, random-looking
 * 8-hex identifier, and the same bits deterministically drive a pure-SVG identicon.
 */

// Fixed round keys (arbitrary; changing them changes the permutation).
const ROUND_KEYS = [0x428a, 0xa3f1, 0x7c5d, 0x9e37];

function roundFn(x: number, key: number): number {
  let h = (x ^ key) | 0;
  h = Math.imul(h, 0x9e3779b1);
  h ^= h >>> 13;
  return h & 0xffff;
}

function permute32(input: number): number {
  let l = input & 0xffff;
  let r = (input >>> 16) & 0xffff;
  for (let i = 0; i < ROUND_KEYS.length; i++) {
    r ^= roundFn(l, ROUND_KEYS[i]!);
    const t = l;
    l = r;
    r = t;
  }
  return ((l << 16) | r) >>> 0;
}

// Catppuccin Macchiato accent tokens (identicons keep a fixed palette per DESIGN).
const PALETTE = ['#c6a0f6', '#f5a97f', '#7dc4e4', '#f4dbd4']; // Mauve, Peach, Sapphire, Rosewater

function renderIdenticon(hash: number): string {
  const SIZE = 5;
  const base = (hash >>> 30) & 0x3; // top 2 bits rotate the palette across icons
  let bits = hash;
  let rects = '';
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < 3; col++) {
      const v = bits & 0x3;
      bits >>>= 2;
      if (v === 0) continue; // sparse pixel pattern
      const fill = PALETTE[(base + v) % 4]!;
      rects += `<rect x="${col}" y="${row}" width="1" height="1" fill="${fill}"/>`;
      const mirror = SIZE - 1 - col;
      if (mirror !== col) {
        rects += `<rect x="${mirror}" y="${row}" width="1" height="1" fill="${fill}"/>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" shape-rendering="crispEdges" role="img" aria-hidden="true" focusable="false">${rects}</svg>`;
}

export interface Identity {
  formattedId: string;
  identiconSvg: string;
}

/** Map a guestbook row id to its public identity (10-char `0x…` id + identicon SVG). */
export function identityFromId(dbId: number): Identity {
  const hash = permute32(dbId >>> 0);
  return {
    formattedId: '0x' + hash.toString(16).padStart(8, '0'),
    identiconSvg: renderIdenticon(hash),
  };
}

export function formatId(dbId: number): string {
  return '0x' + permute32(dbId >>> 0).toString(16).padStart(8, '0');
}
