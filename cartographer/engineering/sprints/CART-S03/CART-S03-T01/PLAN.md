# Plan — CART-S03-T01: `carto rm` Remove Node Command

## 1. Objective

Add a `carto rm <title>` sub-command that deletes a named node and all its connected edges from the knowledge graph, persists the change, and reports the outcome to the user.

## 2. Approach

Two files to change: `src/store/graph.ts` (pure function) and `src/cli.ts` (CLI wiring + user output).

### Step 1 — `removeNode()` in `src/store/graph.ts`

Export a new pure function mirroring the load → filter → save pattern of `addNode()` and `link()`:

```ts
export function removeNode(title: string): { node: Node; edgeCount: number } | null
```

- `load()` the full graph
- `find()` the node by `title` (case-sensitive, as per `link()` and acceptance criteria)
- If not found: return `null` (caller handles the "not found" case)
- If found: filter `graph.nodes` to exclude it, filter `graph.edges` to exclude any where `from === node.id` or `to === node.id`
- `save(graph)` with both filtered arrays
- Return `{ node, edgeCount: removedEdges.length }` so the caller has everything needed for the success message

### Step 2 — `rm` command in `src/cli.ts`

Wire the new function into Commander. Follow the existing pattern from `add` and `link`:

```ts
program
  .command("rm <title>")
  .description("Remove a node and its edges from the map")
  .action((title: string) => { /* ... */ });
```

Inside the action:

- Call `removeNode(title)`
- **Success path**: `console.log(chalk.green(`✓ Removed "${title}" and ${edgeCount} edge(s)`))`
- **Not-found path**: `console.error(chalk.red(`✗ Node not found: "${title}"`))`, `process.exit(1)`

Import `removeNode` alongside the existing named imports from `./store/graph.js`. Add `removeNode` to the `load` + `save` re-exports if desired (not strictly required since it is imported directly).

### Step 3 — Tests

Add a new `describe` block in `src/store/graph.test.ts`:

- **Not found**: call `removeNode("No Such Node")` and assert it returns `null`
- **Node removed, no edges**: create a graph with one node, call `removeNode`, assert the node is gone and the graph has zero nodes
- **Cascading edge delete**: create a graph with two nodes and an edge between them, call `removeNode` on one node, assert the node is gone and the edge is gone too

The existing `CART-B01` test in the file (mkdirSync ordering) is untouched — it remains as a regression guard.

### Step 4 — Verify

Run `npm test`, `npm run build`, `npm run lint` and confirm all three pass.

## 3. Files to Modify

| File | Change |
|------|--------|
| `src/store/graph.ts` | Add `removeNode(title: string)` export |
| `src/cli.ts` | Import `removeNode`, add `rm` Commander command |
| `src/store/graph.test.ts` | Add `describe("removeNode")` block with three test cases |

No new files. No changes to `src/types.ts` — the existing `Node`, `Edge`, `Graph` shapes are sufficient.

## 4. Data Model Changes

**None.** The existing `Graph`, `Node`, and `Edge` interfaces in `src/types.ts` cover the removal case. `removeNode` operates purely in memory on arrays of those types before calling the existing `save()`.

## 5. Testing Strategy

Unit tests in `src/store/graph.test.ts` (vitest). No integration tests or E2E tests. Three cases:

| Test | Input | Expected |
|------|-------|----------|
| not found | `"No Such Node"` | `null` returned |
| orphan node removed | graph with 1 node, 0 edges | node deleted, graph.nodes.length === 0 |
| edge cascade | graph with 2 nodes + 1 edge; remove 1 node | node gone, edge gone |

The `vi.mock("fs")` from the existing CART-B01 block covers all three new tests because `removeNode` also calls `save()` → `writeFileSync`.

## 6. Acceptance Criteria

1. `carto rm "Some Node"` removes the node and all edges where the node appears as `from` or `to`, then saves the graph.
2. On success, prints `✓ Removed "Some Node" and N edge(s)` in `chalk.green`.
3. If the node title does not exist, prints `✗ Node not found: "Some Node"` in `chalk.red` to `console.error` and exits with code 1.
4. `npm run build` compiles cleanly with no TypeScript errors.
5. `npm test` passes — all existing tests plus the three new ones.
6. `npm run lint` reports no new violations.
7. ESM conventions respected — relative imports use explicit `.js` extensions.
8. `graph.ts` remains pure functions (no singleton state, no classes); all I/O side-effects stay in `cli.ts`.

## 7. Operational Impact

- **Graph file compatibility**: No format change — removal deletes entries from existing `nodes` and `edges` arrays.
- **Backwards compatibility**: No existing commands change behaviour.
- **Offline-only design**: No network or external dependency introduced.
- **Impact category**: `cli-ux` — users gain the ability to delete nodes; `data-corruption` mitigated by cascading edge cleanup preventing orphaned edge references.