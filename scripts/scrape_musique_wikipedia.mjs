/**
 * Scraper Wikipedia FR - Domaine MUSIQUE pour Dominic
 * 130 articles couvrant : théorie musicale, genres, instruments, compositeurs,
 * histoire de la musique, acoustique, notation musicale, etc.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('C:/Users/CHEFP/OneDrive/Desktop/la finale');
const CORPUS_FILE = path.join(OUTPUT_DIR, 'dominic_musique_corpus.json');
const INDEX_FILE = path.join(OUTPUT_DIR, 'dominic_musique_index.json');

// 130 articles Wikipedia FR soigneusement sélectionnés dans le domaine MUSIQUE
const ARTICLES_MUSIQUE = [
  // === THÉORIE MUSICALE ===
  { titre: "Musique", categorie: "Généralités" },
  { titre: "Théorie musicale", categorie: "Théorie musicale" },
  { titre: "Note de musique", categorie: "Théorie musicale" },
  { titre: "Gamme musicale", categorie: "Théorie musicale" },
  { titre: "Accord (musique)", categorie: "Théorie musicale" },
  { titre: "Harmonie (musique)", categorie: "Théorie musicale" },
  { titre: "Contrepoint", categorie: "Théorie musicale" },
  { titre: "Rythme (musique)", categorie: "Théorie musicale" },
  { titre: "Tempo", categorie: "Théorie musicale" },
  { titre: "Tonalité (musique)", categorie: "Théorie musicale" },
  { titre: "Mode (musique)", categorie: "Théorie musicale" },
  { titre: "Intervalle (musique)", categorie: "Théorie musicale" },
  { titre: "Octave", categorie: "Théorie musicale" },
  { titre: "Gamme pentatonique", categorie: "Théorie musicale" },
  { titre: "Gamme diatonique", categorie: "Théorie musicale" },
  { titre: "Mélodie", categorie: "Théorie musicale" },
  { titre: "Polyphonie", categorie: "Théorie musicale" },
  { titre: "Timbre (acoustique)", categorie: "Théorie musicale" },
  { titre: "Solfège", categorie: "Théorie musicale" },
  { titre: "Partition (musique)", categorie: "Théorie musicale" },

  // === INSTRUMENTS DE MUSIQUE ===
  { titre: "Instrument de musique", categorie: "Instruments" },
  { titre: "Piano", categorie: "Instruments" },
  { titre: "Guitare", categorie: "Instruments" },
  { titre: "Violon", categorie: "Instruments" },
  { titre: "Trompette", categorie: "Instruments" },
  { titre: "Flûte traversière", categorie: "Instruments" },
  { titre: "Saxophone", categorie: "Instruments" },
  { titre: "Tambour", categorie: "Instruments" },
  { titre: "Orgue", categorie: "Instruments" },
  { titre: "Harpe", categorie: "Instruments" },
  { titre: "Violoncelle", categorie: "Instruments" },
  { titre: "Contrebasse", categorie: "Instruments" },
  { titre: "Clarinette", categorie: "Instruments" },
  { titre: "Hautbois", categorie: "Instruments" },
  { titre: "Cor (instrument)", categorie: "Instruments" },
  { titre: "Trombone", categorie: "Instruments" },
  { titre: "Tuba (instrument)", categorie: "Instruments" },
  { titre: "Luth", categorie: "Instruments" },
  { titre: "Clavecin", categorie: "Instruments" },
  { titre: "Banjo", categorie: "Instruments" },

  // === GENRES ET STYLES ===
  { titre: "Musique classique", categorie: "Genres musicaux" },
  { titre: "Jazz", categorie: "Genres musicaux" },
  { titre: "Blues", categorie: "Genres musicaux" },
  { titre: "Rock", categorie: "Genres musicaux" },
  { titre: "Pop (musique)", categorie: "Genres musicaux" },
  { titre: "Hip-hop", categorie: "Genres musicaux" },
  { titre: "Reggae", categorie: "Genres musicaux" },
  { titre: "Musique électronique", categorie: "Genres musicaux" },
  { titre: "Opéra", categorie: "Genres musicaux" },
  { titre: "Symphonie", categorie: "Genres musicaux" },
  { titre: "Sonate", categorie: "Genres musicaux" },
  { titre: "Concerto", categorie: "Genres musicaux" },
  { titre: "Fugue (musique)", categorie: "Genres musicaux" },
  { titre: "Musique baroque", categorie: "Genres musicaux" },
  { titre: "Musique romantique", categorie: "Genres musicaux" },
  { titre: "Musique contemporaine", categorie: "Genres musicaux" },
  { titre: "Musique de chambre", categorie: "Genres musicaux" },
  { titre: "Musique folklorique", categorie: "Genres musicaux" },
  { titre: "Musique traditionnelle", categorie: "Genres musicaux" },
  { titre: "Punk (musique)", categorie: "Genres musicaux" },

  // === COMPOSITEURS ET MUSICIENS CÉLÈBRES ===
  { titre: "Ludwig van Beethoven", categorie: "Compositeurs" },
  { titre: "Wolfgang Amadeus Mozart", categorie: "Compositeurs" },
  { titre: "Johann Sebastian Bach", categorie: "Compositeurs" },
  { titre: "Frédéric Chopin", categorie: "Compositeurs" },
  { titre: "Franz Schubert", categorie: "Compositeurs" },
  { titre: "Johannes Brahms", categorie: "Compositeurs" },
  { titre: "Claude Debussy", categorie: "Compositeurs" },
  { titre: "Igor Stravinsky", categorie: "Compositeurs" },
  { titre: "Giuseppe Verdi", categorie: "Compositeurs" },
  { titre: "Richard Wagner", categorie: "Compositeurs" },
  { titre: "Franz Liszt", categorie: "Compositeurs" },
  { titre: "Pyotr Ilyich Tchaikovsky", categorie: "Compositeurs" },
  { titre: "Antonio Vivaldi", categorie: "Compositeurs" },
  { titre: "Georg Friedrich Haendel", categorie: "Compositeurs" },
  { titre: "Joseph Haydn", categorie: "Compositeurs" },
  { titre: "Hector Berlioz", categorie: "Compositeurs" },
  { titre: "Dmitri Chostakovitch", categorie: "Compositeurs" },
  { titre: "Sergueï Prokofiev", categorie: "Compositeurs" },
  { titre: "Maurice Ravel", categorie: "Compositeurs" },
  { titre: "Erik Satie", categorie: "Compositeurs" },

  // === HISTOIRE DE LA MUSIQUE ===
  { titre: "Histoire de la musique", categorie: "Histoire" },
  { titre: "Musique de la Grèce antique", categorie: "Histoire" },
  { titre: "Musique médiévale", categorie: "Histoire" },
  { titre: "Musique de la Renaissance", categorie: "Histoire" },
  { titre: "Période classique (musique)", categorie: "Histoire" },
  { titre: "Mouvement romantique (musique)", categorie: "Histoire" },
  { titre: "Musique du XXe siècle", categorie: "Histoire" },
  { titre: "Chant grégorien", categorie: "Histoire" },
  { titre: "Troubadour", categorie: "Histoire" },
  { titre: "Polyphonie médiévale", categorie: "Histoire" },

  // === ACOUSTIQUE ET PHYSIQUE DU SON ===
  { titre: "Son (physique)", categorie: "Acoustique" },
  { titre: "Acoustique musicale", categorie: "Acoustique" },
  { titre: "Fréquence (physique)", categorie: "Acoustique" },
  { titre: "Hauteur (musique)", categorie: "Acoustique" },
  { titre: "Harmonique", categorie: "Acoustique" },
  { titre: "Résonance (physique)", categorie: "Acoustique" },
  { titre: "Vibration", categorie: "Acoustique" },
  { titre: "Onde sonore", categorie: "Acoustique" },
  { titre: "Décibel", categorie: "Acoustique" },
  { titre: "Psychoacoustique", categorie: "Acoustique" },

  // === NOTATION ET ÉCRITURE MUSICALE ===
  { titre: "Notation musicale", categorie: "Notation" },
  { titre: "Portée (musique)", categorie: "Notation" },
  { titre: "Clé (solfège)", categorie: "Notation" },
  { titre: "Mesure (musique)", categorie: "Notation" },
  { titre: "Nuance (musique)", categorie: "Notation" },
  { titre: "Barre de mesure", categorie: "Notation" },
  { titre: "Tablature", categorie: "Notation" },
  { titre: "Chiffrage d'accord", categorie: "Notation" },
  { titre: "Articulation (musique)", categorie: "Notation" },
  { titre: "Phrasé musical", categorie: "Notation" },

  // === VOIX ET CHANT ===
  { titre: "Voix chantée", categorie: "Voix et chant" },
  { titre: "Soprano", categorie: "Voix et chant" },
  { titre: "Alto (voix)", categorie: "Voix et chant" },
  { titre: "Ténor", categorie: "Voix et chant" },
  { titre: "Basse (voix)", categorie: "Voix et chant" },
  { titre: "Chœur (musique)", categorie: "Voix et chant" },
  { titre: "Technique vocale", categorie: "Voix et chant" },
  { titre: "Chant lyrique", categorie: "Voix et chant" },
  { titre: "Aria (opéra)", categorie: "Voix et chant" },
  { titre: "Lied (musique)", categorie: "Voix et chant" },

  // === MUSIQUE ET SOCIÉTÉ ===
  { titre: "Industrie musicale", categorie: "Musique et société" },
  { titre: "Droit d'auteur en musique", categorie: "Musique et société" },
  { titre: "Musicologie", categorie: "Musique et société" },
  { titre: "Ethnomusicologie", categorie: "Musique et société" },
  { titre: "Pédagogie musicale", categorie: "Musique et société" },
  { titre: "Conservatoire de musique", categorie: "Musique et société" },
  { titre: "Concert (spectacle)", categorie: "Musique et société" },
  { titre: "Festival de musique", categorie: "Musique et société" },
  { titre: "Enregistrement sonore", categorie: "Musique et société" },
  { titre: "Streaming musical", categorie: "Musique et société" },
];

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'DominicMusicCorpus/1.0 (educational; contact@example.com)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse error: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchArticleWikipedia(titre) {
  const encoded = encodeURIComponent(titre);
  const url = `https://fr.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=extracts|info|categories&exintro=1&explaintext=1&inprop=url&cllimit=5&format=json&utf8=1`;
  
  try {
    const data = await httpsGet(url);
    const pages = data.query.pages;
    const page = Object.values(pages)[0];
    
    if (page.missing !== undefined) {
      return null; // Article non trouvé
    }
    
    const extract = (page.extract || '').trim();
    // Prendre max 1200 caractères pour la définition
    const definition = extract.length > 1200
      ? extract.substring(0, 1200).replace(/\s+\S*$/, '') + '…'
      : extract;
    
    const cats = (page.categories || []).map(c => c.title.replace('Catégorie:', '')).slice(0, 5);
    
    return {
      titre: page.title,
      titre_recherche: titre,
      pageid: page.pageid,
      definition,
      categories_wiki: cats,
      url: page.fullurl || `https://fr.wikipedia.org/wiki/${encoded}`,
      longueur_extrait: extract.length,
    };
  } catch (err) {
    return { titre, erreur: err.message, url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(titre)}` };
  }
}

async function main() {
  console.log(`[Démarrage] Scraping ${ARTICLES_MUSIQUE.length} articles Wikipedia FR - Domaine MUSIQUE`);
  console.log(`[Sortie] ${CORPUS_FILE}`);
  
  const resultats = [];
  const echecs = [];
  let compteur = 0;
  
  for (const article of ARTICLES_MUSIQUE) {
    compteur++;
    process.stdout.write(`\r[${compteur}/${ARTICLES_MUSIQUE.length}] ${article.titre.padEnd(50)}`);
    
    const data = await fetchArticleWikipedia(article.titre);
    
    if (!data) {
      echecs.push({ titre: article.titre, raison: 'Article introuvable sur Wikipedia FR' });
      resultats.push({
        titre: article.titre,
        categorie_dominic: article.categorie,
        definition: null,
        categories_wiki: [],
        url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(article.titre)}`,
        statut: 'non_trouve',
      });
    } else if (data.erreur) {
      echecs.push({ titre: article.titre, raison: data.erreur });
      resultats.push({
        titre: article.titre,
        categorie_dominic: article.categorie,
        definition: null,
        categories_wiki: [],
        url: data.url,
        statut: 'erreur',
        erreur: data.erreur,
      });
    } else {
      resultats.push({
        titre: data.titre,
        categorie_dominic: article.categorie,
        pageid: data.pageid,
        definition: data.definition,
        categories_wiki: data.categories_wiki,
        url: data.url,
        longueur_extrait: data.longueur_extrait,
        statut: 'ok',
      });
    }
    
    // Politesse : 250ms entre chaque requête
    await sleep(250);
  }
  
  process.stdout.write('\n');
  
  const reussis = resultats.filter(r => r.statut === 'ok').length;
  const nonTrouves = resultats.filter(r => r.statut === 'non_trouve').length;
  const erreurs = resultats.filter(r => r.statut === 'erreur').length;
  
  // === CORPUS COMPLET ===
  const corpus = {
    meta: {
      projet: "CORPUS MUSIQUE - DOMINIC",
      source: "Wikipédia FR (fr.wikipedia.org)",
      date_collecte: new Date().toISOString().split('T')[0],
      total_articles_cibles: ARTICLES_MUSIQUE.length,
      total_reussis: reussis,
      total_non_trouves: nonTrouves,
      total_erreurs: erreurs,
      categories_couvertes: [...new Set(ARTICLES_MUSIQUE.map(a => a.categorie))],
      description: "Corpus encyclopédique en langue française sur la musique : théorie musicale, instruments, genres, compositeurs, histoire, acoustique, notation, voix, et musique & société.",
    },
    articles: resultats,
    echecs: echecs.length > 0 ? echecs : null,
  };
  
  // === INDEX STRUCTURÉ ===
  const categoriesIndex = {};
  for (const a of resultats) {
    if (!categoriesIndex[a.categorie_dominic]) {
      categoriesIndex[a.categorie_dominic] = [];
    }
    categoriesIndex[a.categorie_dominic].push({
      titre: a.titre,
      url: a.url,
      statut: a.statut,
      apercu: a.definition ? a.definition.substring(0, 200) + (a.definition.length > 200 ? '…' : '') : null,
    });
  }
  
  const index = {
    meta: {
      projet: "INDEX MUSIQUE - DOMINIC",
      date_collecte: new Date().toISOString().split('T')[0],
      total_articles: reussis,
      total_categories: Object.keys(categoriesIndex).length,
    },
    categories: categoriesIndex,
    liste_alphabetique: resultats
      .filter(r => r.statut === 'ok')
      .sort((a, b) => a.titre.localeCompare(b.titre, 'fr'))
      .map(a => ({ titre: a.titre, categorie: a.categorie_dominic, url: a.url })),
    statistiques: {
      par_categorie: Object.fromEntries(
        Object.entries(categoriesIndex).map(([cat, arts]) => [cat, arts.length])
      ),
      taux_succes: `${Math.round((reussis / ARTICLES_MUSIQUE.length) * 100)}%`,
    },
  };
  
  fs.writeFileSync(CORPUS_FILE, JSON.stringify(corpus, null, 2), 'utf8');
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf8');
  
  console.log(`\n[Terminé]`);
  console.log(`  Articles récupérés : ${reussis}/${ARTICLES_MUSIQUE.length}`);
  console.log(`  Non trouvés        : ${nonTrouves}`);
  console.log(`  Erreurs            : ${erreurs}`);
  console.log(`  Corpus JSON        : ${CORPUS_FILE}`);
  console.log(`  Index JSON         : ${INDEX_FILE}`);
}

main().catch(console.error);
