# HORAÏSME

> « Ta vie. Ton terrain de jeu. »
> « L'IA propose. Le réel décide. »
> « Tu connais ta ville. Mais tu ne l'as jamais jouée. »

Application web qui met en pratique la philosophie de l'Horaïsme : transformer
l'environnement quotidien en terrain d'exploration, d'action et d'apprentissage,
sans jamais confirmer automatiquement la première interprétation de
l'utilisateur ni fabriquer le besoin de rester devant l'écran.

Cette version est une **vertical slice** : une seule opération, « L'angle mort »,
jouable entièrement, avec toute l'architecture derrière.

---

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 40 tests : moteur, philosophie, rendu
npm run build      # typecheck complet + bundle de production
```

Google Maps est facultatif. Copier `.env.example` vers `.env` et renseigner
`VITE_GOOGLE_MAPS_API_KEY` active la carte du Terrain ; sans clé, l'application
bascule sur un relevé dessiné et rien d'essentiel n'est perdu.

---

## Ce qui est RÉEL

Fonctionne vraiment, maintenant, sans dépendance externe.

| Élément | Détail |
| --- | --- |
| **« L'angle mort » de bout en bout** | Fragment → Inventaire → Sortie (mode poche) → Constat → Ancrage → clôture. Les cinq étapes sont jouables. |
| **Les quatre statuts de provenance** | `fait` / `plausible` / `simulé` / `inconnu`. Chaque `Datum<T>` porte sa source, sa justification et son statut. Un datum `inconnu` n'affiche jamais de valeur de remplacement. |
| **Heure locale, saison** | Lues sur l'appareil. Statut `fait`. |
| **Position géographique** | Géolocalisation réelle du navigateur si l'utilisateur l'autorise (statut `fait`). Sinon repli Vieux-Québec, marqué `simulé`. |
| **Lumière restante** | Vrai calcul astronomique du coucher du soleil (`coucherDuSoleil`), classé `plausible` parce qu'il ignore le relief et les bâtiments. |
| **Distance et rayon** | Haversine réel. Une opération hors du rayon déclaré est écartée, avec le motif affiché. |
| **« Pourquoi cette opération ? »** | Liste réellement les données qui ont pesé sur la proposition, chacune avec son statut. Ce n'est pas un texte figé. |
| **Inventaire** | Le passage à l'étape suivante est bloqué tant qu'une seule lecture est sur la table. Aucune hypothèse n'est mise en avant. « Retenir » ne change jamais le statut d'une hypothèse. |
| **Bifurcations** | Quatre issues de même poids visuel, dont l'échec sincère. La suite, le XP et le dévoilement du lieu changent selon l'issue réelle. |
| **XP vécu** | Attribué uniquement contre une preuve rattachée (observation écrite + déclaration de sortie). Une attribution sans preuve est rejetée par le moteur, pas seulement masquée par l'UI. |
| **Registre** | Conserve le statut initial de chaque supposition et le verdict du réel. Corrigeable depuis l'opération et depuis `Moi`. Ce que l'utilisateur écrit écrase la supposition de HORA, jamais l'inverse. |
| **Souveraineté** | Couper chaque source contextuelle, autoriser/révoquer la position, fixer ou retirer le rayon, corriger une supposition, écarter une opération sans pénalité, la remettre en jeu, effacer le Registre, tout effacer. |
| **Garde-fous en code** | `verifierTexte` scanne tout contenu adressé au joueur (prédiction, lecture de pensée, oracle, thérapie, autorité morale, rétention). Une opération qui viole un garde-fou ne se charge pas dans le catalogue. |
| **Persistance** | `localStorage` uniquement, clés versionnées. Rien ne part vers un serveur. Un effacement navigateur efface tout. |
| **Mode poche** | Réduit l'écran à un glyphe respirant pendant la sortie. Rien à consulter tant que l'utilisateur n'est pas revenu. |

## Ce qui est SIMULÉ

Présent à l'écran, mais adossé à du contenu de démonstration. **Tout ce qui suit
est marqué `simulé` dans l'interface**, jamais présenté comme un fait.

| Élément | Pourquoi |
| --- | --- |
| **Le fragment et le reveal de « L'angle mort »** | Images générées, situées au Vieux-Québec. Dans une version reliée à Street View, le fragment serait extrait du voisinage réel de l'utilisateur. La supposition « Le fragment provient du Vieux-Québec » est explicitement `simulé` dans le Registre. |
| **La position de repli** | Vieux-Québec, utilisée uniquement sans autorisation de géolocalisation. Marquée `simulé`, et tout ce qui en découle hérite du statut. |
| **Le nom de zone quand la position est réelle** | Classé `plausible` : les coordonnées sont vraies, mais aucun service de géocodage inverse n'est branché pour nommer le quartier. |
| **Le relevé dessiné du Terrain** | Sans clé Google Maps, le Terrain affiche des cercles concentriques en SVG. Il assume de ne pas être une carte plutôt que d'en imiter une. |

## Ce qui est INCONNU (et le dit)

| Élément | Comportement |
| --- | --- |
| **Météo, température** | Aucun service branché. HORA répond « je ne sais pas ». Aucune estimation n'est fabriquée pour combler le vide. |
| **Budget** | Non déclaré. Aucune opération payante n'est proposée. |

## Ce qui est PRÉPARÉ pour plus tard

Structuré dans le code, volontairement non rempli.

| Élément | État |
| --- | --- |
| **Maître de jeu génératif (LLM)** | L'interface `Compositeur` est en place et le compositeur actuel est déterministe (`genere: false`). Un compositeur génératif implémentera la même interface, et ses sorties passeront obligatoirement par `accepterPropositionExterne()` avant d'atteindre l'écran. Les garde-fous restent dans le code et les tests, pas dans un prompt. |
| **Familles d'opérations** | Les quatre familles existent comme structure. Une seule opération est écrite. La page Missions le dit à l'utilisateur au lieu d'afficher des cartes verrouillées. |
| **Street View** | Chargement optionnel déjà branché (`CarteTerrain`), non utilisé pour extraire des fragments. |
| **Boss, Parcours longs, transmission** | Vocabulaire et types posés, contenu non écrit. |
| **Économie, social, campagnes** | Volontairement absents de cette version. |

---

## Architecture

Le moteur est séparé en modules étanches pour que le futur maître de jeu
génératif ne puisse jamais contourner les règles fondamentales.

```
src/engine/
  types.ts        Datum<T>, Operation, Etape, Hypothese, Bifurcation, MemoireJoueur, EtatOperation
  provenance/     Les quatre statuts, leurs libellés, leurs couleurs, estAffichable()
  safety/         Garde-fous : verifierTexte, verifierOperation, accepterPropositionExterne
  context/        Données contextuelles : sources, heure, lumière, saison, position, distance
  composition/    Interface Compositeur + compositeur déterministe (« pourquoi cette opération »)
  operation/      État d'une opération en cours (reducer pur) + règles d'avancement
  evidence/       Preuves rattachées à une action réelle
  memory/         Mémoire du joueur : Registre, ancrages, lieux révélés, refus, effacement
  progression/    Attribution des XP (refusée sans preuve) et paliers de niveau
```

Rien de tout cela n'importe React. L'affichage est en aval et ne peut pas
court-circuiter le moteur.

```
src/
  content/        HORA (paroles), philosophie, catalogue d'opérations
  state/          FournisseurJeu (contexte React unique) + localStorage
  components/     ui, shell, operation (5 étapes), map
  routes/         Seuil, Aujourdhui, Terrain, Missions, Parcours, Decouvrir, Moi, OperationEnCours
  tests/          moteur, philosophie, rendu
```

### Navigation

`Aujourd'hui · Terrain · Missions · Parcours · Découvrir · Moi`

**Découvrir est un atlas, pas un feed.** Il contient la philosophie, les
principes, les garde-fous, les familles d'opérations, les lieux révélés et les
règles du système. Aucun défilement infini, aucune tendance, aucun classement,
aucune recommandation. La page se termine explicitement.

### La contrainte de rétention

L'application a le droit d'être belle et de mériter du temps d'attention : le
Journal, le Registre et le Terrain contiennent la mémoire réelle de la personne.
Ce qui est interdit, c'est de **fabriquer** le besoin d'y rester. Il n'existe
donc dans le modèle de données ni like, ni classement, ni série, ni notification
de rappel, ni compteur de temps passé — et un test échoue si l'un d'eux
réapparaît.

---

## Tests

`npm test` — 40 tests, trois niveaux.

- **`moteur.test.ts`** — contexte, provenance, composition, registre, progression.
- **`philosophie.test.ts`** — les principes canoniques traduits en assertions :
  le test des dix secondes est obligatoire ; une conclusion doit survivre à
  l'inventaire ; une hypothèse reste une hypothèse ; les XP exigent une preuve ;
  l'échec sincère est récompensé ; la technologie s'efface ; refuser ou
  abandonner ne coûte rien ; HORA a le droit de dire qu'il ne sait pas ; aucune
  parole d'oracle, de devin ou de thérapeute dans le corpus.
- **`rendu.test.tsx`** — monte l'application dans un DOM complet et joue
  « L'angle mort » de bout en bout, dans la branche réussie et dans la branche
  de l'échec sincère.

---

## Vérification visuelle

| Script | Rôle |
| --- | --- |
| `npm run captures` | Capture les huit routes en desktop (1440×900) et mobile (390×844), et signale débordement horizontal, erreurs console et requêtes échouées. |
| `npm run captures:operation` | Joue « L'angle mort » de bout en bout dans un vrai navigateur et capture les cinq étapes, le mode poche, la clôture, puis Parcours / Terrain / Moi après coup. |
| `npm run audit:cibles` | Liste les cibles tactiles sous 44 px sur chaque route en viewport mobile. |
| `scripts/optimiser-images.ps1` | Recompresse `src/assets` (1400 px max, qualité 82). |
| `scripts/decouper-oeil.ps1` | Retaille `hora-oeil.jpg`, le médaillon découpé dans l'œuvre. Paramètres `-Cx -Cy -Cote -Sortie`. |

Les trois premiers pilotent l'Edge déjà installé via CDP — aucun navigateur
n'est téléchargé. Les images atterrissent dans `.captures/`, non versionné.

`VERIFICATION.md` décrit la passe de validation manuelle, ordinateur et
téléphone compris.

Une cible reste sous 44 px : le mot « Moi » cité dans une phrase d'Aujourd'hui.
C'est un lien en ligne dans du texte courant, pas un contrôle autonome ; l'agrandir
casserait l'interlignage du paragraphe.
