# EMBER-S01-T03: go test coverage for parser + validation

**Sprint:** EMBER-S01
**Estimate:** S
**Pipeline:** default

---

## Objective

Table-driven tests locking parse + validation behavior.

## Acceptance Criteria

1. `internal/dsl/parser_test.go`: example recipe parses; empty name rejected;
   malformed YAML error includes a line number
2. Validation cases: unknown device in `when`, in `then[]`, and in `unless`
   each reported with the rule name; valid recipe yields zero findings
3. `go test ./...` exits 0

## Context

Keep to stdlib `testing` — no new dependencies. Use `dsl.ExampleRecipe()` as
the golden valid input.

## Entities

- New: `internal/dsl/parser_test.go`
