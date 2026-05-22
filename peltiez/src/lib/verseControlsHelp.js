/**
 * Lignes d’aide affichées dans le dialogue Verse (desktop vs tactile).
 * @param {boolean} touch
 * @returns {{ k: string, d: string }[]}
 */
export function buildVerseControlsHelp(touch) {
  const rows = [
    {
      k: touch ? "Toucher le canvas" : "Clic canvas",
      d: touch
        ? "premier toucher = activer le regard ; glisser pour orienter"
        : "verrouiller la souris (regard FPS / orbite)",
    },
    { k: "W A S D · ↑ ↓ ← →", d: "avancer / reculer / strafe (↑ = vers l’horizon)" },
    { k: "Shift", d: "sprint cosmique" },
    { k: "Espace", d: "saut ; maintenir = glisse" },
    { k: "E / Entrée", d: "traverser un portail quand vous êtes proche" },
    { k: "Interface 2D", d: "retour au site CirculAI / Egor69" },
  ];

  if (touch) {
    rows.splice(1, 0, {
      k: "Joystick virtuel",
      d: "sur mobile : zone bas-gauche du canvas pour avancer (si activé)",
    });
  }

  return rows;
}
