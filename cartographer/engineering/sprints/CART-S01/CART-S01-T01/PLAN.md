# PLAN — CART-S01-T01: Fix mkdirSync static import and verify gates

**Task:** CART-S01-T01
**Sprint:** CART-S01
**Estimate:** S

---

## Objective

Verify that `src/store/graph.ts` already has `mkdirSync` correctly imported via a static top-level import from `"fs"` and that `save()` contains no `await` expression, then run the full gate suite (`npm run build`, `npm test`, `npm run lint`) to confirm all acceptance criteria are satisfied, and clean up the CLAUDE.md known-issues entry if one exists.

## Approach

The task-prompt context notes that at plan time the static-import fix and the `mkdirSync` call inside `save()` were already present in the working tree. The implementation phase therefore consists of:

1. Inspect `src/store/graph.ts` and confirm the single top-level `import { … } from "fs"` line already includes `mkdirSync`.
2. Confirm `save()` contains no `await` keyword.
3. Run `npm run build` (TypeScript compiler), `npm test` (vitest), and `npm run lint` (eslint) sequentially, and capture exit codes.
4. If any gate is red, apply the minimal targeted fix:
   - Build error: merge `mkdirSync` into the existing import statement (do not add a second `import … from "fs"` line).
   - Test failure: ensure `save()` calls `mkdirSync(dir, { recursive: true })` synchronously before `writeFileSync`.
   - Lint error: correct the offending line per ESLint guidance.
5. Inspect CLAUDE.md § "Known issues / in-progress" and remove or mark resolved any entry that refers to the `mkdirSync` / `await import` bug (CART-B01). The `link`-fuzzy-lookup roadmap item is unrelated and must be left intact.
6. Re-run all three gates after any correction to confirm all exit 0.

## Files to Modify

| File | Change | Rationale |
|---|---|---|
| `src/store/graph.ts` | Confirm (or add) `mkdirSync` to the static `import { … } from "fs"` block; remove any `await import(…)` fallback | Eliminates TS1308 compile error and ensures the directory is created reliably before every `writeFileSync` call |
| `CLAUDE.md` | Remove or mark resolved the CART-B01 / mkdirSync known-issue entry in § "Known issues / in-progress" | Keeps the doc accurate once the fix is verified |

## Plugin Impact Assessment

- **Version bump required?** No — this is a bug-fix to internal storage logic; no public API surface changes.
- **Migration entry required?** No — no store schema or config changes.
- **Security scan required?** No — no changes to `.forge/` tooling.
- **Schema change?** No.

## Testing Strategy

- `npm run build` — TypeScript compiler must exit 0 with no TS1308 or related errors.
- `npm test` — vitest suite must exit 0; the regression guard in `save()` tests (`mkdirSync` called before `writeFileSync`, always called once) must pass.
- `npm run lint` — ESLint must exit 0 with no lint errors.

No new tests are required by this task; existing tests already cover the `save()` behaviour. (CART-S01-T02 adds the directory-path assertion test as a separate task.)

## Acceptance Criteria

- [ ] `src/store/graph.ts` `import { … } from "fs"` includes `mkdirSync` (no dynamic `await import`)
- [ ] `save()` contains no `await` keyword
- [ ] `npm run build` exits 0
- [ ] `npm test` exits 0 — all existing tests pass including the `mkdirSync`-before-`writeFileSync` regression guard
- [ ] `npm run lint` exits 0
- [ ] CLAUDE.md § "Known issues / in-progress" has no stale CART-B01 / mkdirSync entry

## Operational Impact

- **Distribution:** No user action required; this is an internal file-write reliability fix.
- **Backwards compatibility:** Fully backward-compatible — the synchronous `mkdirSync` call is idempotent when the directory already exists (`{ recursive: true }` is set).
- **Version bump:** Not required.
