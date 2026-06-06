# HELLO-B01 — `--shout` flag has no effect — Bug Index

| Field | Value |
|-------|-------|
| **Bug ID** | HELLO-B01 |
| **Title** | `--shout` flag does not upper-case the greeting |
| **Severity** | Medium |
| **Status** | Open |
| **Root Cause** | Missing call parentheses on `greeting.upper` → should be `greeting.upper()` |
| **Fix complexity** | Single character |
| **Affected paths** | `hello.py:16` |

## Artifacts

| Document | Purpose |
|----------|---------|
| [BUG_REPORT.md](BUG_REPORT.md) | Full bug report with reproduction steps, root cause, and proposed fix |

## Timeline

| Date | Event |
|------|-------|
| 2026-06-06 | Bug reported, report filed |