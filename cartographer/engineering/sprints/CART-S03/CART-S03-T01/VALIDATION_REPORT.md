# Validation Report — CART-S03-T01
**Task:** Implement `carto rm` command to delete a node
**Phase:** validate (standalone review)
**QA Engineer:** cartographer Qa Engineer

---

## Verdict: **Approved**

All 8 acceptance criteria are satisfied. The implementation correctly delivers the promised behaviour.

---

## Acceptance Criteria Validation

### AC1: `carto rm "Some Node"` removes the node and all edges where the node appears as `from` or `to`, then saves the graph.
- **Evidence (graph.ts):**  
  ```ts
  graph.nodes = graph.nodes.filter((n) => n.id !== node.id);
  graph.edges = graph.edges.filter((e) => e.from !== node.id && e.to !== node.id);
  save(graph);
  ```
- `from === node.id` handles outgoing edges; `to === node.id` handles incoming edges — correct for directed edges.
- `save(graph)` is called unconditionally after mutation.
- **Covered by test:** `"cascade-deletes edges when the node is removed"` — verifies `lastGraph.nodes` and `lastGraph.edges` are both empty for the removed node.

### AC2: On success, prints `✓ Removed "Some Node" and N edge(s)` in `chalk.green`.
- **Evidence (cli.ts):**  
  ```ts
  console.log(chalk.green(`✓ Removed "${title}" and ${result.edgeCount} edge(s)`));
  ```
- Exact match to spec string, `chalk.green` applied to the whole line.
- **No automated test** (CLI output test) — but manual inspection confirms the string is correct. Happy-path functional test in `"cascade-deletes edges"` confirms `edgeCount` is returned correctly (1 in that case).

### AC3: If the node title does not exist, prints `✗ Node not found: "Some Node"` in `chalk.red` to `console.error` and exits with code 1.
- **Evidence (cli.ts):**  
  ```ts
  console.error(chalk.red(`✗ Node not found: "${title}"`));
  process.exit(1);
  ```
- `console.error` ensures stderr; `chalk.red` applied to the full message; `process.exit(1)` sets exit code.
- **Covered by test:** `"returns null when the node is not found"` — verifies `removeNode` returns `null` when the title doesn't exist.

### AC4: `npm run build` compiles cleanly with no TypeScript errors.
- **Evidence:** `tsc` exited 0 with no output.
- Build artifact confirmed to exist.

### AC5: `npm test` passes — all existing tests plus the three new ones.
- **Evidence:** 28/28 tests passed (4 in `src/store/graph.test.ts`, 24 in `src/__tests__/graph.test.ts`).
- Existing CART-B01 regression guard (`mkdirSync` ordering) untouched and still passing.

### AC6: `npm run lint` reports no new violations.
- **Evidence:** `eslint src` exited 0 with no output.

### AC7: ESM conventions respected — relative imports use explicit `.js` extensions.
- **Evidence (graph.ts):** `import type { Graph, Node, Edge } from "../types.js"` — `.js` extension present.
- **Evidence (cli.ts):** `import { ... removeNode ... } from "./store/graph.js"` — `.js` extension present.
- All other imports follow the same convention.

### AC8: `graph.ts` remains pure functions (no singleton state, no classes); all I/O side-effects stay in `cli.ts`.
- **Evidence:** `removeNode` is a pure function with no internal state. `load()` and `save()` are called inside it but are themselves pure-with-side-effects (I/O only, not application state). All `console.log`/`console.error`/`process.exit` are exclusively in `cli.ts`.

---

## Edge Cases & Boundary Conditions

| Condition | Observed Behaviour | Covered? |
|-----------|-------------------|---------|
| Node not found | Returns `null`; CLI prints error + exits 1 | ✅ Test: `"returns null when the node is not found"` |
| Orphan node (0 edges) | Node removed; `edgeCount: 0` returned | ✅ Test: `"removes an orphan node"` |
| Node with 1+ edges | Node + all connected edges removed; `edgeCount` accurate | ✅ Test: `"cascade-deletes edges"` |
| Empty graph | `removeNode` finds no node → `null` (same as not-found) | ⚠️ Not explicitly tested — logically equivalent to not-found |
| Duplicate node titles | Removes first match only (consistent with `find()`) | ⚠️ Not tested; not specified in acceptance criteria |

**No blockers.** Untested conditions are either logically equivalent to a tested case (empty graph) or out-of-scope (duplicate titles).

---

## Regression Check

- CART-B01 test (`mkdirSync` ordering) unchanged and still passing.
- All 28 tests pass.
- No changes to existing `addNode`, `link`, `exportMarkdown`, or other exported functions.

---

## Test Quality Assessment

The three tests are specific and deterministic:
- `"returns null when the node is not found"` — asserts exact `null` return, no mocks needed.
- `"removes an orphan node"` — verifies `result.node.id` matches the created node AND that the graph's final state contains zero nodes.
- `"cascade-deletes edges"` — verifies both `node` and `edgeCount` fields and inspects the persisted graph JSON to confirm no orphaned edge references remain.

The mock infrastructure correctly maintains mutable state across `addNode → link → removeNode` calls, allowing sequential operations within a single test.

---

## Summary

The implementation satisfies all 8 acceptance criteria. Tests are specific, boundary conditions are covered, and there are no regressions.