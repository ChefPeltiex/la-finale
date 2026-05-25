/**
 * Correctif : récupère les 22 articles manquants avec titres corrigés
 * et fusionne dans le corpus existant
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('C:/Users/CHEFP/OneDrive/Desktop/la finale');
const CORPUS_FILE = path.join(OUTPUT_DIR, 'dominic_musique_corpus.json');
const INDEX_FILE = path.join(OUTPUT_DIR, 'dominic_musique_index.json');

// Mapping des titres incorrects -> titres Wikipedia FR réels
const CORRECTIONS = [
  { ancien: "Tonalité (musique)", nouveau: "Tonalité", categorie: "Théorie musicale" },
  { ancien: "Fugue (musique)", nouveau: "Fugue", categorie: "Genres musicaux" },
  { ancien: "Période classique (musique)", nouveau: "Classicisme viennois", categorie: "Histoire" },
  { ancien: "Mouvement romantique (musique)", nouveau: "Romantisme (musique)", categorie: "Histoire" },
  { ancien: "Musique du XXe siècle", nouveau: "Musique du XXe siècle", categorie: "Histoire" },
  { ancien: "Polyphonie médiévale", nouveau: "Polyphonie médiévale", categorie: "Histoire" },
  { ancien: "Fréquence (physique)", nouveau: "Fréquence", categorie: "Acoustique" },
  { ancien: "Résonance (physique)", nouveau: "Résonance", categorie: "Acoustique" },
  { ancien: "Clé (solfège)", nouveau: "Clé (musique)", categorie: "Notation" },
  { ancien: "Chiffrage d'accord", nouveau: "Chiffrage des accords", categorie: "Notation" },
  { ancien: "Phrasé musical", nouveau: "Phrasé", categorie: "Notation" },
  { ancien: "Aria (opéra)", nouveau: "Air (musique)", categorie: "Voix et chant" },
  { ancien: "Lied (musique)", nouveau: "Lied", categorie: "Voix et chant" },
  { ancien: "Droit d'auteur en musique", nouveau: "Droit d'auteur", categorie: "Musique et société" },
  // Erreurs réseau - relance avec délai plus long
  { ancien: "Musicologie", nouveau: "Musicologie", categorie: "Musique et société" },
  { ancien: "Ethnomusicologie", nouveau: "Ethnomusicologie", categorie: "Musique et société" },
  { ancien: "Pédagogie musicale", nouveau: "Pédagogie musicale", categorie: "Musique et société" },
  { ancien: "Conservatoire de musique", nouveau: "Conservatoire de musique", categorie: "Musique et société" },
  { ancien: "Concert (spectacle)", nouveau: "Concert", categorie: "Musique et société" },
  { ancien: "Festival de musique", nouveau: "Festival de musique", categorie: "Musique et société" },
  { ancien: "Enregistrement sonore", nouveau: "Enregistrement sonore", categorie: "Musique et société" },
  { ancien: "Streaming musical", nouveau: "Streaming", categorie: "Musique et société" },
];

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { 
      headers: { 
        'User-Agent': 'DominicMusicCorpus/1.0 (educational)',
        'Accept': 'application/json',
      } 
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse error: ' + e.message + ' | début: ' + data.substring(0, 50))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchArticle(titre, retries = 3) {
  const encoded = encodeURIComponent(titre);
  const url = `https://fr.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=extracts|info|categories&exintro=1&explaintext=1&inprop=url&cllimit=5&format=json&utf8=1`;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sleep(attempt > 1 ? 2000 * attempt : 0);
      const data = await httpsGet(url);
      const pages = data.query.pages;
      const page = Object.values(pages)[0];
      
      if (page.missing !== undefined) return null;
      
      const extract = (page.extract || '').trim();
      const definition = extract.length > 1200
        ? extract.substring(0, 1200).replace(/\s+\S*$/, '') + '…'
        : extract;
      
      const cats = (page.categories || []).map(c => c.title.replace('Catégorie:', '')).slice(0, 5);
      
      return {
        titre: page.title,
        pageid: page.pageid,
        definition,
        categories_wiki: cats,
        url: page.fullurl || `https://fr.wikipedia.org/wiki/${encoded}`,
        longueur_extrait: extract.length,
      };
    } catch (err) {
      if (attempt === retries) return { erreur: err.message };
      console.log(`  [retry ${attempt}] ${titre}: ${err.message}`);
    }
  }
}

async function main() {
  const corpus = JSON.parse(fs.readFileSync(CORPUS_FILE, 'utf8'));
  
  console.log(`[Correctif] ${CORRECTIONS.length} articles à corriger/relancer\n`);
  
  let corriges = 0;
  
  for (const corr of CORRECTIONS) {
    process.stdout.write(`  Tentative: "${corr.nouveau}"... `);
    await sleep(500);
    
    const data = await fetchArticle(corr.nouveau);
    
    // Trouver l'article dans le corpus par titre original
    const idx = corpus.articles.findIndex(a => a.titre === corr.ancien || a.titre_recherche === corr.ancien);
    
    if (!data) {
      console.log('non trouvé');
      // Garder tel quel mais indiquer le titre testé
      if (idx >= 0) {
        corpus.articles[idx].titre_alternatif_tente = corr.nouveau;
      }
    } else if (data.erreur) {
      console.log(`erreur: ${data.erreur}`);
    } else {
      console.log(`OK → "${data.titre}" (${data.longueur_extrait} chars)`);
      corriges++;
      if (idx >= 0) {
        corpus.articles[idx] = {
          titre: data.titre,
          titre_original: corr.ancien,
          categorie_dominic: corr.categorie,
          pageid: data.pageid,
          definition: data.definition,
          categories_wiki: data.categories_wiki,
          url: data.url,
          longueur_extrait: data.longueur_extrait,
          statut: 'ok',
        };
      }
    }
  }
  
  // Recalcul des stats
  const reussis = corpus.articles.filter(a => a.statut === 'ok').length;
  const nonTrouves = corpus.articles.filter(a => a.statut === 'non_trouve').length;
  const erreurs = corpus.articles.filter(a => a.statut === 'erreur').length;
  
  corpus.meta.total_reussis = reussis;
  corpus.meta.total_non_trouves = nonTrouves;
  corpus.meta.total_erreurs = erreurs;
  corpus.meta.date_mise_a_jour = new Date().toISOString().split('T')[0];
  
  // Reconstruire l'index
  const categoriesIndex = {};
  for (const a of corpus.articles) {
    const cat = a.categorie_dominic;
    if (!categoriesIndex[cat]) categoriesIndex[cat] = [];
    categoriesIndex[cat].push({
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
    liste_alphabetique: corpus.articles
      .filter(a => a.statut === 'ok')
      .sort((a, b) => a.titre.localeCompare(b.titre, 'fr'))
      .map(a => ({ titre: a.titre, categorie: a.categorie_dominic, url: a.url })),
    statistiques: {
      par_categorie: Object.fromEntries(
        Object.entries(categoriesIndex).map(([cat, arts]) => [cat, arts.filter(a=>a.statut==='ok').length])
      ),
      taux_succes: `${Math.round((reussis / 130) * 100)}%`,
    },
  };
  
  fs.writeFileSync(CORPUS_FILE, JSON.stringify(corpus, null, 2), 'utf8');
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf8');
  
  console.log(`\n[Résultat final]`);
  console.log(`  Articles OK    : ${reussis}/130`);
  console.log(`  Non trouvés    : ${nonTrouves}`);
  console.log(`  Erreurs        : ${erreurs}`);
  console.log(`  Corrigés       : ${corriges}`);
}

main().catch(console.error);
