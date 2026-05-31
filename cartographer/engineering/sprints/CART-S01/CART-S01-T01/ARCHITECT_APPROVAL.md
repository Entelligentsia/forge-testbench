# Architect Approval — CART-S01-T01

**Verdict:** Approved

## Scope of Approval

Final architectural sign-off on the fix that replaces the broken
`await import("fs")` inside the synchronous `save()` in `src/store/graph.ts`
with a top-of-file static `mkdirSync` import.

## Architectural Review

- **Contract integrity restored.** `save()` is declared synchronous; the prior
  `await import("fs")` violated that contract and crashed on first-run when
  `~/.cartographer/` did not exist. The fix removes the only `await` from a sync
  function, aligning with the `graph.ts` "pure functions, sync I/O" model in CLAUDE.md.
- **Implementation verified against source.** `src/store/graph.ts` now imports
  `{ writeFileSync, mkdirSync, readFileSync, existsSync }` statically and calls
  `mkdirSync(dir, { recursive: true })` before `writeFileSync`. No `async`, no `import()`.
- **Gates re-run independently.** `npm test` → all suites pass (2 files, 6/6 tests
  incl. the CART-B01 mkdirSync-before-writeFileSync guard); `npm run lint` → clean.
- **No cross-cutting concerns.** Change is localized to one function; no API surface
  change, no node-lookup semantics touched, no new CLI commands, no lowdb migration.
  All "Out of Scope" boundaries from the task prompt are respected.

## Deployment Notes

- No operational impact. Persistence remains offline JSON at `~/.cartographer/graph.json`.
- No migration, no schema change, no new dependency. The fix only ensures the parent
  directory is created recursively before the first write.

## Follow-up Items

- The directory-creation regression test is already scoped as **CART-S01-T02**
  (Add save() directory-path assertion test) — proceed with that to lock in coverage.
- **Minor (non-blocking):** `VALIDATION_REPORT.md` contains a corrupted/duplicated
  acceptance-criteria table (repeated rows, odd numbering). The underlying gates and
  source verify correctly, so this is a cosmetic artifact defect, not an approval
  blocker. Worth regenerating cleanly in a future validation pass.
