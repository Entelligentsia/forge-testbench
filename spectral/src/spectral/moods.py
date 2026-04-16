"""Mood-to-parameter mappings."""

from __future__ import annotations

MOODS = {
    "focus": {
        "bpm": 70,
        "layers": ["binaural_40hz", "brown_noise", "rain_light"],
        "reverb": 0.3,
        "description": "Deep concentration — binaural beats over brown noise.",
    },
    "calm": {
        "bpm": 55,
        "layers": ["theta_waves", "ocean_distant", "wind_chimes"],
        "reverb": 0.6,
        "description": "Gentle stillness — theta waves and distant ocean.",
    },
    "energize": {
        "bpm": 120,
        "layers": ["alpha_15hz", "rain_heavy", "white_noise_filtered"],
        "reverb": 0.1,
        "description": "Crisp alertness — alpha waves with driving rain.",
    },
    "sleep": {
        "bpm": 40,
        "layers": ["delta_waves", "brown_noise", "heartbeat_slow"],
        "reverb": 0.8,
        "description": "Deep sleep induction — delta waves and low rumble.",
    },
    "create": {
        "bpm": 85,
        "layers": ["alpha_10hz", "cafe_ambient", "vinyl_crackle"],
        "reverb": 0.4,
        "description": "Creative flow — cafe ambience with alpha entrainment.",
    },
}

LAYER_DESCRIPTIONS: dict[str, str] = {
    "binaural_40hz": "40 Hz binaural beat",
    "brown_noise": "Brownian noise rumble",
    "rain_light": "Light rain patter",
    "theta_waves": "Theta-wave binaural drift",
    "ocean_distant": "Distant ocean surf",
    "wind_chimes": "Soft wind chime tones",
    "alpha_15hz": "15 Hz alpha binaural beat",
    "rain_heavy": "Heavy driving rain",
    "white_noise_filtered": "Filtered white noise hiss",
    "delta_waves": "Delta-wave binaural beat",
    "heartbeat_slow": "Slow heartbeat pulse",
    "alpha_10hz": "10 Hz alpha binaural beat",
    "cafe_ambient": "Cafe ambience murmur",
    "vinyl_crackle": "Vinyl record crackle",
}
