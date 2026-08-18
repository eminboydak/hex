---
name: enforce-strict-typescript
description: Enforce strict TypeScript mode. No `any` types allowed. All types must be explicitly declared. Error on `any` usage.

# Strict TypeScript Enforcement

## What it catches

- `any` type usage anywhere
- Implicit `any` types (return types, parameters without types)
- Missing type annotations in functions
- Untyped variables

## What to do instead

```typescript
// ❌ Wrong
function getData(data: any) { ... }

// ✅ Correct
interface Data {
  id: number;
  title: string;
}
function getData(data: Data) { ... }

// ❌ Wrong
const result = fetch() as any;

// ✅ Correct
const result = await fetch();
const data = await result.json() as Post[];

// ❌ Wrong
async function handle(req: any) { ... }

// ✅ Correct
async function handle(req: Request): Promise<Response> { ... }
```