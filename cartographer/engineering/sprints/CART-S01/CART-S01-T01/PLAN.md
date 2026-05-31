# PLAN — CART-S01-T01: Fix mkdirSync static import and verify gates

**Task:** CART-S01-T01
**Sprint:** CART-S01
**Estimate:** S

---

## Objective

Verify that `src/store/graph.ts` already has `mkdirSync` in the top-level static `import { … } from "fs"` statement and that `save()` contains no `await`, then run the full gate suite (`npm run build`, `npm test`, `npm run lint`) to confirm all acceptance criteria are satisfied, and remove the stale known-issues entry from `CLAUDE.md`.

## Approach

1. **Confirm current state of `graph.ts`**: static import line already includes `mkdirSync`; `save()` is plain synchronous (no `await`). Code fix is already in place.
2. **Run gate suite in order**:
   - `npm run build` — TypeScript compilation must exit 0 with no TS1308 or other errors.
   - `npm test` — vitest must pass, including the regression guard in `src/store/graph.test.ts` that verifies `mkdirSync` is called before `writeFileSync`.
   - `npm run lint` — ESLint must exit 0.
3. **Update `CLAUDE.md`**: remove (or mark resolved) the known-issues bullet for the `await import("fs")` bug now that gates are green.
4. No new code logic is required — the implementation work is purely verification and documentation cleanup.

## Files to Modify

| File | Change | Rationale |
|---|---|---|
| `src/store/graph.ts` | No change expected — verify static import and sync `save()` already present | Bug fix was already applied in working tree |
| `CLAUDE.md` | Remove the stale known-issues bullet for `await import("fs")` | AC #6 requires this entry be removed once gates are green |

## Plugin Impact Assessment

- **Version bump required?** No — this is a verification + doc-cleanup task, no behaviour change
- **Migration entry required?** No
- **Security scan required?** No
- **Schema change?** No

## Testing Strategy

- `npm run build` — TypeScript compiler must exit 0; any TS1308 error would indicate the bug is not fixed
- `npm test` — vitest runs all suites including `src/store/graph.test.ts` (CART-B01 regression guard) and `src/__tests__/graph.test.ts`; both must pass
- `npm run lint` — ESLint must exit 0 on `src/`

## Acceptance Criteria

- [ ] `src/store/graph.ts` line 2 reads `import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";` (or equivalent single-statement static import including `mkdirSync`)
- [ ] `save()` contains no `await` keyword
- [ ] `npm run build` exits 0 with no TypeScript errors
- [ ] `npm test` exits 0 — regression guard passes (mkdirSync called before writeFileSync)
- [ ] `npm run lint` exits 0
- [ ] The known-issues bullet for `graph.ts:save()` is removed from `CLAUDE.md`

## Operational Impact

- **Distribution:** No user action required — offline CLI only
- **Backwards compatibility:** No breaking changes — `save()` behaviour is identical, import style is an internal detail
