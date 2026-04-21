# Sprint Requirements — SPECTRAL-S01

**Captured:** 2026-04-14
**Source:** sprint-intake interview

## Goals
1. Transition from single-sound placeholder to a basic multi-layer mixing engine.
2. Professionalize the mood catalog presentation using `rich` tables.

## In Scope
### Implement Layered Audio Mixing [must-have]
Modify `SoundEngine` to synthesize and sum multiple audio layers defined in a mood profile.

**Acceptance criteria:**
- When `spectral play calm` is executed, the audio output must be a composite of at least two distinct sound layers (e.g., brown noise + low-frequency sine wave).
- The `SoundEngine` must iterate through the `layers` list in the mood profile to determine what to synthesize.

### Enhanced Mood Listing with Rich Formatting [must-have]
Upgrade the `spectral moods` command to use a structured table for better readability.

**Acceptance criteria:**
- Running `spectral moods` must produce a `rich.table.Table` output.
- The table must include columns: "Mood", "Description", "BPM", and "Reverb".
- The table header must be styled with a distinct color (e.g., bold cyan).

## Out of Scope
- Implementation of complex synthesis algorithms (FM, Granular).
- Real-time mood editing via CLI.
- Support for external audio files/samples.

## Nice-to-Have (attempt if time allows)
- Add mood-specific colors to the `rich` table rows.

## Constraints
- **Technical:** Audio callback must remain allocation-free.
- **Data:** Mood profiles must stay in `moods.py`.
- **Dependencies:** PortAudio must be present for audio playback.
- **Timeline:** Immediate execution as a test sprint.

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Audio glitching/popping during mixing | Medium | Pre-allocate buffers and use numpy vectorized summing. |
| Layout breaking on narrow terminals | Low | Use `rich`'s automatic column sizing. |

## Carry-Over from SPECTRAL-S00
| Item | Status | Notes |
|---|---|---|
| Initial Project Setup | Completed | Base structure is ready. |
