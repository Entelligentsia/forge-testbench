# PLAN REVIEW — CART-S02-T02: Add read-only carto stats CLI command

🌿 *cartographer Supervisor — I review before things move forward. I read the actual code, not the report.*

**Task:** CART-S02-T02
**Iteration:** 1 of 3

---

**Verdict:** Approved

---

## Review Summary

The plan is correctly scoped, convention-compliant, and addresses every acceptance criterion. It confines all changes to `src/cli.ts`, delegates computation to `graphStats()` (already implemented in T01), and follows the established read-only command pattern. No data model changes, no persistence changes, no `graph.ts` modifications. Security surface is negligible — a read-only command with no user input, no filesystem writes, and no shell/eval. The plan is approved with advisory notes below.

## Correctness

Every acceptance criterion from the task prompt is addressed:

| Criterion | Plan Coverage | Verified |
|---|---|---|
| `.command("stats").description(...).action(...)` | ✓ Explicit code snippet | ✓ Matches `list`/`export` pattern |
| Uses `graphStats(graph)` from `./store/graph.js` — no inline `.length` | ✓ Import added to existing import line; action handler calls `graphStats()` | ✓ `graphStats` exported from `graph.ts` line 65 |
| Output `2 nodes, 1 edge` via `console.log` | ✓ `chalk.green(\`${nodes} ${nodeLabel}, ${edges} ${edgeLabel}\`)` | ✓ Format matches exactly |
| Pluralisation: singular only when count is exactly 1 | ✓ Two independent ternaries: `nodes === 1 ? "node" : "nodes"` and `edges === 1 ? "edge" : "edges"` | ✓ `0 nodes, 0 edges` and `1 node, 0 edges` are correct |
| Read-only: no `save()`, no flags/arguments | ✓ No `save()` call, no `.option()` chains | ✓ |
| Success output uses `chalk.green` | ✓ `chalk.green(...)` | ✓ |
| Build/test/lint pass; ESM `.js` extensions; I/O in `cli.ts` only | ✓ Stated as verification step; single file change | ✓ Verified: `npm test` (21 pass), `npm run build` (clean), `npm run lint` (clean) |

Independently verified the codebase state:
- `src/cli.ts` line 3: `import { load, addNode, link, exportMarkdown } from "./store/graph.js"` — adding `graphStats` to this import is the correct, minimal change.
- `src/store/graph.ts` line 65: `export function graphStats(graph: Graph): { nodes: number; edges: number }` — exists, exported, matches the plan's expected signature.
- `src/__tests__/graph.test.ts`: `graphStats` imported and tested (2 node/1 edge and 0/0 cases) — T01 dependency is resolved.
- All three verification commands pass cleanly on the current codebase.

## Security

Per the security-guidance skill requirements:

- **Filesystem-path handling**: No changes. The command calls `load()` which reads from `DATA_PATH` (`~/.cartographer/graph.json` via `process.env.HOME ?? "~"`). No new path construction or user-supplied path input.
- **Input validation**: `stats` takes no arguments or flags. No user input reaches the command. Data from `load()` flows through `graphStats()` (returns `{ nodes: number, edges: number }`) and is formatted with template literals. No shell execution, no `eval`, no string interpolation into dangerous contexts.
- **Data sanitisation**: Output is `console.log(chalk.green(...))` with integer counts — no injection vector. Chalk handles its own escaping.
- **No new dependencies**: No `lowdb`, `enquirer`, `ink`, `react`, or network/database imports.
- **No write path**: No `save()` call. The command is purely read-only.

**Security risk: none identified.**

## Architecture Alignment

| Convention | Aligned? | Verification |
|---|---|---|
| Pure functions in `graph.ts` | Yes | Plan does NOT modify `graph.ts`; `graphStats` is already there from T01 |
| I/O side-effects confined to `cli.ts` | Yes | All new code in the `stats` action handler |
| ESM `.js` import extensions | Yes | Import from `./store/graph.js` |
| `const` + arrow functions; no `class` | Yes | Code snippet uses `const` destructuring and arrow `.action()` |
| Node lookup by `title` (case-sensitive) preserved | N/A | This task does not touch node lookup |
| `chalk.green`/`chalk.cyan` for success; `chalk.red` for errors | Yes | `chalk.green` for stats output |
| No database or network dependency added | Yes | No new imports beyond `graphStats` |
| `strict: true` in tsconfig retained | Yes | No tsconfig changes |
| Only `cli.ts` performs I/O side effects | Yes | All I/O in the stats action handler |

## Conventions

- **ESM `.js` extensions**: Plan specifies `./store/graph.js` ✓
- **`"type": "module"` in package.json**: Confirmed, no change needed ✓
- **No `require()` / CommonJS**: No change ✓
- **No new `class` definitions**: No change ✓
- **`types.ts` interfaces stay flat**: No change to types ✓
- **CART-B01 regression guard**: Not relevant — no `save()` call, no persistence change ✓

## Business Rules

- **Graph/Node/Edge data model**: Unchanged ✓
- **Edge weight hardcoded to 1**: Not relevant to this task ✓
- **Case-sensitive title lookup**: Not relevant to this task ✓
- **`load()` empty-graph default**: Correctly leveraged — `stats` on a missing graph file prints `0 nodes, 0 edges` ✓

## Testing Strategy

The plan states no new automated tests. Justification:
1. `graphStats` pure logic is tested in T01 (verified: 2 test cases in `src/__tests__/graph.test.ts`).
2. The CLI handler is a thin I/O shell (`load()` → `graphStats()` → ternaries → `console.log`). Testing it would require mocking `load()` and `console.log()`.
3. Three manual smoke-test scenarios are specified covering empty graph (0/0), singular (1/0), and plural (3/1) cases.

**Assessment**: Acceptable for this task scope. The pluralisation logic is trivially correct (two independent ternaries) and the task's acceptance criteria do not mandate automated tests. **Advisory**: A future task should add CLI integration tests to confirm exact output format and pluralisation edge cases in an automated manner.

## Advisory Notes

1. **Update `routing.md`**: After implementation, `engineering/architecture/routing.md` must be updated to document the `carto stats` command (no arguments, no options, prints graph statistics). The current routing.md lists `add`, `link`, `list`, `export` — `stats` should be added to the Command Inventory table.

2. **Pluralisation testability**: The two ternaries are trivial but are not covered by the automated suite. If more stats-related commands are added in the future, consider either CLI integration tests or extracting a small `pluralise(count, singular, plural)` helper that can be unit-tested independently.

3. **T01 dependency is resolved**: `graphStats` now exists in `graph.ts` and is tested, so no temporary stub is needed during implementation.