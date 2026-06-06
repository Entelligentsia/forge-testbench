# HELLO-B01 — `--shout` flag has no effect

| Field | Value |
|-------|-------|
| **Bug ID** | HELLO-B01 |
| **Title** | `--shout` flag does not upper-case the greeting |
| **Severity** | Medium |
| **Status** | Open |
| **Affected file** | `hello.py:16` |
| **Introduced in** | v0.1.0 |
| **Discovered** | 2026-06-06 |

## Summary

The `--shout` CLI flag is supposed to upper-case the greeting output, but it has no effect. When `--shout` is passed, the output displays the `str.upper` method object reference (e.g. `<built-in method upper of str object at 0x...>`) instead of the upper-cased greeting string.

## Steps to Reproduce

```bash
pip install -e .
hello Alice --shout
```

## Expected Behavior

```
HELLO, ALICE!
```

## Actual Behavior

```
<built-in method upper of str object at 0x7db1fa761770>
```

Also reproducible with the formal path:

```bash
hello Alice --formal --shout
```

**Expected:** `GREETINGS, ALICE`
**Actual:** `<built-in method upper of str object at 0x758273261730>`

## Root Cause

In `hello.py` line 16, `greeting.upper` references the **method object** without calling it. The correct syntax requires parentheses:

```python
# Bug (line 16):
greeting = greeting.upper        # ← assigns the bound method, doesn't call it

# Fix:
greeting = greeting.upper()     # ← calls the method, returns the upper-cased string
```

Python evaluates `greeting.upper` as a bound method reference rather than invoking it. When `click.echo()` receives this method object, it converts it to its `repr()` string, producing output like `<built-in method upper of str object at 0x...>`.

## Proposed Fix

Change line 16 of `hello.py` from:

```python
greeting = greeting.upper
```

to:

```python
greeting = greeting.upper()
```

**Impact:** Single character change (adding `()`). No other files affected. The `--formal`, `--count`, and default paths are all unaffected — only the `--shout` code path is broken.

## Regression Guard

A standalone test exists at `tests/test_shout_formal.py` covering four cases:

| Case | Args | Expected |
|------|------|----------|
| Formal + shout | `Alice --formal --shout` | `GREETINGS, ALICE` |
| Informal + shout | `Alice --shout` | `HELLO, ALICE!` |
| Formal only | `Alice --formal` | `Greetings, Alice` |
| Formal + shout × 2 | `Alice --formal --shout --count 2` | 2× `GREETINGS, ALICE` |

Run with: `python3 tests/test_shout_formal.py`

## Severity Justification

**Medium** — The `--shout` flag is a documented user-facing feature (README, `--help`). It does not cause a crash or data loss, but it produces confusing output (a Python method repr) instead of the expected upper-cased text. This is a common Python beginner mistake (missing call parentheses) and has a trivial one-character fix.