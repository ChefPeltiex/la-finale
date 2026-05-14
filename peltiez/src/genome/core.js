export const EGOR69_CORE_DNA = Object.freeze({
  name: "Egor69",
  primeDirective: "SOIN",
  pillars: Object.freeze([
    "Soin de l'utilisateur",
    "Soin de la planète",
    "Souveraineté (contrôle total)",
    "Simplicité (naturelle comme un fruit)",
    "Régénération (faner → nourrir)",
  ]),
});

export function createGene({
  id,
  name,
  lineage = [],
  purpose,
  heals = [],
  owner = "Egor69",
  status = "alive", // alive | fading | archived
  tags = [],
} = {}) {
  if (!id || !name) throw new Error("createGene: id and name are required");
  if (!purpose) throw new Error("createGene: purpose is required");

  return {
    id,
    name,
    lineage,
    purpose,
    heals,
    owner,
    status,
    tags,
    bornAt: new Date().toISOString(),
  };
}

