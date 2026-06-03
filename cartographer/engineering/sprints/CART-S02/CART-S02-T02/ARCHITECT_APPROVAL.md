# Architect Approval — CART-S02-T02

## Task
Add read-only `carto stats` CLI command

## Architectural Review

### I/O Boundary
All I/O side-effects remain in `cli.ts`: `load()` reads the graph, `console.log(chalk.green(...))` prints the result. The action handler is a thin shell — 4 lines. `store/graph.ts` is unmodified by T02 and continues to export pure functions only.

### Pure Function Contract
`graphStats()` (introduced in T01) is a pure function that accepts a `Graph` and returns `{ nodes: number, edges: number }`. The stats command calls it and formats output — no logic leaked into `graph.ts`.

### Pluralisation
Two independent ternaries (`nodes === 1 ? "node" : "nodes"`, `edges === 1 ? "edge" : "edges"`) are in `cli.ts` only. This is display logic that correctly belongs in the CLI layer, not the pure computation module.

### No New Dependencies
No imports added beyond `graphStats` from the existing `./store/graph.js` module. No network, database, or filesystem write paths introduced.

### Read-Only Invariant
The stats command makes no calls to `save()` or any mutative function. It reads the graph via `load()` and prints to stdout. This is consistent with the existing `list` and `export` read-only commands.

### Offline-Only Deployment
The command is purely local: reads `~/.cartographer/graph.json` via `load()` and prints to terminal. No server or network dependency. The offline CLI posture is fully preserved.

### Entity Model
No changes to `Node`, `Edge`, or `Graph` types. The `graphStats` function merely counts existing entities without mutation.

### Operational Impact
- **data-corruption**: None — read-only command, no write path.
- **cli-ux**: Positive — users get an instant graph-size summary with correct pluralisation.
- **build-failure**: None — additive change only; `npm run build` and `npm run lint` pass clean.
- **test-coverage**: Neutral — pure logic tested under T01; CLI handler is an I/O thin shell.

### Cross-Cutting Concerns
- `routing.md` updated to document the stats command — inventory, arguments section, and error handling notes. Good practice for CLI surface documentation.
- No conflicts with T01 or any other sprint task.

### Deployment Notes
- Single offline CLI (`carto`), JSON store at `~/.cartographer/graph.json`.
- No server, no network, no container orchestration.
- Users install from source, run `npm run build`, then invoke `carto stats`.

## Follow-Up Items
1. Consider adding CLI integration tests (e.g. with ` Commander`'s `.parseAsync()` or a subprocess runner) to cover the pluralisation logic in automated tests — currently only manual smoke tests cover it.
2. `lowdb` remains listed as a production dependency but is unused — should be removed in a future cleanup sprint.

**Verdict:** Approved