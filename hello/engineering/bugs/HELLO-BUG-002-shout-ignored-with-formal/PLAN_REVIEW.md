# Plan Review — HELLO-BUG-002: `--shout` ignored when combined with `--formal` (iteration 1 of 3)

🌿 hello Supervisor — I reviewed the plan against the triage and the **actual** code (`hello.py`, working tree + HEAD), not the report. Every claim below was independently verified.

## Scope reviewed

- `BUG_FIX_PLAN.md` (the fix plan)
- `TRIAGE.md` (root cause + Path B routing)
- `hello.py` (current working-tree state and HEAD state)

## Independent verification performed

1. **Root cause / diff claim — CONFIRMED.** `git diff hello.py` shows working tree has `if shout and not formal:` (the bug) while `HEAD` has `if shout:` (correct). Restoring the working tree to HEAD therefore yields a **net-empty `hello.py` diff**, exactly as the plan states. The substantive landed artifact is the regression test.

2. **Fix correctness — CONFIRMED.** I loaded a fixed copy of `main()` (guard = `if shout:`) and drove it with `click.testing.CliRunner`. All four asserted expected strings match exactly:
   - `Alice --formal --shout` → `GREETINGS, ALICE\n` (no trailing `!` — correct; the formal greeting has none)
   - `Alice --shout` → `HELLO, ALICE!\n` (informal shout path — no regression)
   - `Alice --formal` → `Greetings, Alice\n` (formal-no-shout unchanged)
   - `Alice --formal --shout --count 2` → `GREETINGS, ALICE\nGREETINGS, ALICE\n` (`--count` interaction)

3. **No regression of informal / `--count` paths — CONFIRMED.** Changing the guard from `if shout and not formal:` to `if shout:` only *adds* the formal-shout branch; the informal-shout and unshouted paths are untouched. The `--count` loop wraps the (already-transformed) greeting, so repetition is unaffected. The fix does not reintroduce FORGE-BUG-007 (`--count` honoured in the formal branch — verified via the count-2 case).

4. **Regression guard discriminates — CONFIRMED.** I ran the *buggy* working-tree guard against the primary assertion: it produces `Greetings, Alice\n`, which fails `GREETINGS, ALICE\n`. The test is a genuine guard, not a tautology that passes regardless of the fix.

5. **Test form appropriate — CONFIRMED.** `pytest` is not installed; `click` 8.1.6 is. The plan correctly specifies a **standalone** `python3 tests/test_shout_formal.py` CliRunner script (exit non-zero on failure), not a pytest file. `config.commands.test` is null and no `tests/` directory exists yet — the implement phase creates it. This matches the project's stack reality.

## Branch matrix (enumerated per Iron Laws)

| formal | shout | count | Expected output | Verified |
|--------|-------|-------|-----------------|----------|
| F | F | 1 | `Hello, Alice!` | implied (echo path) |
| F | T | 1 | `HELLO, ALICE!` | yes |
| T | F | 1 | `Greetings, Alice` | yes |
| T | T | 1 | `GREETINGS, ALICE` | yes |
| T | T | 2 | `GREETINGS, ALICE` ×2 | yes |

Every shout/formal/count combination resolves correctly under the planned fix.

## Findings

- The plan's central claims (root cause, empty net diff, expected strings, test form) are all empirically accurate.
- The fix is minimal, single-file, single-line, and does not touch interfaces, schema, build, or security surface — consistent with the triage.
- The regression test is the substantive artifact and is concretely specified (file path, run command, exact expected strings, exit-code contract).

## Advisory notes (non-blocking)

1. The plan describes the loader as importing "the **sibling** `hello.py`". With the test at `tests/test_shout_formal.py`, `hello.py` lives in the **parent** directory, not a sibling. This is an illustrative "e.g." for the implement phase, and the specified run command (`python3 tests/test_shout_formal.py` from the repo root) resolves `hello.py` via the current working directory regardless. The implement phase should ensure the loader resolves `hello.py` robustly (e.g. relative to the test file's parent, or via cwd), and not literally assume a sibling path.
2. Optional: add a control assertion for plain `Alice` (no flags) → `Hello, Alice!` to lock the untouched happy path, though this is not required to guard the reported defect.

## Verdict: approved

The planned one-line guard change (`if shout and not formal:` → `if shout:`) fixes the root cause without regressing the informal or `--count` paths, and the standalone CliRunner regression script is correctly formed with empirically-verified expected outputs. Proceed to implement.
