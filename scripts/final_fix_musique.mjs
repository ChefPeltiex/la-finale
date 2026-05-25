/**
 * Dernier correctif : 8 articles restants
 * - 4 rate-limitées : relancer avec délai 5s
 * - 4 non trouvées : titres alternatifs
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('C:/Users/CHEFP/OneDrive/Desktop/la finale');
const CORPUS_FILE = path.join(OUTPUT_DIR, 'dominic_musique_corpus.json');
const INDEX_FILE = path.join(OUTPUT_DIR, 'dominic_musique_index.json');

// Corrections finales
const FINAL = [
  // Non trouvés -> nouveaux titres
  { ancien: "Mouvement romantique (musique)", nouveau: "Romantisme musical", categorie: "Histoire" },
  { ancien: "Musique du XXe siècle", nouveau: "Atonalité", categorie: "Histoire" },
  { ancien: "Polyphonie médiévale", nouveau: "Ars nova", categorie: "Histoire" },
  { ancien: "Air (musique)", nouveau: "Aria", categorie: "Voix et chant" },
  { ancien: "Pédagogie musicale", nouveau: "Éducation musicale", categorie: "Musique et société" },
  { ancien: "Conservatoire de musique", nouveau: "Conservatoire national supérieur de musique et de danse de Paris", categorie: "Musique et société" },
  // Rate-limitées
  { ancien: "Enregistrement sonore", nouveau: "Enregistrement sonore", categorie: "Musique et société" },
  { ancien: "Streaming musical", nouveau: "Musique en streaming", categorie: "Musique et société" },
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
        catch (e) { reject(new Error('JSON parse: ' + data.substring(0, 80))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchArticle(titre, retries = 4) {
  const encoded = encodeURIComponent(titre);
  const url = `https://fr.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=extracts|info|categories&exintro=1&explaintext=1&inprop=url&cllimit=5&format=json&utf8=1`;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (attempt > 1) await sleep(5000 * attempt);
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
      console.log(`    [essai ${attempt}] ${err.message.substring(0, 60)}`);
      if (attempt === retries) return { erreur: err.message };
    }
  }
}

async function main() {
  const corpus = JSON.parse(fs.readFileSync(CORPUS_FILE, 'utf8'));
  
  console.log(`[Final] ${FINAL.length} articles à résoudre\n`);
  await sleep(3000); // Pause initiale pour le rate-limit
  
  let corriges = 0;
  
  for (const corr of FINAL) {
    process.stdout.write(`  "${corr.nouveau}"... `);
    await sleep(2000);
    
    const data = await fetchArticle(corr.nouveau);
    
    // Chercher par ancien titre OU par titre actuel (déjà corrigé)
    let idx = corpus.articles.findIndex(a => 
      a.titre === corr.ancien || 
      a.titre_original === corr.ancien ||
      (a.statut !== 'ok' && a.titre === corr.ancien)
    );
    
    if (idx < 0) {
      // Chercher dans les erreurs/non-trouvés
      idx = corpus.articles.findIndex(a => a.statut !== 'ok' && 
        (a.titre?.includes(corr.ancien.split(' ')[0]) || a.categorie_dominic === corr.categorie));
    }
    
    if (!data) {
      console.log('non trouvé sur WP FR');
      // Créer un article de fallback avec contenu minimal
      if (idx >= 0) {
        corpus.articles[idx].titre_alternatif_tente = corr.nouveau;
      }
    } else if (data.erreur) {
      console.log(`erreur réseau`);
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
      } else {
        // Pas trouvé dans le corpus -> ajouter
        corpus.articles.push({
          titre: data.titre,
          titre_original: corr.ancien,
          categorie_dominic: corr.categorie,
          pageid: data.pageid,
          definition: data.definition,
          categories_wiki: data.categories_wiki,
          url: data.url,
          longueur_extrait: data.longueur_extrait,
          statut: 'ok',
        });
      }
    }
  }
  
  const reussis = corpus.articles.filter(a => a.statut === 'ok').length;
  const nonTrouves = corpus.articles.filter(a => a.statut === 'non_trouve').length;
  const erreurs = corpus.articles.filter(a => a.statut === 'erreur').length;
  
  corpus.meta.total_reussis = reussis;
  corpus.meta.total_non_trouves = nonTrouves;
  corpus.meta.total_erreurs = erreurs;
  corpus.meta.date_mise_a_jour = new Date().toISOString().split('T')[0];
  
  // Reconstruire index
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
  
  console.log(`\n=== RÉSULTAT FINAL ===`);
  console.log(`  Articles OK    : ${reussis}`);
  console.log(`  Non trouvés    : ${nonTrouves}`);
  console.log(`  Erreurs        : ${erreurs}`);
  console.log(`  Corpus         : ${CORPUS_FILE}`);
  console.log(`  Index          : ${INDEX_FILE}`);
}

main().catch(console.error);
