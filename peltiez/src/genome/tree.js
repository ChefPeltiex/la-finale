import { createGene, EGOR69_CORE_DNA } from "./core";

/**
 * Genetic tree: ties the codebase together as a living organism.
 * This is intentionally small and composable — each module can register its own gene later.
 */
export const EGOR69_GENE_TREE = Object.freeze({
  root: createGene({
    id: "igor.root",
    name: "Egor69 Organism",
    lineage: [],
    purpose: "Faire pousser une plateforme qui soigne (humain + planète) en souveraineté totale.",
    heals: ["friction", "gaspillage", "désorganisation", "inertie"],
    tags: ["organism", "core", "soin"],
  }),
  children: Object.freeze([
    createGene({
      id: "igor.radar.zeldatower",
      name: "Radar — ZeldaTower",
      lineage: ["igor.root"],
      purpose: "Scanner des opportunités (Golden Nuggets) et déclencher l’action concrète.",
      heals: ["aveuglement", "inaction", "perte de temps"],
      tags: ["radar", "opportunities", "realtime"],
    }),
    createGene({
      id: "igor.memory.seedcycle",
      name: "Cycle de la Semence",
      lineage: ["igor.root"],
      purpose: "Faner les idées obsolètes et nourrir l’archive qui servira au prochain Fruit du Dragon.",
      heals: ["dette technique", "oubli", "stagnation"],
      tags: ["regeneration", "archive", "evolution"],
    }),
  ]),
  dna: EGOR69_CORE_DNA,
});

