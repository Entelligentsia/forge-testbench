<div align="center">

# cartographer

**A terminal-first personal knowledge map.**<br>
Add ideas as nodes, draw connections, traverse the graph, export to markdown. No cloud, no GUI — just your thoughts in a JSON file.

</div>

---

## Quick Start

```bash
npm install && npm run build
npm link                        # makes `carto` available globally
```

```bash
carto add "Zettelkasten" --body "A slip-box note-taking method" --tags "productivity,writing"
carto add "Evergreen notes" --body "Notes that evolve and stay relevant over time"
carto link "Zettelkasten" "Evergreen notes" --label "inspires"
carto list
carto export > map.md
```

## Commands

| Command | Description |
|---------|-------------|
| `carto add <title>` | Create a new node (supports `--body`, `--tags`) |
| `carto link <from> <to>` | Draw a directed edge (supports `--label`) |
| `carto list` | Print all nodes |
| `carto export` | Dump the graph as markdown |

## Stack

| | |
|---|---|
| **Language** | TypeScript (Node 20+, ESM) |
| **CLI** | [commander](https://github.com/tj/commander.js) |
| **Output** | [chalk](https://github.com/chalk/chalk) |
| **Persistence** | JSON via [lowdb](https://github.com/typicode/lowdb) at `~/.cartographer/graph.json` |
| **Build** | `tsc` → `dist/` |
| **Tests** | vitest |
| **Dev runner** | `tsx` (no build needed during development) |

## Architecture

```
src/
  cli.ts              ← commander entry point, one command per .command() block
  types.ts            ← Graph, Node, Edge interfaces — flat, no class hierarchies
  store/
    graph.ts          ← load/save JSON, addNode, link, exportMarkdown — pure functions
```

Data model: `Graph = { nodes: Node[], edges: Edge[] }` serialized to JSON. Node lookup is by `title` (case-sensitive). `graph.ts` exports pure functions only — no singleton state, no classes. `cli.ts` is the only file that does I/O side-effects.

## Known Issues

| Issue | Details |
|-------|---------|
| `graph.ts:save()` | `await import("fs")` inside a sync function — should import `mkdirSync` at top of file |
| Node lookup | Title-based only (case-sensitive). Fuzzy/ID lookup on roadmap |

## Roadmap

- Interactive TUI graph explorer (Ink-based)
- Fuzzy search with `fzf` integration
- Obsidian vault import/export
- Bi-directional link inference
- Tag-based clustering and visualization

> [!TIP]
> This is a [Forge testbench](../) project. Follow the root README to see Forge generate stack-aware TypeScript personas, workflows, and a knowledge base from this codebase.

## License

MIT
