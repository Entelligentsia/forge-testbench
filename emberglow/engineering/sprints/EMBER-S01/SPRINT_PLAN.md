# EMBER-S01 — Sprint Plan

| Task | Title | Estimate | Depends on |
|------|-------|----------|------------|
| EMBER-S01-T01 | Create cmd/emberglow CLI entrypoint | M | — |
| EMBER-S01-T02 | Recipe validation: line numbers + device-reference checks | M | T01 |
| EMBER-S01-T03 | go test coverage for parser + validation | S | T02 |

Execution: sequential. T01 wires the existing library surface
(`dsl.ExampleRecipe`, `dsl.Parse`, `engine.New/Run`, `engine.ListDevices`)
into the README's promised subcommands; T02 deepens `check`; T03 locks it.
