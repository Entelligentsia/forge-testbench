# Architect Approval — HELLO-BUG-002: `--shout` ignored when combined with `--formal`

🗻 hello Architect — final sign-off before commit. I hold the shape of the whole and confirm the fix, the regression guard, and the bug artifacts are coherent.

**Verdict:** Approved

## Scope of this approval

Path B fix-bug pipeline for HELLO-BUG-002. Plan, plan-review, implementation, and
code-review are all complete and approved. This gate confirms the whole is
architecturally coherent and the deployment posture is understood before commit.

## What I verified independently

- **`hello.py:15` is `if shout:`** — read directly. The buggy `and not formal`
  clause is gone, so `--shout` upper-cases the greeting on both the formal and
  informal paths. `greeting.upper()` is a real call. The `for _ in range(count)`
  loop sits outside the shout guard, so `--count` applies to both branches — no
  FORGE-BUG-007-style regression reintroduced.
- **Regression guard passes** — `python3 tests/test_shout_formal.py` → all four
  cases PASS, exit 0 (observed this run). The four cases cover the exact
  shout/formal/count branch matrix this bug touches, including the subtle
  no-trailing-`!` detail on the formal path (`GREETINGS, ALICE`).
- **Empty net `hello.py` diff is expected and correct** — `git diff --stat
  hello.py` is empty. HEAD already carried the correct `if shout:` guard; the
  working tree had reintroduced the bug and the implement phase restored it. The
  substantive landed artifact is `tests/test_shout_formal.py` (currently
  untracked under `tests/`), which is what actually enters the commit.
- **Preflight gate** — `preflight-gate.cjs --phase approve --bug HELLO-BUG-002`
  exits 0.
- **Artifact consistency** — TRIAGE.md, BUG_FIX_PLAN.md, PLAN_REVIEW.md,
  PROGRESS.md, and CODE_REVIEW.md tell one consistent story: business-rule
  defect, Path B (severity `major` fails the Path A minor-only criterion),
  one-line guard restoration, standalone CliRunner regression script. Both
  Supervisor reviews proved the guard discriminates against a reintroduced bug
  rather than passing tautologically.

## Architectural assessment

The fix correctly and minimally resolves the root cause. The defect was the
`if shout and not formal:` guard encoding the wrong business rule; the correct
guard `if shout:` makes shouting orthogonal to formality, which is the intended
behaviour. The change is single-file, single-line, and touches no schema, API,
packaging, or entry point. The `hello` console entry point (`hello.py:main`,
installed via `pip install -e .`) is unaffected. The regression guard is adequate:
it is a standalone `python3` script matching the project's stack reality (no
pytest installed, `config.commands.test` null, `click` 8.1.6 present), resolves
`hello.py` robustly via the repo root on `sys.path`, and exits non-zero on
failure.

## Deployment notes

- No packaging or entry-point change. No migration. No new runtime dependency
  (`click.testing.CliRunner` ships with the existing `click` dependency).
- The commit phase will introduce the new `tests/` directory and
  `tests/test_shout_formal.py` as the first tracked test in the project.

## Follow-up items for future sprints

- Wire a project test command (`config.commands.test` is null) so this and future
  regression guards run as part of a standard verification step rather than ad hoc.
- Review the "Known issues" note in `CLAUDE.md` (references the earlier
  `greeting.upper` vs `greeting.upper()` defect) for staleness — documentation
  follow-up, not part of this fix.
