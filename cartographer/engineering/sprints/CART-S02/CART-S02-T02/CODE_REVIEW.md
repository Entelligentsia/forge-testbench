# CODE REVIEW — CART-S02-T02: Add read-only carto stats CLI command

**Iteration 1 of 3**

## Verdict: Approved

## Review Scope

Reviewed the implementation of CART-S02-T02 against the approved PLAN.md. Verified the actual diff, source files, and test evidence independently — not from the engineer's report.

## Findings

### 1. Correctness — ✅ Fully compliant with the plan

Every acceptance criterion from the plan is verified against the actual code:

- **`stats` command registered**: `src/cli.ts` line 51 registers `.command("stats").description("Show graph statistics").action(...)`.
- **Uses `graphStats()` from `./store/graph.js`**: Import on line 3 includes `graphStats`; action handler on lines 54-55 calls `graphStats(graph)` — no inline `.length` computation.
- **Pluralisation correct**: Two independent ternaries: `nodes === 1 ? "node" : "nodes"` and `edges === 1 ? "edge" : "edges"`. Output: `"2 nodes, 1 edge"` — matches plan exactly.
- **Read-only command**: No `save()` call, no flags, no arguments, no `.option()` or `.argument()` calls.
- **Success output uses `chalk.green`**: Verified on line 56.
- **`graph.ts` not modified**: `git diff HEAD -- src/store/graph.ts` shows no changes. `graphStats()` was introduced in T01 and is untouched.
- **Empty/missing graph prints `0 nodes, 0 edges`**: `load()` returns `{ nodes: [], edges: [] }` for missing files; `graphStats` on that returns `{ nodes: 0, edges: 0 }`; the ternary `0 === 1` → false → `"nodes"` / `"edges"` → output `"0 nodes, 0 edges"`. Correct.
- **routing.md updated**: Three additions — command inventory, arguments section, error handling note. All accurate.
- **No data model changes, no new dependencies**: `types.ts` and `package.json` are unchanged.

### 2. Security — ✅ Negligible surface

The `stats` command is purely read-only, takes no user input, and performs no filesystem writes. The security-guidance areas (persistence path handling, input validation, dependency introduction) are all clean:
- No user-controlled strings reach filesystem paths.
- No `save()` or write path invoked.
- No new dependencies introduced.
- No shell/eval usage.

### 3. Architecture — ✅ Follows established patterns

- `cli.ts` is the only I/O boundary — `stats` registered alongside `list`, `export`.
- `graphStats()` is a pure function in `graph.ts`: takes `Graph`, returns `{ nodes: number; edges: number }`.
- ESM `.js` import extension respected: `from "./store/graph.js"`.
- Pattern matches existing `list` and `export` commands exactly.
- No singleton state, no module-level side effects in graph.ts.

### 4. Conventions — ✅ All project conventions upheld

- `const` and arrow functions only — no `class` definitions.
- `console.log` with `chalk.green` for success output (no `console.error` needed — read-only command has no error path).
- `strict: true` in `tsconfig.json` — unchanged.
- No `require()` / CommonJS patterns.
- No network or database imports.
- `DATA_PATH` derives from `process.env.HOME ?? "~"` — unchanged.

### 5. Business Rules — ✅ All domain invariants preserved

- `Graph` / `Node` / `Edge` in `types.ts` are the SSOT — no modifications.
- Case-sensitive `title` lookup unchanged in `link()`.
- `save()` calls `mkdirSync` before `writeFileSync` (CART-B01 guard intact — verified in `graph.test.ts` lines 26-38).
- Edge `weight` still hardcoded to `1`.
- `lowdb` / `enquirer` still unused — no silent integration.

### 6. Testing — ✅ Adequate for scope

- `graphStats` pure logic covered by 2 test cases in T01 (empty graph, 2-node/1-edge graph). Both present in `src/__tests__/graph.test.ts` lines 302-319.
- `npm test` passes all 21 tests — **independently verified**.
- `npm run build` compiles cleanly — **independently verified**.
- `npm run lint` reports no violations — **independently verified**.
- CLI action handler is an I/O thin shell (load + console.log) — plan explicitly acknowledges no automated tests for this layer, with manual smoke tests specified.

### 7. Verification Results (independently run)

| Command | Result |
|---------|--------|
| `npm test` | ✅ 21 tests pass |
| `npm run build` | ✅ Clean compilation |
| `npm run lint` | ✅ No violations |

## Advisory Notes

1. **Pluralisation ternaries are untested by the automated suite.** The plan acknowledges this — the CLI handler is an I/O thin shell. Future CLI integration tests could cover this if needed, but the logic is trivial (two independent ternaries) and the risk is low.
2. **Changes are unstaged.** The T02 diff appears in `git diff HEAD` (working tree changes), not in the committed history. The implementation is correct but needs to be committed before the pipeline advances.

## Summary

The implementation is a minimal, correct, read-only addition to `cli.ts` that follows the established command patterns exactly. No spec deviations, no security concerns, no architectural violations, no convention breaks, no business rule changes. All verification commands pass independently. Approved.