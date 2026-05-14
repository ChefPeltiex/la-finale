#!/usr/bin/env bash
# bootstrap_phi.sh — safe bootstrap for CirculAI φ (IGOR monorepo).
#
# Usage:
#   ./scripts/bootstrap_phi.sh bundle [--sync-server]
#     Writes ONLY under public/circulai-phi/ (does not touch root package.json,
#     root index.html, or .github/workflows). Default: does NOT copy server/ or
#     lambda/ into the monorepo — use ../../server and ../../lambda already in tree.
#     Optional: --sync-server → also overwrites ../../server/ab-server.js from the
#     embedded standalone template (fetch + AbortSignal.timeout).
#
#   ./scripts/bootstrap_phi.sh standalone <DIR>
#     Writes a flat mini-repo into DIR: public/circulai-phi/, server/, lambda/,
#     .github/workflows/deploy.yml, package.json, serverless.yml, index.html (root).
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PHI="$REPO_ROOT/public/circulai-phi"

SYNC_SERVER=0
MODE=""
STAND_TARGET=""

usage() {
  sed -n '1,30p' "$0" | sed -n '/^# /p' | sed 's/^# \{0,1\}//'
  echo ""
  echo "Examples:"
  echo "  $0 bundle"
  echo "  $0 bundle --sync-server"
  echo "  $0 standalone /tmp/circulai-phi-standalone"
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      bundle)
        MODE=bundle
        shift
        ;;
      standalone)
        MODE=standalone
        STAND_TARGET="${2:-}"
        if [[ -z "$STAND_TARGET" ]]; then echo "standalone requires <DIR>" >&2; exit 2; fi
        shift 2
        ;;
      --sync-server)
        SYNC_SERVER=1
        shift
        ;;
      -h|--help)
        usage; exit 0
        ;;
      *)
        echo "Unknown arg: $1" >&2
        usage
        exit 2
        ;;
    esac
  done
  if [[ -z "$MODE" ]]; then usage; exit 2; fi
}

die() { echo "error: $*" >&2; exit 1; }

write_power_ipynb() {
  local out="$1"
  python3 - "$out" <<'__PY_NOTEBOOK__'
import json, pathlib, sys
nb = json.loads("{\n  \"nbformat\": 4,\n  \"nbformat_minor\": 5,\n  \"metadata\": {\n    \"kernelspec\": {\n      \"display_name\": \"Python 3\",\n      \"language\": \"python\",\n      \"name\": \"python3\"\n    },\n    \"language_info\": {\n      \"name\": \"python\",\n      \"version\": \"3.12.0\"\n    }\n  },\n  \"cells\": [\n    {\n      \"cell_type\": \"markdown\",\n      \"metadata\": {},\n      \"id\": \"intro-md\",\n      \"source\": [\n        \"# Circulai \u03c6 \u2014 analyse de puissance (A/B, deux proportions)\\n\",\n        \"\\n\",\n        \"Miroir de `scripts/circulai_power_analysis.py` : **statsmodels** `NormalIndPower` et `proportion_effectsize`.\\n\",\n        \"\\n\",\n        \"Installation : `pip install statsmodels numpy` (scipy souvent install\u00e9 en d\u00e9pendance ; optionnel explicitement).\\n\",\n        \"\\n\",\n        \"Runbook canary : [`playbook-canary.md`](playbook-canary.md).\"\n      ]\n    },\n    {\n      \"cell_type\": \"code\",\n      \"metadata\": {},\n      \"id\": \"statsmodels-cell\",\n      \"source\": [\n        \"import math\\n\",\n        \"\\n\",\n        \"import numpy as np\\n\",\n        \"from statsmodels.stats.power import NormalIndPower\\n\",\n        \"from statsmodels.stats.proportion import proportion_effectsize\\n\",\n        \"\\n\",\n        \"p_control = 0.12\\n\",\n        \"min_lift_relative = 0.15\\n\",\n        \"alpha = 0.05\\n\",\n        \"power = 0.80\\n\",\n        \"ratio = 1.0\\n\",\n        \"daily_visitors = 5000\\n\",\n        \"pct_eligible = 0.25\\n\",\n        \"alternative = \\\"larger\\\"  # \\\"larger\\\" | \\\"smaller\\\" | \\\"two-sided\\\"\\n\",\n        \"\\n\",\n        \"p_phi = float(np.clip(p_control * (1.0 + min_lift_relative), 0.0, 1.0))\\n\",\n        \"# Convention Cohen h statsmodels : arcsin(\u221ap1) \u2212 arcsin(\u221ap2) ; (p_phi, p_control) > 0 si p_phi > p_control.\\n\",\n        \"effect_size = proportion_effectsize(p_phi, p_control)\\n\",\n        \"\\n\",\n        \"analysis = NormalIndPower()\\n\",\n        \"n_raw = analysis.solve_power(\\n\",\n        \"    effect_size=effect_size,\\n\",\n        \"    power=power,\\n\",\n        \"    alpha=alpha,\\n\",\n        \"    ratio=ratio,\\n\",\n        \"    alternative=alternative,\\n\",\n        \")\\n\",\n        \"n_control = float(np.squeeze(np.asarray(n_raw)))\\n\",\n        \"n_treatment = n_control * ratio\\n\",\n        \"n_total = n_control + n_treatment\\n\",\n        \"eligible_per_day = daily_visitors * pct_eligible\\n\",\n        \"days_hint = math.ceil(n_total / eligible_per_day) if eligible_per_day > 0 else math.nan\\n\",\n        \"\\n\",\n        \"print(\\\"p_control, p_phi:\\\", p_control, p_phi)\\n\",\n        \"print(\\\"effect_size:\\\", effect_size)\\n\",\n        \"print(\\\"n control / treatment / total:\\\", math.ceil(n_control), math.ceil(n_treatment), math.ceil(n_total))\\n\",\n        \"print(\\\"duration hint (days):\\\", days_hint)\"\n      ],\n      \"execution_count\": null,\n      \"outputs\": []\n    },\n    {\n      \"cell_type\": \"markdown\",\n      \"metadata\": {},\n      \"id\": \"extensions-md\",\n      \"source\": [\n        \"## Extensions (optionnel)\\n\",\n        \"\\n\",\n        \"- Ajuster `ratio` si les effectifs ne sont pas sym\u00e9triques entre les bras.\\n\",\n        \"- `alternative=\\\"two-sided\\\"` pour une hypoth\u00e8se bilat\u00e9rale (souvent effectif plus \u00e9lev\u00e9).\\n\",\n        \"- Sensibilit\u00e9 : faire varier `p_control` et `min_lift_relative` ; tracer une courbe puissance avec `matplotlib` si besoin p\u00e9dagogique.\"\n      ]\n    }\n  ]\n}")
path = pathlib.Path(sys.argv[1])
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(json.dumps(nb, indent=2, ensure_ascii=False), encoding="utf-8")
__PY_NOTEBOOK__
}

_emit_index_html() {
  cat <<'__EOF__'
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>CirculAI φ — Prototype</title>
<link rel="stylesheet" href="./design-tokens.css" />
<script src="./ab_experiment.js" defer></script>
<style>
  :root{
    --card-w: 320px;
    --muted: #2b2b2b;
    --glass: rgba(255,255,255,0.04);
  }
  html,body{height:100%;margin:0;font-family:Inter,system-ui,Segoe UI,Roboto,"Helvetica Neue",Arial;}
  body{background:linear-gradient(180deg,#071021 0%, var(--bg) 100%);color:#e6eef6;display:flex;align-items:center;justify-content:center;padding:2rem;}
  .wrap{max-width:1200px;width:100%;display:grid;grid-template-columns:1fr minmax(0, calc(100% / (var(--phi) * var(--phi))));gap:var(--gutter);align-items:center;}
  .hero{
    padding:2rem;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    border-radius:14px;backdrop-filter: blur(6px);box-shadow: 0 8px 30px rgba(2,6,23,0.6);
  }
  h1{font-size:var(--scale-2);margin:0 0 0.5rem 0;line-height:1.02;color:var(--accent);}
  p.lead{font-size:var(--scale-1);margin:0 0 1.25rem 0;color:#cfe6ff;}
  .cta{display:inline-flex;gap:0.75rem;align-items:center}
  .btn{
    background:var(--accent);color:#071021;padding:0.7rem 1.1rem;border-radius:10px;font-weight:600;border:none;cursor:pointer;
    box-shadow: 0 6px 18px rgba(255,127,80,0.12);
  }
  .muted{color:#9fb6d6;font-size:0.95rem}
  .side{display:flex;flex-direction:column;gap:var(--gutter);}
  .card{background:var(--glass);padding:1rem;border-radius:12px;border:1px solid rgba(255,255,255,0.03);}
  .metric{font-size:1.25rem;font-weight:700;color:var(--accent)}
  .small{font-size:0.9rem;color:#bcd7f0}
  #spiral-wrap{width:100%;height:420px;display:flex;align-items:center;justify-content:center}
  svg{max-width:100%;height:auto;display:block}
  @media (max-width:980px){
    .wrap{grid-template-columns:1fr; padding:0}
    #spiral-wrap{height:320px}
  }
  @media (prefers-reduced-motion: reduce){
    *,*::before,*::after{
      animation-duration:0.01ms !important;
      animation-iteration-count:1 !important;
      transition-duration:0.01ms !important;
    }
  }
</style>
</head>
<body>
  <div class="wrap" role="main">
    <section class="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">CirculAI — Architectures en proportion φ</h1>
      <p class="lead">Passe de l’approximation à la structure : design, optimisation et génération procédurale guidés par le nombre d’or.</p>
      <div class="cta">
        <button class="btn" id="launch">Tester le prototype</button>
        <div class="muted">Prototype responsive • A/B ready</div>
      </div>
      <div id="spiral-wrap" style="margin-top:1.25rem">
        <svg id="spiral" viewBox="-300 -300 600 600" role="img" aria-label="Spirale dorée"></svg>
      </div>
    </section>
    <aside class="side" aria-label="Indicateurs du prototype">
      <div class="card">
        <div class="small">KPI cible</div>
        <div class="metric" id="kpi-ctr">CTR +12%</div>
        <div class="small">Prototype appliqué à landing + dashboard</div>
      </div>
      <div class="card">
        <div class="small">Optimisation</div>
        <div class="small">Golden‑section search intégré pour tuning d’un paramètre</div>
      </div>
      <div class="card">
        <div class="small">Design system</div>
        <div class="small">Variables centrales : --phi, --base, --gutter</div>
      </div>
    </aside>
  </div>
<script>
(function(){
  const svg = document.getElementById('spiral');
  const phi = (1 + Math.sqrt(5)) / 2;
  const k = 2 * Math.log(phi) / Math.PI;
  const r0 = 2;
  const steps = 2500;
  const stepTheta = 0.012;
  let path = '';
  for (let i = 0; i < steps; i++){
    const theta = i * stepTheta;
    const r = r0 * Math.exp(k * theta);
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    if (i === 0) path += `M ${x} ${y} `;
    else path += `L ${x} ${y} `;
    if (Math.abs(x) > 290 || Math.abs(y) > 290) break;
  }
  const p = document.createElementNS('http://www.w3.org/2000/svg','path');
  p.setAttribute('d', path);
  p.setAttribute('stroke', '#ffb07a');
  p.setAttribute('fill', 'none');
  p.setAttribute('stroke-width', 1.6);
  p.setAttribute('stroke-linecap','round');
  svg.appendChild(p);
  const len = p.getTotalLength();
  p.style.strokeDasharray = String(len);
  p.style.strokeDashoffset = String(len);
  p.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(.2,.9,.2,1)';
  requestAnimationFrame(()=> { p.style.strokeDashoffset = '0'; });
  document.getElementById('launch').addEventListener('click', ()=> {
    const variant = window.__circulai_phi && window.__circulai_phi.variant;
    /* CTA : experiment_conversion (non géré par ab_experiment.js — conserver ici pour GTM / ga legacy). */
    if (typeof window.dataLayer !== 'undefined' && window.dataLayer && window.dataLayer.push) {
      window.dataLayer.push({
        event: 'experiment_conversion',
        experiment: 'circulai_phi_v1',
        variant: variant,
        target: 'launch_demo',
      });
    }
    if (typeof window.ga === 'function') {
      try {
        window.ga('send', 'event', 'circulai_phi_v1', 'experiment_conversion', String(variant || ''));
      } catch (e) {}
    }
    if (window.circulaiAB) {
      window.circulaiAB.track('cta_click', { target: 'launch' });
      window.circulaiAB.conversion({ target: 'launch_demo' });
    }
    alert('Prototype φ lancé — intégrer dans ton repo et A/B tester la landing.');
  });
})();
</script>
</body>
</html>
__EOF__
}

_emit_design_css() {
  cat <<'__EOF__'
:root{
  --phi: 1.6180339887;
  --base: 16px;
  --scale-0: calc(var(--base) * 1);
  --scale-1: calc(var(--base) * var(--phi));
  --scale-2: calc(var(--base) * var(--phi) * var(--phi));
  --gutter: calc(8px * var(--phi));
  --accent: #ff7f50;
  --bg: #0f1720;
}
__EOF__
}

_emit_ab_js() {
  cat <<'__EOF__'
/**
 * CirculAI φ — snippet A/B client (localStorage + dataLayer / ga legacy).
 * Expérience : circulai_phi_v1. Variantes : control | phi.
 * QA : ?ab=control | ?ab=phi
 * window.__circulai_phi = { variant } pour le CTA et les hooks GTM.
 */
(function () {
  "use strict";

  var EXPERIMENT_ID = "circulai_phi_v1";
  var STORAGE_KEY = "circulai_phi_variant";

  function pickFromQuery() {
    var m = /[?&]ab=(control|phi)(?:&|$)/i.exec(window.location.search);
    return m ? m[1].toLowerCase() : null;
  }

  function pickRandom() {
    return Math.random() < 0.5 ? "control" : "phi";
  }

  function readStored() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeStored(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function resolveVariant() {
    var prev = readStored();
    var hadValid = prev === "control" || prev === "phi";

    var q = pickFromQuery();
    if (q) {
      var wroteQ = writeStored(q);
      return {
        variant: q,
        isNewAssignment: wroteQ && !hadValid,
        assignment_source: "query",
      };
    }

    if (hadValid) {
      return {
        variant: prev,
        isNewAssignment: false,
        assignment_source: "storage",
      };
    }

    var v = pickRandom();
    var wroteR = writeStored(v);
    return {
      variant: v,
      isNewAssignment: wroteR,
      assignment_source: "random",
    };
  }

  function pushExperimentAssign(payload) {
    if (typeof window.dataLayer !== "undefined" && window.dataLayer && window.dataLayer.push) {
      window.dataLayer.push(payload);
    }
    if (typeof window.ga === "function") {
      try {
        window.ga("send", "event", EXPERIMENT_ID, "experiment_assign", String(payload.variant || ""));
      } catch (e) {}
    }
  }

  function pushDataLayer(obj) {
    if (typeof window.dataLayer !== "undefined" && window.dataLayer && window.dataLayer.push) {
      window.dataLayer.push(Object.assign({ event: "circulai_ab" }, obj));
    }
  }

  function emit(name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail: detail }));
    } catch (e) {}
  }

  var meta = resolveVariant();
  var variant = meta.variant;

  window.__circulai_phi = { variant: variant };

  document.documentElement.setAttribute("data-ab-variant", variant);
  document.documentElement.setAttribute("data-experiment-phi", variant);

  function applyBodyVariantClasses() {
    var b = document.body;
    if (!b) return;
    b.classList.remove("phi-variant", "control-variant");
    b.classList.add(variant === "phi" ? "phi-variant" : "control-variant");
  }

  if (document.body) {
    applyBodyVariantClasses();
  } else {
    document.addEventListener("DOMContentLoaded", applyBodyVariantClasses, { once: true });
  }

  if (meta.isNewAssignment) {
    pushExperimentAssign({
      event: "experiment_assign",
      experiment: EXPERIMENT_ID,
      variant: variant,
      assignment_source: meta.assignment_source,
      storage_key: STORAGE_KEY,
    });
    emit("circulai_ab", {
      variant: variant,
      action: "experiment_assign",
      experiment: EXPERIMENT_ID,
      assignment_source: meta.assignment_source,
    });
  }

  var EXP_KEY = "circulai_phi_exposed";

  function expose(extra) {
    try {
      if (window.sessionStorage.getItem(EXP_KEY)) return;
      window.sessionStorage.setItem(EXP_KEY, "1");
    } catch (e) {}
    var payload = Object.assign({ variant: variant, action: "expose" }, extra || {});
    pushDataLayer(payload);
    emit("circulai_ab", payload);
  }

  function track(action, extra) {
    var payload = Object.assign({ variant: variant, action: action }, extra || {});
    pushDataLayer(payload);
    emit("circulai_ab", payload);
  }

  function conversion(extra) {
    track("conversion", extra);
  }

  window.circulaiAB = {
    getVariant: function () {
      return variant;
    },
    expose: expose,
    track: track,
    conversion: conversion,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      expose();
    });
  } else {
    expose();
  }
})();
__EOF__
}

_emit_golden_py() {
  cat <<'__EOF__'
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
__EOF__
}

_emit_power_py() {
  cat <<'__EOF__'
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
__EOF__
}

_emit_deploy_md() {
  cat <<'__EOF__'
# Deploy Checklist — CirculAI φ Prototype

Checklist **sections 1 à 11** pour le bundle statique `public/circulai-phi/`, les intégrations **A/B** (`ab_experiment.js`, `server/ab-server.js`, `lambda/ab-lambda.js`) et le déploiement **Serverless** (`serverless.yml` à la racine du monorepo). Adapter selon l’hébergeur réel.

---

## 1. Objectif et périmètre

- **Objectif métier** : hypothèse testée (ex. uplift conversion **phi** vs **control**) documentée.
- **Périmètre** : pages, assets, endpoints (`/api/experiment`, `/api/experiment/convert`) inclus ou exclus.
- **Identifiant d’expérience** : **`circulai_phi_v1`** partout (cookies serveur, `dataLayer`, README).

---

## 2. Préparation (build, branches, secrets)

- **Build monorepo** : `npm run verify` ou au minimum `npm run build` sans erreur.
- **Branche / tag** : point de rollback identifié (voir §10).
- **Secrets** : clés AWS, URLs de collecte (`CIRCULAI_ANALYTICS_URL`, `EVENT_COLLECTOR_URL`) hors Git ; variables alignées sur l’hébergeur.

---

## 3. Sécurité

- **HTTPS** obligatoire en production ; redirection HTTP → HTTPS.
- **CSP / XSS** : pas de scripts non maîtrisés ; SVG et inline JS revus.
- **Cookies** : `Secure`, `SameSite`, `HttpOnly` pour l’identifiant utilisateur côté serveur ; politique de domaine cohérente (`COOKIE_DOMAIN` en Lambda si besoin).

---

## 4. Accessibilité

- Contraste **WCAG AA** sur hero, cartes, CTA.
- Focus visible, ordre de tabulation, spirale / animations respectant **`prefers-reduced-motion`**.

---

## 5. Performance

- Scripts non bloquants (`defer` / fin de `body`) ; budgets LCP / INP définis.
- Assets statiques versionnés ou hashés si CDN.

---

## 6. Observabilité

- Schéma d’événements stable : `experiment_assign`, `experiment_conversion`, `circulai_ab` (expose / track).
- Dashboards prêts **avant** le premier pourcentage de canary.

---

## 7. A/B — statistiques et produit

- **Puissance / n** : calibrés (voir `docs/circulai-power-analysis.ipynb`).
- **α** et règles d’arrêt pré-enregistrées ; pas de décision ad hoc sur pic journalier seul.

---

## 8. QA pré-production

- Parcours **control** et **phi** ; `?ab=control` / `?ab=phi` sur le snippet client.
- Démo serveur : `npm run ab:server-demo` puis `GET /api/experiment` et `POST /api/experiment/convert`.
- Matrice navigateurs + mobile.

---

## 9. Rollout et canary

- Séquence type **5 % → 20 % → 50 % → 100 %** (voir `docs/playbook-canary.md`).
- **Kill switch** testé une fois avant prod.

---

## 10. Opérations et rollback

- **Runbook incident** : qui appeler, comment désactiver **phi**, comment restaurer la version **control**.
- **Sauvegardes** : tout état persistant concerné par l’expérience.

---

## 11. Pré-commit, CI/CD et post-déploiement

- **CI** : workflow `.github/workflows/deploy-circulai-phi.yml` — copie des assets `public/circulai-phi/` vers `dist/circulai-phi/` ; archive tar ; `npx serverless deploy` ; `aws s3 sync` (clés AWS via secrets GitHub).
- **Post-déploiement** : smoke tests URL publique ; surveillance 24–48 h renforcée.

---

## Références chemins

| Élément | Chemin |
|---------|--------|
| Landing φ | `public/circulai-phi/index.html` |
| Snippet A/B | `public/circulai-phi/ab_experiment.js` |
| Démo Express | `server/ab-server.js` (`npm run ab:server-demo`) |
| Lambda HTTP API v2 | `lambda/ab-lambda.js` |
| CI GitHub Actions | `.github/workflows/deploy-circulai-phi.yml` |
| Serverless (racine) | `serverless.yml` |
| Puissance A/B | `public/circulai-phi/power_analysis.py`, `scripts/circulai_power_analysis.py` |
| Playbook canary | `docs/playbook-canary.md` |
__EOF__
}

_emit_playbook_md() {
  cat <<'__EOF__'
# Playbook canary — CirculAI φ / Canary playbook

> **FR** : guide opérationnel pour un déploiement **progressif** (canary) de la landing φ et des endpoints A/B associés.  
> **EN** : operational playbook for **progressive rollout** of the φ landing and related A/B surfaces.

---

## 1. Objectif / Purpose

**FR** : limiter le blast radius d’une régression (UX, perf, stats A/B, cookies) en exposant d’abord une **fraction** du trafic à la variante **phi**, avec critères de promotion explicites et rollback rapide.  
**EN** : cap the blast radius of regressions (UX, performance, A/B stats, cookies) by exposing a **fraction** of traffic to the **phi** variant first, with explicit promotion gates and fast rollback.

---

## 2. Périmètre / Scope

**FR** : ce playbook couvre le bundle statique (`index.html`, `ab_experiment.js`, tokens), la démo **Express** (`server/ab-server.js`), et la **Lambda** HTTP API v2 (`lambda/ab-lambda.js`). Hors périmètre : bases de données métier non décrites ici.  
**EN** : covers the static bundle, the Express demo, and the Lambda HTTP API v2. Out of scope: unspecified business databases.

---

## 3. Gates de trafic / Traffic gates

**FR** — séquence recommandée : **5 % → 20 % → 50 % → 100 %** (ajuster selon volume). Entre chaque palier : **minimum** une fenêtre complète incluant un week-end si le trafic B2C est saisonnier.  
**EN** — recommended ramp: **5% → 20% → 50% → 100%** (tune to volume). Between steps: at least one full window including a weekend for seasonal B2C traffic.

| Palier / Step | Trafic φ / φ traffic | Durée indicative / Hint |
|----------------|----------------------|-------------------------|
| T0 | 5 % | 24–48 h |
| T1 | 20 % | 24–72 h |
| T2 | 50 % | 24–48 h |
| T3 | 100 % | stabilisation |

---

## 4. Critères de promotion / Promotion criteria

**FR** (tous **obligatoires** avant montée) :  
- KPI primaire (conversion) **non dégradée** vs baseline sur **control** (pas de régression majeure).  
- Taux d’erreur JS / 5xx **≤ seuil** défini en amont.  
- Latence p95 **≤ budget** (LCP / INP selon instrumentation disponible).  
- **A/B** : pas de fuite d’assignation (une session = une variante) ; événements `experiment_assign` / `experiment_conversion` cohérents.  
- **Accessibilité** : spot-check **WCAG AA** sur la variante **phi** (contraste, focus, `prefers-reduced-motion`).

**EN** (all **required** before promoting): primary KPI not degraded vs baseline; JS/5xx error rate within threshold; p95 latency within budget; assignment integrity; analytics events coherent; WCAG AA spot-check on **phi**.

---

## 5. Observabilité / Observability

**FR** : tableaux de bord par palier (conversion, erreurs, latence) ; corrélation **variante × segment** (device, locale). Logs serveur pour attribution critique.  
**EN** : dashboards per step (conversion, errors, latency); correlate **variant × segment**; server logs for critical attribution.

---

## 6. Rollback & kill switch

**FR** : en cas de dérive, **revenir** à `control` / bundle précédent / flag off en **< 15 min** (objectif aligné sur `deploy-checklist.md`). Documenter l’owner on-call.  
**EN** : on drift, roll back to `control`/previous bundle/flag off in **< 15 min**; document on-call owner.

---

## 7. Communication

**FR** : informer support & produit des changements de libellés / CTA ; préparer FAQ courte si l’UX change.  
**EN** : notify support & product of copy/CTA changes; short FAQ if UX shifts.

---

## 8. Après 100 % / Post–100%

**FR** : revue KPI à J+1 et J+7 ; conserver les artefacts (tag git, build hash) ; **post-mortem léger** si incident.  
**EN** : KPI review at D+1 and D+7; keep artifacts (git tag, build hash); lightweight post-mortem if incident.

---

## 9. Références / References

- `deploy-checklist.md` (sections 1–11, monorepo).  
- `power_analysis.py` / `power_analysis.ipynb` (dimensionnement échantillon / sample-size hints).  
- `docs/PHI-DESIGN-SYSTEM-AND-ROADMAP.md` (contexte IGOR / IGOR context).
__EOF__
}

_emit_ab_lambda() {
  cat <<'__EOF__'
/**
 * CirculAI φ — AWS Lambda handler for server-side A/B (API Gateway HTTP API v2).
 *
 * Env:
 *   EVENT_COLLECTOR_URL — optional HTTPS sink (JSON); skipped if unset
 *   EXPERIMENT_ID — cookie / experiment key (default `circulai_phi_v1`, align with `server/ab-server.js`)
 *   COOKIE_DOMAIN — optional `Domain=...` fragment for Set-Cookie
 *   ASSIGN_PROB_CONTROL — default "0.5" (fraction assigned to control; rest → phi)
 *
 * HTTP API v2: multiple Set-Cookie via top-level `cookies` string array on the response.
 */

import { randomUUID } from "node:crypto";

const VARIANTS = new Set(["control", "phi"]);
const USER_COOKIE = "circulai_user_id";

function experimentKey() {
  return process.env.EXPERIMENT_ID || process.env.CIRCULAI_EXPERIMENT_KEY || "circulai_phi_v1";
}

function assignProbControl() {
  const raw = process.env.ASSIGN_PROB_CONTROL ?? "0.5";
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || n >= 1) return 0.5;
  return n;
}

function assignVariant() {
  return Math.random() < assignProbControl() ? "control" : "phi";
}

function maxAgeSecondsOneYear() {
  return 365 * 24 * 60 * 60;
}

function parseCookieHeader(cookieHeader) {
  const out = Object.create(null);
  if (!cookieHeader) return out;
  for (const part of String(cookieHeader).split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(val);
  }
  return out;
}

function parseCookies(event) {
  const fromArray = event.cookies;
  if (Array.isArray(fromArray) && fromArray.length) {
    const out = Object.create(null);
    for (const c of fromArray) {
      const i = String(c).indexOf("=");
      if (i > 0) out[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1));
    }
    return out;
  }
  const h = event.headers?.cookie ?? event.headers?.Cookie ?? "";
  return parseCookieHeader(h);
}

function buildUserCookie(value) {
  const domain = process.env.COOKIE_DOMAIN ? `; Domain=${process.env.COOKIE_DOMAIN}` : "";
  const maxAge = maxAgeSecondsOneYear();
  return `${USER_COOKIE}=${encodeURIComponent(value)}; Path=/${domain}; Max-Age=${maxAge}; Secure; HttpOnly; SameSite=Lax`;
}

function buildVariantCookie(expKey, value) {
  const domain = process.env.COOKIE_DOMAIN ? `; Domain=${process.env.COOKIE_DOMAIN}` : "";
  const maxAge = maxAgeSecondsOneYear();
  return `${expKey}=${encodeURIComponent(value)}; Path=/${domain}; Max-Age=${maxAge}; Secure; SameSite=Lax`;
}

async function sendEvent(payload) {
  const url = process.env.EVENT_COLLECTOR_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    /* fire-and-forget */
  }
}

function normalizeRequest(event) {
  const rawPath = event.rawPath ?? event.path ?? "/";
  const path = String(rawPath).split("?")[0] || "/";
  const method = String(
    event.requestContext?.http?.method ?? event.httpMethod ?? "GET",
  ).toUpperCase();
  return { path, method };
}

function readJsonBody(event) {
  if (!event.body) return { ok: true, value: {} };
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf8")
      : event.body;
    if (!raw || !String(raw).trim()) return { ok: true, value: {} };
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false, value: null };
  }
}

function jsonResponse(statusCode, bodyObj, setCookies) {
  const res = {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(bodyObj),
  };
  if (setCookies && setCookies.length > 0) {
    res.cookies = setCookies;
  }
  return res;
}

function pathIs(path, suffix) {
  return path === suffix || path.endsWith(suffix);
}

export async function handler(event) {
  const { path, method } = normalizeRequest(event);
  const expKey = experimentKey();

  const cookies = parseCookies(event);
  const setCookies = [];

  let userId = cookies[USER_COOKIE];
  if (!userId) {
    userId = randomUUID();
    setCookies.push(buildUserCookie(userId));
  }

  let variant = cookies[expKey];
  let newAssignment = false;
  if (!variant || !VARIANTS.has(variant)) {
    variant = assignVariant();
    setCookies.push(buildVariantCookie(expKey, variant));
    newAssignment = true;
  }

  const ts = new Date().toISOString();

  if (newAssignment) {
    await sendEvent({
      event: "experiment_assign",
      experiment: expKey,
      userId,
      variant,
      ts,
      path,
    });
  }

  if (method === "GET" && pathIs(path, "/api/experiment")) {
    return jsonResponse(200, { experiment: expKey, variant, userId }, setCookies);
  }

  if (method === "POST" && pathIs(path, "/api/experiment/convert")) {
    const parsed = readJsonBody(event);
    if (!parsed.ok) {
      return jsonResponse(400, { error: "invalid_json" }, setCookies);
    }
    const goal = parsed.value?.goal ?? "default";
    await sendEvent({
      event: "experiment_convert",
      experiment: expKey,
      userId,
      variant,
      goal,
      ts: new Date().toISOString(),
    });
    return jsonResponse(200, { ok: true }, setCookies);
  }

  if (method === "GET" && (path === "/" || path === "")) {
    return jsonResponse(
      200,
      {
        message: "CirculAI φ A/B Lambda",
        hint: "GET /api/experiment or POST /api/experiment/convert",
        experiment: expKey,
        variant,
        userId,
      },
      setCookies,
    );
  }

  return jsonResponse(404, { error: "not_found", path, method }, setCookies);
}
__EOF__
}

_emit_ab_server() {
  cat <<'__EOF__'
/**
 * Node 18+.
 * Install deps: npm i express cookie-parser uuid
 *
 * Standalone server-side A/B demo — not wired into server/index.js by default.
 * Run: node server/ab-server.js
 * Or:  npm run ab:server-demo
 */

import express from "express";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

const PORT = Number(process.env.AB_SERVER_PORT || process.env.PORT || 3847);
const ANALYTICS_URL = process.env.CIRCULAI_ANALYTICS_URL || "";

const EXPERIMENT_KEY = "circulai_phi_v1";
const VARIANTS = ["control", "phi"];
const ASSIGN_PROB = 0.5;

const USER_COOKIE = "circulai_user_id";

const COOKIE_BASE = {
  path: "/",
  sameSite: "lax",
  maxAge: 365 * 24 * 60 * 60 * 1000,
};

const app = express();
app.use(cookieParser());
app.use(express.json());

function assignVariant() {
  return Math.random() < ASSIGN_PROB ? VARIANTS[1] : VARIANTS[0];
}

/**
 * Demo / optional sink: set CIRCULAI_ANALYTICS_URL to POST JSON payloads.
 * Intended to be invoked only when a **new** experiment cookie is assigned
 * (see middleware branch that sets the cookie).
 */
async function sendEvent(payload) {
  if (ANALYTICS_URL) {
    try {
      await fetch(ANALYTICS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
    } catch (err) {
      console.warn("[ab-server] sendEvent POST failed:", err?.message || err);
    }
    return;
  }
  console.info("[ab-server demo] sendEvent:", JSON.stringify(payload));
}

function ensureUserAndExperiment(req, res, next) {
  let userId = req.cookies[USER_COOKIE];
  if (!userId) {
    userId = uuidv4();
    res.cookie(USER_COOKIE, userId, { ...COOKIE_BASE, httpOnly: true });
  }
  req.circulai_user_id = userId;

  let variant = req.cookies[EXPERIMENT_KEY];
  if (!variant || !VARIANTS.includes(variant)) {
    variant = assignVariant();
    res.cookie(EXPERIMENT_KEY, variant, { ...COOKIE_BASE, httpOnly: false });
    void sendEvent({
      event: "experiment_assign",
      experiment: EXPERIMENT_KEY,
      userId,
      variant,
      ts: new Date().toISOString(),
    });
  }
  req.experimentVariant = variant;
  next();
}

app.use(ensureUserAndExperiment);

app.get("/api/experiment", (req, res) => {
  res.json({
    experiment: EXPERIMENT_KEY,
    variant: req.experimentVariant,
    userId: req.circulai_user_id,
  });
});

app.post("/api/experiment/convert", (req, res) => {
  const goal = req.body?.goal ?? "default";
  const payload = {
    event: "experiment_convert",
    experiment: EXPERIMENT_KEY,
    userId: req.circulai_user_id,
    variant: req.experimentVariant,
    goal,
    ts: new Date().toISOString(),
  };
  if (ANALYTICS_URL) {
    void fetch(ANALYTICS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    }).catch((err) =>
      console.warn("[ab-server] convert POST failed:", err?.message || err),
    );
  } else {
    console.info("[ab-server demo] convert:", JSON.stringify(payload));
  }
  res.json({ ok: true });
});

app.get("/", (_req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CirculAI — A/B server demo</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; }
    code { background: #f4f4f5; padding: 0.1em 0.35em; border-radius: 4px; }
    pre { background: #18181b; color: #fafafa; padding: 1rem; border-radius: 8px; overflow: auto; }
    button { padding: 0.5rem 1rem; cursor: pointer; margin-top: 0.75rem; }
  </style>
</head>
<body>
  <h1>A/B server demo</h1>
  <p>Standalone Express app (<code>server/ab-server.js</code>). Assignment cookies + <code>GET /api/experiment</code>.</p>
  <p><button type="button" id="load">Charger /api/experiment</button></p>
  <pre id="out">{}</pre>
  <p><button type="button" id="convert">POST /api/experiment/convert</button></p>
  <pre id="conv">—</pre>
  <script>
    async function loadExperiment() {
      const r = await fetch('/api/experiment', { credentials: 'include' });
      document.getElementById('out').textContent = JSON.stringify(await r.json(), null, 2);
    }
    document.getElementById('load').onclick = loadExperiment;
    document.getElementById('convert').onclick = async () => {
      const r = await fetch('/api/experiment/convert', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: 'demo_cta' }),
      });
      document.getElementById('conv').textContent = JSON.stringify(await r.json(), null, 2);
    };
    loadExperiment();
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`[ab-server] demo listening on http://localhost:${PORT}`);
});
__EOF__
}

_emit_serverless() {
  cat <<'__EOF__'
# Serverless Framework — CirculAI φ prototype API (A/B assignment).
# Déployer depuis la racine du monorepo : `npx serverless deploy --stage staging`
# (ou `npm run deploy` dans `circulai-serverless/`).
# Prérequis : Node 18+, AWS credentials ; optionnel : EVENT_COLLECTOR_URL, COOKIE_DOMAIN.
# `ASSIGN_PROB_CONTROL` défaut 0,5 (50 % control / 50 % phi, aligné sur `server/ab-server.js`).

service: circulai-phi

frameworkVersion: "3"

provider:
  name: aws
  runtime: nodejs20.x
  stage: ${opt:stage, 'staging'}
  region: ${opt:region, 'eu-west-3'}
  httpApi:
    cors: true
  environment:
    EXPERIMENT_ID: circulai_phi_v1
    EVENT_COLLECTOR_URL: ${env:EVENT_COLLECTOR_URL, ''}
    ASSIGN_PROB_CONTROL: ${env:ASSIGN_PROB_CONTROL, '0.5'}

functions:
  ab:
    handler: lambda/ab-lambda.handler
    description: Assignation A/B HTTP API v2 (circulai_phi_v1)
    memorySize: 128
    timeout: 5
    events:
      - httpApi:
          path: /
          method: get
      - httpApi:
          path: /api/experiment
          method: get
      - httpApi:
          path: /api/experiment/convert
          method: post

package:
  individually: true
  patterns:
    - "!**"
    - "lambda/ab-lambda.js"
__EOF__
}

_emit_deploy_yml() {
  cat <<'__EOF__'
# CirculAI φ — standalone workflow (paths relative to repository root = job workspace).
name: Deploy CirculAI phi

on:
  workflow_dispatch:
  push:
    branches: [main]
    paths:
      - "public/circulai-phi/**"
      - "lambda/**"
      - "serverless.yml"
      - ".github/workflows/deploy.yml"

jobs:
  build-and-package:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Assemble dist/circulai-phi
        run: |
          mkdir -p dist/circulai-phi
          cp public/circulai-phi/index.html dist/circulai-phi/
          cp public/circulai-phi/design-tokens.css dist/circulai-phi/
          cp public/circulai-phi/ab_experiment.js dist/circulai-phi/
          cp public/circulai-phi/golden_search.py dist/circulai-phi/
          cp public/circulai-phi/power_analysis.py dist/circulai-phi/
          cp public/circulai-phi/power_analysis.ipynb dist/circulai-phi/
          cp public/circulai-phi/playbook-canary.md dist/circulai-phi/
          cp public/circulai-phi/README.md dist/circulai-phi/
          cp public/circulai-phi/deploy-checklist.md dist/circulai-phi/

      - name: Tar artifact
        run: tar -czvf circulai-phi-dist.tar.gz -C dist circulai-phi

      - uses: actions/upload-artifact@v4
        with:
          name: circulai-phi-dist
          path: circulai-phi-dist.tar.gz

  deploy:
    needs: build-and-package
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm install

      - uses: actions/download-artifact@v4
        with:
          name: circulai-phi-dist

      - name: Serverless deploy (Lambda + HTTP API)
        run: npx serverless deploy --stage prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: S3 sync (static bundle)
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          BUCKET: ${{ secrets.CIRCULAI_PHI_S3_BUCKET }}
        run: |
          test -n "$BUCKET"
          aws s3 sync public/circulai-phi/ "s3://${BUCKET}/" --delete
__EOF__
}

_emit_pkg_json() {
  cat <<'__EOF__'
{
  "name": "circulai-phi-standalone",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "ab:server-demo": "node server/ab-server.js"
  },
  "dependencies": {
    "cookie-parser": "^1.4.6",
    "express": "^4.21.0",
    "uuid": "^9.0.1"
  }
}
__EOF__
}


write_bundle() {
  mkdir -p "$PHI"
  _emit_index_html >"$PHI/index.html"
  _emit_design_css >"$PHI/design-tokens.css"
  _emit_ab_js >"$PHI/ab_experiment.js"
  _emit_golden_py >"$PHI/golden_search.py"
  _emit_power_py >"$PHI/power_analysis.py"
  write_power_ipynb "$PHI/power_analysis.ipynb"
  _emit_playbook_md >"$PHI/playbook-canary.md"
  _emit_deploy_md >"$PHI/deploy-checklist.md"
  if [[ "$SYNC_SERVER" -eq 1 ]]; then
    mkdir -p "$REPO_ROOT/server"
    _emit_ab_server >"$REPO_ROOT/server/ab-server.js"
  fi
}

write_standalone() {
  local root="$1"
  [[ -n "$root" ]] || die "empty DIR"
  mkdir -p "$root/public/circulai-phi" "$root/server" "$root/lambda" "$root/.github/workflows"
  write_bundle_at() {
    local P="$1"
    mkdir -p "$P"
    _emit_index_html >"$P/index.html"
    _emit_design_css >"$P/design-tokens.css"
    _emit_ab_js >"$P/ab_experiment.js"
    _emit_golden_py >"$P/golden_search.py"
    _emit_power_py >"$P/power_analysis.py"
    write_power_ipynb "$P/power_analysis.ipynb"
    _emit_playbook_md >"$P/playbook-canary.md"
    _emit_deploy_md >"$P/deploy-checklist.md"
  }
  write_bundle_at "$root/public/circulai-phi"
  _emit_ab_server >"$root/server/ab-server.js"
  _emit_ab_lambda >"$root/lambda/ab-lambda.js"
  _emit_serverless >"$root/serverless.yml"
  _emit_deploy_yml >"$root/.github/workflows/deploy.yml"
  _emit_pkg_json >"$root/package.json"
  _emit_index_html >"$root/index.html"
  cat >"$root/README.md" <<'RM'
# CirculAI φ — standalone scaffold

- Static bundle: `public/circulai-phi/`
- A/B demo server: `npm install && npm run ab:server-demo` (see `server/ab-server.js`)
- Lambda: `lambda/ab-lambda.js` + `serverless.yml`
- CI: `.github/workflows/deploy.yml` (paths relative to this repo root)

Bootstrap source: run `scripts/bootstrap_phi.sh standalone .` from the IGOR monorepo.
RM
  if [[ -f "$REPO_ROOT/public/circulai-phi/README.md" ]]; then
    cp "$REPO_ROOT/public/circulai-phi/README.md" "$root/public/circulai-phi/README.md"
  else
    cp "$root/README.md" "$root/public/circulai-phi/README.md"
  fi
}

main() {
  parse_args "$@"
  if [[ "$MODE" == bundle ]]; then
    write_bundle
    echo "bootstrap_phi: wrote bundle under $PHI"
    if [[ "$SYNC_SERVER" -eq 1 ]]; then
      echo "bootstrap_phi: synced server/ab-server.js from template (fetch + AbortSignal.timeout)"
    else
      echo "bootstrap_phi: skipped server/ and lambda/ (use monorepo server/ and lambda/); use --sync-server to overwrite server/ab-server.js only"
    fi
  else
    local t="$STAND_TARGET"
    if [[ "$t" == "." ]]; then t="$PWD"; fi
    mkdir -p "$t"
    t="$(cd "$t" && pwd)"
    write_standalone "$t"
    echo "bootstrap_phi: wrote standalone scaffold under $t"
  fi
  echo ""
  echo "Usage recap:"
  echo "  $0 bundle [--sync-server]   # public/circulai-phi/ only"
  echo "  $0 standalone <DIR>        # full flat mini-repo"
}

main "$@"
