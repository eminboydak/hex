---
name: enforce-tailwind-only
description: Enforce Tailwind utility classes only. No `style=` or inline styles allowed.

# Tailwind-Only Enforcement

## What it catches

- `style="color: red"` attributes
- `style=` on any element
- Inline `<style>` tags
- JavaScript `element.style.***` mutations

## What to do instead

```tsx
// ❌ Wrong
<div style="color: red">Error</div>

// ✅ Correct
<div class="text-red-500">Error</div>

// ❌ Wrong
<p style={{ color: 'red' }}>Error</p>

// ✅ Correct
<p class="text-red-500">Error</p>
```

## Allowed

- Tailwind utility classes (e.g., `p-4`, `text-center`)
- Tailwind design system config (`tailwind.config.mjs` → `design-system`)
- Component composition for reusable styles
- Global CSS (`styles/global.css`)

## Why this rule

- Keeps styling declarative and maintainable
- No inline strings that scatter visual logic
- Works well with Tailwind theme system

## Edge cases

If you need dynamic styles (e.g. inline animations), use CSS variables and update `styles/global.css` instead.