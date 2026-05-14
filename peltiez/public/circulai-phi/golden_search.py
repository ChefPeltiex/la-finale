"""Reusable golden-section search for unimodal 1D optimization on [a, b].

Classic golden-section (φ) line search: minimize a unimodal objective with no
derivatives. JavaScript equivalent: ``goldenSectionSearch`` in
``src/lib/goldenRatio.js`` (monorepo). Mirrors ``../../scripts/golden_search.py``.
"""

import math
from typing import Callable, Tuple

phi = (1 + 5**0.5) / 2


def golden_section_search(
    f: Callable[[float], float],
    a: float,
    b: float,
    tol: float = 1e-6,
    max_iter: int = 100,
) -> Tuple[float, float]:
    """Minimize unimodal f on [a, b]; returns (x_opt, f(x_opt)). To maximize g, pass lambda x: -g(x) and use -f(x_opt)."""
    invphi = 1.0 / phi
    c = b - (b - a) * invphi
    d = a + (b - a) * invphi
    fc = f(c)
    fd = f(d)
    for _ in range(max_iter):
        if abs(b - a) < tol:
            break
        if fc < fd:
            b, d, fd = d, c, fc
            c = b - (b - a) * invphi
            fc = f(c)
        else:
            a, c, fc = c, d, fd
            d = a + (b - a) * invphi
            fd = f(d)
    x_opt = (a + b) / 2
    return x_opt, f(x_opt)


if __name__ == "__main__":
    def loss(x: float) -> float:
        return (x - 0.37) ** 2

    x_best, val = golden_section_search(loss, 0.0, 1.0)
    print("x_best:", x_best, "f(x):", val)

    def synthetic_metric(x: float) -> float:
        return math.exp(-((x - 0.37) ** 2) / 0.02)

    xm, fm_neg = golden_section_search(lambda x: -synthetic_metric(x), 0.0, 1.0)
    print("argmax metric x:", xm, "metric:", -fm_neg)
