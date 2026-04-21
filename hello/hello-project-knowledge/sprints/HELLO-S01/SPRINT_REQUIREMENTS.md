# HELLO-S01 Sprint Requirements

**Captured:** 2026-04-21
**Source:** sprint-intake interview

## Sprint Goal

Add a `--goodbye` flag to the `hello` CLI so users can emit a farewell greeting instead of a hello greeting.

## Stakeholder

Developer/demo user exploring the hello CLI. The feature rounds out the greeting toolkit by adding a complementary farewell mode.

## Must-Have Requirements

| # | Requirement | Acceptance Criterion | Example Invocation |
|---|-------------|---------------------|--------------------|
| 1 | Basic goodbye greeting | Running the command prints `Goodbye, Alice!` to stdout | `hello Alice --goodbye` |
| 2 | Goodbye + shout | Running the command prints `GOODBYE, ALICE!` to stdout (fully uppercased) | `hello Alice --goodbye --shout` |
| 3 | Goodbye + count | Running the command prints `Goodbye, Alice!` exactly 3 times (once per line) | `hello Alice --goodbye --count 3` |
| 4 | Test coverage | A test exists that exercises `--goodbye`, `--goodbye --shout`, and `--goodbye --count 3` and asserts the correct stdout output for each | *(pytest invocation once tests are configured)* |

## Out of Scope

- Fixing the existing `--shout` bug on the regular greeting (tracked separately as HELLO-B01)
- Adding any other new flags (`--formal`, `--quiet`, etc.) not listed above
- Internationalisation or localisation of the goodbye message
- CI pipeline setup

## Priority Order

1. Basic `--goodbye` flag (Requirement 1) — foundation; nothing else works without this
2. `--goodbye --shout` compatibility (Requirement 2) — combines with existing flag
3. `--goodbye --count` compatibility (Requirement 3) — combines with existing option
4. Test coverage (Requirement 4) — verifies all above

## Edge Cases

| Scenario | Expected Behaviour | Status |
|----------|--------------------|--------|
| `hello --goodbye` (no name) | click raises `MissingArgument` error; same as baseline `hello` with no name | Accepted — no special handling needed |
| `hello Alice --goodbye --shout --count 3` | Prints `GOODBYE, ALICE!` 3 times | Must-have combo; covered by requirements 2+3 together |
| Name with special characters (`hello "O'Brien" --goodbye`) | Prints `Goodbye, O'Brien!` unchanged | Deferred — no encoding requirement stated |

## Open Questions

- None. All acceptance criteria confirmed by user.

## Handoff Checklist

- [x] Sprint goal is one clear sentence
- [x] Every must-have has a specific, testable acceptance criterion
- [x] Every acceptance criterion names an exact terminal output or exit code
- [x] Out-of-scope list has at least two items
- [x] Requirements are priority-ranked
- [x] Edge cases are documented or explicitly deferred
- [x] `SPRINT_REQUIREMENTS.md` written to `hello-project-knowledge/sprints/HELLO-S01/`
- [x] Architect has been notified that requirements are ready
