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

- `graph.ts:save()` has a bug: `await import("fs")` inside a sync function — fix by importing `mkdirSync` at the top of the file
- `link` resolves nodes by title; fuzzy/id lookup is on the roadmap but not yet started
