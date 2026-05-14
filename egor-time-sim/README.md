# egor-time-sim

Prototype de **simulation** pour le brief « flou temporel » (modèles d’effondrement objectif, **DP / CSL** — toy) : bruit de fréquence fractionnaire, **Allan deviation overlapping**, pipeline Node.

## Arborescence

```
egor-time-sim/
├── simulate_time_noise.py
├── run_batch.py
├── analyze.py
├── config.example.json          # format brief (clé "nu" acceptée)
├── config.extended.example.json # grille Allan personnalisée
├── node_pipeline/analyze.js
├── notebooks/README.md          # instructions Jupyter
├── docs/
│   ├── README.md
│   ├── BRIEF-FLOU-TEMPOREL-COMPLET.md
│   └── PROTOCOLE-PILOTE-A-SOUMISSION.md
├── results/
└── requirements.txt
```

## Démarrage rapide

Voir **[docs/README.md](docs/README.md)** (installation `venv`, commandes, ZIP).

## Documents

- **[docs/BRIEF-FLOU-TEMPOREL-COMPLET.md](docs/BRIEF-FLOU-TEMPOREL-COMPLET.md)** — brief technique intégral.  
- **[docs/PROTOCOLE-PILOTE-A-SOUMISSION.md](docs/PROTOCOLE-PILOTE-A-SOUMISSION.md)** — protocole pilote A + budget.

## Note technique

Le simulateur n’utilise **pas** `np.diff(y)` comme Allan : l’estimateur **overlapping two-sample** sur moyennes glissantes est implémenté dans `simulate_time_noise.py`.
