# forge-testbench

Monorepo containing three independent CLI tools used as a Forge SDLC testbench:

| Directory | Language | Purpose |
|-----------|----------|---------|
| `hello/` | Python 3.11+ | Minimal CLI greeter — primary show-and-tell target |
| `cartographer/` | TypeScript (Node ESM) | Terminal knowledge-graph tool (`carto` CLI) |
| `emberglow/` | Go 1.22 | Smart home DSL interpreter (`.ember` recipe files) |
| `spectral/` | Python 3.11+ | Mood-based ambient soundscape generator |

Each project is self-contained with its own build system, dependencies, and tests. See the `CLAUDE.md` inside each subdirectory for project-specific guidance.

## Repo conventions

- No shared build step at the root — work inside each project directory
- Each project follows its own language conventions; do not mix styles across them
- READMEs are the source of truth for user-facing behaviour
