/**
 * Synthèse consolidée CirculAI — PDF unique (pdfkit).
 * Sources condensées : plan d'affaires, Épopée Tome I, cadre mathématique créatif,
 * dossier stratégique meeting, alignement produit (sans remplacer les originaux).
 */
import PDFDocument from "pdfkit";
import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "docs", "CIRCULAI-SYNTHESE-COMPLETE.pdf");

const M = { top: 48, bottom: 48, left: 50, right: 50 };
const doc = new PDFDocument({ size: "A4", margins: M, bufferPages: true });
const stream = createWriteStream(outPath);
doc.pipe(stream);

const W = doc.page.width - M.left - M.right;

function h1(t) {
  doc.moveDown(0.7);
  doc.font("Helvetica-Bold").fontSize(13).fillColor("#0a4a4a").text(t, { width: W });
  doc.font("Helvetica").fontSize(9.5).fillColor("#222");
  doc.moveDown(0.25);
}
function h2(t) {
  doc.moveDown(0.45);
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#145050").text(t, { width: W });
  doc.font("Helvetica").fontSize(9.5).fillColor("#222");
  doc.moveDown(0.2);
}
function p(t, size = 9.5) {
  doc.font("Helvetica").fontSize(size).fillColor("#222").text(t, { width: W, align: "justify", lineGap: 1.5 });
  doc.moveDown(0.35);
}
function bullets(lines) {
  doc.font("Helvetica").fontSize(9.5);
  for (const line of lines) {
    doc.fillColor("#222").text(`• ${line}`, { width: W - 10, indent: 10, lineGap: 1 });
  }
  doc.moveDown(0.35);
}
function box(title, body) {
  doc.moveDown(0.2);
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#5a3d00").text(title, { width: W });
  doc.font("Helvetica").fontSize(9).fillColor("#333").text(body, { width: W, lineGap: 1 });
  doc.moveDown(0.35);
}
function mono(lines) {
  doc.font("Courier").fontSize(8.5).fillColor("#111");
  doc.text(lines.join("\n"), { width: W, lineGap: 0.5 });
  doc.font("Helvetica");
  doc.moveDown(0.35);
}

// ——— Page titre
doc.font("Helvetica-Bold").fontSize(20).fillColor("#0a4a4a").text("CirculAI", { align: "center" });
doc.moveDown(0.2);
doc.font("Helvetica").fontSize(12).text("Synthèse consolidée", { align: "center" });
doc.moveDown(0.15);
doc.fontSize(9.5).fillColor("#444").text("Plan d'affaires · Vision scientifique (Tome I) · Cadre créatif · Dossier meeting · Produit", {
  align: "center",
  width: W + 30,
});
doc.moveDown(0.4);
doc.fontSize(8.5).text("Dominic Pelletier — Québec, Canada — Document de travail — Compilation mai 2026", {
  align: "center",
});
doc.moveDown(0.5);
box(
  "Avertissement",
  "Ce PDF condense et harmonise des documents sources (ex. plan d'affaires avril 2026, L'Épopée de la Vérité Tome I, notes stratégiques). Il ne remplace pas les originaux confidentiels. Les projections et statistiques de marché doivent être recoupées avec les sources primaires avant due diligence. Les passages symboliques ou métaphoriques ne constituent pas des preuves mathématiques reconnues par la communauté scientifique (Clay, etc.).",
);

h1("1. Pitch synthétique (60 secondes)");
p(
  "Problème : surconsommation, déchets (ex. déchets électroniques à l'échelle planétaire), indice de circularité en tension. Au Québec, le plan d'affaires cite une mise à jour RECYC-QUÉBEC (oct. 2025) : indice provincial passé de 3,5 % (2021) à 2,5 % (2025), dans un contexte mondial également en baisse selon le même document.",
);
p(
  "Solution : CirculAI — plateforme québécoise d'IA au service de l'économie circulaire, du microlearning populaire, de la culture, de la communauté et du bien-être, avec une IA présentée comme éthique, transparente et centrée sur l'humain.",
);
p(
  "Marchés convergents (ordres de grandeur issus du plan d'affaires, à vérifier en sourcing) : économie circulaire mondiale, microlearning, IA — avec taux de croissance annoncés dans le document source.",
);
p(
  "Demande : partenaires et financement seed (voir section 6) pour MVP, constitution légale et pilote (ex. région de Québec).",
);

h1("2. Résumé exécutif");
h2("Constat");
p(
  "Paradoxe québécois : créativité et solidarité fortes, économie encore largement linéaire ; savoirs et objets sous-utilisés ; outils numériques pouvant isoler autant que rassembler.",
);
h2("Offre CirculAI");
p(
  "Écosystème unique (non marketplace seule, non LMS seul, non réseau social seul) : commerce circulaire local, microlearning, gamification éducative, culture, bien-être, vie communautaire. L'IA : mise en relation, personnalisation des parcours, lecture de dynamiques communautaires, mesure d'impact circulaire.",
);

h1("3. Données et positionnement (extraits plan d'affaires)");
bullets([
  "Alignement politique : Feuille de route économie circulaire Québec 2024-2028 (>130 actions) — opportunité de cohérence narrative.",
  "Différenciation : ancrage québécois, écosystème holistique, ton authentique et communautaire.",
  "Loi 25 : présentée comme plancher, pas plafond — argument confiance données.",
]);

h1("4. Modèle d'affaires — sept sources de revenus");
bullets([
  "Abonnements freemium (citoyens et PME).",
  "Commissions sur transactions circulaires.",
  "Microlearning premium et certifications.",
  "Licences B2B / B2G.",
  "Données anonymisées d'impact circulaire.",
  "Événements communautaires.",
  "Partenariats stratégiques.",
]);

h1("5. Projections financières préliminaires (plan d'affaires)");
p("Revenus et EBITDA en milliers de dollars CAD (K$). Point de rentabilité estimé : année 3 (2029). À valider avec comptable.", 9);
mono([
  "Indicateur           2026   2027   2028   2029   2030   2031",
  "Revenus (K$)            50    450  1 800  5 200 12 000 22 000",
  "EBITDA (K$)           -700 -1 200   -800    520  2 400  5 500",
  "Utilisateurs actifs    500  8 000 45 000 150 K 400 K 800 K",
]);

h1("6. Financement demandé (seed)");
p(
  "Fourchette 500 000 $ à 1 000 000 $ CAD : développement MVP, constitution légale, lancement pilote (ville de Québec). Répartition indicative du plan : technologie 45 %, recrutement 30 %, marketing lancement 15 %, opérations 10 %.",
);
p("Équipe cible phase MVP : 8 à 12 personnes (tech, IA, communauté, marketing, contenu).", 9);

h1("7. Mission, vision, valeurs (condensé)");
bullets([
  "Mission : démocratiser l'accès à une économie intelligente, circulaire et humaine via l'IA — citoyens, PME, communautés.",
  "Vision : Québec comme phare d'innovation sociale et technologique — IA au service de l'humain, de la culture, de l'environnement.",
  "Valeurs : circularité, authenticité, innovation humaine, communauté, humour/légèreté, respect, courage.",
]);

h1("8. Manifeste — axes (très condensé)");
bullets([
  "École de la vie : savoirs informels valorisés, campus numérique du savoir vivant.",
  "Circularité totale : objets, idées, talents, émotions — tout mérite de circuler.",
  "Union collective : force communautaire québécoise, ponts intergénérationnels.",
  "Culture et art : créativité comme besoin, espace pour créateurs.",
  "Jeux et apprentissage : ludification documentée comme levier pédagogique.",
  "Spiritualité inclusive : sens, non dogme religieux institutionnel.",
  "Psychologie positive et bien-être : outiller sans manipuler.",
  "Sécurité techno : IA explicable, pas de vente des données personnelles, anti-addiction cynique.",
]);

h1("9. L'Épopée de la Vérité — Tome I (document scientifique)");
p(
  "Formalisation du modèle socio-économique circulaire : trois piliers annoncés — réparation, circularité, équation du cœur (courbe implicite classique (x²+y²−1)³−x²y³=0). Chapitres : héritage horloger et conservation de la valeur ; symbiose humain–IA (Circulia) ; économie du cœur (Étincelle, « théorème de la Pizza ») ; réseau d'agents et seuil 144 000 ; dualité OpenWorld / Underworld.",
);
box(
  "Cadrage meeting / investisseurs",
  "Ce tome fournit un cadre narratif et axiomatico-symbolique pour le projet. Pour les instances techniques ou académiques : le distinguer clairement des publications révisées par les pairs. Pour le produit : il nourrit identité, glossaire et expérience, sans substituer aux preuves d'impact mesurées (KPI pilote).",
);

h1("10. Notes « 7 problèmes du millénaire + bonus » (document Word)");
p(
  "Contenu à dominante métaphorique et perspective « Pirates du Bonheur » : Riemann comme équilibre et symétrie ; P vs NP comme intuition / alignement ; Navier–Stokes comme circulation équitable des flux ; Poincaré comme unité de l'âme ; Birch–Swinnerton-Dyer comme abondance ; formule « Singularité souveraine » / Peltiez–Circulia.",
);
box(
  "Important",
  "Ces textes n'établissent pas des solutions aux prix du millénaire au sens mathématique officiel. Ils peuvent enrichir la culture d'entreprise et le storytelling si étiquetés comme cadre philosophique ou fiction d'entreprise — pas comme théorèmes validés par la communauté mathématique.",
);

h1("11. Dossier stratégique — meeting & due diligence");
h2("SWOT synthétique");
bullets([
  "Forces : vision intégrée, prototype/produit, modularité, ancrage valeurs, séparation utilitaire/fiction possible.",
  "Faiblesses : ressources, traction à prouver, complexité perçue, charge fondateur.",
  "Opportunités : transition écologique, microlearning, données d'impact, B2G, feuille de route Québec.",
  "Menaces : géants tech, conformité, scepticisme financeurs, fatigue cognitive utilisateurs.",
]);
h2("Fiscalité et « souveraineté »");
p(
  "Ne pas promettre d'économies d'impôts globales sans avis fiscal. Présenter les délais de « souveraineté » numérique/physique comme dépendants des politiques publiques et proposer des pilotes mesurables plutôt qu'une promesse unique.",
);
h2("Protocole post-webinaire");
bullets([
  "Accroche 15 s + preuve 30 s + demande de rencontre 30 min.",
  "Pitch en couches : utilitaire → éducatif → exploratoire → fiction optionnelle étiquetée.",
]);

h1("12. Alignement produit (IGOR / plateforme technique)");
bullets([
  "Couches recommandées : (A) utilitaire — donner, vendre, réparer, impact ; (B) éducatif — hubs, fiches, microlearning ; (C) exploratoire / fiction — Verse, mythologies, arts divinatoires comme couches signalées, sans confusion avec l'utilitaire institutionnel.",
  "Qualité logicielle : pipelines verify (lint, types, build), documentation LegalNotice / partage, gouvernance des contenus sensibles.",
]);

h1("13. Feuille de route immédiate");
bullets([
  "Pilote territoire + 3–5 partenaires + KPI 90 jours (rétention, actions complétées, NPS).",
  "Pack data room : sources des tableaux de marché, hypothèses financières, structure juridique, IP.",
  "Harmoniser tous les PDF externes (plan, Épopée, codex) avec cette synthèse comme table des matières exécutive.",
]);

doc.moveDown(0.8);
doc.font("Helvetica-Oblique").fontSize(8.5).fillColor("#555").text(
  "Fin de la synthèse consolidée — les documents sources complets font foi pour le détail et les annexes.",
  { width: W },
);

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});

console.log("PDF écrit :", outPath);
