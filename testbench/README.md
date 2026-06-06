# Testbench reset harness

Golden-baseline reset + release-parity gates for Forge testbench projects.

**The clone-ready contract:** for every onboarded project, `git clone` →
`checkout main` → `/forge:run-sprint CART-S0x` / `/forge:run-task
CART-S0x-Tnn` / `/forge:fix-bug CART-BUG-00n` works, at the plugin/forgecli
versions pinned in `golden/<project>/MANIFEST.json`. The full Forge instance
(`.forge/` minus volatile dirs, `engineering/`, `.claude/workflows|commands/`)
is **git-tracked**; the baseline tag is the single source of truth (the old
tarball mechanism is retired). forgecli ≥ 1.0.24 self-heals a foreign
`paths.forgeRoot` to its own bundled payload, so tracked configs are portable.

Onboarded: **cartographer, hello, emberglow, spectral** — all four projects
carry runnable fixtures (sprint @ planning, tasks @ draft, bugs @ reported).

## Day-to-day

```bash
testbench/reset.sh cartographer     # restore pristine between runs (pure git)
testbench/readiness.sh cartographer # verify the clone-ready contract at HEAD
```

`reset.sh` is git-restore + volatile-dir recreation, census-verified against
`golden/<project>/MANIFEST.json` and gated on `validate-store --dry-run`.
`readiness.sh` simulates a fresh clone in a temporary worktree (node + git
only, no forgecli, CI-safe) — it is also the CI gate
(`.github/workflows/readiness.yml`: every push, weekly, and on
`repository_dispatch` type `forge-release`).

## Release parity (every forge plugin / forgecli release)

```bash
testbench/rebaseline.sh cartographer
# then, as the script prints:
git add -A cartographer/ && git commit -m "rebaseline: …"
testbench/snapshot.sh cartographer
git add testbench/golden/cartographer/ && git commit -m "golden: …"
git push origin main && git push -f origin testbench/cartographer-baseline
testbench/readiness.sh cartographer
```

`rebaseline.sh` re-materializes the instance from the **installed forgecli's
bundled payload** (config stamp → `substitute-placeholders.cjs` → tools +
schemas vendoring → `make-pristine.sh`). This step is on the forge-releaser /
forge-cli release checklists — a release is not done until the testbench
readiness gate is green at the new version.

## Changing the fixtures

1. Get the project into the state you want (add sprints/tasks/bugs, edit
   prompts, run `/forge:plan-sprint`, whatever).
2. `testbench/make-pristine.sh <project>` — rewinds statuses, strips
   summaries, prunes execution artifacts (keeps `TASK_PROMPT.md`,
   `SPRINT_PLAN.md`, `SPRINT_REQUIREMENTS.md`, `BUG_REPORT*.md`,
   `sprint_requirements.md`), re-collates KB indexes, gates on
   `validate-store`.
3. Commit the pristine state (snapshot refuses uncommitted trees).
4. `testbench/snapshot.sh <project>` — force-moves the
   `testbench/<project>-baseline` tag to HEAD and writes the version-stamped
   `MANIFEST.json` (entity census, plugin/forgecli versions, tool sentinels).
5. Commit `testbench/golden/<project>/MANIFEST.json`; push main and the tag
   (`git push -f origin testbench/<project>-baseline`).

## Onboarding a new project (emberglow / spectral)

1. `/forge:init` the project with forgecli; curate sprints/tasks/bugs fixtures.
2. `make-pristine.sh` → commit → `snapshot.sh` → commit MANIFEST → push + tag.
3. Add a `readiness.sh <project>` step to `.github/workflows/readiness.yml`.

## Layout

```
testbench/
├── reset.sh           # restore golden — the one you run between test runs
├── readiness.sh       # clone-ready gate (CI + local) — node + git only
├── rebaseline.sh      # release hook: re-materialize instance from installed forgecli
├── snapshot.sh        # capture current committed state as golden (tag + MANIFEST)
├── make-pristine.sh   # executed state -> pristine state (curation, run rarely)
└── golden/
    └── cartographer/
        └── MANIFEST.json  # baseline tag/sha, entity census, version pins, sentinels
```

## Notes

- `reset.sh` scopes `git restore`/`git clean` to the project subtree, so other
  testbench projects' in-flight work is untouched.
- Volatile state is never tracked: `.forge/cache/`, `.forge/transcripts/`,
  `.forge/store/events/` (a `.gitkeep` keeps the dir), enhancement-proposals,
  `pi-settings.json`, `init-progress.json`.
- Task branches created by sprint runs (`cart/*`) are left alone; reset only
  restores file state. Delete branches manually if they pile up.
