# SPECTRAL-S01-T03: Add mood-specific row styling

**Sprint:** SPECTRAL-S01
**Estimate:** S
**Pipeline:** default

---

## Objective

Give each mood row a distinct style on top of the T02 table structure.

## Acceptance Criteria

1. Per-row style derived from the mood (e.g. `sleep` dim, `energize` bright,
   defaults for the rest) via `Table.add_row(..., style=...)`
2. Style mapping lives next to `MOODS` (single source of truth)
3. No behavior change to other commands

## Context

Depends on T02's column structure. Keep the mapping data-driven so new moods
pick up a sensible default.

## Entities

- `src/spectral/cli.py`, `src/spectral/moods.py`
