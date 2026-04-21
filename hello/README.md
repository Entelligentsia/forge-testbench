<div align="center">

# hello

**Minimal CLI greeter. 21 lines of Python. The simplest Forge testbench project.**

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

## Why Start Here

This is the recommended first project for the [Forge testbench](../). Twenty-one lines of code, but Forge still discovers the stack, generates 14 project-specific commands, builds a knowledge base, and runs multi-stage reviewed sprints.

If Forge can add structure to *this*, imagine what it does with a real codebase.

> [!TIP]
> Follow the [onboarding guide in the root README](../) — it uses this project for all examples.

## License

MIT
