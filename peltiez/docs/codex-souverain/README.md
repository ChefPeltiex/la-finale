# Codex Souverain d’Igor — dossier auteur

| Fichier | Usage |
|--------|--------|
| **`CODEX-SOUVERAIN-COMPLET.md`** | **Édition fusionnée** : **Partie I** = texte intégral `import-…md` (DOCX) ; **Partie II** = édition harmonisée plateforme (II–VIII). Export PDF ; personnaliser le Canal du Chaos Pur (V.1) si besoin. |
| **`CODEX-SOUVERAIN-COMPLET.pre-merge-backup.md`** | Squelette **sans** le manuscrit DOCX — éditer ce fichier pour changer la Partie II, puis régénérer : `node docs/codex-souverain/_merge-codex.mjs`. |
| **`PROMPT-CLAUDE-PDF.md`** | Prompt à coller dans Claude pour **régénérer** ou **allonger** le Codex + consignes post-génération. |
| **`STRUCTURE-FINALE.md`** | Table des matières I–VIII et listes des versions (référence rapide). |
| **`CODEX-MAITRE.md`** | Index + bloc `[COLLE ICI]` pour le **Canal du Chaos Pur** avant envoi au scribe. |
| **`INSTRUCTIONS-SCRIBE.md`** | Rôle du scribe et modèles de commandes complémentaires. |
| **`Egor69-La-Vraie-Cle-des-Secrets-des-Portes-de-lUnivers.pdf`** | Copie du PDF *La Vraie Clé… (1)* depuis Téléchargements (~501 Ko). |
| **`import-Egor69-La-Vraie-Cle-des-Secrets-des-Portes-de-lUnivers.md`** | Import depuis le `.docx` *La Vraie Clé…* — relire titres / listes ; le texte est **aussi** intégré en Partie I du complet fusionné. |
| **`_merge-codex.mjs`** | Régénère `CODEX-SOUVERAIN-COMPLET.md` = `pre-merge-backup` + `import-…md` (UTF-8). |

**Workflow** : manuscrit DOCX → mettre à jour `import-…md` → `node docs/codex-souverain/_merge-codex.mjs`. Partie II (harmonisée) → éditer **`CODEX-SOUVERAIN-COMPLET.pre-merge-backup.md`** puis la même commande. Export PDF depuis le **complet** fusionné. Pour **régénérer** ou **allonger** avec un LLM : `PROMPT-CLAUDE-PDF.md` + copie du complet.

Le **manuel utilisateur** (`src/content/manuel-utilisation-igor.md`) reste le guide **interface** ; le Codex est la **doctrine** et la **littérature souveraine**.
