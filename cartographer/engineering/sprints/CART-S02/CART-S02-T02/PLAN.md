# PLAN — CART-S02-T02: Add read-only carto stats CLI command

**Task:** CART-S02-T02
**Sprint:** CART-S02
**Estimate:** S

---

## Objective

Add a `carto stats` command that loads the graph via `load()`, derives node and edge counts via `graphStats()` (from CART-S02-T01), and prints a single correctly pluralised line (e.g. `2 nodes, 1 edge`) to stdout — giving users an instant sense of their graph's size.

## Approach

1. **Add the `stats` command block to `src/cli.ts`** — register it via the existing `.command("stats").description(...).action(...)` pattern, mirroring the read-only `list` command. Import `graphStats` alongside the existing `load` import from `./store/graph.js`.

2. **Implement the action handler** — call `load()` to get the graph, pass it to `graphStats(graph)` to obtain `{ nodes, edges }`, then produce the pluralised output string with two independent ternaries:
   - `${count === 1 ? "node" : "nodes"}`
   - `${count === 1 ? "edge" : "edges"}`

   The pluralisation logic stays entirely in `cli.ts` — it must not leak into the pure `graph.ts` module.

3. **Use `chalk.green` for the output line** per project convention for read-only success output. No flags, no arguments, no `save()` call, no mutation.

4. **No unit tests needed for this task** — the command handler is a thin I/O wrapper (calls `load()` which touches the filesystem, then `console.log`). The pure computation (`graphStats`) is tested in CART-S02-T01. A manual smoke test confirms the output format and pluralisation. Any future CLI integration tests would belong in a separate task.

5. **Verify the build** — `npm run build` must compile cleanly, `npm test` must pass (existing suite untouched), `npm run lint` must report no new violations.

### Dependency note

This task depends on CART-S02-T01 (`graphStats` helper). The import `import { ..., graphStats } from "./store/graph.js"` will not compile until T01 is implemented. If implementing while T01 is still pending, add `graphStats` as a temporary stub in `graph.ts` (returning `{ nodes: graph.nodes.length, edges: graph.edges.length }`) — this matches the exact signature T01 will deliver and will be superseded when T01 lands.

## Files to Modify

| File | Change | Rationale |
|---|---|---|
| `src/cli.ts` | Add `graphStats` to the import from `./store/graph.js`; add `.command("stats")` block with description, action handler, pluralisation logic, and `chalk.green` output | CLI is the only I/O boundary; stats command belongs here alongside the other read-only commands (`list`, `export`) |

## Data Model

None. No changes to `types.ts`, `Node`, `Edge`, or `Graph`. No changes to the `graph.json` serialisation format.

## CLI Layer

New command block in `src/cli.ts`:

```
program
  .command("stats")
  .description("Show graph statistics")
  .action(() => {
    const graph = load();
    const { nodes, edges } = graphStats(graph);
    const nodeLabel = nodes === 1 ? "node" : "nodes";
    const edgeLabel = edges === 1 ? "edge" : "edges";
    console.log(chalk.green(`${nodes} ${nodeLabel}, ${edges} ${edgeLabel}`));
  });
```

- No arguments, no flags.
- Read-only: calls `load()` and `graphStats()` only; no `save()`.
- Error path: `load()` already returns `{ nodes: [], edges: [] }` for a missing file, so `stats` on an empty/missing graph prints `0 nodes, 0 edges` — no explicit error handling needed.
- Output format: `<n> node(s), <m> edge(s)` — singular only when count is exactly 1.

## Persistence

None. The command is read-only; it calls `load()` and does not call `save()`. No changes to `~/.cartographer/graph.json`.

## Testing Strategy

- **Build check**: `npm run build` — TypeScript strict compilation must pass (confirms `graphStats` import resolves correctly).
- **Lint**: `npm run lint` — no new violations.
- **Unit tests**: No new automated tests in this task. `graphStats` pure logic coverage is provided by CART-S02-T01. The CLI action handler is a thin I/O shell (load + console.log); manual smoke-test covers pluralisation.
- **Manual smoke test** (dev runner):
  ```bash
  npm run dev -- stats
  # Expected: "0 nodes, 0 edges" (empty graph)
  ```
  Add a node and re-run:
  ```bash
  npm run dev -- add "Idea"
  npm run dev -- stats
  # Expected: "1 node, 0 edges"
  ```
  Link two nodes:
  ```bash
  npm run dev -- add "Source"
  npm run dev -- add "Target"
  npm run dev -- link "Source" "Target"
  npm run dev -- stats
  # Expected: "3 nodes, 1 edge"
  ```
- **Existing suite**: `npm test` must continue passing with no regressions.

## Acceptance Criteria

- [ ] A `stats` command is registered in `src/cli.ts` via `.command("stats").description(...).action(...)`, following the existing pattern.
- [ ] The action handler uses `graphStats(graph)` from `./store/graph.js` — no inline `.length` computation.
- [ ] Output for a graph with 2 nodes and 1 edge is exactly `2 nodes, 1 edge` (via `console.log`).
- [ ] Pluralisation is correct: singular only when count is exactly 1 (`1 node, 0 edges`; `0 nodes, 0 edges`).
- [ ] The command is read-only: no `save()` call, no flags or arguments.
- [ ] Success output uses `chalk.green` (project convention).
- [ ] `npm run build` compiles cleanly; `npm test` passes; `npm run lint` reports no new violations.
- [ ] ESM `.js` import extensions respected throughout.
- [ ] All I/O stays in `cli.ts`; `graph.ts` is not modified by this task.

## Operational Impact

- **Graph file compatibility:** Full — no change to `graph.json` format or read/write behaviour.
- **Backwards compatibility:** Full — existing commands unchanged; `stats` is additive.
- **data-corruption:** None — read-only command, no write path touched.
- **cli-ux:** Positive — users gain an instant graph-size summary. Pluralisation correctness is the only risk surface.
- **build-failure:** None expected — additive change under strict TypeScript, provided `graphStats` import resolves (T01 dependency).
- **test-coverage:** Neutral — pure logic tested under T01; CLI handler is I/O-only.
- **Offline-only invariant:** Maintained — no network or database dependency introduced.
- **Monitoring:** N/A — offline single-user CLI, no runtime telemetry.