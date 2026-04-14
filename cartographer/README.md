# cartographer

A terminal-first personal knowledge map. Add ideas as nodes, draw connections between them, traverse the graph, and export the whole thing to markdown — no cloud, no GUI, just your thoughts in a file.

## Quick start

```bash
npm install && npm run build
npm link   # or: node dist/cli.js

carto add "Zettelkasten" --body "A slip-box note-taking method" --tags "productivity,writing"
carto add "Evergreen notes" --body "Notes that evolve and stay relevant over time"
carto link "Zettelkasten" "Evergreen notes" --label "inspires"
carto list
carto export > map.md
```

## Commands

| Command | Description |
|---------|-------------|
| `carto add <title>` | Create a new node |
| `carto link <from> <to>` | Draw a directed edge |
| `carto list` | Print all nodes |
| `carto export` | Dump the map as markdown |

## Roadmap

- Interactive TUI graph explorer (Ink-based)
- Fuzzy search with `fzf` integration
- Obsidian vault import/export
- Bi-directional link inference
- Tag-based clustering and visualisation
