# Implementation Progress — HELLO-BUG-002: `--shout` ignored when combined with `--formal`

Phase: implement (Path B) — status remains `in-progress`.

## Reproduction

Before the fix, the working tree contained the buggy guard `if shout and not formal:`
at `hello.py:15`. Running the formal+shout combination produced mixed case instead
of upper case:

```
$ python3 hello.py Alice --formal --shout
Greetings, Alice        # WRONG — expected GREETINGS, ALICE
```

The informal shout path (`--shout` without `--formal`) worked correctly, masking
the defect.

## Root cause

`hello.py:15` guarded the upper-casing with `if shout and not formal:`. The
`and not formal` clause suppressed shouting whenever `--formal` was supplied, so
the formal greeting was never upper-cased regardless of `--shout`. This is a
business-rule defect: the conditional encoded the wrong rule for when shouting
applies. Shouting should apply whenever `--shout` is set, independent of
`--formal`.

## The fix

Single-line change at `hello.py:15`:

- **From:** `    if shout and not formal:`
- **To:**   `    if shout:`

```python
greeting = f"Greetings, {name}" if formal else f"Hello, {name}!"
if shout:
    greeting = greeting.upper()
for _ in range(count):
    click.echo(greeting)
```

### Code-state note

`HEAD` already carried the correct guard `if shout:`; the working tree had
reintroduced the bug. Restoring the working tree to `if shout:` makes the net
`git diff hello.py` against HEAD **empty** — this is expected. The substantive
new artifact landed by this fix is the regression guard below.

Verification that the net diff is empty:

```
$ git diff hello.py | wc -c
0
```

## Regression guard

New standalone script (no pytest): `tests/test_shout_formal.py`. It drives
`hello.py`'s `main` command via `click.testing.CliRunner`, asserts the output for
each case, prints PASS/FAIL per case, and `sys.exit(1)` on any mismatch / `0` when
all pass. The import of `hello.py` is resolved robustly by inserting the repo root
(parent of `tests/`) onto `sys.path`, so the script runs regardless of cwd.

Cases asserted:

| args | expected output |
|------|-----------------|
| `Alice --formal --shout` | `GREETINGS, ALICE\n` (primary guard; no trailing `!`) |
| `Alice --shout` | `HELLO, ALICE!\n` (informal shout control) |
| `Alice --formal` | `Greetings, Alice\n` (formal-no-shout control) |
| `Alice --formal --shout --count 2` | `GREETINGS, ALICE\nGREETINGS, ALICE\n` (count interaction) |

### Guard discriminates against the bug

Run against the buggy guard, the primary case emits `Greetings, Alice\n`, which
fails the `GREETINGS, ALICE\n` assertion — confirming the test is a genuine guard,
not a tautology.

## Verification evidence

Command and output (run from the repo root):

```
$ python3 tests/test_shout_formal.py; echo "EXIT=$?"
PASS: args=['Alice', '--formal', '--shout'] -> 'GREETINGS, ALICE\n'
PASS: args=['Alice', '--shout'] -> 'HELLO, ALICE!\n'
PASS: args=['Alice', '--formal'] -> 'Greetings, Alice\n'
PASS: args=['Alice', '--formal', '--shout', '--count', '2'] -> 'GREETINGS, ALICE\nGREETINGS, ALICE\n'
All regression cases passed
EXIT=0
```

Run from a foreign cwd (`/tmp`) to confirm the robust import:

```
$ cd /tmp && python3 /home/boni/src/forge-testbench/hello/tests/test_shout_formal.py; echo "EXIT=$?"
PASS: args=['Alice', '--formal', '--shout'] -> 'GREETINGS, ALICE\n'
PASS: args=['Alice', '--shout'] -> 'HELLO, ALICE!\n'
PASS: args=['Alice', '--formal'] -> 'Greetings, Alice\n'
PASS: args=['Alice', '--formal', '--shout', '--count', '2'] -> 'GREETINGS, ALICE\nGREETINGS, ALICE\n'
All regression cases passed
EXIT=0
```

Final state: `hello.py` carries the correct `if shout:` guard (net diff vs HEAD
empty); `tests/test_shout_formal.py` is the new tracked artifact and passes with
exit code 0.

## Constraints honoured

- `bug.status` not modified — remains `in-progress`.
- `bug.path` untouched.
- No git commit performed (deferred to the commit phase).
- Change kept minimal and faithful to the approved plan.
