# SPECTRAL-S01-T01: Implement layered audio mixing engine

**Sprint:** SPECTRAL-S01
**Estimate:** M
**Pipeline:** default

---

## Objective

Replace the single-sound placeholder in `SoundEngine` with real multi-layer
mixing: synthesize every layer named in the mood profile and sum them.

## Acceptance Criteria

1. The audio callback mixes the profile's `layers` (e.g. `calm` = theta sine +
   ocean-like filtered noise) — `spectral play calm` is audibly a composite of
   at least two distinct layers
2. Unknown layer names degrade gracefully (warn once, skip the layer)
3. Buffers are pre-allocated; the callback does numpy vectorized summing only
   — no per-callback allocations (sprint risk note)
4. The mixed signal is normalised to avoid clipping
5. `--duration` and Ctrl+C behavior unchanged

## Context

`src/spectral/engine.py` already has `_brown_noise`, `_sine`, `_binaural`
helpers but `callback()` ignores the profile and plays brown noise only.
Layer vocabulary lives in `src/spectral/moods.py` (`MOODS[*]["layers"]`,
`LAYER_DESCRIPTIONS`). Mind SPECTRAL-BUG-001: noise state must persist across
callback chunks — do not re-seed per chunk.

## Entities

- `src/spectral/engine.py` (primary), `src/spectral/moods.py` (read-only)
