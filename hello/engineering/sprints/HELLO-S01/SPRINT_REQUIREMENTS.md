# HELLO-S01 — Sprint Requirements

**Goal:** Add `--goodbye` flag

Add a `--goodbye` flag to `hello.py` that prints `Goodbye, NAME!` instead of
`Hello, NAME!`. It must compose with `--shout` and `--count` exactly like the
regular greeting, and with `--formal` it uses the farewell form
(`Farewell, NAME`).

## Acceptance criteria

1. `hello Alice --goodbye` → `Goodbye, Alice!`
2. `hello Alice --goodbye --shout` → `GOODBYE, ALICE!`
3. `hello Alice --goodbye --count 3` → `Goodbye, Alice!` three times
4. `hello Alice --goodbye --formal` → `Farewell, Alice`
5. Test coverage for the new flag and its interactions
