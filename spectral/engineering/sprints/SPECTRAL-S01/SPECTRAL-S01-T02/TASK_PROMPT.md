# SPECTRAL-S01-T02: Reformat mood listing table

**Sprint:** SPECTRAL-S01
**Estimate:** S
**Pipeline:** default

---

## Objective

Bring `spectral moods` up to the SPRINT_REQUIREMENTS spec: a `rich` table
with Mood / Description / BPM / Reverb columns and a styled header.

## Acceptance Criteria

1. Columns exactly: Mood, Description, BPM, Reverb (Reverb is missing today)
2. Header row styled bold cyan
3. Values come from `MOODS` (reverb as given, e.g. `0.6`)
4. Output still renders cleanly in narrow terminals (rich auto-sizing)

## Context

`src/spectral/cli.py` `moods()` already builds a `rich.table.Table` — this is
a column/order/style change, not a rewrite.

## Entities

- `src/spectral/cli.py`
