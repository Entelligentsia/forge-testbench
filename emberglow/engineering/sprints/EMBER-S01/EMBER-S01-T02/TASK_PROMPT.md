# EMBER-S01-T02: Recipe validation — line numbers + device-reference checks

**Sprint:** EMBER-S01
**Estimate:** M
**Pipeline:** default

---

## Objective

Give `check` real validation: YAML syntax errors reported with line numbers,
and rule device references verified against the `devices` map.

## Acceptance Criteria

1. `dsl.Validate(*Recipe) []error` (or equivalent) reports every rule whose
   `when.device`, any `then[].device`, or `unless.device` is not declared in
   `devices`, naming the rule and the unknown device
2. YAML syntax errors surface the line number (yaml.v3 `yaml.TypeError` /
   error text already carries it — preserve, don't swallow)
3. `check` prints all findings (not just the first) and exits 1 on any
4. Valid sample recipe (`dsl.ExampleRecipe`) passes with no findings

## Context

`dsl.Parse` currently validates only `r.Name != ""` — a typo'd device
reference parses clean and fails silently at runtime (the engine just
"listens" on a device that does not exist). Validation must cover the
`unless` trigger too (see EMBER-BUG-001 for why `unless` is easy to forget).

## Entities

- `internal/dsl/parser.go` (Validate), `cmd/emberglow/main.go` (check wiring)
