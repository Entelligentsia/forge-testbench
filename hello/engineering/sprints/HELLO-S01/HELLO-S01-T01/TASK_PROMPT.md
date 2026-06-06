# HELLO-S01-T01: Implement --goodbye flag in hello.py

**Sprint:** HELLO-S01
**Estimate:** S
**Pipeline:** default

---

## Objective

Add a `--goodbye` flag to `hello.py` that switches the greeting to a farewell:
`Goodbye, NAME!` (informal) / `Farewell, NAME` (with `--formal`). The flag
must compose with `--shout` and `--count` exactly like the regular greeting.

## Acceptance Criteria

1. `hello Alice --goodbye` → `Goodbye, Alice!`
2. `hello Alice --goodbye --shout` → `GOODBYE, ALICE!`
3. `hello Alice --goodbye --count 3` → `Goodbye, Alice!` printed 3 times
4. `hello Alice --goodbye --formal` → `Farewell, Alice`
5. Existing behavior without `--goodbye` is unchanged (`tests/test_shout_formal.py` still passes)

## Context

`hello.py` is a single-file Click CLI (~21 lines). The greeting is selected by
the `--formal` ternary, then `--shout` upper-cases it, then `--count` loops the
echo. `--goodbye` slots into the greeting-selection step; shout/count handling
needs no change if the selection happens first.

## Entities

- Source: `hello.py`
- Guard: `tests/test_shout_formal.py` (must stay green)
