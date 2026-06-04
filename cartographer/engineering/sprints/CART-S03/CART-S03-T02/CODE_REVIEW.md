# CODE REVIEW — CART-S03-T02: Implement `carto ls` command to list all nodes

🌿 *cartographer Supervisor*

**Task:** CART-S03-T02

---

**Verdict:** Approved

---

## Review Summary

Clean implementation matching every plan step. `listNodeTitles()` in `graph.ts` is a minimal pure function — reads `load()`, maps `nodes` to titles — with all I/O stays in `cli.ts`. The `ls` sub-command prints `chalk.cyan(title)` per line with a `chalk.yellow("No nodes yet.")` fallback. Two unit tests cover populated and empty graph states. Build, tests (30/30), and lint pass independently. No new dependencies, no data model changes, no mutation, existing `list` command untouched.

## Checklist Results

| Item | Result | Notes |
|---|---|---|
| No npm dependencies introduced | 〇 | No new deps |
| Hook exit discipline (exit 0 on error, not non-zero) | 〇 / N/A | Read-only command, no error exit paths needed |
| Tool top-level try/catch + exit 1 on error | 〇 / N/A | `ls` is read-only; no error paths to guard |
| `--dry-run` supported where writes occur | N/A | No write operations in `ls` command |
| Reads `.forge/config.json` for paths (no hardcoded paths) | 〇 / N/A | No config file reads needed; DATA_PATH already follows project convention |
| Version bumped if material change | N/A | Read-only addition, not a material breaking change |
| Migration entry present and correct | N/A | No schema/data model changes |
| Security scan report committed | N/A | Not required for this task |
| `additionalProperties: false` preserved in schemas | N/A | No schema modifications |
| `node --check` passes on modified JS/CJS files | 〇 | `npm run build` (tsc) succeeds with zero errors |
| `validate-store --dry-run` exits 0 | N/A | No store schema changes |
| No prompt injection in modified Markdown files | N/A | No Markdown files modified |

## Spec Compliance

| Acceptance Criterion | Status | Evidence |
|---|---|---|
| `carto ls` prints all node titles, one per line, in `chalk.cyan` | ✅ | `cli.ts`: `for (const title of titles) { console.log(chalk.cyan(title)); }` |
| `carto ls` on an empty graph prints `No nodes yet.` in `chalk.yellow` | ✅ | `cli.ts`: `if (!titles.length) { console.log(chalk.yellow("No nodes yet.")); return; }` |
| `npm run build` compiles with no TypeScript errors | ✅ | Independently verified — `tsc` exits 0 |
| `npm test` passes — new behaviour covered by tests | ✅ | 30/30 tests pass; `listNodeTitles` block has 2 tests |
| `npm run lint` reports no violations | ✅ | Independently verified — `eslint src` exits clean |
| ESM conventions: explicit `.js` extensions on relative imports | ✅ | `import { ..., listNodeTitles } from "./store/graph.js"` in cli.ts |
| `graph.ts` changes are pure functions, no I/O side-effects | ✅ | `listNodeTitles(): string[]` reads via `load()`, returns `string[]` — no mutation, no console, no side-effects |
| Existing `list` command remains unchanged | ✅ | Verified line-by-line — original `list` command is identical |

## Issues Found

None.

---

## If Approved

### Advisory Notes

1. **Diff scope includes T01 code.** The working-tree diff bundles T01 (`rm`, `stats`, `graphStats`, `mostConnectedNode`) alongside T02 (`ls`, `listNodeTitles`). This is expected when tasks are developed on the same branch but worth noting for audit clarity.

2. **`listNodeTitles()` is a one-liner.** The function is `graph.nodes.map(n => n.title)` wrapped in a `load()` call. This is appropriate — it's a pure data-access function that keeps the CLI thin. No elaboration needed.

3. **No `--json` flag on `ls`.** The `list` command also lacks structured output. If a JSON output mode is ever needed, consider a shared `--format` flag across both commands — but that's a future concern, not a current deficiency.

4. **`beforeEach` resets `mockGraph` in `listNodeTitles` describe block.** Correct pattern — each test starts with a clean empty graph. The populated-graph test uses `addNode()` to seed data, which is consistent with existing test patterns in this file.