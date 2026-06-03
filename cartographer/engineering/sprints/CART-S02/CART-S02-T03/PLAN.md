# PLAN — CART-S02-T03: Nice-to-have: most-connected node title in carto stats

🌱 *cartographer Architect*

**Task:** CART-S02-T03
**Sprint:** CART-S02
**Estimate:** S

---

## Objective

Add a pure helper `mostConnectedNode(graph: Graph)` to `src/store/graph.ts` that returns the node with the highest degree (total bidirectional edge count) and its degree, along with a sentinel value when no edges exist. Extend the `carto stats` CLI command to display the most-connected node’s title and degree, or "(no edges)" if no edges exist.

## Approach

1. **Pure helper** in `src/store/graph.ts`:
   - Implement `mostConnectedNode(graph)` that iterates all edges, accumulates per-node degree counts (both `from` and `to`), and returns `{ node: Node | null, degree: number }`.
   - Return `null` and `0` for the no-edges sentinel, consistent with `graphStats`’s `{ nodes: 0, edges: 0 }` pattern.
   - Use first-encountered tie-break when degrees are equal (deterministic, stable).

2. **CLI extension** in `src/cli.ts`:
   - Import `mostConnectedNode`.
   - Modify the `stats` command to print the additional line: `Most connected node: <title> (<degree>)` or `(no edges)` if `node === null`.

3. **Tests** in `src/__tests__/graph.test.ts`:
   - Add `describe("mostConnectedNode")` with four tests:
     - no-edges sentinel: `graphStats.graph({ nodes: [...], edges: [] })` → `{ node: null, degree: 0 }`
     - bidirectional degree: count both incoming and outgoing edges correctly
     - first-encountered tie-break: when two nodes have same degree, first encountered wins
     - empty graph: `{ nodes: [], edges: [] }` → `{ node: null, degree: 0 }`

This follows the existing pattern: pure functions in `graph.ts`, I/O boundary only in `cli.ts`, and tests mirror `graphStats`’s structure.

## Files to Modify

| File | Change | Rationale |
|---|---|---|
| `src/store/graph.ts` | Add `mostConnectedNode(graph: Graph): { node: Node \| null; degree: number }` | Pure helper implementation |
| `src/cli.ts` | Import `mostConnectedNode`, extend `stats` command | CLI surface extension |
| `src/__tests__/graph.test.ts` | Add `describe("mostConnectedNode")` with 4 test cases | Verify pure helper behaviour |

## Data Model

No changes to the data model. The function operates on the existing `Graph`, `Node`, and `Edge` interfaces defined in `src/types.ts`. No modifications to `~/.cartographer/graph.json` are required.

## CLI Layer

The `stats` command in `src/cli.ts` will be extended:

```typescript
program
  .command("stats")
  .description("Show graph statistics")
  .action(() => {
    const graph = load();
    const { nodes, edges } = graphStats(graph);
    console.log(chalk.green(`${nodes} ${nodes === 1 ? "node" : "nodes"}, ${edges} ${edges === 1 ? "edge" : "edges"}`));
    const { node, degree } = mostConnectedNode(graph);
    if (node) {
      console.log(chalk.cyan(`Most connected node: ${node.title} (${degree})`));
    } else {
      console.log(chalk.yellow("(no edges)"));
    }
  });
```

## Persistence

No persistence changes. The function is pure and reads from the in-memory `graph` parameter; no writes to `~/.cartographer/graph.json`.

## Testing Strategy

- **Build check**: `npm run build` — verify TypeScript compiles without errors
- **Lint**: `npm run lint` — verify no style issues
- **Unit tests**: Add `describe("mostConnectedNode")` block to `src/__tests__/graph.test.ts`:
  - `it("returns { node: null, degree: 0 } when no edges exist")`
  - `it("correctly counts bidirectional degree for a node with incoming and outgoing edges")`
  - `it("uses first-encountered tie-break when multiple nodes share the highest degree")`
  - `it("returns { node: null, degree: 0 } for an empty graph")`

- **Manual smoke test**: `npm run dev -- stats` — verify:
  - With edges: prints node title and degree
  - Without edges: prints "(no edges)"

## Acceptance Criteria

- [ ] `mostConnectedNode(graph)` returns `{ node: Node | null, degree: number }` for any `Graph`
- [ ] Returns `{ node: null, degree: 0 }` when no edges exist (sentinel)
- [ ] Degree counts both incoming and outgoing edges bidirectionally
- [ ] When degrees tie, first-encountered node wins (stable, deterministic)
- [ ] `carto stats` CLI shows the most connected node (or "(no edges)")
- [ ] `npm run build` compiles cleanly to `dist/`
- [ ] `npm test` passes with 4 new tests for `mostConnectedNode`
- [ ] `npm run lint` passes with no errors

## Operational Impact

- **Graph file compatibility:** Full — existing `~/.cartographer/graph.json` files load without any migration; the function operates on the in-memory structure only.
- **Backwards compatibility:** None — `carto stats` gains additional output but doesn’t change existing behaviour (node count, edge count remain unchanged).
- **Monitoring:** N/A — offline single-user CLI, no runtime telemetry.
