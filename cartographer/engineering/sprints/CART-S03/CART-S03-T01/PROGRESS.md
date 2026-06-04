# PROGRESS — CART-S03-T01: `carto rm` Remove Node Command

## Summary

Implemented the `carto rm <title>` command that deletes a named node and all its connected edges from the knowledge graph.

## Changes Made

### `src/store/graph.ts`
Added `removeNode(title: string): { node: Node; edgeCount: number } | null`:
- Loads graph, finds node by title (case-sensitive)
- Returns `null` if not found (caller handles error output)
- Filters out the node from `graph.nodes`
- Filters out all edges where `from === node.id || to === node.id` (cascading delete)
- Calls `save(graph)` and returns `{ node, edgeCount }`

### `src/cli.ts`
- Imported `removeNode` alongside existing graph functions
- Added `rm` Commander subcommand with chalk success/error output:
  - Success: `chalk.green(\`✓ Removed "${title}" and ${edgeCount} edge(s)\`)`
  - Not-found: `chalk.red(\`✗ Node not found: "${title}"\`)` → `process.exit(1)`

### `src/store/graph.test.ts`
Added `describe("removeNode")` with three test cases:
- `returns null when the node is not found` — verifies null return for unknown title
- `removes an orphan node (no edges) and returns {node, edgeCount:0}` — creates node, removes it, inspects written graph
- `cascade-deletes edges when the node is removed` — creates 2 nodes + 1 edge, removes source, asserts node + edge gone

The existing `CART-B01` regression guard (mkdirSync ordering) is untouched.

## Test Evidence

```
✓ src/store/graph.test.ts  (4 tests) 17ms
✓ src/__tests__/graph.test.ts  (24 tests) 10ms

Test Files  2 passed (2)
     Tests  28 passed (28)
```

Build and lint also clean:
```
> tsc (no output = success)
> eslint src (no output = success)
```

## Files Changed

| File | Change |
|------|--------|
| `src/store/graph.ts` | +1 export (`removeNode`) |
| `src/cli.ts` | +1 import (`removeNode`), +1 command (`rm`) |
| `src/store/graph.test.ts` | +3 tests in new `describe("removeNode")` block |

## Verification

- [x] `npm run build` — TypeScript compiles cleanly (0 errors)
- [x] `npm run lint` — 0 errors
- [x] `npm test` — 28/28 tests pass (2 test files)
- [x] `removeNode` returns `null` for unknown nodes
- [x] `removeNode` removes the node and returns correct edge count
- [x] Cascading edge delete removes all edges referencing the node
- [x] Existing `CART-B01` regression guard untouched