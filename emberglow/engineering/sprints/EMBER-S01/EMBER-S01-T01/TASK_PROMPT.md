# EMBER-S01-T01: Create cmd/emberglow CLI entrypoint

**Sprint:** EMBER-S01
**Estimate:** M
**Pipeline:** default

---

## Objective

Create `cmd/emberglow/main.go` so the README Quick Start works as written:
`example` (print `dsl.ExampleRecipe()`), `check <file>` (read + `dsl.Parse`,
exit 1 on error), `run <file>` (parse + `engine.New(...).Run()`), `devices`
(`engine.ListDevices()`).

## Acceptance Criteria

1. `go run ./cmd/emberglow example > morning.ember` writes the sample recipe
2. `go run ./cmd/emberglow check morning.ember` exits 0 on the sample
3. `go run ./cmd/emberglow check <bad.yaml>` prints the parse error, exits 1
4. `go run ./cmd/emberglow devices` lists the 7 supported drivers
5. `go build ./...` and `go vet ./...` clean; stdlib `os.Args` dispatch is
   fine — no new dependencies

## Context

The library surface already exists (`internal/dsl/parser.go`,
`internal/engine/engine.go`); this task is wiring, usage text, and exit codes.
Module path is `github.com/entelligentsia/emberglow`.

## Entities

- New: `cmd/emberglow/main.go`
- Read-only: `internal/dsl/parser.go`, `internal/engine/engine.go`
