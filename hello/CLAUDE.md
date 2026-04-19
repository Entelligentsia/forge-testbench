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
| [Fix bug](.forge/workflows/fix_bug.md) | Triage → fix → verify |
| [Run task](.forge/workflows/orchestrate_task.md) | Full task pipeline (plan → implement → review → commit) |
| [Run sprint](.forge/workflows/run_sprint.md) | Full sprint orchestration |
| [Sprint plan](.forge/workflows/architect_sprint_plan.md) | Sprint planning and task decomposition |
| [Sprint intake](.forge/workflows/architect_sprint_intake.md) | Sprint intake and requirements elicitation |
<!-- /forge-workflow-links -->
