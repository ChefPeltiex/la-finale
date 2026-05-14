#!/usr/bin/env python3
"""
Prototype pédagogique EGOR — bruit de fréquence fractionnaire y(t) = δν/ν
et estimateur Allan deviation overlapping (fractionnel).

Ne calibre pas DP/CSL réels : epsilon = amplitude relative d'un bruit "exotique" toy
superposé au bruit technique (blanc + composante 1/f sur y).
"""
from __future__ import annotations

import argparse
import json
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List

import numpy as np


def generate_colored_noise(n: int, dt: float, exponent: float = -1.0, rng: np.random.Generator | None = None) -> np.ndarray:
    """Bruit corrélé type 1/f^|exponent| sur la série temporelle (domaine temps)."""
    rng = rng or np.random.default_rng()
    freqs = np.fft.rfftfreq(n, dt)
    psd = np.zeros_like(freqs)
    mask = freqs > 0
    psd[mask] = np.abs(freqs[mask]) ** exponent
    phases = rng.normal(0.0, 1.0, size=psd.shape) + 1j * rng.normal(0.0, 1.0, size=psd.shape)
    spectrum = phases * np.sqrt(psd + 1e-30)
    colored = np.fft.irfft(spectrum, n=n)
    return colored


def generate_clock_signal(
    n: int,
    dt: float,
    sigma_tech: float,
    epsilon: float,
    seed: int | None = None,
) -> np.ndarray:
    rng = np.random.default_rng(seed)
    tech = rng.normal(0.0, sigma_tech, size=n)
    colored = generate_colored_noise(n, dt, exponent=-1.0, rng=rng)
    std = float(np.std(colored))
    if std > 0:
        colored = colored / std * epsilon
    y = tech + colored
    return y


def overlapping_allan_deviation(y: np.ndarray, dt: float, taus: np.ndarray) -> np.ndarray:
    """
    Déviation d'Allan (fractionnelle) — estimateur overlapping « two-sample » sur y(t).

    Pour chaque τ = m·dt : moyennes glissantes Y_k = mean(y[k:k+m]), puis
    d_k = Y_{k+2m} - 2·Y_{k+m} + Y_k ; variance d'Allan ≈ (1/2)·mean(d_k²).

    y : déviation de fréquence fractionnaire, pas la phase.
    """
    y = np.asarray(y, dtype=float)
    y = y - np.mean(y)
    N = len(y)
    out: List[float] = []
    for tau in taus:
        m = int(round(float(tau) / dt))
        if m < 1 or N < 3 * m + 1:
            out.append(float("nan"))
            continue
        kernel = np.ones(m) / float(m)
        ybar = np.convolve(y, kernel, mode="valid")  # length N - m + 1 ; index k = start sample
        # k + 2m <= (N - m + 1) - 1  =>  k <= N - 3m
        d = ybar[2 * m :] - 2.0 * ybar[m : N - 2 * m + 1] + ybar[: N - 3 * m + 1]
        if len(d) <= 0:
            out.append(float("nan"))
            continue
        avar = 0.5 * float(np.mean(d**2))
        out.append(math.sqrt(max(avar, 0.0)))
    return np.array(out)


def integrate_phase_from_y(y: np.ndarray, dt: float, nu_hz: float) -> np.ndarray:
    return np.cumsum(y * dt) * (2 * math.pi * nu_hz)


@dataclass
class SimConfig:
    n: int = 200_000
    dt: float = 0.05
    nu_hz: float = 228e12
    sigma_tech: float = 1e-16
    epsilon: float = 3e-18
    seed: int = 42
    allan_tau_min_factor: int = 5
    allan_tau_max_factor: int = 8000
    allan_num_points: int = 14


def normalize_config_dict(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Accepte `nu` (Hz) comme alias de `nu_hz` (brief / anciens JSON)."""
    d = dict(raw)
    if "nu_hz" not in d and "nu" in d:
        d["nu_hz"] = d["nu"]
    return {k: d[k] for k in SimConfig.__dataclass_fields__ if k in d}


def load_config(path: str) -> SimConfig:
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return SimConfig(**normalize_config_dict(raw))


def run_simulation(cfg: SimConfig) -> Dict[str, Any]:
    y = generate_clock_signal(cfg.n, cfg.dt, cfg.sigma_tech, cfg.epsilon, cfg.seed)
    tau_min = max(cfg.dt * cfg.allan_tau_min_factor, cfg.dt)
    tau_max = min(cfg.dt * cfg.allan_tau_max_factor, cfg.dt * (cfg.n // 4))
    if tau_max <= tau_min:
        tau_max = tau_min * 10
    taus = np.logspace(math.log10(tau_min), math.log10(tau_max), num=cfg.allan_num_points)
    ad = overlapping_allan_deviation(y, cfg.dt, taus)
    phi = integrate_phase_from_y(y, cfg.dt, cfg.nu_hz)
    return {
        "config": cfg.__dict__,
        "stats": {
            "std_y": float(np.std(y)),
            "rms_phase_rad": float(np.sqrt(np.mean((phi - np.mean(phi)) ** 2))),
        },
        "allan_deviation": {float(t): float(s) for t, s in zip(taus, ad) if math.isfinite(s)},
    }


def main() -> None:
    ap = argparse.ArgumentParser(description="Simulate fractional frequency noise + Allan curve (toy DP/CSL amplitude).")
    ap.add_argument("--config", default="config.example.json")
    ap.add_argument("--out", default="", help="Optional JSON output path")
    args = ap.parse_args()
    cfg = load_config(args.config)
    out = run_simulation(cfg)
    text = json.dumps(out, indent=2)
    if args.out:
        outp = Path(args.out)
        outp.parent.mkdir(parents=True, exist_ok=True)
        outp.write_text(text, encoding="utf-8")
        # Sortie compacte pour orchestrateurs (Node) : évite parser un énorme JSON sur stdout.
        print(json.dumps({"ok": True, "path": str(outp.resolve()), "keys": list(out.keys())}, indent=2))
    else:
        print(text)


if __name__ == "__main__":
    main()
