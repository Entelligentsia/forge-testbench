# hello

Minimal CLI greeter. Single-file Python. Exists to demonstrate Forge on the simplest possible project.

## Stack

- **Language**: Python 3.11+
- **CLI**: `click`
- **Entry point**: `hello.py:main`

## Commands

```bash
pip install -e .        # install
hello Alice             # greet
hello Alice --shout     # shout (broken — see known issues)
hello Alice --count 3   # repeat
```

## Known issues

- `hello.py`: `--shout` flag does not work — `greeting.upper` should be `greeting.upper()`

## 🔍 Post-Init Tour (5 minutes)

After running `/forge:init --fast`, explore what Forge created from a 26-line Python file.

**Note**: This tour shows artifacts after init completes. Your fresh init creates **stubs** that materialize on first workflow use.

### 1. Master Index (Fresh Init State)
Open `hello-project-knowledge/MASTER_INDEX.md`:
```markdown
# Master Index

<!-- forge-fast-stub -->

## Domain Entities
<!-- Will be populated when the KB is fully generated -->

## Architecture
- [Stack](architecture/stack.md)
- [Processes](architecture/processes.md)
...
```

Empty initially. Populates as you run sprints/tasks/bugs.

**Want to see populated version?** Check branch `forge-initialized` in repo.

### 2. Config
Open `.forge/config.json`:
```json
{
  "project": { "prefix": "HELLO", "name": "hello" },
  "stack": { "primary": "Python", "version": "3.11+", "frameworks": ["click"] },
  "commands": { "build": "pip install -e .", "test": null },
  "mode": "fast"
}
```

👉 **Key insight**: Forge discovered stack details automatically. No manual config.

### 3. Workflow Stubs
Open `.forge/workflows/fix_bug.md`:
```markdown
<!-- FORGE FAST-MODE STUB — will self-replace on first use -->

Before doing any bug fix work, materialise this workflow:
1. Read lazy-materialize.md
2. Re-read this file (replaced with real workflow)
3. Execute real workflow
```

Stubs self-materialize when invoked (~1-2 min first use).

### 4. Commands
List generated commands:
```bash
ls .claude/commands/hello/
```

14 commands created:
- `sprint-intake.md`, `sprint-plan.md`
- `plan.md`, `review-plan.md`, `implement.md`, `review-code.md`, `approve.md`
- `commit.md`, `fix-bug.md`
- `run-task.md`, `run-sprint.md`
- `collate.md`, `retrospective.md`, `quiz-agent.md`

Type `/hello:` in Claude Code prompt → autocomplete shows all commands.

👉 **Key insight**: Commands namespace by project. No collision with other projects.

### 5. Populated Artifacts (After Running Workflows)

Once you run tasks/sprints/bugs, KB fills with rich artifacts:

**Example bug artifacts** (see `forge-initialized` branch):
- `hello-project-knowledge/bugs/HELLO-B01-shout-flag-no-effect/`
  - `INDEX.md`: Bug summary
  - `BUG_FIX_PLAN.md`: Fix strategy
  - `CODE_REVIEW.md`: Supervisor review
  - `PROGRESS.md`: Implementation log

👉 **Key insight**: Forge documents *why* bug happened, not just fix. Root cause feeds KB.

**Example sprint artifacts** (see `forge-initialized` branch):
- `hello-project-knowledge/sprints/HELLO-S01/HELLO-S01-T01/`
  - `PLAN.md`: Implementation plan
  - `PLAN_REVIEW.md`: Supervisor review
  - `CODE_REVIEW.md`: Code review
  - `ARCHITECT_APPROVAL.md`: Final gate
  - `COST_REPORT.md`: Token usage

👉 **Key insight**: Multi-stage review (plan → code → architect). Not just "ship it."

### 6. Forge Itself Dogfoods This
Forge uses its own bug workflow. Hit issue?
```bash
/forge:report-bug
```
- Structured interview (what happened, expected vs actual)
- Auto-captures: version, stack, OS, logs
- Drafts GitHub issue, files to Entelligentsia/forge repo
- You confirm before submission

👉 **Key insight**: Lowers feedback barrier. Structured bug reports, not "paste error in browser."

## 🎯 Try These Commands (3 minutes)

### Ask Tomoshibi (Forge Concierge)
```bash
/forge:ask What sprints exist?
/forge:ask What's the status of HELLO-S01?
/forge:ask Show me bug HELLO-B01
```

Tomoshibi reads `.forge/store/` and `engineering/` — instant answers, no file hunting.

### Check Health
```bash
/forge:health
```
Detects stale KB docs, orphaned entities, missing skills.

### Inspect Config
```bash
/forge:config
```
Shows current mode (fast/full), paths, version.

### Report Bugs in Forge Itself
```bash
/forge:report-bug
```

If you hit issues with Forge (command fails, confusing behavior, doc errors):
- Forge interviews you (what happened, expected vs actual, steps to reproduce)
- Auto-captures: Forge version, project stack, OS, relevant logs
- Drafts GitHub issue in standard format
- Files to Entelligentsia/forge repo with your confirmation

👉 **Key insight**: Forge dogfoods its own bug workflow. Structured reporting, not "paste error in browser."

### Verify Security (Enterprise Users)
```bash
/security-watchdog:scan-plugin forge:forge
```

Scans Forge plugin you just installed:
- 171 files analyzed
- Threat categories: prompt injection, data exfil, code exec, hooks
- Shows critical/warnings/info

Or check pre-published report:  
[docs/security/scan-v0.24.1.md](https://github.com/Entelligentsia/forge/blob/main/docs/security/scan-v0.24.1.md)

👉 **Key insight**: Every Forge release scanned before publish. Public audit trail in `docs/security/`.

Want to scan other installed plugins?
```bash
/security-watchdog:scan-plugin <plugin-name>
```

Supply chain security for plugin ecosystem.

### List Available Commands
```bash
/help forge
```
Shows all Forge commands + project-specific commands (if generated).

## 🚀 Your First Sprint (5 minutes)

### Sprint Intake
```bash
/sprint-intake
```

When prompted:
- **Feature**: "Add --goodbye flag that says 'Goodbye, NAME!'"
- **Sprint goal**: "Add farewell greeting option"
- **Acceptance criteria**: "User can run `hello Alice --goodbye` and see 'Goodbye, Alice!'"

Forge creates `engineering/sprints/HELLO-S03/intake.md`.

### Sprint Planning
```bash
/sprint-plan HELLO-S03
```

Forge:
1. Breaks feature into tasks (likely 2: add flag, add test)
2. Estimates complexity (S/M/L)
3. Creates dependency graph
4. Writes `engineering/sprints/HELLO-S03/plan.md`

### Run Sprint (or just one task)
```bash
/run-task HELLO-S03-T01
```

Watch Forge:
1. **Plan** task (Engineer reads KB, proposes implementation)
2. **Review plan** (Supervisor checks against KB)
3. **Implement** (Engineer writes code)
4. **Review code** (Supervisor checks quality)
5. **Approve** (Architect final gate)
6. **Commit** (atomic git commit)

Check `engineering/sprints/HELLO-S03/HELLO-S03-T01/` for all artifacts.

### Retrospective
```bash
/retrospective HELLO-S03
```

Forge analyzes sprint, updates KB with learnings.

## 🐛 Report a Complex Bug (5 minutes)

Tell Claude:
> "There's a bug. When I run `hello Alice --count 5 --shout --formal`, 
> the formal greeting isn't shouted. Only the informal greeting respects --shout."

Let Claude file it naturally, or guide it:
```bash
/fix-bug
```

Describe the bug when prompted.

Watch Forge:
1. **Triage**: Reproduce, classify severity
2. **Root cause**: Analyze conditional logic (formal flag checked after shout)
3. **Propose fix**: Reorder logic or apply shout to both branches
4. **Implement**: Write fix + test
5. **Verify**: Run tests
6. **KB writeback**: Add to `engineering/architecture/known-issues.md` or patterns doc

Check `engineering/bugs/HELLO-B03-*/` for full trail.

👉 **Key insight**: Bug artifact includes *why* bug happened, not just fix.
Self-learning loop feeds KB → prevents similar issues.

## 📚 The Knowledge Graph (3 minutes)

### Start at CLAUDE.md
Scroll to bottom of this file — auto-managed Forge KB/workflow links:

```markdown
## Forge Knowledge Base

| Index | Contents |
|-------|----------|
| [MASTER_INDEX](engineering/MASTER_INDEX.md) | All sprints, tasks, bugs, and features |
| [Architecture](engineering/architecture/INDEX.md) | Stack, processes, database, routing, deployment |
| [Business Domain](engineering/business-domain/INDEX.md) | Entity model and domain concepts |

Personas live in `.forge/personas/`.
```

👉 Click `MASTER_INDEX.md`

### Navigate from MASTER_INDEX
Every sprint/task/bug links to deep artifacts:
- Click `HELLO-S01-T01` → task folder with 10+ docs
- Click `HELLO-B01` → bug folder with triage/fix/review

### KB Cross-References
Open `engineering/architecture/processes.md`:
```markdown
## Build Commands
- Install: `pip install -e .`
- Test: `pytest`
- Lint: (none configured)

[!] No CI pipeline yet — see HELLO-S02 for planned GitHub Actions setup
```

👉 KB docs link to sprints. Self-referential knowledge graph.

### Personas Reference KB
Open `.forge/personas/engineer.md`:
```markdown
When implementing features, consult:
- engineering/architecture/INDEX.md for stack details
- engineering/business-domain/INDEX.md for entities
- engineering/stack-checklist.md for test/build commands
```

👉 Personas know where to look. Context-efficient.

## 🔧 Maintenance Commands (2 minutes)

### Check for Forge Plugin Updates
```bash
/forge:update
```

Forge:
1. Checks GitHub for new version
2. Shows changelog since your version
3. Prompts to upgrade
4. Applies migrations if needed
5. Suggests regenerating artifacts if breaking changes

### Detect KB Drift
```bash
/forge:calibrate
```

Forge compares KB to codebase:
- "architecture/processes.md mentions pytest, but no tests/ folder exists"
- Proposes surgical patches
- Applies approved patches

### Regenerate Artifacts
```bash
/forge:regenerate workflows
```

Rebuilds workflows from latest meta-definitions (useful after Forge upgrade).

Options: `workflows`, `personas`, `templates`, `tools`, `knowledge-base`.

## 🏮 Tomoshibi — Your Forge Concierge (2 minutes)

Tomoshibi (灯 — "lantern") is Forge's built-in agent. Ask it anything:

### Project Status
```bash
/forge:ask What's the current project status?
```

Returns: active sprints, completed tasks, open bugs, recent activity.

### Sprint Details
```bash
/forge:ask Show me all tasks in HELLO-S01
```

Returns: task list with status, estimates, dependencies.

### Bug History
```bash
/forge:ask What bugs have been fixed?
```

Returns: bug registry with severity, status, fix dates.

### Config Questions
```bash
/forge:ask What mode am I in? (fast or full)
/forge:ask What version of Forge is installed?
/forge:ask Where is the knowledge base?
```

### Command Help
```bash
/forge:ask How do I run a sprint?
/forge:ask What's the difference between /run-task and /run-sprint?
```

👉 **Key insight**: Tomoshibi = instant answers without file hunting.
No need to navigate `.forge/store/` manually.

## 🔧 Troubleshooting

### Something Broken? Report It
If Forge command fails, behaves unexpectedly, or docs wrong:
```bash
/forge:report-bug
```

Forge interviews you, captures context (version, stack, OS), drafts GitHub issue.
**Preferred over manual issue filing** — structured, includes diagnostic info automatically.

### Permission Prompts
Forge reads files frequently (KB docs, store). If permission prompts annoying:
```bash
/update-config
```
Ask to "allow Read tool for engineering/ and .forge/ directories"

### Model Selection
Fast mode uses Sonnet by default. For faster/cheaper:
- **Haiku**: Good for simple tasks, reviews
- **Sonnet**: Balanced (recommended)
- **Opus**: Complex reasoning, large codebases

Change in Claude Code settings.

### "Command not found: /sprint-intake"
Commands generated per-project. If missing:
```bash
/forge:regenerate commands
```

If still broken: `/forge:report-bug` (command generation may be broken)

### Forge Already Initialized Error
Projects in testbench pre-initialized. Don't run `/forge:init` again.
Check `.forge/config.json` to verify.

### KB Drift (Docs out of sync with code)
```bash
/forge:calibrate
```
Detects drift, proposes patches.

Or:
```bash
/quiz
```
Interactive Q&A to verify KB accuracy, patch gaps.

### Fast Mode vs Full Mode
Testbench projects in fast mode (lazy-build). To see all artifacts upfront:
```bash
/forge:materialize
```
Generates all stubs (workflows, personas, skills).

Or promote to full mode:
```bash
/forge:config mode full
/forge:regenerate workflows
```

<!-- forge-kb-links: managed by Forge — do not edit manually -->
## Forge Knowledge Base

| Index | Contents |
|-------|----------|
| [MASTER_INDEX](engineering/MASTER_INDEX.md) | All sprints, tasks, bugs, and features |
| [Architecture](engineering/architecture/INDEX.md) | Stack, processes, database, routing, deployment |
| [Business Domain](engineering/business-domain/INDEX.md) | Entity model and domain concepts |

Personas live in `.forge/personas/`.
<!-- /forge-kb-links -->

<!-- forge-workflow-links: managed by Forge — do not edit manually -->
## Forge Workflows

| Workflow | Purpose |
|----------|---------|
| [Plan](.forge/workflows/plan_task.md) | Research codebase → implementation plan |
| [Implement](.forge/workflows/implement_plan.md) | Execute approved plan → code changes |
| [Review plan](.forge/workflows/review_plan.md) | Supervisor reviews implementation plan |
| [Review code](.forge/workflows/review_code.md) | Supervisor reviews code changes |
| [Commit](.forge/workflows/commit_task.md) | Commit completed task |
| [Sprint plan](.forge/workflows/architect_sprint_plan.md) | Sprint planning and task decomposition |
| [Sprint intake](.forge/workflows/architect_sprint_intake.md) | Sprint intake and requirements elicitation |
<!-- /forge-workflow-links -->
