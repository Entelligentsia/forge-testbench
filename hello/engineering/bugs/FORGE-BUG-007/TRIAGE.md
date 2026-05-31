# Triage Report: FORGE-BUG-007 — `--count` flag ignored when `--formal` is used

## Reported Symptom
When `--formal` and `--count` are used together in the `hello` CLI tool, the greeting is printed only once regardless of the count value provided (e.g., `--count 3`).

## Reproduction
**Reproduction Command:**
```bash
python3 hello.py Alice --formal --count 3
```

**Actual Output:**
```
Greetings, Alice
```

**Expected Output:**
```
Greetings, Alice
Greetings, Alice
Greetings, Alice
```

## Root Cause
In `hello.py` lines 17–21, the `formal` conditional branch bypasses the loop:
```python
    if formal:
        click.echo(greeting)
    else:
        for _ in range(count):
            click.echo(greeting)
```
When `formal` is set, it outputs the greeting once and does not execute the loop inside the `else` block. The correct implementation should execute the loop for both casual and formal greetings.

## Path A / Path B Enumeration
- **`bug.severity ∈ {minor}`**: **Pass**. The bug severity in the record is `minor`.
- **Fix is contained in a single file**: **Pass**. The fix is entirely contained within `hello.py`.
- **Estimated diff ≤ ~20 lines**: **Pass**. The diff is extremely small, modifying or removing only 5 lines.
- **No schema, API, migration, security, or build-system change**: **Pass**. The fix only corrects local application logic.
- **A regression test is obvious from the reproduction script**: **Pass**. The regression test is invoking `hello Alice --formal --count 3` and asserting that three identical lines are printed.

## Route Decision and Rationale
**Route Decision**: **Path A**
**Rationale**: All eligibility criteria are met. The fix is a localized logic change within a single file, and verification is straightforward.

## Collateral Findings
None. The defect is localized strictly within the `hello.py` main CLI entrypoint function.
