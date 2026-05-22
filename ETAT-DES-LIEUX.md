# État des lieux — `la finale`

## Executive summary

Le dossier `la finale` n’est pas un projet unique proprement unifié : c’est un **noyau applicatif réel** (`peltiez/`) entouré de **satellites de contenu, d’assets et de prototypes**.  
Le point solide, c’est que `peltiez/` ressemble à une vraie base produit avec README, scripts, structure claire, CI au niveau du dépôt racine et une logique de déploiement/documentation déjà poussée.  
Le point faible, c’est l’**accumulation** : beaucoup de docs, de doublons, d’artefacts générés, de copies publiques, et plusieurs couches annexes qui rendent l’ensemble difficile à piloter pour un propriétaire non technique.  
`assets/` est simple et utile, mais purement documentaire/graphique. `circulai-final/` est un mini-dossier de livrables, pas un produit. `egor-time-sim/` est un prototype scientifique isolé, petit mais pollué par des dépendances générées dans `docs/`.  
Le vrai sujet de gouvernance est `peltiez/` : c’est le sous-projet qui porte la valeur, mais aussi le plus gros niveau de dette organisationnelle.  
Le dossier global est donc **prometteur mais patchwork** : il y a de la matière publiable et monétisable, mais elle est mélangée avec du brouillon, du packaging local et des traces d’expérimentation.  
En l’état, je dirais : **une base sérieuse existe**, mais elle est noyée dans trop de couches parallèles.  
La priorité n’est pas de produire plus ; la priorité est de **trier, clarifier, séparer et sécuriser**.

---

## 1) `assets/` — focus `codex-encyclopedie/`

### Identité

`assets/` est un dossier de **matière visuelle brute**. Ici, il contient surtout une série d’images PNG destinées à une encyclopédie / codex visuel CirculAI.  
Ce n’est pas un logiciel : c’est un **stock d’illustrations et de planches éditoriales** prêtes à être utilisées ailleurs.

### État technique

- **Stack** : pas de stack logicielle ; uniquement des fichiers image `.png`.
- **README** : aucun README local détecté dans `assets/`.
- **Manifestes** : pas de `package.json`, pas de `requirements.txt`.
- **Lançable ?** Non, ce n’est pas exécutable.
- **Tests ?** Aucun.
- **`.git/` local ?** Non.

### Maturité

**Utilisable** comme bibliothèque d’assets.  
Pas un produit, pas un prototype applicatif : plutôt une **matière éditoriale prête**.

### Volume / complexité

- Environ **38 fichiers**, dont **37 PNG**.
- Taille totale approximative : **59 Mo**.
- Complexité faible : c’est **gérable**.

### Risques visibles

- Pas de README ni d’index local : on comprend les noms, mais pas le statut exact de chaque image.
- Le sous-dossier `codex-encyclopedie-incoming/` est quasi vide (juste un `.gitkeep`) : cela suggère une zone de dépôt prévue mais pas encore utilisée.
- Risque principal : **manque de gouvernance éditoriale**, pas risque technique.

### Valeur

**À garder clairement.**  
Ces assets ont une valeur directe pour publication, packaging PDF, présentation ou monétisation éditoriale.  
À mon avis : **garder et référencer proprement**, pas archiver.

---

## 2) `circulai-final/`

### Identité

`circulai-final/` ressemble à un **mini-dossier de livrables de synthèse** autour de CirculAI.  
On y trouve des notes finales, une fiche 1 page, des preuves, et un schéma d’infrastructure. C’est plus un **paquet de documents de présentation** qu’un sous-projet logiciel.

### État technique

- **Stack** : Markdown + Mermaid (`infra.mmd`).
- **README** : oui, mais `README.txt` est très mince et ressemble à un simple historique/trace de commits, pas à une vraie doc d’usage.
- **Manifestes** : aucun `package.json`, aucun `requirements.txt`.
- **Lançable ?** Non.
- **Tests ?** Aucun.
- **`.git/` local ?** Non.

### Maturité

**Utilisable** comme dossier de livrables, mais **pas structuré comme un projet**.  
On n’est ni sur un produit ni sur un prototype logiciel : c’est un **bundle documentaire**.

### Volume / complexité

- **5 fichiers** seulement.
- Taille totale : environ **12 Ko**.
- Très simple, très gérable.

### Risques visibles

- Le `README.txt` n’explique pas vraiment le contenu ; il ressemble davantage à une trace de commits.
- Risque de redondance avec `peltiez/docs/`, où l’on retrouve des fichiers très proches (`final-pack.md`, `proofs.md`, `scale-ai-fiche-1-page.md`).
- Risque clair de **dispersion documentaire** : on ne sait pas quelle version est la bonne.

### Valeur

**À garder si c’est un paquet de livraison externe**, sinon à **fusionner dans une seule zone documentaire officielle**.  
Valeur réelle pour présentation ou prospection, mais faible valeur en tant que dossier autonome.

---

## 3) `egor-time-sim/`

### Identité

`egor-time-sim/` est un **prototype de simulation scientifique/technique** autour d’un “bruit temporel” avec analyse Allan deviation.  
Ce n’est pas lié au cœur produit grand public : c’est plutôt un **sandbox expérimental**, petit, spécialisé, et orienté exploration.

### État technique

- **Stack** : Python (`simulate_time_noise.py`, `analyze.py`, `run_batch.py`) + un petit pont Node (`node_pipeline/analyze.js`).
- **README** : oui, à la racine et dans `docs/`, plutôt corrects.
- **Manifestes** : `requirements.txt` minimal (`numpy`, `matplotlib`), plus config JSON d’exemple.
- **Lançable ?** Probablement oui en local côté Python, et ponctuellement côté Node, **si l’environnement est préparé**.
- **Tests ?** Aucun test formel détecté.
- **`.git/` local ?** Non.

### Maturité

**Prototype** clair.  
Le périmètre est compréhensible, la doc existe, mais on n’est pas sur un logiciel durci ni sur un projet prêt à être diffusé largement.

### Volume / complexité

- Volume brut observé : environ **1 215 fichiers / 19,6 Mo**.
- Mais volume utile réel : environ **21 fichiers / 0,1 Mo** seulement.
- Conclusion : la complexité réelle est faible, mais elle est **artificiellement gonflée** par des dépendances générées dans `docs/node_modules/`.

### Risques visibles

- Très gros signal de désordre : présence de **`docs/node_modules/`** dans ce sous-projet documentaire/scientifique.
- Cela donne une impression de projet plus lourd qu’il ne l’est vraiment.
- Pas de tests.
- `results/` est presque vide, donc peu de preuves d’usage ou d’historique.
- Risque principal : **prototype propre dans l’idée, mais mal rangé**.

### Valeur

**À garder comme prototype de recherche**, mais pas comme pilier produit.  
Si ce sujet n’a plus de trajectoire active, il mérite probablement un statut **“archive active”** ou **“R&D isolée”**.  
Valeur intellectuelle oui ; valeur commerciale directe faible à court terme.

---

## 4) `peltiez/`

### Identité

`peltiez/` est clairement le **cœur du dossier**. C’est la plateforme principale, avec interface web, serveur Node, documentation riche, scripts de génération et logique de déploiement.  
En langage simple : c’est le seul sous-projet qui ressemble à un **vrai produit numérique en construction**, avec une ambition de publication sérieuse.

### État technique

- **Stack principale** : React 18 + Vite + Tailwind + nombreuses dépendances UI ; serveur Express local ; scripts Node ; un peu d’infra/serverless/terraform autour.
- **README** : oui, README racine de `peltiez/` présent et utile ; `server/README.md` présent aussi.
- **Manifestes** : `package.json` riche, `package-lock.json`, configs Vite / ESLint / Playwright / Tailwind / Vercel / Serverless.
- **Lançable ?** Sur le papier oui, clairement pensé pour être lancé localement (`dev`, `dev:api`, `dev:stack`, `verify`), mais je n’ai rien exécuté.
- **Tests ?** Oui, présence d’un **smoke test Playwright** (`e2e/smoke.spec.js`). C’est un bon signal, mais la couverture semble faible au regard de la taille du projet.
- **`.git/` local ?** Non, il dépend du Git racine.

### Maturité

Je le classerais **WIP avancé / utilisable**.  
Il y a une vraie structure produit, de la doc, des scripts, un serveur, un début de QA, des éléments SEO et déploiement.  
En revanche, l’ensemble n’a pas encore la netteté d’un projet “pré-production” proprement gouverné.

### Volume / complexité

#### Volume brut

- Environ **140 356 fichiers**.
- Taille brute approximative : **2,6 Go**.

#### Volume utile estimé

- En retirant les grosses zones générées (`node_modules`, `dist`, etc.), on tombe à environ **1 404 fichiers** pour **375 Mo** utiles.

#### Répartition notable

- `src/` : **526 fichiers**, ~**3 Mo** → le vrai code applicatif.
- `server/` : **20 fichiers**, léger.
- `scripts/` : **56 fichiers**, raisonnable.
- `docs/` : **308 fichiers**, ~**118 Mo**.
- `public/` : **327 fichiers**, ~**252 Mo**.
- `infra/` : **73 312 fichiers**, ~**1,3 Go** → énorme signal de poids local embarqué.

#### Lecture simple

Le projet est **gros et pilotable seulement si on le nettoie**.  
En l’état, il est trop chargé pour être confortable pour une personne seule non développeuse.

### Risques visibles

#### 1. Secrets et fichiers sensibles présents localement

- Présence de `.env`, `.env.server`, et `infra/stack-souverain/.env`.
- Présence à la racine du dépôt d’un `recovery-codes.txt`.
- Bonne nouvelle : ces fichiers apparaissent comme **ignorés par Git**, pas comme versionnés.
- Mauvaise nouvelle : ils existent dans l’espace de travail et signalent une **hygiène de sécurité fragile** si le dossier circule en ZIP ou copie manuelle.

#### 2. Artefacts générés et fichiers temporaires

- `dist/` présent.
- `node_modules/` présent.
- `test-results/` présent.
- Fichiers `.bak` visibles (`public/encyclopedie.pdf.bak`, `dist/encyclopedie.pdf.bak`, etc.).
- Fichier temporaire `src/pages/WorldHub.jsx.tmp`.
- Fichier patch `cyclotomic_update.patch`.

Ce n’est pas dramatique, mais cela donne une impression de **bureau encombré**.

#### 3. Doublons documentaires massifs

- `docs/` contient **308 fichiers**.
- `public/docs/` contient **242 fichiers**.
- Environ **223 noms de fichiers identiques** entre les deux.

Cela veut dire qu’une énorme partie de la documentation existe **au moins en double nom**, souvent une fois en source et une fois en version publique.  
Le principe peut être logique, mais le risque est très élevé : **on ne sait plus vite quelle copie fait foi**.

#### 4. Gros poids inutile dans l’infra locale

- `infra/` concentre à lui seul plus d’**1,3 Go** et plus de **73 000 fichiers**.
- Le signal le plus probable est la présence d’environnements locaux embarqués (`.venv`, packages, outils lourds).

Pour un propriétaire non technique, c’est typiquement le genre de zone qui fait gonfler le dossier et brouille la lisibilité.

#### 5. Documentation très riche, mais gouvernance faible

Le projet contient beaucoup de livrables : PDF, DOCX, HTML, docs stratégiques, docs produit, docs encyclopédie, dossiers investisseurs, etc.  
Le problème n’est pas l’absence de matière ; c’est plutôt l’**excès de matière sans hiérarchie forte**.

### Valeur

**Très clairement à garder.**  
C’est le sous-projet avec la plus forte valeur potentielle de publication, de démonstration, voire de monétisation.  
Mais avant cela, il mérite un **chantier de simplification et de séparation**.  
Verdict : **garder, consolider, puis publier** — surtout pas archiver.

---

## Évaluation globale du dossier

### Cohérence : un projet ou un patchwork ?

C’est **un patchwork organisé autour d’un noyau**.  
Le noyau, c’est `peltiez/`. Le reste sert d’assets, d’annexes, de livrables ou de R&D.  
Donc la réponse honnête est : **ce n’est pas un projet unique propre**, c’est un **écosystème personnel accumulé** autour d’un projet principal.

### Doublons entre sous-projets

Les doublons les plus visibles ne sont pas entre `assets/`, `circulai-final/` et `egor-time-sim/`, mais surtout :

- entre **`circulai-final/`** et **`peltiez/docs/`** (ex. `final-pack.md`, `proofs.md`, `scale-ai-fiche-1-page.md`) ;
- entre **`peltiez/docs/`** et **`peltiez/public/docs/`** ;
- entre certaines sorties PDF publiques et leurs variantes locales / `.bak`.

Le dossier global souffre donc moins d’avoir “trop de projets” que d’avoir **trop de copies de contenus proches**.

### Recommandation de structuration

#### Ce que je recommande

1. **Assumer `peltiez/` comme projet principal unique.**
2. **Traiter `assets/` comme bibliothèque de ressources partagée.**
3. **Traiter `circulai-final/` comme dossier de livraison à fusionner ou archiver.**
4. **Traiter `egor-time-sim/` comme prototype R&D séparé.**

#### En pratique

- **Fusionner** le contenu utile de `circulai-final/` dans une seule zone documentaire officielle (probablement `peltiez/docs/` ou un futur dossier `deliverables/`).
- **Séparer** clairement `egor-time-sim/` comme annexe ou repo futur autonome si le sujet vit encore.
- **Conserver** `assets/` à part, mais le documenter en une page simple.
- **Alléger fortement** `peltiez/` en retirant de la vue “propriétaire” tout ce qui relève des caches, builds, environnements locaux, copies publiques et brouillons temporaires.

### Risques principaux à adresser vite

1. **Confusion documentaire** : trop de copies, trop de dossiers sources/publics parallèles.
2. **Poids du dossier** : l’ensemble est gonflé par des dépendances locales et de l’infra embarquée.
3. **Hygiène de sécurité** : fichiers sensibles présents dans l’espace de travail (`.env`, recovery codes, clés d’API côté nommage).
4. **Lisibilité produit** : on perçoit mal, au premier regard, ce qui est “le vrai produit” et ce qui est “archive / expérimentation / doc”.

---

## Top 3 actions concrètes

### 1. Définir officiellement le centre du projet

Décider noir sur blanc que **`peltiez/` est le produit principal**.  
Puis reléguer le reste en trois catégories simples : **assets**, **livrables**, **R&D**.

### 2. Réduire les doublons documentaires

Choisir une règle simple :  
- soit `docs/` = source interne et `public/docs/` = export public contrôlé,  
- soit un autre schéma,  
mais **pas les deux sans règle écrite**.  
Aujourd’hui, c’est le plus gros facteur de confusion.

### 3. Faire un ménage de sécurité et de poids

Sans toucher au fond du produit, il faut rapidement :

- isoler les secrets et codes de récupération hors du dossier de travail diffusé ;
- sortir ou nettoyer les environnements locaux lourds ;
- identifier les `.tmp`, `.bak`, artefacts et vieux bundles à archiver ailleurs.

---

## Verdict général

Il y a **du solide** ici : une vraie base produit existe, avec ambition, matière éditoriale et signaux de sérieux.  
Mais il y a aussi **du bordélique accumulé** : copies, exports, dossiers parallèles, infra locale lourde, et trop de niveaux de documentation.  

Mon évaluation globale est la suivante :

- **Valeur potentielle** : élevée, surtout via `peltiez/`.
- **État actuel** : prometteur mais encombré.
- **Capacité à publier** : réelle, mais freinée par le manque de tri.
- **Capacité à monétiser** : plausible, à condition de clarifier le périmètre public et de simplifier l’ensemble.

En une phrase :  
**ce dossier contient un vrai projet qui mérite d’être sauvé du trop-plein qui l’entoure.**