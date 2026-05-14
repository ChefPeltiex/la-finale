# Manuel d’utilisation — plateforme Egor69 (Peltiez)

*Bienvenue.* Ce guide résume **l’interface**, le **gameplay du Verse 3D**, l’**économie locale en points d’expérience**, et les **bonnes habitudes** pour avancer sans vous perdre.

---

![Vue synthétique : menu latéral, zones principales et retour au Verse](/manual/igor-vue-ensemble.png)

## 1. Premiers pas : où cliquer ?

Après avoir lancé l’application (`npm run dev` côté développeur ; en production : l’URL de votre site) :

| Étape | Action |
|--------|--------|
| 1 | Ouvrir la **page d’accueil** depuis la barre latérale (**Accueil**). |
| 2 | Parcourir le **menu** : Accueil, Verse 3D, Marketplace, Profil, Mon univers, Atlas, Pricing, Panthéon, etc. |
| 3 | Sur mobile ou petit écran, utiliser le **bouton menu** pour afficher ou masquer la navigation. |

### Démarrage en 30 secondes (chemin conseillé)

1. Ouvrir **Verse 3D** (`/world`) et franchir un **premier portail**.  
2. Passer par **Mon univers** (`/mon-univers`) pour régler la navigation et votre style de jeu.  
3. Ouvrir le **Manuel** (`/manuel`) si vous voulez les raccourcis et le dépannage.  
4. (Créateurs) Ouvrir **UEAIOUY** (`/ue-aiouy`) pour enregistrer des modèles glTF/GLB et tester la prévisualisation.  

> **Bon à savoir** : certains menus peuvent être **filtrés** selon vos réglages dans **Mon univers** (mode navigation minimal, par exemple).

---

![Contrôles du Verse spatial : mouvements, saut, sprint, entrée dans un portail](/manual/igor-verse-controles.png)

## 2. Verse spatial (open world WebGL)

Le **Verse** est le monde **3D** accessible depuis la route **`/world`** (entrée souvent étiquetée « Verse 3D » dans le menu).

### 2.1 Ce que vous pouvez faire

- **Explorer** un terrain continu avec reliefs.
- **Vous déplacer** librement vers des **portails** (anneaux lumineux) reliés à d’autres sections du site.
- **Suivre votre progression** : nombre de **salles / royaumes** visités au moins une fois.

### 2.2 Contrôles (clavier + souris)

| Touche / action | Effet |
|-----------------|--------|
| **Clic** sur le canvas | Capture la souris pour regarder autour (vue à la troisième personne). |
| **W A S D** | Avancer, gauche, reculer, droite. |
| **Shift** | Sprint (course plus rapide). |
| **Espace** | Saut ; **maintenir** en l’air pour une chute ralentie (glisse). |
| **E** ou **Entrée** | Lorsque vous êtes **proche d’un portail** : entrer dans la page liée. |
| Lien **« Interface 2D »** | Quitter le plein écran 3D et revenir au site classique. |

### 2.3 Portails et narration

Lorsque vous approchez d’un portail, un **panneau** en bas de l’écran s’anime : titre du lieu, texte d’ambiance, et rappel des touches **E** / **Entrée**. C’est votre **fil conducteur** entre exploration 3D et contenus **2D** (marketplace, encyclopédie, etc.).

### 2.4 Sauvegarde de la position

- Votre **position** dans le monde est enregistrée **pendant la session** (sessionStorage) : si vous fermez l’onglet ou le navigateur, vous repartez du point de départ par défaut.
- Les **visites de royaumes** (progression) sont mémorisées **plus longtemps** (localStorage) — voir section XP.

---

![De l’exploration aux points d’expérience : boucle de gameplay simple](/manual/igor-gameplay-boucle.png)

## 3. Gameplay : boucle simple

**Schéma** (voir aussi l’image *De l’exploration aux points d’expérience*) : **Menu 2D** → **Verse 3D** → **Portail** → **Page thématique** → retour au menu ; pendant l’exploration, une **première visite** de royaume peut créditer des **XP**.

1. **Choisir** une destination dans le menu **ou** vous promener dans le Verse.  
2. **Franchir** un portail pour découvrir une section du site.  
3. **Revenir** au Verse ou à l’accueil quand vous voulez changer d’ambiance.  
4. **Collecter** des **points d’expérience (XP)** en visitant un royaume pour la **première fois** (voir § 4).

---

## 4. Points d’expérience (XP) et Mon univers

![XP local : solde, dépenses cosmétiques, estimation pédagogique](/manual/igor-economie-xp.png)

### 4.1 Nature des XP

- Les XP sont stockés **dans votre navigateur** (localStorage).  
- Ce ne sont **pas** des crypto-actifs, **pas** un dépôt bancaire, **pas** une promesse de gain financier.  
- Ils servent à la **progression ludique** et aux **déblocages** prévus dans l’interface (ex. éléments d’Univers).

### 4.2 Comment gagner des XP ?

Un exemple codé dans la plateforme : à la **première visite** d’un nouveau royaume via un portail du Verse, le jeu peut créditer **+35 XP** (une fois par royaume).

### 4.3 Dépenser des XP

Dans **Mon univers** vous pouvez, selon les options proposées :

- Débloquer **accessoires** ou **costumes** avec un **coût en XP**.
- Ajuster votre **style de jeu** (explorateur, bâtisseur, etc.).
- Définir le **réglage d’échelle** du texte, le **mode de navigation**, et d’autres préférences ergonomiques.

Le **journal** des mouvements de XP permet de voir les dernières opérations (gain ou dépense).

### 4.4 Indication « valeur » marchande affichée

Une **conversion approximative** vers une monnaie réelle peut être affichée **à titre pédagogique** : vous réglez vous-même un **taux** (exemple : combien de XP représentent une unité de monnaie). Le système applique ensuite un coefficient d’affichage — vérifiez toujours les **prix réels** sur **Pricing / Stripe**.

---

## 5. Panthéon 3D, Atlas, encyclopédie

| Zone | Rôle court |
|------|-------------|
| **Panthéon (3D)** | Galerie ou scène 3D autour du panthéon narratif Egor69. |
| **Atlas** | Contenu encyclopédique / cartographique élargi. |
| **Encyclopédie biblique** | Parcours thématiques, cartes, graphes, scènes 3D liées aux entrées. |

Utilisez-les comme des **chambres** du même bâtiment : le Verse sert de **hall** ; ces pages sont des **salles** spécialisées.

---

## 6. UEAIOUY — ponts Unreal / Quixel (créateurs)

La page **`/ue-aiouy`** (menu **UEAIOUY — ponts UE**) sert aux **créateurs** :

- Enregistrer des **URL** de fichiers **glTF / GLB** hébergés avec **CORS** correct.  
- **Prévisualiser** un modèle web.  
- Optionnel : lier une **iframe Pixel Streaming** si vous avez déployé l’infrastructure Epic (variable d’environnement côté build).

Aucun **éditeur Unreal** ne tourne dans le navigateur en standard : c’est un **pont documenté** vers vos exports.

---

## 7. Paiements et passes (Stripe)

- La page **Pricing** présente les **passes** et abonnements selon la configuration du projet.  
- Les paiements passent par **Stripe** (serveur / clés — ne jamais coller de **clé secrète** dans le front).  
- Certaines offres peuvent afficher une **clause** à accepter dans l’interface : lisez le texte avant de valider.

---

## 8. Dépannage rapide

| Problème | Piste |
|----------|--------|
| **npm run dev** introuvable | Vous devez être dans le dossier du projet qui contient **`package.json`** (ex. `.../peltiez`). |
| Verse **ne capte pas** la souris | Cliquez une fois sur la **zone 3D**. |
| **Portail** ne réagit pas | Approchez-vous davantage ; le panneau du bas doit **briller** (proximité). |
| **XP** à zéro après changement de navigateur | Les données sont **locales** par navigateur et par appareil : pas de synchronisation automatique entre machines. |
| Erreurs **WebSocket** en dev | Le rechargement manuel de la page suffit souvent ; voir la doc Vite (HMR). |

---

## 9. Rappel d’éthique et de sécurité

- Ne partagez **jamais** vos mots de passe ni **clés API** dans le chat ou les formulaires publics.  
- La plateforme encourage des pratiques **défensives** (sécurité, modération) : signalez les abus par les canaux prévus plutôt qu’en « ripostant » vous-même.  
- Les textes **légaux** (mentions, singularité, etc.) sont accessibles depuis les pages dédiées : lisez-les pour comprendre les limites du service.

---

## 10. Codex Souverain d’Igor (narration & doctrine)

Le **manuel** ci-dessus décrit l’**usage** de l’interface. Le **Codex Souverain** vit dans le dépôt sous **`docs/codex-souverain/`** :

- **`CODEX-SOUVERAIN-COMPLET.md`** — édition **fusionnée** (Partie I = manuscrit DOCX ; Partie II = harmonisé plateforme II–VIII, export PDF)  
- **`CODEX-SOUVERAIN-COMPLET.pre-merge-backup.md`** + **`_merge-codex.mjs`** — source de la Partie II et script `node docs/codex-souverain/_merge-codex.mjs` pour régénérer le complet après mise à jour du DOCX ou du squelette  
- **`PROMPT-CLAUDE-PDF.md`** — prompt pour régénérer / allonger avec un LLM  
- **`STRUCTURE-FINALE.md`** — table des matières officielle (I–VIII)  
- **`CODEX-MAITRE.md`** — index + emplacement pour coller le texte du **Canal du Chaos Pur**  
- **`INSTRUCTIONS-SCRIBE.md`** — rôle du scribe et commandes complémentaires  
- **`Egor69-La-Vraie-Cle-des-Secrets-des-Portes-de-lUnivers.pdf`** — copie du PDF *La Vraie Clé… (1)* (Téléchargements)  
- **`import-Egor69-La-Vraie-Cle-des-Secrets-des-Portes-de-lUnivers.md`** — import texte depuis le Word *La Vraie Clé…* (intégré en Partie I du complet ; éditable puis fusion)

Ce corpus n’est pas embarqué dans le bundle du site par défaut ; ouvrez ces fichiers depuis votre copie du projet ou votre forge Git.

---

## 11. Outils, intégrations, Unreal & cadre réel

- **Page intégrée** : **`/outils-integration`** — liens vers outils d’IA externes (CGU / empreinte à votre charge), rappel Verse WebGL vs Unreal, sécurité, limites « entreprise ».  
- **Carte & cohérence** : **`/carte-site`** — arborescence des routes utiles, parcours guidés (liens vers pages ou docs), glossaire central, liens vers `docs/BUS-INTEGRATION.md` et `docs/ORCHESTRATION-ROADMAP.md` (vision vs livré).  
- **Docs dépôt** : `docs/unreal-bridge.md` (directives UE), `docs/INTEGRATIONS-SECURITE-ENTREPRISE.md` (référencement interne, pas de pub tiers, périmètre produit).

---

**Fin du manuel** — pour la version technique du dépôt, les contributeurs peuvent aussi consulter `docs/unreal-bridge.md` et les règles sous `.cursor/rules/`.
