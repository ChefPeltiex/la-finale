#!/usr/bin/env python3
"""Cyclotomic polynomials Φ_n(X) via SymPy, with optional Möbius-product check."""

from __future__ import annotations

import argparse
import sys

from sympy import Symbol, cancel, cyclotomic_poly, divisors, mobius, prod


def cyclotomic_via_mobius(n: int, x: Symbol):
    """
    Phi_n(x) = prod_{d|n} (x^d - 1)^(mu(n/d))  (Möbius inversion on divisors).
    """
    if n < 1:
        raise ValueError("n must be >= 1")
    factors = []
    for d in divisors(n):
        exp = mobius(n // d)
        base = x**d - 1
        if exp == 0:
            continue
        if exp == 1:
            factors.append(base)
        elif exp == -1:
            factors.append(1 / base)
        else:
            factors.append(base**exp)
    expr = cancel(prod(factors))
    poly = expr.as_poly(x)
    if poly is None:
        expr = expr.expand()
        poly = expr.as_poly(x)
    if poly is None:
        raise ValueError(f"could not reduce Möbius product to a polynomial in {x}: {expr!r}")
    return poly.as_expr()


def cyclotomic_via_sympy(n: int, x: Symbol):
    """SymPy's built-in cyclotomic polynomial in x."""
    return cyclotomic_poly(n, x, polys=False)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Print the cyclotomic polynomial Phi_n(X) using SymPy."
    )
    parser.add_argument(
        "n",
        type=int,
        help="Index n >= 1",
    )
    parser.add_argument(
        "--verify",
        action="store_true",
        help="Cross-check against the Möbius divisor product",
    )
    args = parser.parse_args(argv)

    if args.n < 1:
        print("error: n must be >= 1", file=sys.stderr)
        return 2

    x = Symbol("X")
    p_lib = cyclotomic_via_sympy(args.n, x)
    print(f"Phi_{args.n}(X) = {p_lib}")

    if args.verify:
        p_mob = cyclotomic_via_mobius(args.n, x)
        if (p_lib - p_mob).expand() != 0:
            print("Möbius product mismatch:", p_lib, p_mob, file=sys.stderr)
            return 1
        print("(OK: matches Möbius product)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
