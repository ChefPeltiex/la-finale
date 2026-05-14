# pip install statsmodels numpy
# scipy optional (statsmodels bundles / uses scipy where available)
# Bundle mirror: ../public/circulai-phi/power_analysis.py

"""
CirculAI phi — sample size / duration hints for a two-proportion A/B test.

Uses statsmodels.stats.power.NormalIndPower with effect size from
statsmodels.stats.proportion.proportion_effectsize(prop1, prop2).

With statsmodels Cohen-h style convention, ``proportion_effectsize(p_phi, p_control)``
yields a **positive** effect when ``p_phi > p_control`` (one-sided ``larger`` tests).
"""

from __future__ import annotations

import math

import numpy as np
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

# --- Study parameters (edit as needed) ---
p_control = 0.12  # baseline conversion (control)
min_lift_relative = 0.15  # minimum *relative* lift to detect, e.g. 0.15 => +15%
alpha = 0.05
power = 0.80
ratio = 1.0  # n_treatment / n_control (NormalIndPower: nobs2 = ratio * nobs1)
daily_visitors = 5000
pct_eligible = 0.25  # fraction of daily traffic in the experiment

# One-sided is common when only improvement matters; two-sided is conservative.
alternative = "larger"  # "larger" | "smaller" | "two-sided"


def compute_sample_size(p_control, p_treatment, alpha=0.05, power=0.8, ratio=1.0):
    """
    Approximate **per-group** sample size (arm1 / control) for two proportions,
    two-sided test, normal approximation. `ratio` = n_treatment / n_control.
    """
    es = abs(float(proportion_effectsize(p_control, p_treatment)))
    if es == 0 or not math.isfinite(float(es)):
        return float("nan")
    analysis = NormalIndPower()
    n = analysis.solve_power(
        effect_size=es,
        alpha=alpha,
        power=power,
        ratio=ratio,
        alternative="two-sided",
    )
    return float(np.squeeze(np.asarray(n)))


def main() -> None:
    p_phi = float(np.clip(p_control * (1.0 + min_lift_relative), 0.0, 1.0))
    if p_phi <= p_control and alternative == "larger":
        raise ValueError("p_phi must exceed p_control for alternative='larger'")

    # Statsmodels: h ∝ arcsin(√prop1) − arcsin(√prop2). Use (p_phi, p_control) so h > 0 when p_phi > p_control.
    effect_size = proportion_effectsize(p_phi, p_control)

    analysis = NormalIndPower()
    n_raw = analysis.solve_power(
        effect_size=effect_size,
        power=power,
        alpha=alpha,
        ratio=ratio,
        alternative=alternative,
    )
    n_control = float(np.squeeze(np.asarray(n_raw)))
    if not math.isfinite(n_control):
        raise RuntimeError("solve_power returned invalid n_control")

    n_control_f = n_control
    n_treatment_f = n_control_f * float(ratio)
    n_total = n_control_f + n_treatment_f

    eligible_per_day = float(daily_visitors) * float(pct_eligible)
    days_hint = math.ceil(n_total / eligible_per_day) if eligible_per_day > 0 else math.nan

    print("CirculAI phi - power analysis (two independent proportions, Normal approximation)")
    print("---")
    print(f"p_control           = {p_control}")
    print(f"min_lift_relative   = {min_lift_relative}  => p_phi = {p_phi:.6g}")
    print(f"alpha               = {alpha}")
    print(f"power               = {power}")
    print(f"ratio (n2/n1)       = {ratio}")
    print(f"alternative         = {alternative}")
    print(f"Cohen h (effect)    = {effect_size:.6g}")
    print("---")
    print(f"Required n (control / arm1)   ~ {math.ceil(n_control_f):,}")
    print(f"Required n (treatment / arm2) ~ {math.ceil(n_treatment_f):,}")
    print(f"Required total n              ~ {math.ceil(n_total):,}")
    print("---")
    print(f"daily_visitors      = {daily_visitors:,}")
    print(f"pct_eligible        = {pct_eligible}")
    print(f"eligible / day      ~ {eligible_per_day:,.0f}")
    print(f"duration hint (days)~ {days_hint}")


if __name__ == "__main__":
    main()
