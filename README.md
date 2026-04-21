# forge-testbench

> **You are on the `forge-initialized` branch** — Forge artifacts after init + first sprint intake.
> To start from scratch (pristine, no Forge): switch to [`main`](../../tree/main).

Four CLI projects demonstrating Forge SDLC at different stages.

## What This Branch Shows

This branch captures the `hello/` project after two Forge milestones:

1. **`/forge:init --fast`** — Forge analyzed the 26-line Python greeter and generated:
   - `.forge/config.json` — project config (stack auto-detected)
   - `.forge/workflows/` — 18 workflow stubs (self-materialize on first use)
   - `.forge/schemas/` — JSON validation schemas
   - `.claude/commands/hello/` — 14 project-scoped slash commands
   - `hello-project-knowledge/MASTER_INDEX.md` — KB skeleton

2. **`/hello:sprint-intake`** (first workflow invocation, lazy-materialized):
   - `hello-project-knowledge/architecture/stack.md` — generated from codebase
   - `hello-project-knowledge/sprints/HELLO-S01/SPRINT_REQUIREMENTS.md` — sprint requirements
   - `.forge/workflows/architect_sprint_intake.md` — stub replaced with full workflow
   - `.forge/personas/product-manager.md` — materialized on first use
   - `.forge/skills/architect-skills.md`, `generic-skills.md`
   - `.forge/templates/SPRINT_REQUIREMENTS_TEMPLATE.md`, `SPRINT_MANIFEST_TEMPLATE.md`

Sprint HELLO-S01 is in `planning` status — requirements captured, sprint plan not yet run.

## Navigate the Artifacts

### Start Here
```
hello/
├── .forge/
│   ├── config.json                    ← auto-detected stack config
│   ├── workflows/                     ← 18 workflows (stubs → full on first use)
│   │   └── architect_sprint_intake.md ← this one materialized during sprint intake
│   ├── schemas/                       ← JSON schemas for store validation
│   ├── personas/                      ← product-manager.md (materialized)
│   ├── skills/                        ← architect + generic skills (materialized)
│   └── templates/                     ← sprint requirements + manifest templates
├── .claude/commands/hello/            ← 14 project slash commands
└── hello-project-knowledge/
    ├── MASTER_INDEX.md                ← KB index (stub — grows with each sprint)
    ├── architecture/
    │   └── stack.md                   ← generated from pyproject.toml + hello.py
    └── sprints/
        └── HELLO-S01/
            └── SPRINT_REQUIREMENTS.md ← --goodbye flag requirements
```

### Key Files to Read

| File | What to notice |
|------|---------------|
| `hello/.forge/config.json` | Stack auto-detected: Python 3.11+, click, hatchling — from 26 lines of code |
| `hello/.forge/workflows/architect_sprint_intake.md` | Full workflow (was a stub before first `/hello:sprint-intake` invocation) |
| `hello/.forge/workflows/fix_bug.md` | Still a stub — materializes on first `/hello:fix-bug` |
| `hello/hello-project-knowledge/architecture/stack.md` | KB doc generated from codebase scan |
| `hello/hello-project-knowledge/sprints/HELLO-S01/SPRINT_REQUIREMENTS.md` | Requirements with acceptance criteria, edge cases, out-of-scope |
| `hello/.claude/commands/hello/` | 14 project-scoped commands (`/hello:sprint-plan`, `/hello:fix-bug`, etc.) |

### Commands Available (type `/hello:` in Claude Code)

After this init, these slash commands work in the `hello/` project:

```
/hello:sprint-intake    run sprint requirements interview
/hello:sprint-plan      break requirements into tasks
/hello:plan             plan a single task
/hello:implement        implement an approved plan
/hello:review-plan      supervisor plan review
/hello:review-code      supervisor code review
/hello:approve          architect final gate
/hello:commit           atomic commit after approval
/hello:fix-bug          full bug triage → fix → verify pipeline
/hello:run-task         full task pipeline (plan → implement → review → commit)
/hello:run-sprint       full sprint orchestration
/hello:collate          collate sprint artifacts
/hello:retrospective    sprint retrospective
/hello:quiz-agent       verify agent loaded KB correctly
```

### What's Next (Not Yet Done)

HELLO-S01 is at `planning` status. To continue:

```bash
# Break requirements into tasks
/hello:sprint-plan HELLO-S01

# Run first task
/hello:run-task HELLO-S01-T01
```

## Why This Exists

Claude Code is powerful, but without structure, it re-learns your project every session.

**Forge** generates project-specific knowledge bases, personas, and workflows that improve with every sprint.

The `main` branch is the pristine starting point. This branch is the reference view after init + first workflow use.

## Quick Start (15 minutes)

### 1. Install Forge
```bash
/plugin marketplace add Entelligentsia/skillforge
/plugin install forge@skillforge
/reload-plugins
```

Verify installation:
```bash
/plugin list
# Should show: forge@skillforge (enabled)
```

### 2. Clone This Repo
```bash
git clone https://github.com/Entelligentsia/forge-testbench.git
cd forge-testbench
```

### 3. Pick a Project
| Project | Language | Complexity | Description |
|---------|----------|------------|-------------|
| **hello/** | Python | ⭐ Simplest | 26-line CLI greeter — **START HERE** |
| cartographer/ | TypeScript | ⭐⭐ Medium | Terminal knowledge graph tool |
| emberglow/ | Go | ⭐⭐⭐ Complex | Smart home DSL interpreter |
| spectral/ | Python | ⭐⭐ Medium | Mood-based soundscape generator |

### 4. Open Claude Code in Project
```bash
cd hello/
# Open Claude Code here (new terminal session in this directory)
```

**IMPORTANT**: Must open Claude Code from project directory. Forge operates on current working directory.

### 5. Initialize Forge
```bash
/forge:init --fast
```

**Fast mode recommended** (~2-4 min lazy-build vs ~10-15 min full upfront).

Watch Forge run 12 phases (fast mode runs 7, defers 5 to first use):
1. **Discover**: Scans codebase (stack, processes, database, routing, testing)
2. **Marketplace Skills**: Recommends skills for your stack
3. **Knowledge Base**: Creates skeleton (MASTER_INDEX + empty dirs)
4. **Personas**: [DEFERRED to first workflow use]
5. **Skills**: [DEFERRED to first workflow use]
6. **Templates**: [DEFERRED to first workflow use]
7. **Workflows**: Creates 18 self-materializing workflow stubs
8. **Orchestration**: [DEFERRED to first workflow use]
9. **Commands**: Creates project-specific slash commands (e.g., `/hello:fix-bug`)
10. **Tools**: Copies validation schemas
11. **Smoke Test**: Validates everything wired correctly
12. **Tomoshibi**: Links KB to CLAUDE.md

**User prompts during init**:
- KB folder name (default: `engineering/`, can customize)
- Permissions for creating `.claude/commands/` directory

After init completes:
- `.forge/` directory created (config, workflows stubs, schemas, store)
- KB directory created (skeleton with stub docs)
- Project-specific commands available (type `/hello:` to see 14 commands)
- First workflow invocation triggers ~1-2 min materialization

**You are on `forge-initialized`** — this branch IS the initialized reference. See the artifact map at the top of this README.

### 6. Verify Setup
```bash
/plugin list
# forge@skillforge should be enabled

ls .forge/
# Should see: config.json, workflows/, schemas/, store/

ls engineering/  # or custom KB folder name you chose
# Should see: MASTER_INDEX.md, architecture/, business-domain/, sprints/, bugs/

# Discover project commands: Type /hello: in prompt
# Should see 14 commands autocomplete (sprint-intake, plan, implement, etc.)
```

### 7. Explore Generated Artifacts (Fast Mode)

**Fast mode creates stubs** — full content materializes on first workflow use.

Open `engineering/MASTER_INDEX.md`:
```markdown
# Master Index

<!-- forge-fast-stub -->

## Domain Entities
<!-- Will populate on materialization -->

## Architecture
- [Stack](architecture/stack.md)
- [Processes](architecture/processes.md)
...
```

Open `.forge/workflows/plan_task.md`:
```markdown
<!-- FORGE FAST-MODE STUB — will self-replace on first use -->

# Workflow: plan_task (fast-mode stub)

Before doing any task work, materialise this workflow and its dependencies:
1. Read lazy-materialize.md
2. Re-read this file (now replaced with real workflow)
3. Execute real workflow
```

Open `.forge/config.json` — project config:
```json
{
  "project": { "prefix": "HELLO", "name": "hello" },
  "stack": { "primary": "Python", "version": "3.11+", "frameworks": ["click"] },
  "paths": { "engineering": "engineering", "store": ".forge/store" },
  "mode": "fast"
}
```

👉 **Key insight**: Forge discovered stack from 26-line Python file. Not templates.

### 8. Create Your First Sprint (Copy-Paste Prompt)

Tell Claude (copy-paste this):

```
I want to create a test sprint for hello project to see Forge in action.

Sprint goal: "Add --goodbye flag"

Feature description:
"Add a --goodbye flag to hello.py that prints 'Goodbye, NAME!' instead of 'Hello, NAME!'. 
It should work with --shout and --count flags just like the regular greeting."

Acceptance criteria:
1. User can run: hello Alice --goodbye
2. Output: "Goodbye, Alice!"
3. Works with --shout: hello Alice --goodbye --shout → "GOODBYE, ALICE!"
4. Works with --count: hello Alice --goodbye --count 3 → prints "Goodbye, Alice!" 3 times
5. Test coverage for new flag

Please run /sprint-intake for me using this information.
```

Claude will run `/sprint-intake`, create `engineering/sprints/HELLO-S01/intake.md`.

Then:
```bash
/sprint-plan HELLO-S01
```

Forge breaks feature into tasks (likely 2-3 tasks), creates dependency graph, estimates complexity.

Check `engineering/sprints/HELLO-S01/plan.md`.

### 9. Run a Task

```bash
/run-task HELLO-S01-T01
```

Watch Forge execute full pipeline:
1. **Plan**: Engineer reads KB, proposes implementation
2. **Review Plan**: Supervisor checks against KB + spec
3. **Implement**: Engineer writes code
4. **Review Code**: Supervisor checks quality + spec compliance
5. **Architect Approval**: Final gate
6. **Commit**: Atomic git commit

Check `engineering/sprints/HELLO-S01/HELLO-S01-T01/`:
- `PLAN.md` (implementation strategy)
- `PLAN_REVIEW.md` (supervisor plan feedback)
- `CODE_REVIEW.md` (supervisor code feedback)
- `ARCHITECT_APPROVAL.md` (final gate)
- `COST_REPORT.md` (token usage)
- `VALIDATION_REPORT.md` (tests passing?)

### 10. Report a Bug (Copy-Paste Prompt)

Tell Claude (copy-paste this):

```
I found a bug in hello.py. When I run:
hello Alice --count 5 --shout

The output should print "HELLO, ALICE!" 5 times (shouted, repeated).

But I suspect there might be an off-by-one error in the count logic, 
or the shout flag might not be applied correctly.

Please run /hello:fix-bug (or /fix-bug if no project command exists) to 
investigate and fix this bug using Forge's bug workflow.
```

Claude will:
1. Triage (reproduce, classify severity)
2. Root cause (analyze code)
3. Propose fix
4. Implement + test
5. KB writeback (add to review checklist → self-learning)

Check `engineering/bugs/HELLO-B01-*/`:
- `INDEX.md` (bug summary)
- `BUG_FIX_PLAN.md` (fix strategy)
- `CODE_REVIEW.md` (supervisor review)
- `PROGRESS.md` (implementation log)

### 11. Ask Tomoshibi

```bash
/forge:ask What sprints exist?
/forge:ask What's the status of HELLO-S01?
/forge:ask What bugs have been reported?
```

Tomoshibi reads `.forge/store/` and `engineering/` — instant answers.

### 12. Check Self-Learning

Open `engineering/bugs/HELLO-B01-*/BUG_FIX_PLAN.md`:
- Root cause documented (not just fix)

Open `engineering/architecture/` or relevant KB docs:
- Bug writeback added patterns/checks to prevent similar issues

👉 **Key insight**: KB improves with every sprint. Next sprint catches issues this sprint taught.

## What You Just Experienced

### ✅ Project-Specific Adaptation
Personas/workflows generated from your codebase, not templates.

Compare `.forge/personas/engineer.md` with another project (cartographer/, emberglow/):
- Different stack, different entities, different conventions.

### ✅ Self-Learning Loop
Bug → root cause → KB writeback → prevents similar bugs.

Check `engineering/` before and after bug fix — KB evolved.

### ✅ Context-Efficient Recall
Workflows load only relevant KB sections (surgical recall, not full codebase).

Check `.forge/workflows/plan_task.md` — references specific KB docs, not everything.

### ✅ Multi-Stage Review
Plan review + code review + architect approval. Not "ship it."

Count files in `engineering/sprints/HELLO-S01/HELLO-S01-T01/` — 10+ artifacts per task.

### ✅ Deterministic Tools
`engineering/tools/collate.*`, `validate-store.*` generated in your language (Python for hello/).

LLM resources for thinking, not housekeeping.

## Try Other Projects

Repeat steps 4–12 with:
- `cartographer/` (TypeScript, different stack)
- `emberglow/` (Go, different conventions)
- `spectral/` (Python, but different domain)

Compare generated artifacts across projects. Same SDLC structure, different adaptation.

## Advanced: Full Mode vs Fast Mode

### Fast Mode (Default)
- Init: 2 min
- Workflows: Stubs that materialize on first use
- Trade-off: First invocation slower (generation penalty)

### Full Mode
- Init: 12 min
- Workflows: All generated upfront
- Trade-off: Slower onboarding, no lazy-build delay

Switch modes:
```bash
/forge:config mode full
/forge:regenerate workflows
```

Or start fresh:
```bash
# Backup if you want to keep artifacts
mv .forge .forge.backup
mv engineering engineering.backup

/forge:init --full
```

## Security

Every Forge release scanned before publish:
- 171 files analyzed (commands, agents, hooks, workflows)
- 0 critical issues across all versions
- Public audit trail: [docs/security/](https://github.com/Entelligentsia/forge/tree/main/docs/security)

Scan installed plugins yourself:
```bash
/security-watchdog:scan-plugin forge:forge
/security-watchdog:scan-plugin <other-plugin-id>
```

## Troubleshooting

### Forge Command Not Found
```bash
/plugin list
# Verify forge@skillforge enabled

/reload-plugins
# Reload if needed
```

### Project Commands Missing (/hello:fix-bug)
After `/forge:init`, check:
```bash
# Type / in Claude Code to see available commands
# Look for project-specific namespace:

ls .claude/commands/
# Should see generated command files
```

If missing:
```bash
/forge:regenerate commands
```

### Permission Prompts
Forge reads files frequently. To reduce prompts:
```bash
/update-config
# Ask to "allow Read tool for engineering/ and .forge/ directories"
```

### Init Failed / Interrupted
Check `.forge/init-progress.json` for last completed phase.

Resume:
```bash
/forge:init --resume
```

Or start fresh (backup first if you want to keep partial artifacts).

### Something Broken? Report It
```bash
/forge:report-bug
```

Forge interviews you, captures context (version, stack, OS), drafts GitHub issue.

Preferred over manual filing — structured, includes diagnostic info automatically.

## Next Steps

After testbench experience:
1. Try Forge on your own project
2. Read [Forge docs](https://github.com/Entelligentsia/forge/tree/main/docs)
3. Check [command reference](https://github.com/Entelligentsia/forge/tree/main/docs/commands)
4. Join [GitHub Discussions](https://github.com/Entelligentsia/forge/discussions)

## Share Your Experience

Go online (Reddit, HN, LinkedIn) and tell us:
- What worked?
- What broke?
- What confused you?
- What impressed you?

Good or bad — we learn from both.

Use `/forge:report-bug` for technical issues.

## License

MIT

---

**Questions?** Open an issue or ask on [GitHub Discussions](https://github.com/Entelligentsia/forge/discussions)
