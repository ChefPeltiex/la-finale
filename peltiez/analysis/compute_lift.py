"""
Two-proportion A/B helpers: load events, aggregate counts, and z-test.
"""

from __future__ import annotations

import json
import math
import random
from collections import defaultdict
from dataclasses import dataclass
from typing import Any, Iterable, Iterator, Mapping, MutableMapping


@dataclass(frozen=True)
class VariantStats:
    variant: str
    exposures: int
    conversions: int

    @property
    def rate(self) -> float:
        if self.exposures <= 0:
            return 0.0
        return self.conversions / self.exposures


def read_events(path: str) -> list[dict[str, Any]]:
    """Load NDJSON lines (one JSON object per line) from a local file."""
    out: list[dict[str, Any]] = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError:
                continue
            if isinstance(row, dict):
                out.append(row)
    return out


def read_events_iter(lines: Iterable[str]) -> Iterator[dict[str, Any]]:
    for line in lines:
        line = line.strip()
        if not line:
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(row, dict):
            yield row


def aggregate(
    events: Iterable[Mapping[str, Any]],
    *,
    exposure_event: str = "experiment_assign",
    conversion_event: str = "experiment_convert",
    variant_key: str = "variant",
    event_key: str = "event",
) -> dict[str, VariantStats]:
    """Count exposures and conversions per variant from event dicts."""
    exposures: MutableMapping[str, int] = defaultdict(int)
    conversions: MutableMapping[str, int] = defaultdict(int)

    for e in events:
        ev = e.get(event_key)
        if not isinstance(ev, str):
            continue
        v = e.get(variant_key)
        if not isinstance(v, str):
            continue
        if ev == exposure_event:
            exposures[v] += 1
        elif ev == conversion_event:
            conversions[v] += 1

    keys = set(exposures) | set(conversions)
    return {
        k: VariantStats(variant=k, exposures=exposures.get(k, 0), conversions=conversions.get(k, 0))
        for k in sorted(keys)
    }


def compute_stats(stats_by_variant: Mapping[str, VariantStats]) -> dict[str, Any]:
    """Summary dict for reporting (rates, counts)."""
    return {
        k: {"exposures": v.exposures, "conversions": v.conversions, "rate": v.rate}
        for k, v in stats_by_variant.items()
    }


def z_test(
    control: VariantStats,
    treatment: VariantStats,
) -> tuple[float, float]:
    """
    Pooled two-proportion z-test (two-sided normal approx).
    Returns (z_statistic, two_sided_p_value).
    """
    n0, x0 = control.exposures, control.conversions
    n1, x1 = treatment.exposures, treatment.conversions
    if n0 <= 0 or n1 <= 0:
        return float("nan"), float("nan")

    p_pool = (x0 + x1) / (n0 + n1)
    if p_pool <= 0 or p_pool >= 1:
        return float("nan"), float("nan")

    se = math.sqrt(p_pool * (1 - p_pool) * (1 / n0 + 1 / n1))
    if se <= 0:
        return float("nan"), float("nan")

    p0 = x0 / n0
    p1 = x1 / n1
    z = (p1 - p0) / se
    # two-sided p-value from standard normal
    p_two = 2 * (1 - _phi(abs(z)))
    return z, p_two


def _phi(z: float) -> float:
    """Standard normal CDF via erf."""
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))


def bootstrap_lift_ratio(
    control: VariantStats,
    treatment: VariantStats,
    *,
    n_draws: int = 10_000,
    seed: int | None = None,
) -> dict[str, float]:
    """Non-parametric bootstrap on Bernoulli resamples; returns quantiles of (p1 - p0)."""
    rng = random.Random(seed)
    if control.exposures <= 0 or treatment.exposures <= 0:
        return {"p05": float("nan"), "p50": float("nan"), "p95": float("nan")}

    diffs: list[float] = []
    for _ in range(n_draws):
        p0 = _bernoulli_mean(rng, control)
        p1 = _bernoulli_mean(rng, treatment)
        diffs.append(p1 - p0)
    diffs.sort()
    lo = diffs[int(0.05 * (len(diffs) - 1))]
    mid = diffs[int(0.50 * (len(diffs) - 1))]
    hi = diffs[int(0.95 * (len(diffs) - 1))]
    return {"p05": lo, "p50": mid, "p95": hi}


def _bernoulli_mean(rng: random.Random, s: VariantStats) -> float:
    if s.exposures <= 0:
        return 0.0
    p = s.conversions / s.exposures
    hits = sum(1 for _ in range(s.exposures) if rng.random() < p)
    return hits / s.exposures
