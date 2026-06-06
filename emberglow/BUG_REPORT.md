# Bug report — EMBER-BUG-001

`unless:` guards in `.ember` recipes are silently ignored.

Reproducing recipe (rule should NOT fire while the motion sensor is active):

```yaml
name: Night light
devices:
  hall_light:   { type: hue_bulb,      address: "192.168.1.50" }
  motion:       { type: motion_sensor, address: "mqtt://motion/hall" }
  clock:        { type: virtual_clock, address: "local" }
rules:
  - name: Lights off at midnight
    when:   { device: clock, event: trigger, value: "00:00" }
    unless: { device: motion, event: active }
    then:
      - { device: hall_light, command: power_off }
```

**Expected:** the `unless` trigger suppresses the rule while `motion` is active.
**Actual:** the rule registers and fires unconditionally — `Rule.Unless` is
deserialised by `dsl.Parse` (parser.go) but `engine.Run` never reads it.

Please investigate with `/forge:fix-bug EMBER-BUG-001`. A fix should enforce
the guard in the engine loop (or explicitly reject `unless` as unsupported at
parse time — silent acceptance is the bug).
