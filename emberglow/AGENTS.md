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

## Known issues / in-progress

- `cmd/emberglow/main.go` does not exist yet — the CLI entry point has not been implemented
- `Engine.Run()` blocks on `select{}` and never processes events — the event loop is a stub
- `Unless *Trigger` on `Rule` is parsed by the DSL but not evaluated by the engine
- `Delay` field on `Action` is parsed but not implemented — actions fire immediately
- No test files exist yet (`*_test.go`)

## Notes

- `bubbletea` and `lipgloss` are declared in `go.mod` but not yet used — they are for the planned TUI
- `Params` and `Options` map values are all strings; numeric params like `level` and `kelvin` require runtime coercion by device drivers
- The `Parse` function only validates that the recipe has a name; structural validation of devices, rules, and triggers is not yet enforced

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
| [Sprint plan](.forge/workflows/architect_sprint_plan.md) | Sprint planning and task decomposition |
| [Sprint intake](.forge/workflows/architect_sprint_intake.md) | Sprint intake and requirements elicitation |
<!-- /forge-workflow-links -->

## Roadmap context

The engine event loop is a stub (`select{}`). Real device drivers and MQTT integration are next. When adding drivers, introduce a `drivers/` package under `internal/` — do not put driver code in `engine`.
