# Bug Fix Plan — HELLO-BUG-002: `--shout` ignored when combined with `--formal`

## Objective

Restore correct behaviour so that `--shout` upper-cases the greeting on **both**
the formal and informal paths, and add a standalone regression guard that locks
this behaviour in. After this fix, `hello Alice --formal --shout` must emit
`GREETINGS, ALICE` instead of `Greetings, Alice`.

## Root cause

The defect lives in `hello.py:15` inside `main()`:

```
greeting = f"Greetings, {name}" if formal else f"Hello, {name}!"   # line 14
if shout and not formal:                                            # line 15
    greeting = greeting.upper()                                     # line 16
```

The upper-casing guard `if shout and not formal:` only shouts when `--shout` is
set **and** `--formal` is **not** set. Whenever `--formal` is present the guard
is false and `greeting.upper()` never runs, so the formal greeting is emitted in
its original mixed case regardless of `--shout`. This is a **business-rule**
defect — the conditional encodes the wrong rule for when shouting applies.

## Exact code change

Single-line change at `hello.py:15`:

- **From:** `    if shout and not formal:`
- **To:**   `    if shout:`

Drop the `and not formal` clause so the upper-casing applies whenever `--shout`
is supplied, irrespective of `--formal`. No other lines change.

### Code-state note (important)

`HEAD` already contains the correct guard `if shout:`. The **working tree** has
reintroduced the bug (`if shout and not formal:`). The implement phase therefore
restores the working tree to match HEAD, which means the net `git diff` of
`hello.py` after the fix is **empty**. The substantive new artifact produced by
this bug fix is the regression test described below — it is what actually lands
in the diff.

## Regression-guard form + run command

pytest is **not installed** in this environment (`click` 8.1.6 is). There is no
`tests/` directory and no configured test command (`config.commands.test` is
null). The regression guard therefore MUST be a **standalone Python script**,
runnable directly with `python3`, that exits non-zero on failure — NOT a pytest
file.

- **File to create (implement phase):** `tests/test_shout_formal.py`
- **Exact run command:**

```
python3 tests/test_shout_formal.py
```

- **Form:** the script loads `hello.py` (e.g. via `importlib` against the
  sibling `hello.py`), drives it with `click.testing.CliRunner`, and asserts the
  output for each case. On any mismatch it prints the failing case and calls
  `sys.exit(1)`; on full success it prints a pass line and exits `0`.

- **Assertions (exact expected strings, empirically verified against the fix):**
  - `hello Alice --formal --shout` → `GREETINGS, ALICE\n`  (primary guard; note
    no trailing `!` because the formal greeting has none)
  - `hello Alice --shout` → `HELLO, ALICE!\n`  (control: informal shout still works)
  - `hello Alice --formal` → `Greetings, Alice\n`  (control: formal without shout unchanged)
  - `hello Alice --formal --shout --count 2` → `GREETINGS, ALICE\nGREETINGS, ALICE\n`
    (interaction with `--count`)

## Verification steps

1. Apply the one-line change at `hello.py:15` (`if shout:`).
2. Create `tests/test_shout_formal.py` as specified above.
3. Run the regression guard: `python3 tests/test_shout_formal.py` — expect exit
   code `0` and a pass message.
4. Manual spot-check: `python3 hello.py Alice --formal --shout` prints
   `GREETINGS, ALICE`; `python3 hello.py Alice --shout` prints `HELLO, ALICE!`.
5. Confirm `git diff hello.py` is empty (working tree now matches HEAD's correct
   guard), and that `tests/test_shout_formal.py` is the new tracked artifact.

## Files to modify

- `hello.py` — line 15 guard changed to `if shout:` (restores HEAD state; net
  diff empty against HEAD).
- `tests/test_shout_formal.py` — **new** standalone CliRunner regression script
  (the substantive artifact of this fix). Run via `python3 tests/test_shout_formal.py`.
