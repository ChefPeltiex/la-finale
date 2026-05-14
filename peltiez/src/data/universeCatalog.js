/**
 * Catalogue de personnalisation — thèmes, ambiances sonores (presets), props symboliques, packs « archetypes ».
 * Pas de marques tierces : inspirations génériques uniquement.
 */

export const THEME_PRESETS = [
  { id: "ember_court", name: "Cour des braises", accent: "#f97316", mood: "Chaleur stratégique, contraste élevé.", density: "comfortable" },
  { id: "quantum_forest", name: "Forêt quantique", accent: "#34d399", mood: "Circulaire, organique, radar visible.", density: "compact" },
  { id: "obsidian_archive", name: "Archive d’obsidienne", accent: "#a78bfa", mood: "Lecture longue, halo violet.", density: "comfortable" },
  { id: "solar_harbor", name: "Port solaire", accent: "#38bdf8", mood: "Clarté maritime, navigation aisée.", density: "airy" },
  { id: "heart_curve", name: "Courbe du cœur", accent: "#fb7185", mood: "Courbes douces, emphase bienveillance.", density: "comfortable" },
  { id: "monochrome_oath", name: "Serment monochrome", accent: "#e5e7eb", mood: "Contrôle visuel minimal.", density: "compact" },
  {
    id: "sovereign_alpha",
    name: "Singularité souveraine (fiction)",
    accent: "#059669",
    mood: "Accent fleurdelisé doux — lore cheat, pas une certification officielle.",
    density: "comfortable",
  },
];

/** Ambiances musicales = labels UX ; le lecteur réel dépend des fichiers hébergés plus tard. */
export const MUSIC_MOODS = [
  { id: "silent", name: "Silence sacré", hint: "Aucune boucle — concentration maximale." },
  { id: "pulse_green", name: "Pulsation verte", hint: "Ambient minimal synthétique (placeholder)." },
  { id: "tapestry_strings", name: "Tapisserie à cordes", hint: "Orchestral léger (placeholder)." },
  { id: "urban_night", name: "Nuit urbaine douce", hint: "Trip-hop feutré (placeholder)." },
  { id: "ceremonial_drone", name: "Drone cérémoniel", hint: "Textures longues (placeholder)." },
  { id: "circularity_loop", name: "Boucle circulaire", hint: "Rythme régulier travail / pause (placeholder)." },
];

export const HUD_PRESETS = [
  { id: "navigator", name: "Navigateur", desc: "Sidebar dense, radar mental activé." },
  { id: "atelier", name: "Atelier", desc: "Zones larges, focus création / listings." },
  { id: "sanctuary", name: "Sanctuaire", desc: "Respiration visuelle, blocs espacés." },
];

/** Props décoratifs / outils symboliques débloqués par XP ou quêtes. */
export const UNIVERSE_PROPS = [
  { id: "tool_compass", name: "Boussole circulaire", costXp: 120, realm: "navigation", blurb: "Oriente listing ↔ besoin local." },
  { id: "tool_seedvault", name: "Chambre à graines", costXp: 200, realm: "economy", blurb: "Rappelle les dons cumulés." },
  { id: "tool_repair_anvil", name: "Enclume réparable", costXp: 260, realm: "craft", blurb: "Bonus psychologique aux annonces réparation." },
  { id: "tool_echo_mirror", name: "Miroir d’écho", costXp: 180, realm: "social", blurb: "Reflet des engagements publics." },
  { id: "tool_star_chart", name: "Carte stellaire locale", costXp: 320, realm: "cosmos", blurb: "Accès cosmologie & cartes." },
  { id: "tool_heart_sigil", name: "Sceau courbe cœur", costXp: 400, realm: "identity", blurb: "Accent rose & animations douces." },
  { id: "tool_quant_grid", name: "Grille quantique décorative", costXp: 550, realm: "visual", blurb: "Fond grille subtile (purement UI)." },
];

/** Costumes génériques « masques du héros » — pas de licences externes. */
export const ARCHETYPE_COSTUMES = [
  { id: "mask_solar_champion", name: "Champion solaire", costXp: 280, blurb: "Or & cape stylisée." },
  { id: "mask_night_sentinel", name: "Sentinelle nocturne", costXp: 280, blurb: "Silhouette trait bleu nuit." },
  { id: "mask_ocean_sovereign", name: "Souverain océanique", costXp: 310, blurb: "Écailles stylisées aquatiques." },
  { id: "mask_machine_sympath", name: "Sympathétique mécanique", costXp: 340, blurb: "Lignes chromées douces." },
  { id: "mask_verdant_archivist", name: "Archiviste verdoyant", costXp: 260, blurb: "Robe herbacée & sceaux." },
];
