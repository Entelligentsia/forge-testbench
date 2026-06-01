# Triage — HELLO-BUG-002: `--shout` ignored when combined with `--formal`

## 1. Reported symptom

Running `hello Alice --formal --shout` produces a formal greeting that is **not**
shouted. The `--shout` flag is honoured for the informal greeting but silently
ignored whenever `--formal` is also supplied. The reporter expected
`GREETINGS, ALICE` (upper-cased formal greeting) but observed `Greetings, Alice`.
Severity on the bug record is **major**.

## 2. Reproduction

Reproduced deterministically from the command line (using `python3 hello.py`):

```
$ python3 hello.py Alice --formal --shout
Greetings, Alice          # BUG: not shouted

$ python3 hello.py Alice --shout
HELLO, ALICE!             # control: shouting works for informal path

$ python3 hello.py Alice --formal
Greetings, Alice          # control: formal path, no shout requested
```

- **Actual** (`--formal --shout`): `Greetings, Alice`
- **Expected** (`--formal --shout`): `GREETINGS, ALICE` (the formal greeting has
  no trailing `!`, so the shouted form is `GREETINGS, ALICE`)

The control cases confirm the shout logic itself is functional for the informal
branch and that the formal branch renders correctly when shouting is not asked
for. The defect is specifically the interaction of the two flags.

## 3. Root cause

The defect lives in `hello.py:15` inside `main()`:

```python
greeting = f"Greetings, {name}" if formal else f"Hello, {name}!"   # line 14
if shout and not formal:                                            # line 15
    greeting = greeting.upper()                                     # line 16
```

The upper-casing guard on line 15 is `if shout and not formal:`. The
`and not formal` clause means the greeting is only upper-cased when `--shout` is
set **and** `--formal` is **not** set. As soon as `--formal` is present, the
condition is false and `greeting.upper()` never runs, so the formal greeting is
emitted in its original mixed case regardless of `--shout`. The correct guard is
simply `if shout:` so that shouting applies to both the formal and informal
greeting strings. This is a `business-rule` defect — the conditional encodes the
wrong rule for when shouting should apply.

## 4. Path A / Path B enumeration

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | `bug.severity ∈ {minor}` | **FAIL** | Bug record `severity` is `"major"`, not `minor`. |
| 2 | Fix is contained in a single file | PASS | Change is entirely within `hello.py`. |
| 3 | Estimated diff ≤ ~20 lines | PASS | One-line change: drop `and not formal` from line 15. |
| 4 | No schema, API, migration, security, or build-system change | PASS | Pure logic edit in the CLI body; no interfaces touched. |
| 5 | Regression test obvious from reproduction | PASS | Single assertion: `hello Alice --formal --shout` → `GREETINGS, ALICE`. |

## 5. Route decision and rationale

**Route: B.** Path A requires *all* criteria to hold; criterion 1 fails because
the bug's severity is `major`, not `minor`, so per triage.md ("If any criterion
fails, the triage subagent MUST select Path B") the bug routes to the full
plan/review/implement/review/approve/commit pipeline.

## 6. Collateral findings

- `hello.py:15` is the only site with the `shout`/`formal` interaction; there are
  no other call sites sharing this conditional shape, so no additional fixes are
  warranted.
- Once fixed, the existing "Known issues" note in `CLAUDE.md` referencing the
  earlier `greeting.upper` vs `greeting.upper()` defect should be reviewed for
  staleness, but that is a documentation follow-up, not part of this fix.
