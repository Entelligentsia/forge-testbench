# spectral

Mood-based ambient soundscape generator for the terminal. Python 3.11+, real-time audio.

## Stack

- **Language**: Python 3.11+
- **CLI**: `click` (entry point: `spectral.cli:main`)
- **Output/TUI**: `rich`
- **Audio**: `sounddevice` (PortAudio wrapper) + `numpy` + `scipy`
- **Build**: `hatchling` (`pyproject.toml`)
- **Package layout**: `src/spectral/` (src layout)

## Commands

```bash
pip install -e ".[dev]"        # install in editable mode with dev extras
spectral moods                 # list available mood profiles
spectral play focus            # play the "focus" profile until Ctrl+C
spectral play calm -d 3600     # play for 1 hour then stop

python -m pytest               # run tests
```

## Architecture

```
src/spectral/
  __init__.py     # package version only
  cli.py          # click commands: moods | play — all user-facing I/O here
  moods.py        # MOODS dict — pure data, no I/O, no imports from engine
  engine.py       # SoundEngine class — audio synthesis and playback
```

- `moods.py` is pure data — a dict mapping mood name → profile params. No logic.
- `engine.py` `SoundEngine` takes a profile dict and handles all audio threading
- `sounddevice` import is guarded: if unavailable, engine prints a warning and sleeps instead (useful in CI/headless environments)
- `SAMPLE_RATE = 44100` is a module-level constant in `engine.py` — do not hardcode elsewhere

## Conventions

- Type hints on all public functions/methods; `from __future__ import annotations` at top of each file
- `click` options use `--duration`/`-d` for seconds; keep CLI flags consistent with existing commands
- Audio callbacks must never block — keep them allocation-free (pre-allocate buffers if needed)
- Do not add async/await — `threading.Event` is the concurrency primitive in use
- `rich` for all terminal output in `cli.py`; plain `print` only in `engine.py` fallback path

## Mood profiles

Defined in `moods.py:MOODS`. Each profile has: `bpm`, `layers` (list of layer names), `reverb` (0–1 float), `description`. When adding a new mood, add it only to `MOODS` — the CLI and engine pick it up automatically.

## Notes

- `sounddevice` requires PortAudio to be installed on the host (`apt install portaudio19-dev` / `brew install portaudio`)
- The current `SoundEngine.run()` only plays brown noise as a placeholder — layer mixing per profile is not yet wired up

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
| [Sprint plan](.forge/workflows/architect_sprint_plan.md) | Sprint planning and task decomposition |
| [Sprint intake](.forge/workflows/architect_sprint_intake.md) | Sprint intake and requirements elicitation |
<!-- /forge-workflow-links -->
