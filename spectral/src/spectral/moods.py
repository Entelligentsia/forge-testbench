"""Mood-to-parameter mappings."""

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
