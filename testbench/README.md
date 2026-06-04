# Testbench reset harness

Golden-snapshot reset for Forge testbench projects. One command returns a
project to a pristine, ready-to-execute state: sprint folders with
`TASK_PROMPT.md`s, `BUG_REPORT.md` fixtures, store entities at their initial
statuses (`sprints: planning`, `tasks: draft`, `bugs: reported`), empty event
log / cache / transcripts, and tracked source restored to the baseline tag.

## Day-to-day

```bash
testbench/reset.sh cartographer
```

Pure git + tar restore — fast, deterministic, no LLM, no store semantics.
Verifies entity counts/statuses against `golden/<project>/MANIFEST.json` and
runs `validate-store --dry-run` before reporting `PRISTINE`. Then run any of
`/forge:run-sprint CART-S0x`, `/forge:run-task CART-S0x-Tnn`,
`/forge:fix-bug CART-BUG-00n`.

## Changing the fixtures

1. Get the project into the state you want (add sprints/tasks/bugs, edit
   prompts, run `/forge:plan-sprint`, whatever).
2. `testbench/make-pristine.sh <project>` — rewinds statuses, strips
   summaries, prunes execution artifacts (keeps `TASK_PROMPT.md`,
   `SPRINT_PLAN.md`, `SPRINT_REQUIREMENTS.md`, `BUG_REPORT*.md`,
   `sprint_requirements.md`), re-collates KB indexes, gates on
   `validate-store`.
3. `testbench/snapshot.sh <project>` — captures `golden/<project>/state.tgz`,
   force-moves the `testbench/<project>-baseline` git tag to HEAD, writes
   `MANIFEST.json`.
4. Commit `testbench/golden/<project>/` (and push the tag:
   `git push -f origin testbench/<project>-baseline`).

## Layout

```
testbench/
├── reset.sh           # restore golden — the one you run between test runs
├── snapshot.sh        # capture current state as golden
├── make-pristine.sh   # executed state -> pristine state (curation, run rarely)
└── golden/
    └── cartographer/
        ├── state.tgz      # .forge/store + cache + engineering/ + root fixtures
        └── MANIFEST.json  # baseline tag/sha, entity census, tgz checksum
```

Scripts are project-parameterized — to onboard `emberglow`/`spectral`, run the
same make-pristine → snapshot flow with that project name.

## Notes

- `reset.sh` scopes `git restore`/`git clean` to the project subtree, so other
  testbench projects' in-flight work is untouched.
- `.forge/` and `engineering/` are gitignored inside projects — that's why the
  golden state travels as a tarball under `testbench/golden/` (tracked).
- Task branches created by sprint runs (`cart/*`) are left alone; reset only
  restores file state. Delete branches manually if they pile up.
