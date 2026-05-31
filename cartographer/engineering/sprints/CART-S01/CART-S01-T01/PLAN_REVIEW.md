# PLAN_REVIEW — CART-S01-T01: Fix mkdirSync static import and verify gates (iteration 1 of 3)

**Verdict:** Approved

## Scope of review

Reviewed PLAN.md for CART-S01-T01 against the task requirement and the actual
state of the codebase. Verification was done by reading the real source file
`src/store/graph.ts` directly, not by trusting the plan's claims.

## Independent verification (primary source)

- `src/store/graph.ts:2` reads exactly:
  `import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";`
  — `mkdirSync` is present in the single top-level static import. **AC #1 satisfied.**
- `save()` (lines 13–17) is a plain synchronous function. It contains no `await`
  and no `await import("fs")`. It calls `mkdirSync(dir, { recursive: true })`
  before `writeFileSync(...)`. **AC #2 satisfied; the CART-B01 root cause is
  fixed in the working tree.**

These two facts are the core of the task, and both are already true. The plan's
characterization of the current state is accurate.

## Assessment of the plan

- **Feasibility:** High. The code change is already in place, so the work
  reduces to running the gate suite and a one-line doc edit. Realistic.
- **Completeness:** The plan covers all six acceptance criteria and maps each to
  a concrete verification step.
- **Architecture alignment:** Consistent with CLAUDE.md guidance, which
  explicitly prescribes "importing `mkdirSync` at the top of the file" — exactly
  what the working tree now does. No new dependencies, no class, no I/O moved out
  of the intended boundary.
- **Testing strategy:** Sound. Build (would surface TS1308 if the await-import
  regressed), test (CART-B01 regression guard for mkdirSync-before-writeFileSync),
  and lint are the right three gates. Note T02 owns adding the directory-path
  assertion test; T01 only needs the existing guard to pass.
- **Security:** No security surface. Offline CLI, no network/DB, no untrusted
  input introduced.

## Advisory notes (non-blocking)

1. The plan lists `CLAUDE.md` removal of the stale known-issues bullet as AC #6.
   That bullet still describes the bug as live ("graph.ts:save() has a bug:
   await import('fs') inside a sync function"). Implementer must actually delete
   or mark-resolved that bullet; leaving it stale would violate AC #6 even though
   the code is fixed.
2. Pre-existing concern, out of scope for this task but worth a backlog note:
   `DATA_PATH`/`dir` fall back to the literal string `"~"` when `process.env.HOME`
   is unset, which would create a directory literally named `~`. Not introduced
   by this change; do not expand T01's scope to address it.
3. Gate evidence: the verdict above is based on static file inspection. The
   implementer/validator must still capture actual exit-0 output for
   `npm run build`, `npm test`, and `npm run lint` as the recorded proof for
   AC #3–#5; this review does not substitute for running them.

## Conclusion

The plan is correct, appropriately scoped, and aligned with project conventions.
The substantive code fix is already present and independently confirmed. Approved
to proceed to implementation (gate execution + CLAUDE.md cleanup).
