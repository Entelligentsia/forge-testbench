# HELLO-S01-T02: Test coverage for --goodbye interactions

**Sprint:** HELLO-S01
**Estimate:** S
**Pipeline:** default

---

## Objective

Lock the `--goodbye` behavior with a standalone CliRunner test script
following the `tests/test_shout_formal.py` pattern (no pytest dependency;
exits non-zero on any mismatch).

## Acceptance Criteria

1. New `tests/test_goodbye.py` covering: `--goodbye`, `--goodbye --shout`,
   `--goodbye --count 3`, `--goodbye --formal`
2. Script exits 0 on success, 1 on any mismatch, and prints the failing case
3. `python3 tests/test_goodbye.py` passes against the T01 implementation
4. `python3 tests/test_shout_formal.py` still passes (no regression)

## Context

The repo's test convention is standalone scripts driven by
`click.testing.CliRunner`, importing `hello.main` via a sys.path insert of the
repo root — copy that prologue verbatim from `tests/test_shout_formal.py`.

## Entities

- New: `tests/test_goodbye.py`
- Pattern source: `tests/test_shout_formal.py`
