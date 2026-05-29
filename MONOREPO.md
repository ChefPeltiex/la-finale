# La Finale — Écosystème monorepo

Ce dépôt est un écosystème multi-projets.
Chaque dossier a un rôle distinct. Ne pas les confondre.

---

## Structure

| Dossier | Rôle | Type |
|---------|------|------|
| `peltiez/` | **Application principale CirculAI** | React + Vite + Express + Stripe |
| `egor69/` | Couche narrative / culturelle | React + Vite |
| `hub-neutre/` | Portail central / carrefour | React + Vite |
| `encyclopedie-immersive/` | Expérience encyclopédique | React + Vite + Three.js |
| `peltiez/circulai-serverless/` | Fonctions backend CirculAI | Serverless |
| `peltiez/lambda/` | Fonctions Lambda | AWS Lambda |
| `scripts/` | Outils et validateurs | Python, PowerShell, Batch |
| `docs/` | Architecture et protocoles | Markdown |
| `prompts/` | Briefs IA opérationnels | Markdown |

---

## À ignorer

| Dossier | Pourquoi |
|---------|----------|
| `node_modules/` | Dépendances installées localement |
| `backups/` | Copies de sécurité |
| `snapshots/` | Sauvegardes temporaires |

---

## Comment lancer

Application principale (CirculAI) :

```bash
cd peltiez
npm install
npm run dev
```

---

## Séparation des mondes

- **CirculAI** = concret : économie circulaire, territoire, marketplace, preuves.
- **Egor69** = narratif : bréviaire, symboles, culture, transmission.

Ne pas confondre les deux dans la communication publique.

---

*Document généré le 28 mai 2026. Mis à jour manuellement si la structure change.*
