"""Synthesis engine — generates and mixes audio layers in real time."""
from __future__ import annotations
import numpy as np
import time
import threading
from typing import Any

try:
    import sounddevice as sd
    _AUDIO_AVAILABLE = True
except ImportError:
    _AUDIO_AVAILABLE = False

SAMPLE_RATE = 44100


def _brown_noise(n: int) -> np.ndarray:
    white = np.random.randn(n)
    brown = np.cumsum(white)
    return brown / np.max(np.abs(brown))


def _sine(freq: float, n: int) -> np.ndarray:
    t = np.arange(n) / SAMPLE_RATE
    return np.sin(2 * np.pi * freq * t)


def _binaural(base_freq: float, beat_freq: float, n: int) -> np.ndarray:
    t = np.arange(n) / SAMPLE_RATE
    left = np.sin(2 * np.pi * base_freq * t)
    right = np.sin(2 * np.pi * (base_freq + beat_freq) * t)
    return np.stack([left, right], axis=1)


class SoundEngine:
    def __init__(self, profile: dict[str, Any]):
        self.profile = profile
        self._stop = threading.Event()

    def run(self, duration: float | None = None):
        if not _AUDIO_AVAILABLE:
            print("[spectral] sounddevice not installed — audio output disabled")
            try:
                time.sleep(duration or 3)
            except KeyboardInterrupt:
                pass
            return

        chunk = SAMPLE_RATE // 10
        end = time.time() + duration if duration else None

        def callback(outdata, frames, _time, status):
            if self._stop.is_set() or (end and time.time() >= end):
                raise sd.CallbackStop
            buf = _brown_noise(frames) * 0.3
            outdata[:] = buf.reshape(-1, 1)

        with sd.OutputStream(samplerate=SAMPLE_RATE, channels=1, callback=callback):
            try:
                self._stop.wait(timeout=duration)
            except KeyboardInterrupt:
                self._stop.set()
