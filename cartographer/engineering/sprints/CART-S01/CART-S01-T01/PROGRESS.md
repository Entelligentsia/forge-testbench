# PROGRESS — CART-S01-T01: Fix mkdirSync static import and verify gates

**Task:** CART-S01-T01
**Sprint:** CART-S01
**Status:** implemented
**Date:** 2026-05-31

---

## Summary of Changes

The `graph.ts:save()` known-issues entry in `CLAUDE.md` described a bug where `await import("fs")` was used inside a synchronous function. Inspection confirmed the bug was already fixed in the working tree — `src/store/graph.ts` line 2 uses a proper top-level static import and `save()` contains no `await`.

However, the build gate (`npm run build`) revealed a TypeScript error:
- `src/__tests__/graph.test.ts` imported `save` which was not exported from `graph.ts`

Additionally, `npm run lint` failed because `eslint` was not installed and had no configuration file.

Both blockers were resolved:
1. **Exported `save`** from `src/store/graph.ts` by adding it to the bottom-of-file `export { load, save }` statement.
2. **Installed ESLint** (`eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`) as dev dependencies.
3. **Created `eslint.config.js`** — minimal ESLint v9 flat config for TypeScript source files.
4. **Removed the stale known-issues bullet** from `CLAUDE.md` (the `await import("fs")` entry).

---

## Test Evidence

### `npm run build` — TypeScript Compilation

```
> cartographer@0.1.0 build
> tsc

[exit: 0]
```

### `npm test` — Vitest

```
> cartographer@0.1.0 test
> vitest run

 RUN  v1.6.1 /home/boni/src/forge-testbench/cartographer

 ✓ src/store/graph.test.ts  (1 test) 28ms
 ✓ src/__tests__/graph.test.ts  (5 tests) 12ms

 Test Files  2 passed (2)
      Tests  6 passed (6)
   Start at  08:21:53
   Duration  497ms (transform 70ms, setup 0ms, collect 91ms, tests 40ms, environment 0ms, prepare 149ms)

[exit: 0]
```

### `npm run lint` — ESLint

```
> cartographer@0.1.0 lint
> eslint src

[exit: 0]
```

---

## Acceptance Criteria

- [x] `src/store/graph.ts` line 2 includes `mkdirSync` in static import from `"fs"`
- [x] `save()` contains no `await` keyword
- [x] `npm run build` exits 0 with no TypeScript errors
- [x] `npm test` exits 0 — regression guard passes (mkdirSync called before writeFileSync)
- [x] `npm run lint` exits 0
- [x] The known-issues bullet for `graph.ts:save()` is removed from `CLAUDE.md`

---

## Files Changed

| File | Change |
|------|--------|
| `src/store/graph.ts` | Added `save` to export statement: `export { load, save }` |
| `CLAUDE.md` | Removed stale `graph.ts:save()` known-issues bullet |
| `eslint.config.js` | Created: minimal ESLint v9 flat config for TypeScript |
| `package.json` | Added devDependencies: `eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` |
| `package-lock.json` | Updated by npm install |
