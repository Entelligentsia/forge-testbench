# HELLO-S01 — Sprint Plan

| Task | Title | Estimate | Depends on |
|------|-------|----------|------------|
| HELLO-S01-T01 | Implement `--goodbye` flag in hello.py | S | — |
| HELLO-S01-T02 | Test coverage for `--goodbye` interactions | S | T01 |
| HELLO-S01-T03 | Document `--goodbye` in README and CLAUDE.md | S | T01 |

Execution: sequential. T01 lands the behavior; T02 locks it with CliRunner
cases (standalone-script pattern, see `tests/test_shout_formal.py`); T03
updates the user-facing docs.
