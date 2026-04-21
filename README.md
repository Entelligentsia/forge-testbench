<div align="center">

# forge-testbench

**`forge-initialized` branch** — reference snapshot after `/forge:init --fast` + first sprint intake.

Looking to start from scratch? Switch to [`main`](https://github.com/Entelligentsia/forge-testbench).

</div>

---

## What's on This Branch

The `hello/` project after two Forge milestones:

**① `/forge:init --fast`** — Forge analyzed 26 lines of Python and generated:
- `.forge/config.json` — auto-detected stack config
- `.forge/workflows/` — 18 workflow stubs (self-materialize on first use)
- `.forge/schemas/` — JSON validation schemas
- `.claude/commands/hello/` — 14 project-scoped slash commands
- `hello-project-knowledge/MASTER_INDEX.md` — KB skeleton

**② `/hello:sprint-intake`** — first workflow invocation triggered lazy materialization:
- `hello-project-knowledge/architecture/stack.md` — generated from codebase
- `hello-project-knowledge/sprints/HELLO-S01/SPRINT_REQUIREMENTS.md` — sprint requirements
- `.forge/workflows/architect_sprint_intake.md` — stub replaced with full workflow
- `.forge/personas/product-manager.md` — materialized on first use
- `.forge/skills/` — architect + generic skills
- `.forge/templates/` — sprint requirements + manifest templates

Sprint **HELLO-S01** is at `planning` status — requirements captured, sprint plan not yet run.

---

## Artifact Map

```
hello/
├── .forge/
│   ├── config.json                        ← auto-detected: Python 3.11+, click, hatchling
│   ├── workflows/                         ← 18 workflows (stubs → full on first use)
│   │   └── architect_sprint_intake.md     ← materialized during sprint intake
│   ├── schemas/                           ← JSON schemas for store validation
│   ├── personas/                          ← product-manager.md (materialized)
│   ├── skills/                            ← architect + generic skills (materialized)
│   └── templates/                         ← sprint requirements + manifest templates
├── .claude/commands/hello/                ← 14 project slash commands
└── hello-project-knowledge/
    ├── MASTER_INDEX.md                    ← KB index (stub — grows with sprints)
    ├── architecture/
    │   └── stack.md                       ← generated from pyproject.toml + hello.py
    └── sprints/
        └── HELLO-S01/
            └── SPRINT_REQUIREMENTS.md     ← --goodbye flag requirements
```

## Key Files to Read

| File | What to Notice |
|------|---------------|
| `hello/.forge/config.json` | Stack auto-detected from 26 lines of code |
| `hello/.forge/workflows/architect_sprint_intake.md` | Full workflow — was a stub before first invocation |
| `hello/.forge/workflows/fix_bug.md` | Still a stub — materializes on first `/hello:fix-bug` |
| `hello/hello-project-knowledge/architecture/stack.md` | KB doc generated from codebase scan |
| `hello/hello-project-knowledge/sprints/HELLO-S01/SPRINT_REQUIREMENTS.md` | Requirements with acceptance criteria, edge cases, out-of-scope |
| `hello/.claude/commands/hello/` | 14 project-scoped commands |

## Commands Available

Type `/hello:` in Claude Code to autocomplete:

```
/hello:sprint-intake    /hello:sprint-plan      /hello:plan
/hello:implement        /hello:review-plan      /hello:review-code
/hello:approve          /hello:commit           /hello:fix-bug
/hello:run-task         /hello:run-sprint       /hello:collate
/hello:retrospective    /hello:quiz-agent
```

## Continue From Here

HELLO-S01 is at `planning` status. Next steps:

```
/hello:sprint-plan HELLO-S01        # break requirements into tasks
/hello:run-task HELLO-S01-T01       # execute first task (full pipeline)
```

> [!TIP]
> The full onboarding walkthrough is on [`main`](https://github.com/Entelligentsia/forge-testbench) — steps ①–⑤ cover setup through self-learning. This branch is the reference view for step ② artifacts.

---

## Projects

| | Project | Stack | Forge Status |
|:---:|---------|-------|:---:|
| 🟢 | **[hello/](hello/)** | Python + Click | Initialized + sprint intake |
| 🔵 | [cartographer/](cartographer/) | TypeScript + Commander | Not initialized |
| 🟠 | [emberglow/](emberglow/) | Go + YAML DSL | Not initialized |
| 🟣 | [spectral/](spectral/) | Python + NumPy | Not initialized |

Initialize the others yourself to compare how Forge adapts to different stacks:

```bash
cd cartographer && /forge:init --fast
cd emberglow && /forge:init --fast
cd spectral && /forge:init --fast
```

---

<div align="center">

[Full Onboarding Guide (main branch)](https://github.com/Entelligentsia/forge-testbench) · [Forge Docs](https://github.com/Entelligentsia/forge/tree/main/docs) · [Discussions](https://github.com/Entelligentsia/forge/discussions)

<sub>MIT License · Built by <a href="https://github.com/Entelligentsia">Entelligentsia</a></sub>

</div>
