# emberglow

A smart home automation DSL interpreter written in Go. Declare your home's behaviour in human-readable `.ember` recipe files — no cloud required, no locked-in hub, just YAML rules running locally.

## Quick start

```bash
go run ./cmd/emberglow example > morning.ember
go run ./cmd/emberglow check morning.ember      # validate
go run ./cmd/emberglow run   morning.ember      # execute
go run ./cmd/emberglow devices                  # list drivers
```

## Recipe format

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

## Roadmap

- MQTT broker integration for real sensor events
- Condition expressions (`value > 22 AND humidity < 60`)
- Recipe hot-reload without restart
- Web dashboard with rule status timeline
- Home Assistant `.yaml` import adapter
