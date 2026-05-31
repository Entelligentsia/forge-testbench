# Validation Report — CART-S01-T01 (iteration 2 of 3)

**Task:** Fix mkdirSync static import and verify gates
**Persona:** Quinn — QA Engineer — "Absence of a test is not evidence of passing."
**Verdict:** Approved

---

All six acceptance criteria are satisfied, each confirmed against live evidence
gathered in this validation run (gates re-run live; not taken from PROGRESS.md).

## Note on prior attempt

Iteration 1 reported the gates as failing (`EJSONPARSE`, `vitest: not found`,
`eslint: not found`) because that environment had no `node_modules` and read a
malformed manifest. That was an environmental artifact of the iteration-1 sandbox,
not the real working-tree state. This iteration re-ran every gate live with
`node_modules` installed and a valid `package.json`; all three pass.

## Acceptance-criteria results

### AC1 — `mkdirSync` in top-level static `import … from "fs"` (no `await import` in source) — PASS
`src/store/graph.ts:2` reads
`import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";`.
The only `await import` matches in `src/` are in test files (vitest mock setup),
not in `graph.ts`. The dynamic-import-in-sync-function bug (CART-B01) is gone.

### AC2 — `save()` contains no `await` — PASS
`grep -n "await" src/store/graph.ts` returns nothing. `save()` (lines 13–17) is a
plain synchronous function: computes dir → `mkdirSync(dir, { recursive: true })`
→ `writeFileSync(...)` (directory created before file write).

### AC3 — `npm run build` (tsc) exits 0, no TS errors — PASS
Live run: `BUILD_EXIT=0`, no compiler output.

### AC4 — `npm test` exits 0; regression guard passes — PASS
Live run: `TEST_EXIT=0`, 6/6 tests pass across 2 files. `src/store/graph.test.ts`
("CART-B01" guard) asserts
`mkdirSyncSpy.mock.invocationCallOrder[0] < writeFileSyncSpy.mock.invocationCallOrder[0]`
— a genuine ordering assertion (directory created before file write), not merely
"tests pass". It would fail if a future change reordered or dropped the
`mkdirSync` call.

### AC5 — `npm run lint` exits 0 — PASS
Live run: `LINT_EXIT=0`, no findings (`eslint src`). `eslint.config.js` present;
`eslint` + `@typescript-eslint/*` installed as devDependencies.

### AC6 — stale known-issues bullet removed from `CLAUDE.md` — PASS
`CLAUDE.md` "Known issues / in-progress" (lines 47–49) now lists only the `link`
fuzzy/id-lookup roadmap item. `grep` for `await import` / "inside a sync" in
`CLAUDE.md` returns nothing.

## Live gate evidence

```
npm test       → TEST_EXIT=0   (vitest: 2 files, 6/6 tests pass, incl. CART-B01 guard)
npm run build  → BUILD_EXIT=0  (tsc, no errors)
npm run lint   → LINT_EXIT=0   (eslint src, no findings)
```

Test breakdown:
- `src/store/graph.test.ts` (1 test) — CART-B01 regression guard (mkdirSync-before-writeFileSync)
- `src/__tests__/graph.test.ts` (5 tests)

## Boundary / coverage observations

- AC4 coverage is genuine: the guard test mocks `fs`, spies through to the real
  `mkdirSync`/`writeFileSync` recording invocation order, and asserts ordering.
- Advisory (non-blocking, pre-existing, out of scope for T01): `DATA_PATH` and
  `save()` fall back to a literal `"~"` when `HOME` is unset (`graph.ts:6,14`),
  which would target a relative `./~/` directory. Flagged in the code review;
  candidate for a future hardening task. Not in this task's acceptance criteria.

## Disposition

All six acceptance criteria met with live, reproducible evidence. Source is
correct and convention-aligned. **Approved.**
