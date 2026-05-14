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
