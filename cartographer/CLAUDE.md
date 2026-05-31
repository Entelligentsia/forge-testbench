# cartographer

Terminal knowledge-graph CLI (`carto`). TypeScript, Node ESM, no server.

## Stack

- **Runtime**: Node.js 20+, ESM (`"type": "module"`)
- **CLI framework**: `commander`
- **Output**: `chalk` for colour, `ink` + `react` for future TUI work
- **Persistence**: JSON file at `~/.cartographer/graph.json` via `lowdb`
- **Build**: `tsc` → `dist/`
- **Test**: `vitest`
- **Dev runner**: `tsx` (no build needed during development)

## Commands

```bash
npm install          # install deps
npm run dev -- add "My idea"   # run without building
npm run build        # compile to dist/
npm test             # run vitest
npm run lint         # eslint
```

## Architecture

```
src/
  cli.ts          # commander entry-point — one command per .command() block
  types.ts        # Graph, Node, Edge interfaces — keep flat, no class hierarchies
  store/
    graph.ts      # load/save JSON, addNode, link, exportMarkdown — pure functions
```

- **Data model**: `Graph = { nodes: Node[], edges: Edge[] }` serialised to JSON
- `graph.ts` exports pure functions only — no singleton state, no classes
- `cli.ts` is the only file that does I/O side-effects (console.log, chalk)
- Node lookup is by `title` (case-sensitive) — keep this behaviour; change only intentionally

## Conventions

- All source files use `.ts` with explicit `.js` extensions in imports (ESM requirement)
- Prefer `const` and arrow functions; avoid `class` unless adding the Ink TUI
- Error messages go to `console.error` with `chalk.red`; success to `console.log` with `chalk.green`/`chalk.cyan`
- Do not add a database or network dependency — offline-only is a design goal

## Known issues / in-progress

- `link` resolves nodes by title; fuzzy/id lookup is on the roadmap but not yet started

<!-- forge-kb-links: managed by Forge — do not edit manually -->
## Forge Knowledge Base

| Index | Contents |
|-------|----------|
| [MASTER_INDEX](engineering/MASTER_INDEX.md) | All sprints, tasks, bugs, and features |
| [Architecture](engineering/architecture/INDEX.md) | Stack, processes, database, routing, deployment |
| [Business Domain](engineering/business-domain/INDEX.md) | Entity model and domain concepts |

Personas live in `.forge/personas/`.
<!-- /forge-kb-links -->

<!-- forge-workflow-links: managed by Forge — do not edit manually -->
## Forge Workflows

| Workflow | Purpose |
|----------|---------|
| [Plan](.forge/workflows/plan_task.md) | Research codebase → implementation plan |
| [Implement](.forge/workflows/implement_plan.md) | Execute approved plan → code changes |
| [Fix bug](.forge/workflows/fix_bug.md) | Triage → fix → verify |
| [Run task](.forge/workflows/orchestrate_task.md) | Full task pipeline (plan → implement → review → commit) |
| [Run sprint](.forge/workflows/run_sprint.md) | Full sprint orchestration |
<!-- /forge-workflow-links -->
