# Sprint Requirements — CART-S02

**Captured:** 2026-06-03
**Source:** sprint-intake interview (dummy sprint for pipeline testing)

> Small throwaway sprint used to exercise the plan → implement → review → commit
> pipeline end-to-end. Scope is intentionally tiny: one trivial, fully testable
> must-have task. `CART-S02` is the next sequential sprint ID after `CART-S01`.

## Goals

1. `carto` exposes a `stats` command that prints the node and edge counts of the
   stored graph.

## In Scope

### Add `carto stats` command [must-have]

Add a read-only `stats` command that loads the graph and prints the number of
nodes and edges. Backed by a new pure `graphStats(graph)` helper in
`src/store/graph.ts` that returns `{ nodes: number, edges: number }`.

**Acceptance criteria:**
- `graphStats(graph)` is a pure function exported from `src/store/graph.ts` that
  returns `{ nodes, edges }` matching `graph.nodes.length` and `graph.edges.length`
- A vitest case asserts `graphStats` returns `{ nodes: 2, edges: 1 }` for a graph
  with 2 nodes and 1 edge, and `{ nodes: 0, edges: 0 }` for an empty graph
- `carto stats` on a graph with 2 nodes and 1 edge prints `2 nodes, 1 edge`
  (singular/plural pluralisation handled) via `console.log`
- `npm run build` exits 0, `npm test` exits 0, `npm run lint` exits 0

## Out of Scope

- No changes to `addNode`, `link`, `load`, `save`, or `exportMarkdown` signatures
- No new flags or options on the `stats` command
- No persistence/schema changes — `graph.json` format is untouched

## Nice-to-Have *(attempt if must-haves complete)*

- `carto stats` also prints the most-connected node title (highest edge degree)

## Constraints

- **Technical:** Node ESM with explicit `.js` import extensions; `graphStats` stays
  a pure function in `store/graph.ts`; all I/O (`console.log`) isolated to `cli.ts`
- **Data:** graph still persisted as JSON at `~/.cartographer/graph.json` via lowdb
- **Dependencies:** offline-only; no new dependencies — Node built-ins only
- **Timeline:** single session; this is a test sprint

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Pluralisation logic adds avoidable complexity | Low | Inline ternary in `cli.ts`; keep `graphStats` count-only |

## Carry-Over from CART-S01

None — CART-S01 (the `save()` import fix) completed with no outstanding items.
