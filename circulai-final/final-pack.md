# CirculAI — Dossier final (pupitre) — 2026-05-12

## Résumé exécutif (30 s)
CirculAI rend l’économie circulaire **opérationnelle** : livrables vérifiables (site, PDF, dépôt), gouvernance **SCALE** (délégation contrôlée, revue humaine, reproductibilité).  
Demande : **pilote 90 jours** sur un cas restreint, mesuré sur **3 métriques** : **temps, coût, qualité des données**.

## Preuves (chemins & références)
- **Démo web** : https://circulai-copy.vercel.app  
  - Vercel : **Root Directory = `peltiez`** (obligatoire en monorepo).  
  - **Deep links SPA** : commit **`4478e7d`** — `peltiez/vercel.json` → rewrite vers `/index.html`.
- **PDF encyclopédie (téléchargement)** : `peltiez/public/encyclopedie.pdf`  
  - **Source images** : `assets/codex-encyclopedie/`.
- **Dossier preuves (détail)** : `peltiez/docs/proofs.md`
- **Fiche 1 page (FR)** : `peltiez/docs/scale-ai-fiche-1-page.md`
- **Infra / réseau / durable** :  
  - `peltiez/docs/network-ip-plan.md`  
  - `peltiez/docs/P691-checklist.md` *(référence P691 à confirmer avec le client)*  
  - `peltiez/diagrams/README.md` + `peltiez/diagrams/infra.mmd` + `peltiez/diagrams/landing-zone-notes.md`
- **Release** : `RELEASE_NOTES_v1.0.md`

## Commits récents (à montrer)
- `1da03d9` — docs: add infra Mermaid bundle (infra.mmd)  
- `8415a5e` — docs: add network plan, green-IT checklist, and diagram sources  
- `7c473c7` — docs: add CirculAI proofs dossier and infra diagram notes  
- `2b4b0ee` — docs: add SCALE AI one-page executive brief (CirculAI pilot)  
- `4478e7d` — fix(vercel): resolve SPA routing / build output for production

## Checklist smoke (2 minutes)
- [ ] `GET /` → 200  
- [ ] `GET /marketplace` → 200  
- [ ] Téléchargement `/encyclopedie.pdf` → 200 (fichier lourd : patience)

## Pitch 90 s (à dire)
« Je m’appelle Dominic. CirculAI rend la circularité **exécutable** : moins de pertes, moins d’inactifs, plus de réutilisation — avec un site déployé, une encyclopédie PDF, et une chaîne **SCALE** traçable.  
Je ne cherche pas une étiquette : je cherche un **pilote 90 jours** sur un cas concret, mesuré sur **trois métriques** : temps, coût, qualité des données.  
CirculAI, c’est la circularité en **livrables**, pas en slides. »

## Version neutre (45 s)
« CirculAI est une initiative pour rendre l’économie circulaire opérationnelle via une application web, une production documentaire (PDF), et une gouvernance de développement traçable.  
Je propose un pilote à périmètre restreint avec des indicateurs simples : délais, coûts, qualité de données.  
La démonstration s’appuie sur des artefacts publics vérifiables : URL, dépôt, et livrables associés. »

## Questions à poser (cadrage pilote)
1. Quel problème opérationnel réduire en 90 jours ?  
2. Quelle donnée « source de vérité » existe, et qui la possède ?  
3. Qui est le décideur unique (accès, budget minimal, sécurité) ?  
4. Quelles 3 métriques = succès / échec ?  
5. Quel canal de premier déploiement (interne / municipalité / programme) ?

## Notes de prudence
- Ne pas affirmer une conformité **P691** sans le document officiel correspondant.  
- Ne pas présenter des chiffres d’impact **non sourcés** : rester sur **méthode + preuves techniques + demande de pilote mesuré**.
