# EMBER-S01 — Sprint Requirements

**Goal:** Recipe validation + CLI entrypoint

The README Quick Start (`go run ./cmd/emberglow …`) promises four subcommands
— `example`, `check`, `run`, `devices` — but `cmd/` does not exist yet, and
`dsl.Parse` validates nothing beyond the recipe name. This sprint makes the
Quick Start true and gives `check` real validation.

## Acceptance criteria

1. `go run ./cmd/emberglow example > morning.ember` emits the sample recipe
2. `go run ./cmd/emberglow check morning.ember` validates syntax, reporting
   line numbers for YAML errors
3. `check` rejects rules referencing devices not declared in the `devices`
   map (when / then / unless), naming the offending rule
4. `go run ./cmd/emberglow devices` lists the supported drivers
5. `go test ./...` covers parse + validation paths
