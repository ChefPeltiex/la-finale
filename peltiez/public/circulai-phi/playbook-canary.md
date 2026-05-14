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
