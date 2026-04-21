<div align="center">

# emberglow

**Smart home automation DSL interpreter.**<br>
Declare your home's behavior in human-readable `.ember` recipe files — no cloud required, no locked-in hub, just YAML rules running locally.

</div>

---

## Quick Start

```bash
go run ./cmd/emberglow example > morning.ember   # generate sample recipe
go run ./cmd/emberglow check morning.ember        # validate syntax
go run ./cmd/emberglow run   morning.ember        # execute (blocks)
go run ./cmd/emberglow devices                    # list supported drivers
```

Build a binary:

```bash
go build -o bin/emberglow ./cmd/emberglow
```

## Recipe Format

```yaml
name: Evening Wind-down
version: "1.0"

devices:
  living_room:
    type: hue_bulb
    address: "192.168.1.50"

rules:
  - name: Dim at sunset
    when:
      device: living_room
      event: sunset
    then:
      - device: living_room
        command: set_brightness
        params:
          level: "30"
          transition: "600s"
```

## Stack

| | |
|---|---|
| **Language** | Go 1.22 |
| **DSL format** | YAML-based `.ember` files |
| **Parsing** | [gopkg.in/yaml.v3](https://pkg.go.dev/gopkg.in/yaml.v3) |
| **TUI** (planned) | [bubbletea](https://github.com/charmbracelet/bubbletea) + [lipgloss](https://github.com/charmbracelet/lipgloss) |
| **Entry point** | `cmd/emberglow/main.go` |
| **Tests** | `go test ./...` |

## Architecture

```
cmd/emberglow/
  main.go                 ← CLI subcommands: example | check | run | devices

internal/
  dsl/
    parser.go             ← Parse([]byte) → *Recipe; all data types live here
  engine/
    engine.go             ← Engine.Run() event loop; ListDevices()
```

`dsl` owns types and parsing — no business logic. `engine` depends on `dsl` but nothing else. Device drivers will go in a future `internal/drivers/` package.

## Known Issues

| Issue | Details |
|-------|---------|
| No CLI entry point | `cmd/emberglow/main.go` not yet implemented |
| Stub event loop | `Engine.Run()` blocks on `select{}` — never processes events |
| `Unless` not evaluated | `Unless *Trigger` on rules parsed but ignored by engine |
| `Delay` not implemented | Actions fire immediately regardless of delay field |
| No tests | No `*_test.go` files exist yet |
| Minimal validation | `Parse` only validates recipe name; no structural validation of devices/rules/triggers |

## Roadmap

- MQTT broker integration for real sensor events
- Condition expressions (`value > 22 AND humidity < 60`)
- Recipe hot-reload without restart
- Web dashboard with rule status timeline
- Home Assistant `.yaml` import adapter

> [!TIP]
> This is a [Forge testbench](../) project. Follow the root README to see Forge generate stack-aware Go personas, workflows, and a knowledge base from this codebase.

## License

MIT
