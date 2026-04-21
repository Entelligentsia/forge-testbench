<div align="center">

# spectral

**Paint your mood in sound.**<br>
A terminal-first ambient soundscape generator that maps emotional states to layered audio profiles — binaural beats, noise colors, and environmental textures mixed in real time.

</div>

---

## Quick Start

```bash
pip install -e ".[dev]"
```

```bash
spectral moods              # list available profiles
spectral play focus         # deep work mode
spectral play calm -d 3600  # 1-hour wind-down session
```

> [!NOTE]
> Requires PortAudio: `apt install portaudio19-dev` (Linux) or `brew install portaudio` (macOS).

## Mood Profiles

| Mood | BPM | Core Layers |
|------|:---:|-------------|
| **focus** | 70 | binaural 40 Hz · brown noise · light rain |
| **calm** | 55 | theta waves · distant ocean · wind chimes |
| **energize** | 120 | alpha 15 Hz · heavy rain · filtered white noise |
| **sleep** | 40 | delta waves · brown noise · slow heartbeat |
| **create** | 85 | alpha 10 Hz · café ambience · vinyl crackle |

## Stack

| | |
|---|---|
| **Language** | Python 3.11+ |
| **CLI** | [click](https://click.palletsprojects.com/) |
| **TUI** | [rich](https://github.com/Textualize/rich) |
| **Audio** | [sounddevice](https://python-sounddevice.readthedocs.io/) (PortAudio) + numpy + scipy |
| **Build** | hatchling via pyproject.toml |
| **Tests** | pytest |

## Architecture

```
src/spectral/
  __init__.py     ← package version only
  cli.py          ← click commands: moods | play — all user-facing I/O
  moods.py        ← MOODS dict — pure data, no I/O, no engine imports
  engine.py       ← SoundEngine class — audio synthesis and playback
```

`moods.py` is pure data — a dict mapping mood name to profile params. `engine.py` handles all audio threading via `threading.Event` (no async). `sounddevice` import is guarded: if unavailable, engine prints a warning and sleeps instead (CI-safe).

## Known Issues

| Issue | Details |
|-------|---------|
| Placeholder audio | `SoundEngine.run()` only plays brown noise — layer mixing per profile not yet wired |

## Roadmap

- MIDI export of generated rhythmic patterns
- Mood blending (`spectral blend focus calm --ratio 0.7`)
- Session history with waveform snapshots
- Plugin API for custom layer generators

> [!TIP]
> This is a [Forge testbench](../) project. Follow the root README to see Forge generate stack-aware Python personas, workflows, and a knowledge base from this codebase.

## License

MIT
