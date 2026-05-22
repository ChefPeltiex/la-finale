# Dossier preuves — CirculAI / SCALE

**Date :** mai 2026

---

## Références rapides

- **Site (production / démo)** : `https://circulai-copy.vercel.app`
- **Vercel — Root Directory** : `peltiez` (projet configuré pour builder depuis ce sous-dossier)
- **Correctif SPA (routage)** : commit `4478e7d` — fichier `peltiez/vercel.json` (réécritures / headers pour l’application monopage)
- **PDF encyclopédie (fichier public)** : `peltiez/public/encyclopedie.pdf`
- **Répertoire assets encyclopédie** : `assets/codex-encyclopedie/`

---

## Gouvernance et documentation associée

| Document | Chemin |
|----------|--------|
| Gabarit PDF (blueprint) | `peltiez/docs/codex-pdf-blueprint.md` |
| Assemblage PDF | `peltiez/docs/codex-pdf-assembly.md` |
| Notes de version v1.0 | `RELEASE_NOTES_v1.0.md` |
| Fiche SCALE (1 page) | `peltiez/docs/scale-ai-fiche-1-page.md` |

---

## Captures à ajouter

À compléter pour la présentation ou l’audit visuel :

- [ ] **Page d’accueil** — capture plein écran de `https://circulai-copy.vercel.app/`
- [ ] **Marketplace HTTP 200** — capture ou preuve de statut `200` sur `/marketplace` (voir commandes ci-dessous)
- [ ] **Déploiement Vercel** — capture du tableau de bord (projet, dernier déploiement, Root Directory `peltiez`)
- [ ] **Vue fichier GitHub** — capture de la vue fichier pour `peltiez/vercel.json` (commit `4478e7d` ou branche courante)

---

## Commandes de vérif

Sous **Windows (PowerShell)**, utiliser `curl.exe` (alias natif de cURL) pour les en-têtes HTTP :

```powershell
curl.exe -I "https://circulai-copy.vercel.app/"
curl.exe -I "https://circulai-copy.vercel.app/marketplace"
```

Interprétation attendue : réponse `HTTP/2 200` (ou `HTTP/1.1 200`) pour les routes servies correctement par le déploiement.
