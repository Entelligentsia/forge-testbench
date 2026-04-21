# Sprint Plan — SPECTRAL-S01

**Status:** planned
**Created:** 2026-04-15
**Source:** SPRINT_REQUIREMENTS.md

## Sprint Goal

Transition from single-sound placeholder to a basic multi-layer mixing engine, and professionalize the mood catalog presentation using `rich` tables.

## Tasks

| ID | Title | Size | Depends On | Status |
|---|---|---|---|---|
| SPECTRAL-S01-T01 | Implement layered audio mixing engine | M | — | pending |
| SPECTRAL-S01-T02 | Reformat mood listing table | S | — | pending |
| SPECTRAL-S01-T03 | Add mood-specific row styling | S | T02 | pending |

## Dependency Graph

```
T01 ── (no deps, start immediately)
T02 ── (no deps, start immediately)
T03 ── T02 (needs table structure first)
```

## Critical Path

T01 (M) is the longest single task. T02 → T03 is the longest chain at S+S. Critical path is **T01**.

## Risk Notes

- **Audio glitching** (Medium risk): T01 must pre-allocate buffers and use numpy vectorized summing to avoid allocations in the audio callback.
- **Narrow terminals** (Low risk): T02/T03 rely on `rich`'s automatic column sizing.

## Carry-Over from SPECTRAL-S00

- Initial project setup: Completed — base structure is ready.