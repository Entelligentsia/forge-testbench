# PLAN — CART-S03-T02: Implement `carto ls` command to list all nodes

🌱 *cartographer Engineer*

**Task:** CART-S03-T02
**Sprint:** CART-S03
**Estimate:** S

---

## Objective

Add a new `ls` sub-command to `carto` that prints every node title in `chalk.cyan`, one per line. If the graph is empty, it prints `No nodes yet.` in `chalk.yellow`. The `ls` command is read-only — it introduces no mutations, no new dependencies, and no data model changes.

---

## Approach

1. **Add `listNodeTitles()` to `src/store/graph.ts`** — a new pure function that reads the graph via `load()` and returns `string[]` (the titles). It does not mutate the graph.

2. **Add the `ls` sub-command to `src/cli.ts`** — wired in the `program` chain alongside the existing `list` command. Calls `listNodeTitles()`, iterates over titles printing `chalk.cyan(title)` per line. If the array is empty, prints `chalk.yellow("No nodes yet.")` instead.

3. **Write tests for the new `listNodeTitles()` function** in `src/store/graph.test.ts` using the existing `vi.mock("fs")` pattern — verify it returns all titles for a populated graph and returns an empty array when no nodes exist.

4. **Verify** with `npm run build`, `npm test`, and `npm run lint`.

---

## Files to Modify

| File | Change | Rationale |
|---|---|---|
| `src/store/graph.ts` | Add `listNodeTitles(): string[]` pure function | Core data access — returns titles only, no mutation |
| `src/cli.ts` | Add `ls` sub-command wiring; add `listNodeTitles` to import | CLI entry point for the new command |
| `src/store/graph.test.ts` | Add `describe("listNodeTitles")` block | Unit test coverage for the new function |

---

## Data Model Changes

None. `ls` is a read-only operation on the existing `Graph` shape (`nodes: Node[]`). No new fields, types, or persistence changes.

---

## Testing Strategy

- **Unit test** (`src/store/graph.test.ts`): Test `listNodeTitles()` — populate `mockGraph` with two nodes, verify the function returns exactly those two titles; then set `mockGraph = { nodes: [], edges: [] }`, verify it returns an empty array.
- **Syntax check**: `npm run build` compiles cleanly.
- **Lint**: `npm run lint` reports no new violations.
- **Manual smoke test**: Add a node via `carto add "Test Node"`, then run `carto ls` and verify the title appears in cyan; run with no nodes and verify `No nodes yet.` in yellow.

---

## Acceptance Criteria

- [ ] `carto ls` prints all node titles, one per line, in `chalk.cyan`
- [ ] `carto ls` on an empty graph prints `No nodes yet.` in `chalk.yellow`
- [ ] `npm run build` compiles with no TypeScript errors
- [ ] `npm test` passes — new behaviour covered by tests in `src/store/graph.test.ts`
- [ ] `npm run lint` reports no violations
- [ ] ESM conventions respected — relative imports use explicit `.js` extensions
- [ ] `graph.ts` changes remain pure functions (no singleton state, no classes); all I/O side-effects stay in `cli.ts`
- [ ] Existing `list` command remains unchanged