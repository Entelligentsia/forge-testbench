# Bug report — SPECTRAL-BUG-001

Playback clicks rhythmically (~10 times per second) on every mood:

```
spectral play focus --duration 5
```

**Expected:** smooth continuous noise bed.
**Actual:** audible click/level-jump every ~100ms.

Where to look: `src/spectral/engine.py` — the output callback calls
`_brown_noise(frames)` fresh for every chunk. Each chunk is a brand-new
random walk normalised to its own peak, so the waveform jumps in level and
phase at every chunk boundary (chunk = SAMPLE_RATE // 10 ≈ 100ms).

Please investigate with `/forge:fix-bug SPECTRAL-BUG-001`. The fix needs the
noise state to persist across callbacks (carry the walk's last value and use
a stable normalisation), plus a regression test that two consecutive chunks
are continuous at the boundary.
