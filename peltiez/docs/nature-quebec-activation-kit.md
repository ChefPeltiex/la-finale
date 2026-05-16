# Kit d’activation — Grand Portail Naturel du Québec

Document **créateur** : prompts, narration courte et **fiches de design** (fiction). Aucun asset image n’est fourni ici : les prompts servent à une **génération d’images externe** (outil tiers de ton choix).

---

## Avertissements

- **Chaman / états modifiés / plantes** : tout contenu « chaman » ci-dessous est **illustration symbolique — pas conseil médical**, ni invitation à consommer des substances.
- **Interaction / voix in-game** : les scènes type « Portail Mycélium » sont étiquetées **fiction / fiche de design** — non implémentées comme quête 3D dans l’app, sauf évolution ultérieure du Verse.

---

## Mini-script d’introduction (narration hub)

> Tu passes le seuil boréal : neuf portails t’orientent vers des hubs CirculAI — sous-bois, lisières, socle minéral, jarres de mémoire, bricolage doux, « alchimie » de cuisine, atlas des récits et signes partagés. Ici, on nomme les **garde-fous** avant les **effets spéciaux** : la carte prime sur la promesse. En bas du portail, le **Kit créateur** donne des prompts prêts à coller pour imagerie **externe** et une micro-scène **fiction** autour du réseau filamenteux.

---

## Prompts d’images (4) — **génération externe** (non packagées)

Copier-coller dans ton outil de génération (Midjourney, SD, Firefly, etc.). **Aucune image n’est incluse dans le dépôt.**

### 1 — Portail mycélium boréal

> Illustration symbolique, pas documentaire strict : forêt québécoise à l’aube, brume basse, tronc d’épinette fissuré, **réseau filamenteux** lumineux en surimpression graphique (lignes fines type schéma), palette vert lichen / bleu glacier, grain cinéma doux, aucun texte dans l’image, pas de champignons identifiables comme comestibles.

### 2 — Lisière entomologique

> Macro poétique d’ailes et de pollens en suspension au soleil couchant, **Québec été**, profondeur de champ courte, couleurs ambrées et vert mousse, ambiance atlas naturaliste **sans** étiquettes d’espèces ni promesse « bienfaits ».

### 3 — Socle du bouclier

> Roche métamorphique et quartz laiteux, lumière rasante, carte géologique **fantôme** en filigrane, tons gris-vert et ocre, style illustration de musée régional, **pas** de cristaux « énergétiques » mis en scène comme objets magiques.

### 4 — Jarre et cheminée (patrimoine oral)

> Intérieur québécois stylisé, chaleur de cheminée, main qui verse une infusion dans une tasse **sans** nom de plante lisible, livres fermés, lumière douce, ton **mémoire collective** — **non** publicité de remède.

---

## Exemple d’interaction — **Portail Mycélium** (fiction / design spec)

**Contexte** : zone hub « sous-bois » reliée au domaine **Mycologie boréale** (métaphore de réseau, pas guide de cueillette).

| Étape | Joueur / système | Retour narratif (VO possible) |
|--------|------------------|--------------------------------|
| 1 — Approche | Le joueur s’arrête près d’un nœud de filaments (shader + particules légères) | *« Le réseau hume sans te posséder. Écoute la différence entre résonance et réponse. »* |
| 2 — Choix | Deux pictogrammes : **Cartographier** / **Écouter** | Aucun loot « réel » : uniquement jeton narratif « **écho sporé** » (cosmétique ou entrée de journal). |
| 3 — Clôture | Timer court ou sortie de zone | Message : *« Les filaments se retirent dans le bois — la carte reste tiède entre tes mains. »* |

**Implémentation** : spec seulement ; pas de pipeline quête 3D dans ce dépôt.

---

## Exemple d’arbre de compétences « Chaman de fiction » (symbolique)

> **Illustration symbolique — pas conseil médical.** Arbre de progression **narratif** pour personnage ou atelier d’écriture — **pas** un parcours thérapeutique.

- **Racines** — *Écouter le silence du sol* (passif : + texte d’ambiance)
- **Voix du tambour** — *Marquer le tempo sans imposer le sens* (débloque répliques de groupe)
- **Mémoire du feu** — *Récit du foyer, jamais ordonnance* (débloque entrées « patrimoine oral » liées au hub Heritage)
- **Pont** — *Traversée symbolique* (cosmétique de halo / pas de mécanique « soin »)

---

## Zone carte — **Jardin des Âmes**

Zone **narrative** suggérée sur une future couche carte du Verse : lisière humide entre **forêt boréale** et **marais marginal**, bancs de mousse, sentier discontinu, aucune tombe nominative (respect du vécu). Liée thématiquement au domaine **Plantes / flore** pour les fiches botaniques et l’imaginaire des noms populaires.

**Lien hub existant** : [Hub Flore — `/flora-hub`](/flora-hub) (navigation CirculAI).

---

## Réutilisation

- Portail principal : **`/portail/nature-quebec`**
- Ce kit (rendu Markdown) : **`/docs/nature-quebec-kit`**
