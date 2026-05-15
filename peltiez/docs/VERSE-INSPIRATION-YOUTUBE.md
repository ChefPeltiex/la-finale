# Verse — Inspiration YouTube (référence utilisateur)

**Lien :** [https://www.youtube.com/watch?v=pSXgXAqomMY](https://www.youtube.com/watch?v=pSXgXAqomMY)  
**ID :** `pSXgXAqomMY`  
**Date de capture :** mai 2026

---

## Ce que la vidéo est réellement

| Champ | Valeur |
|-------|--------|
| **Titre** | *963Hz + 639Hz + 396Hz Open Up to the Universe \| Heart Chakra & Let Go \| Healing Meditation Music* |
| **Chaîne** | Inner Lotus Music (Pierre Ynad) |
| **Durée** | ~1 h 11 min |
| **Vues** | ~10,4 M (au moment de la capture) |
| **Type** | Musique de méditation / fréquences solfège — **pas** un gameplay « vol dans les anneaux » ni une bande-annonce Seigneur des Anneaux |

### Thèmes publics (description chaîne)

- **Ouverture à l’univers** : sentiment d’interconnexion, retour à l’unité, « Oneness ».
- **963 Hz** : symbolique tiers œil / glande pinéale (discours bien-être, non preuve médicale).
- **639 Hz** : symbolique chakra du cœur, appartenance, compassion.
- **396 Hz** : symbolique lâcher-prise, peur, croyances limitantes.
- **Ambiance** : calme, immersion longue durée, écoute passive (casque ou espace ouvert).

### Transcript

Aucune transcription auto publique exploitable n’a été récupérée via fetch ; le contenu principal est **musical** (pas de voix-off narrative structurante). L’inspiration produit vient donc de l’**intention** et du **mood**, pas d’un storyboard UX.

### Note « verse des anneaux »

Le lien utilisateur évoque les **anneaux du Verse Egor69** (portails tore dans `realms.js`), pas cette vidéo YouTube. La référence reste utile pour l’**ambiance cosmique contemplative** et le vocabulaire « univers / cœur / lâcher prise », aligné avec les `ritualHint` déjà présents sur les salles.

---

## Emprunter (mood & UX — sans copier l’œuvre)

| Idée | Application Egor69 Verse |
|------|---------------------------|
| **Immersion lente** | Vitesses de marche modérées, brume profonde, étoiles denses (`COSMIC_NAV_V2`) — voyage, pas course. |
| **Échelle cosmique** | Ciel étoilé, anneau au sol indigo, portails tore lumineux comme « seuils » vers le site 2D. |
| **Interconnexion** | HUD progression `X / REALM_COUNT`, constellation future (P1), liens `connections` dans le lore. |
| **Rituel / respiration** | Afficher `ritualHint` à l’approche d’un portail (déjà en données ; renforcer en UI P1). |
| **Palette** | Indigo / violet / or doux (nuit, particules lavande) — pas le vert capsule GTA d’origine. |
| **Caméra** | Third-person stable, pointer lock, avance vers l’horizon — sentiment de dérive, pas rail shooter. |

---

## Ne pas copier (droits & promesses)

| Risque | Action |
|--------|--------|
| **Audio Inner Lotus** | Ne pas intégrer la piste, extraits, ni samples identifiables. Copyright ⓒ 2020 Inner Lotus Music — réutilisation interdite par la chaîne. |
| **Marque / visuels chaîne** | Pas de logo, miniature, ni art YouTube repris. |
| **Claims santé solfège** | Ne pas promettre guérison, activation pinéale, etc. sur le Verse — garder les disclaimers produit (`pledge`, charte). |
| **Seigneur des Anneaux / MGM** | Si une autre référence « anneaux » est visée : pas de noms, musiques, anneaux unique, Mordor, etc. Les **tores** du Verse sont une métaphore de navigation interne. |
| **Gameplay vidéo inexistant** | Ne pas promettre « traverser des anneaux à la Sonic » sur la base de cette URL — la vidéo ne le montre pas. |

---

## Cinq recommandations concrètes pour le Verse Egor69

1. **Renommer mentalement le parcours** : « Anneaux du Verse » = portails tore + anneau au sol (`WorldScene`) ; copy HUD déjà amorcée dans `WorldHub` — garder ce vocabulaire utilisateur.
2. **Mode contemplation (P1)** : réduire sprint par défaut ou toggle « dérive » (vitesse ×0,85, caméra plus fluide) quand l’utilisateur ne sprint pas — aligné méditation longue.
3. **Fil conducteur cœur / seuil (P1)** : bannière « Prochain anneau » = realm non visité le plus proche + une ligne de `ritualHint` (respiration, intention).
4. **Traversée symbolique (P2)** : animation courte en entrant dans le tore (scale + fade), sans mini-jeu de précision — l’anneau est un **portail narratif**, pas un checkpoint arcade.
5. **Son ambiant original (P2)** : boucle procédurale ou asset libre de droits — jamais la composition « Open up to the Universe ».

---

## Fichiers code liés

- `docs/VERSE-COSMIC-NAV-DESIGN.md` — phases P0–P4 + tâches P1/P2 mises à jour
- `src/world/WorldScene.jsx` — fog, étoiles, anneau sol
- `src/world/realms.js` — géométrie en anneau, couleurs par salle
- `src/pages/WorldHub.jsx` — HUD « Anneaux du Verse »
- `src/config/cosmicNav.js` — vitesses cosmiques

*Document de référence produit — ne remplace pas une revue juridique pour tout asset audio tiers.*
