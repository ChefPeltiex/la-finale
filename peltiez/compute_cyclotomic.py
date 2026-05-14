# Requirements: pip install sympy
"""Polynômes cyclotomiques Φ_n(X) : SymPy, --verify (Möbius), --factor p (F_p), --out."""

from __future__ import annotations

import argparse
import sys

from sympy import Symbol, cancel, cyclotomic_poly, divisors, expand, factor, mobius, prod


def _ensure_utf8_stdio() -> None:
    for stream in (sys.stdout, sys.stderr):
        reconf = getattr(stream, "reconfigure", None)
        if callable(reconf):
            try:
                reconf(encoding="utf-8", errors="replace")
            except Exception:
                pass


def cyclotomic_via_mobius(n: int, x: Symbol):
    """Φ_n(x) = ∏_{d|n} (x^d - 1)^{μ(n/d)}."""
    if n < 1:
        raise ValueError("n doit être >= 1")
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
    expr = cancel(expand(prod(factors)))
    pl = expr.as_poly(x)
    if pl is None:
        raise ValueError(f"produit de Möbius non polynomial en {x}: {expr!r}")
    return pl.as_expr()


def main() -> None:
    _ensure_utf8_stdio()
    parser = argparse.ArgumentParser(
        description="Affiche Φ_n(X) (SymPy). Options : --verify (Möbius), --factor p (F_p), --out fichier."
    )
    parser.add_argument("n", type=int, help="Indice n ≥ 1")
    parser.add_argument(
        "--verify",
        action="store_true",
        help="Vérifier le produit de Möbius contre cyclotomic_poly de SymPy.",
    )
    parser.add_argument(
        "--factor",
        type=int,
        metavar="p",
        default=None,
        help="Factoriser Φ_n sur F_p (modulo p).",
    )
    parser.add_argument(
        "--out",
        type=str,
        default=None,
        help="Fichier de sortie UTF-8 (sinon stdout).",
    )
    args = parser.parse_args()
    if args.n < 1:
        parser.error("n doit être >= 1")

    X = Symbol("X")
    poly = cyclotomic_poly(args.n, X, polys=False)
    lines: list[str] = [f"Φ_{args.n}(X) = {poly}"]

    if args.verify:
        p_mob = cyclotomic_via_mobius(args.n, X)
        if expand(poly - p_mob) != 0:
            raise SystemExit(f"Écart Möbius / SymPy pour n={args.n}")
        lines.append("(OK : coïncide avec le produit de Möbius.)")

    if args.factor is not None:
        if args.factor < 2:
            parser.error("--factor p doit être >= 2")
        lines.append(f"Factorisation sur F_{args.factor} : {factor(poly, modulus=args.factor)}")

    text = "\n".join(lines) + "\n"
    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(text)
    else:
        sys.stdout.write(text)


if __name__ == "__main__":
    main()
