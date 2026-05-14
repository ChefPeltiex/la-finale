/**
 * Génère docs/DOSSIER-STRATEGIQUE-Meeting-CirculAI-EGOR.pdf (pdfkit, sans navigateur).
 */
import PDFDocument from "pdfkit";
import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "docs", "DOSSIER-STRATEGIQUE-Meeting-CirculAI-EGOR.pdf");

const M = { top: 52, bottom: 52, left: 54, right: 54 };
const doc = new PDFDocument({ size: "A4", margins: M });
const stream = createWriteStream(outPath);
doc.pipe(stream);

const pageWidth = doc.page.width - M.left - M.right;

function heading(text, level = 1) {
  doc.moveDown(level === 1 ? 0.9 : 0.6);
  if (level === 1) {
    doc.fontSize(15).fillColor("#0f3d3e").font("Helvetica-Bold").text(text, { width: pageWidth });
  } else {
    doc.fontSize(11.5).fillColor("#0f3d3e").font("Helvetica-Bold").text(text, { width: pageWidth });
  }
  doc.font("Helvetica").fontSize(10).fillColor("#222");
  doc.moveDown(0.35);
}

function para(text) {
  doc.font("Helvetica").fontSize(10).fillColor("#222").text(text, {
    width: pageWidth,
    align: "justify",
    lineGap: 2,
  });
  doc.moveDown(0.4);
}

function bullet(lines) {
  doc.font("Helvetica").fontSize(10);
  for (const line of lines) {
    doc.fillColor("#222").text(`• ${line}`, { width: pageWidth - 12, indent: 12, lineGap: 1 });
  }
  doc.moveDown(0.45);
}

function warnBox(text) {
  doc.moveDown(0.3);
  doc.rect(M.left, doc.y, pageWidth, 1).stroke("#c90");
  doc.moveDown(0.15);
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#553800").text("Avertissement", { width: pageWidth });
  doc.font("Helvetica").fontSize(9.5).fillColor("#333").text(text, { width: pageWidth, lineGap: 1 });
  doc.moveDown(0.5);
}

// --- Cover
doc.fontSize(17).fillColor("#0f3d3e").font("Helvetica-Bold").text("Dossier stratégique", { align: "center" });
doc.moveDown(0.3);
doc.fontSize(12).text("Présentation & période de questions", { align: "center" });
doc.font("Helvetica").fontSize(10).fillColor("#444").moveDown(0.8);
doc.text("CirculAI / EGOR (IGOR) — Québec", { align: "center" });
doc.moveDown(0.3);
doc.fontSize(8.5).text(
  "Document de travail. Les projections financières et fiscales sont à compléter avec des professionnels habilités.",
  { align: "center", width: pageWidth + 20,
  });
doc.moveDown(1.2);

warnBox(
  "Ne pas insérer de chiffres d’impôts « sauvés » ou de valeur nette future sans validation comptable, fiscale et juridique. Ce PDF structure l’argumentaire.",
);

heading("1. Résumé exécutif", 1);
para(
  "Plateforme québécoise articulant économie circulaire (don, vente, réparation, impact), éducation pratique (fiches, microlearning, hubs) et, le cas échéant, une couche créative ou narrative strictement séparée de l’utilitaire, pour éviter toute confusion avec des champs réglementés (santé, religion, promesses de résultats).",
);
para(
  "État : prototype ou produit navigable et vérifiable techniquement. Demande aux décideurs : mandat de pilote avec critères de succès mesurables (organisations, utilisateurs actifs, actions complétées sur 90 jours), plutôt que des promesses à l’échelle d’une société entière.",
);
para(
  "Piliers : (A) Utilitaire — donner, vendre, réparer, comprendre son impact. (B) Éducatif — contenus modulaires, sources, limites. (C) Exploratoire / fiction — optionnel, étiqueté, non mélangé aux parcours transactionnels institutionnels « secs ».",
);

heading("2. Proposition de valeur", 2);
bullet([
  "Actions regroupées : réduit la fragmentation et la friction cognitive.",
  "Éducation modulaire : fiches type (définition, pourquoi, comment, limites, sources).",
  "Accessibilité : mode essentiel, contrastes, libellés clairs ; feuille de route a11y.",
  "Séparation utilitaire / fiction : crédibilité et clarté pour les institutions.",
  "Architecture modulaire : extensions sans refonte totale.",
]);
para(
  "Formulation : préférer « combinaison documentée pour [segment] au Québec / en français » à « unique au monde », sauf preuve objective.",
);

heading("3. Codex & gouvernance (51 % / 24 % / 25 %)", 2);
para(
  "Présenter la répartition comme intention de gouvernance ou structure cible, sous réserve de négociation et d’avis juridique. Ne pas la figer comme dogme avant signature.",
);
para(
  "Projections (actuel, 6 mois, 1 an, 3, 5, 10 ans) : trois scénarios (bas, milieu, haut) avec page « Hypothèses » (adoption, revenus, coûts, dilution). Insérer : « Projections indicatives, non garanties. »",
);

heading("4. Impôts et taxes", 2);
warnBox(
  "Ne pas promettre un montant d’impôts ou de taxes économisés pour les utilisateurs sans analyse fiscale individualisée.",
);
bullet([
  "La circularité peut réduire certaines dépenses ; ce n’est pas équivalent à « économie d’impôt ».",
  "Dons à OBNL enregistrés : conditions strictes — renvoi à Revenu Québec / ARC et fiscaliste.",
  "Programmes publics : citer uniquement des sources officielles vérifiées.",
]);
para(
  "Phrase de repli : « Les effets fiscaux dépendent de chaque situation ; nous documentons les gestes circulaires ; tout chiffrage fiscal relève d’un professionnel. »",
);

heading("5. « Souveraineté » numérique et physique — délais", 2);
para(
  "Aucun délai unique n’est scientifiquement attestable pour une société entière. Numérique : souvent plusieurs années à une décennie selon la définition opérationnelle. Physique / circulaire : souvent des décennies pour un changement structurel profond.",
);
para(
  "Phrase saine : « Objectif de société qui dépasse un seul produit ; nous proposons des pilotes mesurables avec indicateurs convenus avec les partenaires. »",
);

heading("6. Fortune personnelle", 2);
para(
  "Ne pas présenter des courbes de fortune futures non auditées comme des faits. Parler d’investissement de temps, de coûts directs documentés, et du modèle économique du projet. Projections personnelles nettes : conseillers privés.",
);

heading("7. Analyse SWOT (synthèse)", 2);
bullet([
  "Forces : vision intégrée, prototype, exécution rapide, modularité, cadrage légal/fiction.",
  "Faiblesses : ressources limitées, traction à démontrer, risque de surcharge conceptuelle.",
  "Opportunités : transition écologique, achat local, éducation pratique, services ancrés localement.",
  "Menaces : grands agrégateurs, conformité données/contenus, cycles d’attention courts.",
]);

heading("8. Logistique produit", 2);
bullet([
  "Problème : fragmentation de l’information et des actions circulaires.",
  "Réponse : modules, parcours par intention, contenus standardisés.",
  "Réalisation : application web moderne, contrôle qualité automatisé.",
  "Risques : promesses excessives — mitigés par chartes et séparation des expériences.",
  "Suite : pilote, KPI, itérations avec partenaires.",
]);

heading("9. Après webinaire (période de questions)", 2);
bullet([
  "Accroche (~15 s) : identité + promesse mesurable (pilote + critères).",
  "Preuve (~30 s) : démo courte ou indicateur technique.",
  "Demande : rencontre de 30 minutes pour calendrier de pilote.",
  "Support : QR ou lien vers dossier et contact.",
]);

heading("10. Trame orale (~14 min, à ajuster)", 2);
bullet([
  "Intro : mission en une phrase, ce qui est fonctionnel aujourd’hui.",
  "Utilitaire : quatre intentions ; un parcours complet.",
  "Éducatif : fiche type, limite, source ; quiz ou module court.",
  "Explorateur : radar ou hub.",
  "Fiction (optionnel) : portail séparé, étiquette claire.",
  "Conclusion : base solide ; prochaine étape = pilote chiffré.",
]);

heading("11. Réponses types (questions difficiles)", 2);
const qa = [
  ["Traction ?", "Phase pilote ; métriques cibles sur 90 jours."],
  ["Revenus ?", "Modèle défini ; chiffres après pilote et validation comptable."],
  ["Impôts économisés ?", "Pas de promesse globale ; avis fiscal individuel."],
  ["Délai souveraineté ?", "Dépend des politiques publiques ; pilotes mesurables."],
  ["Pourquoi vous vs un géant ?", "Proximité locale, objectifs circulaires explicites, gouvernance."],
  ["Aspect mythique ?", "Couche optionnelle, fiction signalée ; séparée de l’utilitaire."],
];
for (const [q, a] of qa) {
  doc.font("Helvetica-Bold").fontSize(9.5).text(q, { width: pageWidth });
  doc.font("Helvetica").fontSize(9.5).text(a, { width: pageWidth, lineGap: 1 });
  doc.moveDown(0.35);
}

heading("12. Commandes techniques (équipe)", 2);
para(
  "npm install · npm run verify · npm run verify:deep (selon documentation) · npm run build · npm run preview. Si vérifications guardian avec API : npm run dev:api au préalable.",
);

heading("13. Protocole personnel", 2);
bullet([
  "Priorité au sommeil et à une démo répétée deux fois.",
  "Phrase d’ancrage : « Je m’appuie sur les faits et sur la proposition de pilote. »",
  "Séparer l’estime de soi du résultat d’une seule séance décisionnelle.",
]);

doc.moveDown(1);
doc.fontSize(8.5).fillColor("#666").text(
  "Fin du document — cellules financières vides dans le Codex : intentionnelles, à compléter avec données validées.",
  { width: pageWidth },
);

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});

console.log("PDF écrit :", outPath);
