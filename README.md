# forge-testbench

Four CLI projects demonstrating Forge AI-SDLC in action.

## Why This Exists

Claude Code is powerful, but without structure, it re-learns your project every session.

**Forge** generates project-specific knowledge bases, personas, and workflows that improve with every sprint.

This testbench shows Forge on 4 different stacks — same SDLC structure, different languages.

## Quick Start (5 minutes)

### 1. Install Forge
```bash
/plugin marketplace add Entelligentsia/skillforge
/plugin install forge@skillforge
/reload-plugins
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

### 4. Explore
```bash
cd hello/
# Forge already initialized (fast mode)
# Open engineering/MASTER_INDEX.md — see sprints, tasks, bugs
# Try /forge:ask What sprints exist?
```

**Each project**: Read its README for guided tour (~10 min).

## What You'll See

Each project has:
- ✅ **Knowledge Base** (`engineering/`) — architecture, entities, stack checklist
- ✅ **Generated Personas** (`.forge/personas/`) — project-specific Engineer, Supervisor, Architect
- ✅ **Generated Workflows** (`.forge/workflows/`) — plan, implement, review, commit pipelines
- ✅ **Sprint Artifacts** (`engineering/sprints/`) — plans, reviews, retrospectives
- ✅ **Bug Artifacts** (`engineering/bugs/`) — triage, fixes, root cause analysis
- ✅ **Self-Managed Docs** — CLAUDE.md auto-updated with KB links

## Proof Points

### 1. Project-Specific Adaptation
Compare `.forge/personas/engineer.md` across projects:
- `hello/` → "minimal CLI greeter, click library, pytest"
- `emberglow/` → "Go DSL interpreter, lexer/parser, go test"
- `cartographer/` → "TypeScript knowledge graph, vitest, ESM modules"

**Not templates. Generated from codebase.**

### 2. Self-Learning Loop
Open `hello/engineering/bugs/HELLO-B01-shout-flag-no-effect/`:
- Bug: `--shout` flag didn't work
- Root cause: `greeting.upper` not called (missing `()`)
- KB writeback: Added to review checklist → prevents similar bugs

**KB improves with every sprint.**

### 3. Context-Efficient Recall
Open `hello/.forge/workflows/plan_task.md`:
```markdown
1. Read engineering/architecture/processes.md (build/test commands)
2. Read engineering/business-domain/entities.md (domain model)
3. Propose implementation plan
```

**Surgical loading. Not full codebase dump.**

### 4. Multi-Stage Review
Open `hello/engineering/sprints/HELLO-S01/HELLO-S01-T01/`:
- `PLAN.md` (Engineer proposes)
- `PLAN_REVIEW.md` (Supervisor reviews plan)
- `CODE_REVIEW.md` (Supervisor reviews implementation)
- `ARCHITECT_APPROVAL.md` (Architect final gate)

**Not "ship it." Review-first pipeline.**

## Try It Yourself

Pick a project (start with `hello/`), follow its README guided tour:
1. Explore existing artifacts (sprints, bugs, KB)
2. Try Forge commands (`/forge:ask`, `/forge:health`, `/forge:report-bug`)
3. Create a tiny sprint (see full pipeline)
4. Report a bug (see KB writeback)

Then go online and share your experience — good or bad. We learn from both.

**Hit a bug?** Run `/forge:report-bug` — structured reporting with auto-captured context.

## Security

Every Forge release scanned before publish:
- 171 files analyzed (commands, agents, hooks, workflows)
- 0 critical issues across all versions
- Public audit trail: [docs/security/](https://github.com/Entelligentsia/forge/tree/main/docs/security)

Scan installed plugins:
```bash
/security-watchdog:scan-plugin forge:forge
/security-watchdog:scan-plugin <other-plugin-id>
```

## License

MIT

---

**Video Walkthrough**: [Link when created]

**Questions?** Open an issue or ask on [GitHub Discussions](https://github.com/Entelligentsia/forge/discussions)
