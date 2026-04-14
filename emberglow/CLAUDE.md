# emberglow

Smart home automation DSL interpreter. Go 1.22, local-only, no cloud.

## Stack

- **Language**: Go 1.22 (module: `github.com/entelligentsia/emberglow`)
- **DSL format**: YAML-based `.ember` recipe files
- **Parsing**: `gopkg.in/yaml.v3`
- **TUI** (planned): `charmbracelet/bubbletea` + `charmbracelet/lipgloss`
- **Entry point**: `cmd/emberglow/main.go`

## Commands

```bash
go run ./cmd/emberglow example            # print an example .ember recipe
go run ./cmd/emberglow check <file>       # validate a recipe file
go run ./cmd/emberglow run   <file>       # execute a recipe (blocks)
go run ./cmd/emberglow devices            # list supported device drivers

go test ./...                             # run all tests
go vet ./...                              # static analysis
go build -o bin/emberglow ./cmd/emberglow # build binary
```

## Architecture

```
cmd/emberglow/
  main.go             # CLI subcommands: example | check | run | devices

internal/
  dsl/
    parser.go         # Parse([]byte) → *Recipe; Recipe/Device/Rule/Trigger/Action types
  engine/
    engine.go         # Engine.Run() — event loop stub; ListDevices()
```

- `dsl` package owns all data types and parsing — no business logic
- `engine` package depends on `dsl` but nothing else — keep this direction
- Device drivers are not yet implemented; `Run()` blocks on `select{}`
- `Unless *Trigger` on `Rule` is parsed but not yet evaluated by the engine

## Conventions

- Standard Go formatting (`gofmt`) — always run before committing
- Package-level doc comments on every package (`// Package dsl ...`)
- Exported types have doc comments; unexported helpers do not need them
- Return `error` explicitly; never panic on user-supplied input
- Keep `dsl` and `engine` as separate packages — do not collapse them

## Roadmap context

The engine event loop is a stub (`select{}`). Real device drivers and MQTT integration are next. When adding drivers, introduce a `drivers/` package under `internal/` — do not put driver code in `engine`.
