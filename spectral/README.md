# spectral

Paint your mood in sound. A terminal-first ambient soundscape generator that maps emotional states to layered audio profiles — binaural beats, noise colours, and environmental textures mixed in real time.

## Quick start

```bash
pip install -e ".[dev]"
spectral moods          # list available profiles
spectral play focus     # deep work mode
spectral play calm -d 3600   # 1-hour wind-down
```

## Mood profiles

| Mood | BPM | Core layers |
|------|-----|-------------|
| focus | 70 | binaural 40 Hz + brown noise + light rain |
| calm | 55 | theta waves + distant ocean + wind chimes |
| energize | 120 | alpha 15 Hz + heavy rain + filtered white noise |
| sleep | 40 | delta waves + brown noise + slow heartbeat |
| create | 85 | alpha 10 Hz + café ambience + vinyl crackle |

## Planned features

- MIDI export of generated rhythmic patterns
- Mood blending (`spectral blend focus calm --ratio 0.7`)
- Session history with waveform snapshots
- Plugin API for custom layer generators
