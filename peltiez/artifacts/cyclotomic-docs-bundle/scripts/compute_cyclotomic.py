#!/usr/bin/env python3
# Requirements: pip install sympy
"""Polynomes cyclotomiques Phi_n(X) : formule de Mobius (diviseurs) et SymPy."""

from __future__ import annotations

import argparse
import sys

from sympy import Symbol, cancel, cyclotomic_poly, divisors, expand, mobius, prod


def cyclotomic_via_mobius(n: int, x: Symbol):
    """
    Phi_n(x) = prod_{d|n} (x^d - 1)^(mu(n/d))  (inversion de Mobius sur les diviseurs).
    """
    if n < 1:
        raise ValueError("n doit etre >= 1")
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
    return cancel(expand(prod(factors)))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Affiche Phi_n(X) (formule de Mobius) et verifie avec SymPy."
    )
    parser.add_argument("n", type=int, help="Indice n >= 1 du polynome cyclotomique.")
    parser.add_argument(
        "--no-check",
        action="store_true",
        help="Ne pas comparer a cyclotomic_poly de SymPy.",
    )
    args = parser.parse_args(argv)
    if args.n < 1:
        print("erreur : n doit etre >= 1", file=sys.stderr)
        return 2

    x = Symbol("X")
    p_mob = cyclotomic_via_mobius(args.n, x)
    print(f"Phi_{args.n}(X) = {p_mob}")

    if not args.no_check:
        p_sym = cyclotomic_poly(args.n, x, polys=False)
        if expand(p_mob - p_sym) != 0:
            print("ecart avec SymPy", file=sys.stderr)
            return 1
        print("(OK : identique a cyclotomic_poly de SymPy.)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
