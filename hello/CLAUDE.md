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
