# EGOR Time Simulation

## But

Simuler l’impact d’un **bruit temporel** paramétrique (toy **DP/CSL-like**) sur des séries de fréquence fractionnaire d’« horloge », produire une **courbe d’Allan deviation** (overlapping), des statistiques de phase, et estimer des **sensibilités relatives** pour cadrer des protocoles expérimentaux.

> Le dépôt implémente un estimateur **Allan overlapping** (moyennes glissantes), **pas** la quantité naïve `sqrt(0.5*mean(diff(y)²))` qui ne correspond pas à \(\sigma_y(\tau)\).

## Installation

```bash
python -m venv venv
# Windows PowerShell :
venv\Scripts\activate
# Linux / macOS :
source venv/bin/activate

pip install -r requirements.txt
# Optionnel (figures) :
pip install matplotlib scipy
```

## Exécution

Depuis la racine `egor-time-sim/` :

```bash
python simulate_time_noise.py --config config.example.json
python simulate_time_noise.py --config config.example.json --out results/last_result.json
```

## Orchestration Node (optionnel)

Prérequis : Node.js installé.

```bash
node node_pipeline/analyze.js config.example.json
```

Le script écrit `results/last_result.json` et affiche un résumé JSON sur stdout.

## Fichiers de configuration

- `config.example.json` — format **brief** (`nu` en Hz, alias interne de `nu_hz`).
- `config.extended.example.json` — grille Allan (`allan_*`) personnalisable.

## Résultats

- `results/last_result.json` — courbe \(\sigma_y(\tau)\), stats, copie de la config utilisée.

## Documents associés

- [BRIEF-FLOU-TEMPOREL-COMPLET.md](./BRIEF-FLOU-TEMPOREL-COMPLET.md) — brief technique (~2 pages).
- [PROTOCOLE-PILOTE-A-SOUMISSION.md](./PROTOCOLE-PILOTE-A-SOUMISSION.md) — pilote A, budget, données.
- [CHECKLIST-SOUMISSION.md](./CHECKLIST-SOUMISSION.md) — liste de contrôle dépôt / appel à projets.

## Archive

À la racine du workspace parent : `Compress-Archive` ou équivalent pour produire `egor-time-sim.zip` (exclure `venv/`, gros `results/*.json`).
