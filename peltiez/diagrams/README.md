# Diagrammes d’architecture (CirculAI / infra)

Ce répertoire regroupe les **schémas** et notes visuelles complémentaires à `peltiez/docs/network-ip-plan.md` et aux documents gouvernance SCALE.

## Contenu attendu

- Schémas **landing zone** (abonnements, réseau, identité, journalisation) — voir `landing-zone-notes.md`
- Diagrammes exportés (PNG/SVG) si vous versionnez des exports depuis Miro, draw.io ou équivalent
- Sources Mermaid optionnelles : fichiers `.md` avec blocs ` ```mermaid ` pour régénération dans la doc

## Bonnes pratiques

- Nommer les fichiers par sujet et date (`landing-zone-2026-05.png`) pour la traçabilité présentation / audit
- Ne pas y placer de **secrets** (clés, mots de passe, jetons) : uniquement flux et agrégats CIDR anonymisés ou gabarits
- Aligner les CIDR et zones sur le plan IP documenté ; toute divergence doit être notée explicitement dans le corps du schéma ou dans une PR
