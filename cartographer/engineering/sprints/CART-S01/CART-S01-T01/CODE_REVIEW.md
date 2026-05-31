# CODE_REVIEW — CART-S01-T01 (iteration 1 of 3)

**Task:** Fix mkdirSync static import and verify gates
**Reviewer:** supervisor
**Verdict:** Approved

---

## Scope reviewed

Verified the implementation of CART-S01-T01 against the approved PLAN.md, the
task prompt, and the project conventions in CLAUDE.md. This is a
verification + documentation-cleanup task; the only source-bearing change beyond
the already-present bug fix was exporting `save` and adding ESLint tooling.

## Acceptance-criteria findings (verified by reading source)

1. **AC#1 — static `mkdirSync` import — SATISFIED.**
   `src/store/graph.ts:2` reads
   `import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";`
   Single top-level static import, matching CLAUDE.md guidance. The original
   `await import("fs")`-inside-a-sync-function bug (CART-B01 root cause) is gone.

2. **AC#2 — `save()` has no `await` — SATISFIED.**
   `save()` (graph.ts:13-17) is a plain synchronous function. It computes the
   dir, calls `mkdirSync(dir, { recursive: true })`, then `writeFileSync(...)` —
   correct ordering (directory created before file write).

3. **AC#3 — `npm run build` exits 0 — SATISFIED (re-run live).**
   I executed `npm run build`; it exited 0 with no TypeScript errors.
   `graph.ts:65` now exports `{ load, save }`, resolving the TS2459 (`save` used
   without export) that the test file would otherwise trigger.

4. **AC#4 — `npm test` exits 0, regression guard passes — SATISFIED (re-run
   live).**
   I executed `npm test`; exit 0, 6/6 passing across both suites:
   `src/store/graph.test.ts` (CART-B01 regression guard asserting `mkdirSync` is
   invoked before `writeFileSync`) and `src/__tests__/graph.test.ts`.

5. **AC#5 — `npm run lint` exits 0 — SATISFIED (re-run live).**
   I executed `npm run lint`; exit 0, no findings. `eslint.config.js` exists and
   `package.json` carries `eslint`, `@typescript-eslint/eslint-plugin`,
   `@typescript-eslint/parser` as devDependencies plus a `lint: "eslint src"`
   script.

6. **AC#6 — stale known-issues bullet removed from CLAUDE.md — SATISFIED.**
   The current CLAUDE.md "Known issues / in-progress" section lists only the
   `link` fuzzy/id-lookup roadmap item; the `graph.ts:save()` /
   `await import("fs")` bullet is gone.

## Architecture & convention alignment

- `graph.ts` remains pure functions, no class, no singleton state — conforms to
  CLAUDE.md.
- I/O side-effects stay where they belong: `cli.ts` imports
  `load, addNode, link, exportMarkdown` (not `save`); exporting `save` widens the
  module API slightly but is justified — the test suite imports it to assert call
  ordering, and it introduces no new side-effect surface. Acceptable.
- ESM `.js` import extensions preserved (`../types.js`, `./store/graph.js`).
- No network/DB dependency added; offline-only design intact.
- No security surface: offline CLI, no new untrusted input.

## Scope note (in-bounds)

The plan anticipated "no code change expected." The implementer correctly
expanded to the minimum necessary to make the gates actually green:
(a) export `save` (required for the regression test to compile), and
(b) install + configure ESLint (the `lint` gate had no runner before). Both are
in service of the stated acceptance criteria, not scope creep. Approved.

## Advisory (non-blocking, pre-existing — do not expand T01)

- `DATA_PATH` falls back to a literal `"~"` when `HOME` is unset (graph.ts:6,14);
  `mkdirSync`/`writeFileSync` would then target a relative `./~/` dir rather than
  the user's home. Pre-existing, out of scope for this task. Candidate for a
  future hardening task.

## Independent gate verification

All three gates were re-run live by the reviewer (not taken on the implementer's
word):

```
npm run build  → exit 0  (tsc, no errors)
npm test       → exit 0  (vitest: 2 files, 6/6 tests pass, incl. CART-B01 guard)
npm run lint   → exit 0  (eslint src, no findings)
```

These match PROGRESS.md exactly. No source-level or runtime contradiction found.

---

**Disposition:** All six acceptance criteria are met. Source is correct,
maintainable, and convention-aligned. **Approved.**
