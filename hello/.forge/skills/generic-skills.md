# Generic Skills — hello

Support-role skill set for Orchestrator, Collator, and allied agents in the **hello** project.
No installed skills are wired for this project; all capabilities below rely on built-in tools.

---

## Coordination & Orchestration

### Task Scheduling
Manage the sequence of task execution and dependency resolution across `hello-project-knowledge/sprints/` artifacts.
- Read sprint plan files under `hello-project-knowledge/sprints/HELLO-SXX/` to derive task order.
- Respect task dependencies declared in `PLAN.md` before handing off to the next agent.
- Track completion state via `.forge/store/` JSON records.

### Agent Handoff
Ensure smooth transitions of context and responsibility between Engineer, Supervisor, and Architect roles.
- Pass the full path of the current task artifact directory (e.g. `hello-project-knowledge/sprints/HELLO-SXX/HELLO-SXX-TXX/`) when handing off.
- Confirm the receiving agent has read `PLAN.md` or `PROGRESS.md` before proceeding.
- Use `.forge/store/` records as the single source of truth for handoff state.

### Status Reporting
Aggregate progress from multiple agents into a concise summary.
- Read all `PROGRESS.md` files in the active sprint directory.
- Summarise: tasks completed, tasks in-flight, blockers, and next action.
- Surface output to the user in plain text — no additional files unless explicitly requested.

---

## Information Synthesis

### Data Collation
Gather disparate pieces of information into a structured format.
- Use `Glob` to discover all artifact files under `hello-project-knowledge/`.
- Read discovered files with `Read` and merge content into a single structured summary.
- Write consolidated output to the appropriate index file (e.g. `hello-project-knowledge/MASTER_INDEX.md`).

### Summary Generation
Distil complex technical discussions into key takeaways and action items.
- Identify decisions, risks, and next steps from `CODE_REVIEW.md`, `PLAN_REVIEW.md`, and `ARCHITECT_APPROVAL.md` files.
- Produce bullet-point summaries scoped to the current sprint or task.
- Feed summaries back into the KB under `hello-project-knowledge/` as directed by the active workflow.

### Artifact Mapping
Ensure that tasks, bugs, and features are correctly linked in the store.
- Read records from `.forge/store/` using `Read`.
- Cross-reference sprint task IDs (HELLO-SXX-TXX) and bug IDs (HELLO-BXX) against index files.
- Write corrected or new JSON records to `.forge/store/` with `Write` when mappings are missing or stale.

---

## Basic Tooling

### File Management
Basic use of `Read`, `Write`, and `Glob` for housekeeping.
- `Glob` patterns for this project:
  - All knowledge-base docs: `hello-project-knowledge/**/*.md`
  - Store records: `.forge/store/**/*.json`
  - Workflow definitions: `.forge/workflows/*.md`
  - Template files: `.forge/templates/**/*`
- Use `Read` before any `Write` on an existing file to avoid clobbering content.
- Never create documentation files unless explicitly instructed.

### Git Basics
Perform simple commits and status checks scoped to the hello project.
- Check working-tree state: `git status`
- Stage specific files by name — never `git add -A` or `git add .`.
- Commit with a concise message describing the artifact change.
- Build command (install/verify): `pip install -e .`
- No test, lint, or syntax-check commands are configured for this project.

### Log Monitoring
Watch for specific event patterns to trigger transitions.
- After running `pip install -e .`, scan stdout/stderr for `Successfully installed` or error lines.
- On error, surface the full error message before proceeding.
- In workflow orchestration, check for `PROGRESS.md` updates as the signal that an agent step has completed.
