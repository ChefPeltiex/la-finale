/**
 * Composition « Fiche vivante » — heuristiques IGOR (pas d’appel cloud par défaut).
 * Branchez une vraie IA via OPENAI_API_KEY + IGOR_USE_OPENAI_SHEETS=1 si besoin.
 */

const FORMULES_MATH = [
  {
    id: "euler",
    titre: "Identité d’Euler",
    symbole: "e^{i\\pi}+1=0",
    lecon: (scan) =>
      `Le cercle de ton gestionnaire ${scan.interaction3d.gesture} rencontre l’unité : comme e^{iπ}+1=0, la boucle se referme sans reste — une leçon d’équilibre entre mouvement et point fixe.`,
  },
  {
    id: "pythagore",
    titre: "Théorème de Pythagore",
    symbole: "a^2+b^2=c^2",
    lecon: (scan) =>
      `Élévation (pitch) et dérive (yaw) forment deux côtés ; la trajectoire utile est l’hypoténuse : garde la norme ${scan.interaction3d.zoom.toFixed(2)} comme échelle honnête du triangle réel.`,
  },
  {
    id: "bayes",
    titre: "Théorème de Bayes",
    symbole: "P(A|B)",
    lecon: (scan) =>
      `Le radar révise sa croyance à chaque écho (${scan.radar_echo_db} dB) : P(signal utile | observation) grandit quand tu cadres lentement — patience = mise à jour bayésienne.`,
  },
  {
    id: "shannon",
    titre: "Entropie de Shannon",
    symbole: "H(X)",
    lecon: (scan) =>
      `Ton exploration réduit l’incertitude : chaque seconde de présence (${scan.interaction3d.dwellMs} ms) affine H(X) — moins de bruit, plus de sens.`,
  },
  {
    id: "golden",
    titre: "Nombre d’or φ",
    symbole: "\\varphi",
    lecon: (scan) =>
      `Zoom et pression cadencent comme φ : proportion durable entre intensité (${scan.interaction3d.pointer_pressure.toFixed(2)}) et distance.`,
  },
  {
    id: "newton",
    titre: "Loi fondamentale",
    symbole: "F=ma",
    lecon: (scan) =>
      `Une impulsion nette (geste ${scan.interaction3d.gesture}) produit trajectoire stable ; trop de force sans cadre = dérive — maîtrise l’accélération.`,
  },
  {
    id: "fourier",
    titre: "Série de Fourier",
    symbole: "f(t)",
    lecon: (scan) =>
      `Le signal radar est une somme d’harmoniques : décompose ton geste en petits mouvemes réguliers — la bande ${scan.band} devient mélodie utile.`,
  },
];

function sensationFromScan(scan) {
  const { gesture, dwellMs, zoom, yaw, pitch } = scan.interaction3d;
  const degYaw = ((yaw * 180) / Math.PI).toFixed(1);
  const degPitch = ((pitch * 180) / Math.PI).toFixed(1);

  if (gesture === "orbit") {
    return `Sensation orbitale : tu frôles la sphère comme un satellite — lacet ${degYaw}°, tangage ${degPitch}°, loupe ×${zoom.toFixed(2)}, présence ${dwellMs} ms (texture fluide, presque musicale).`;
  }
  if (gesture === "pinch") {
    return `Sensation de pincement : convergence digitale — zoom ×${zoom.toFixed(2)}, pression ${scan.interaction3d.pointer_pressure.toFixed(2)}, comme si tu calibrais l’épaisseur du réel.`;
  }
  return `Sensation panoramique : translation douce sur ${scan.band}-band, angle ${degYaw}°, élévation ${degPitch}°, échos à ${scan.radar_echo_db} dB — carte vivante qui respire.`;
}

export function composeLivingSheetIgor(scan, index) {
  const formule = FORMULES_MATH[index % FORMULES_MATH.length];
  return {
    id: `fiche_vivante_${scan.id}`,
    scan_id: scan.id,
    titre: `Fiche vivante · ${scan.id}`,
    sensation: sensationFromScan(scan),
    lecon: formule.lecon(scan),
    formule_math_id: formule.id,
    formule_math_titre: formule.titre,
    formule_math_symbole: formule.symbole,
    compose_at: new Date().toISOString(),
    source: "igor_heuristique",
  };
}

export function listFormulesMeta() {
  return FORMULES_MATH.map(({ id, titre, symbole }) => ({ id, titre, symbole }));
}
