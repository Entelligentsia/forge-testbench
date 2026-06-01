# Code Review — HELLO-BUG-002: `--shout` ignored when combined with `--formal` (iteration 1 of 3)

🌿 Supervisor reviewing **bug HELLO-BUG-002** for spec compliance and code quality. I read the actual code, not the report.

## Scope

Path B fix-bug, review-code phase. Reviewed the actual `hello.py`, the actual
regression script `tests/test_shout_formal.py`, `BUG_FIX_PLAN.md`, and
`PROGRESS.md` — and ran the test independently.

## Spec compliance (verified first)

The approved plan calls for:

1. The `hello.py:15` guard to be `if shout:` so `--shout` upper-cases the
   greeting on **both** the formal and informal paths.
2. A standalone (non-pytest) regression guard `tests/test_shout_formal.py`,
   runnable with `python3 tests/test_shout_formal.py`, exiting non-zero on
   failure.

Both are present and correct.

### `hello.py` — fix confirmed

Read directly. Line 14–18:

```python
greeting = f"Greetings, {name}" if formal else f"Hello, {name}!"
if shout:
    greeting = greeting.upper()
for _ in range(count):
    click.echo(greeting)
```

- Line 15 is exactly `if shout:` — the correct guard. The `and not formal`
  clause that caused the bug is gone.
- `greeting.upper()` is an actual **call**, not a bare method reference (the
  historical `--shout` defect) — confirmed.
- Informal path `f"Hello, {name}!"` is intact (control case still emits
  `HELLO, ALICE!` with the trailing `!`).
- The `--count` loop `for _ in range(count)` is unchanged and sits outside the
  shout guard, so it applies to both branches — no FORGE-BUG-007-style
  regression.
- No unused imports; type hints present on the `main` signature. Single-file
  `click` architecture preserved.

### Net diff is empty — expected and correct

`git diff hello.py` is empty (`wc -c` = 0) because `HEAD` already carried the
correct `if shout:` guard and the working tree merely had it reintroduced and
then restored. This is **by design**, as the plan and triage documented. The
substantive new artifact of this fix is the regression test, not a code edit.
This is not a gap.

### `tests/test_shout_formal.py` — genuine regression guard

Read the actual script. Findings:

- **No pytest dependency.** Plain `python3` script using
  `click.testing.CliRunner`; `__main__` calls `sys.exit(1)` on any mismatch,
  `sys.exit(0)` on full pass. Matches `config.commands.test == null` and the
  absence of a configured framework.
- **Robust import.** Resolves the repo root as the parent of the test file's
  directory and inserts it onto `sys.path`, so `from hello import main`
  succeeds regardless of cwd. Verified empirically (PROGRESS records a run from
  `/tmp`).
- **Discriminating assertions** — exact expected strings:
  - `Alice --formal --shout` → `GREETINGS, ALICE\n` (primary guard; **no**
    trailing `!`, correct because the formal greeting has none).
  - `Alice --shout` → `HELLO, ALICE!\n` (informal-shout control, with `!`).
  - `Alice --formal` → `Greetings, Alice\n` (formal-no-shout control).
  - `Alice --formal --shout --count 2` →
    `GREETINGS, ALICE\nGREETINGS, ALICE\n` (count interaction).

  These four cases cover the exact branch matrix this bug touches, with correct
  expected values (including the subtle no-trailing-`!` detail on the formal
  path).

## Independent verification

- `python3 tests/test_shout_formal.py` → all four cases PASS, **exit 0**.
- **Discrimination proof:** copied the tree, reintroduced the buggy guard
  `if shout and not formal:`, and re-ran the test. Result: the two formal-shout
  cases **FAIL** (`Greetings, Alice` ≠ `GREETINGS, ALICE`), exit 1. The two
  control cases still pass. This proves the guard would catch a re-introduction
  of this exact bug — it is not a tautology.
- `git diff hello.py` → empty, as expected.

## Quality / security

- Input handling: name flows through f-strings and `.upper()` only; no
  shell/eval on user-supplied input. No injection surface.
- Minimal, faithful to the approved plan. No scope creep.
- No edge cases missing for the behaviour under review.

## Constraints honoured by the change

`bug.status` unchanged (`in-progress`), `bug.path` untouched, no code/test
modified by this review.

## Advisory notes (non-blocking)

- None that block approval. The empty `hello.py` diff is expected per plan; the
  test is the load-bearing artifact and it is sound.

**Verdict: approved**
