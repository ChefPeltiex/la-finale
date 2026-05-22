# Processus de release (semver + GitHub)

## 1. Préparer le CHANGELOG

Sous [`CHANGELOG.md`](../CHANGELOG.md) :

- Déplacer le contenu pertinent de **`[Unreleased]`** vers une nouvelle section **`[X.Y.Z] - YYYY-MM-DD`**.
- Laisser **`[Unreleased]`** vide (ou avec des sous-sections vides) pour la suite.

## 2. Commit des changements de version

```bash
git add CHANGELOG.md <autres fichiers>
git commit -m "chore: release vX.Y.Z"
```

## 3. Tag annoté

```bash
git tag -a vX.Y.Z -m "vX.Y.Z"
```

Exemple pour l’alignement actuel du journal : **`v0.0.0`**.

## 4. Pousser le commit et le tag

```bash
git push origin master
git push origin vX.Y.Z
```

(Remplace `master` par `main` si c’est ta branche par défaut.)

## 5. GitHub Release

Le workflow [`.github/workflows/release.yml`](workflows/release.yml) crée une **GitHub Release** pour le tag poussé, avec **release notes générées** à partir des commits (complément du texte du CHANGELOG, que tu peux copier-coller manuellement dans la release si tu préfères un corps 100 % maître).

## 6. Release initiale manuelle (optionnel)

Si tu veux une première release **sans** attendre le workflow, ou pour corriger le texte : **Releases → Draft a new release** → choisir le tag `v0.0.0` → coller la section CHANGELOG → publier.

---

Copyright © 2026 CirculAI Québec Inc.
