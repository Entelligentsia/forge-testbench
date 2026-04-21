<div align="center">

# hello

**Minimal CLI greeter. 21 lines of Python. The simplest Forge testbench project.**

> You are on `forge-initialized` — this project has Forge artifacts. See [root README](../) for artifact map.

</div>

---

## Quick Start

```bash
pip install -e .
```

```bash
hello Alice             # Hello, Alice!
hello Alice --shout     # HELLO, ALICE!
hello Alice --count 3   # Hello, Alice! (×3)
```

## Stack

| | |
|---|---|
| **Language** | Python 3.11+ |
| **CLI** | [click](https://click.palletsprojects.com/) |
| **Entry point** | `hello.py:main` |
| **Tests** | pytest |
| **Build** | `pip install -e .` via pyproject.toml |

## Architecture

One file. That's the point.

```
hello.py          ← entire project (21 lines)
pyproject.toml    ← packaging + click entry point
```

## Known Issues

| Issue | Details |
|-------|---------|
| `--shout` broken | `greeting.upper` missing parens — should be `greeting.upper()` |

## Forge Artifacts on This Branch

After `/forge:init --fast` + `/hello:sprint-intake`, this project contains:

```
.forge/                              ← config, workflows, personas, skills, templates
.claude/commands/hello/              ← 14 project-scoped slash commands
hello-project-knowledge/             ← knowledge base (architecture, sprints)
```

Sprint **HELLO-S01** (`--goodbye` flag) is at `planning` status. Continue with:

```
/hello:sprint-plan HELLO-S01
/hello:run-task HELLO-S01-T01
```

> [!TIP]
> See the [root README](../) for full artifact map and key files to read.

## License

MIT
