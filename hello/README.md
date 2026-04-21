# hello

Minimal CLI greeter. Single-file Python. Simplest testbench project.

## Stack

- **Language**: Python 3.11+
- **CLI**: click
- **Entry point**: `hello.py:main`
- **Tests**: pytest (if you add them)

## Usage (Before Forge)

```bash
pip install -e .
hello Alice             # Hello, Alice!
hello Alice --shout     # HELLO, ALICE!
hello Alice --count 3   # Hello, Alice! (3 times)
```

## Try Forge (15 minutes)

### Prerequisites

Forge plugin installed. From testbench root:
```bash
/plugin marketplace add Entelligentsia/skillforge
/plugin install forge@skillforge
/reload-plugins
```

### Step 1: Initialize Forge

**IMPORTANT**: Open Claude Code from this directory (`hello/`).

```bash
cd /path/to/forge-testbench/hello
# Open new Claude Code session here
```

Then:
```bash
/forge:init --fast
```

Fast mode recommended (2 min). Watch 12 phases execute.

After init:
- `.forge/` created (config, workflows, personas, store)
- `engineering/` created (architecture, entities, stack-checklist)
- Project commands available (check `/help`)

### Step 2: Explore Generated Artifacts

#### Personas
```bash
cat .forge/personas/engineer.md
```

Project-specific:
- "You are implementing features for hello, a minimal CLI greeter"
- "Uses click for CLI parsing, pytest for testing"
- References `engineering/` docs for context

Not generic "Engineer" template.

#### Workflows
```bash
ls .forge/workflows/
```

15+ workflows generated:
- `plan_task.md` — research → implementation plan
- `implement_plan.md` — execute approved plan
- `fix_bug.md` — triage → fix → verify
- `architect_sprint_intake.md` — capture requirements
- `architect_sprint_plan.md` — break down into tasks
- etc.

Open `fix_bug.md` — 5 phases (triage, root cause, fix, implement, KB writeback).

#### Knowledge Base
```bash
cat engineering/architecture/processes.md
```

Discovered from codebase:
- Build: `pip install -e .`
- Test: `pytest` (if configured)
- Lint: (none found)

```bash
cat engineering/business-domain/entities.md
```

Minimal project → no complex entities. Forge adapted (no forced abstractions).

```bash
cat engineering/MASTER_INDEX.md
```

Empty initially. Will populate as you create sprints/tasks/bugs.

### Step 3: Create Test Sprint

Copy-paste to Claude:

```
I want to create a test sprint for hello to see Forge in action.

Sprint goal: "Add --goodbye flag"

Feature description:
"Add a --goodbye flag to hello.py that prints 'Goodbye, NAME!' instead of 'Hello, NAME!'. 
Should work with --shout and --count just like regular greeting."

Acceptance criteria:
1. hello Alice --goodbye → "Goodbye, Alice!"
2. hello Alice --goodbye --shout → "GOODBYE, ALICE!"
3. hello Alice --goodbye --count 3 → "Goodbye, Alice!" (3 times)
4. Test coverage for new flag

Please run /sprint-intake using this information.
```

Claude runs `/sprint-intake`, creates `engineering/sprints/HELLO-S01/intake.md`.

Then:
```bash
/sprint-plan HELLO-S01
```

Forge:
1. Breaks feature into tasks (2-3 tasks likely)
2. Estimates complexity (S/M/L)
3. Creates dependency graph
4. Writes `engineering/sprints/HELLO-S01/plan.md`

Check plan:
```bash
cat engineering/sprints/HELLO-S01/plan.md
```

### Step 4: Run a Task

```bash
/run-task HELLO-S01-T01
```

Full pipeline executes:
1. **Engineer plans** (reads KB, proposes implementation)
2. **Supervisor reviews plan** (checks against KB + spec)
3. **Engineer implements** (writes code)
4. **Supervisor reviews code** (checks quality + spec)
5. **Architect approves** (final gate)
6. **Commit** (atomic git commit)

Check artifacts:
```bash
ls engineering/sprints/HELLO-S01/HELLO-S01-T01/
# PLAN.md, PLAN_REVIEW.md, CODE_REVIEW.md, ARCHITECT_APPROVAL.md, COST_REPORT.md, etc.
```

Open each file — see full decision trail.

Check code:
```bash
git log --oneline -1
# Should see commit from task
```

### Step 5: Report a Bug

Copy-paste to Claude:

```
I found a bug. When I run:
hello Alice --count 5 --shout

Expected: "HELLO, ALICE!" printed 5 times
Actual: (test to see what happens — might be off-by-one, might be shout not applied)

Please run /hello:fix-bug (or /fix-bug) to investigate and fix using Forge bug workflow.
```

Claude:
1. **Triages** (reproduces, classifies severity)
2. **Analyzes** (root cause)
3. **Proposes fix**
4. **Implements + tests**
5. **KB writeback** (adds pattern to prevent similar bugs)

Check bug artifacts:
```bash
ls engineering/bugs/
# HELLO-B01-* folder

cat engineering/bugs/HELLO-B01-*/BUG_FIX_PLAN.md
```

Root cause documented (not just fix).

### Step 6: Verify Self-Learning

Check KB after bug fix:
```bash
git diff HEAD~1 engineering/
```

Forge wrote back to KB (new patterns, checks, or warnings added).

Next sprint will benefit from this learning.

### Step 7: Ask Tomoshibi

```bash
/forge:ask What sprints exist?
/forge:ask What's the status of HELLO-S01?
/forge:ask What bugs have been reported?
```

Instant answers from `.forge/store/` and `engineering/`.

### Step 8: Check Commands

```bash
/help
```

Look for:
- Forge plugin commands (`/forge:init`, `/forge:health`, `/forge:ask`, etc.)
- Project-specific commands (`/hello:fix-bug`, `/hello:*`, etc.)

If project commands missing:
```bash
/forge:regenerate commands
```

## What You Experienced

### ✅ Zero-to-SDLC in 2 Minutes
Pristine project → `/forge:init --fast` → full SDLC structure.

### ✅ Project-Specific Adaptation
Personas know "click CLI", "pytest", "single-file design" — not generic.

### ✅ Multi-Stage Review
10+ artifacts per task (plan, reviews, approvals). Not "ship it."

### ✅ Self-Learning
Bug root cause → KB writeback → next sprint smarter.

### ✅ Context-Efficient
Workflows load surgical KB sections, not full codebase.

## Compare with Other Projects

Try same steps on:
- `cartographer/` (TypeScript) — different stack, different personas
- `emberglow/` (Go) — different conventions, different tools
- `spectral/` (Python) — same language, different domain

Same SDLC structure. Different adaptation.

## Troubleshooting

### Forge Not Found
```bash
/plugin list
# Verify forge@skillforge enabled

/reload-plugins
```

### Must Open Claude from hello/ Directory
Forge operates on current working directory. Wrong directory = wrong project.

### Commands Missing
After init, check:
```bash
/help
ls .claude/commands/
```

If missing:
```bash
/forge:regenerate commands
```

### Something Broken?
```bash
/forge:report-bug
```

Structured bug reporting with auto-captured context.

## Next Steps

1. Try full sprint (`/run-sprint HELLO-S01` for all tasks)
2. Run retrospective (`/retrospective HELLO-S01`)
3. Check KB updates (git diff engineering/)
4. Try Forge on your own project

## License

MIT
