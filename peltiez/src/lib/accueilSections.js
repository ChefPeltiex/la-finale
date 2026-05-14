/**
 * Ancrages stables de la page d’accueil (`Home.jsx`, attributs `id`).
 * Utiliser avec React Router : `to={linkToHomeSection('accueil-radar')}` ou `to={linkToHomeSection('#accueil-radar')}`.
 */
export const ACCUEIL_SECTION_LINKS = [
  { id: "accueil-radar", label: "Mur radar" },
  { id: "accueil-planete", label: "Planète 3D" },
  { id: "accueil-cosmos", label: "Cosmos de valeurs" },
  { id: "accueil-mathematiques", label: "Monument math" },
  { id: "accueil-annonces", label: "Annonces récentes" },
  { id: "accueil-vision", label: "Vision" },
];

/** @param {string} slug id sans # ou avec # */
export function linkToHomeSection(slug) {
  const id = slug.startsWith("#") ? slug.slice(1) : slug;
  return { pathname: "/", hash: `#${id}` };
}

/** @param {{ path: string, hash?: string } | string} item */
export function navLinkTarget(item) {
  if (typeof item === "string") return item;
  if (item.hash) {
    const h = item.hash.startsWith("#") ? item.hash : `#${item.hash}`;
    return { pathname: item.path, hash: h };
  }
  return item.path;
}
