# forge-testbench

Four pristine CLI projects for hands-on Forge demonstration.

## Why This Exists

Claude Code is powerful, but without structure, it re-learns your project every session.

**Forge** generates project-specific knowledge bases, personas, and workflows that improve with every sprint.

This testbench lets you experience Forge from scratch — no pre-initialized state.

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

**Fast mode recommended** (2 min lazy-build vs 12 min full upfront).

Watch Forge:
1. **Discover**: Scans codebase (stack, processes, database, routing, testing)
2. **Marketplace Skills**: Recommends skills for your stack
3. **Knowledge Base**: Generates `engineering/` (architecture, entities, stack-checklist)
4. **Personas**: Creates project-specific Engineer, Supervisor, Architect, etc.
5. **Skills**: Generates agent skills
6. **Templates**: Creates plan/review/retro templates
7. **Workflows**: Generates 15+ workflows (plan, implement, review, fix-bug, etc.)
8. **Orchestration**: Assembles task pipeline
9. **Commands**: Creates project-specific slash commands (e.g., `/hello:fix-bug`)
10. **Tools**: Generates collate, validate-store, seed-store scripts (in your language)
11. **Smoke Test**: Validates everything wired correctly
12. **Tomoshibi**: Forge concierge ready

After init completes:
- `.forge/` directory created (config, workflows, personas, store)
- `engineering/` directory created (KB, ready for sprints/bugs)
- Project-specific commands available (`/help` to list)

### 6. Verify Setup
```bash
/plugin list
# forge@skillforge should be enabled

ls .forge/
# Should see: config.json, personas/, workflows/, store/, ...

ls engineering/
# Should see: architecture/, business-domain/, stack-checklist.md

/help
# Look for project-specific commands (e.g., /hello:fix-bug)
```

### 7. Explore Generated Artifacts

Open `engineering/MASTER_INDEX.md` — currently empty (no sprints/tasks/bugs yet).

Open `.forge/personas/engineer.md`:
- Project-specific: "You are implementing features for hello, a minimal CLI greeter"
- Stack-aware: "Uses click for CLI parsing, pytest for testing"
- KB-linked: References `engineering/` docs for context

Open `.forge/workflows/fix_bug.md`:
- Phase 1: Triage
- Phase 2: Root cause analysis
- Phase 3: Propose fix
- Phase 4: Implement + test
- Phase 5: KB writeback (self-learning!)

Open `engineering/architecture/processes.md`:
- Build/test/lint commands discovered from codebase
- Stack details (Python 3.11, click, pytest)

👉 **Key insight**: All generated from 26-line Python file. Not templates.

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
/help
# Look for project-specific commands

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
