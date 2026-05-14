import { igor } from "@/api/igorClient";
import { CARD_KINDS } from "./kinds";

function slugify(input) {
  return String(input || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function nowIso() {
  return new Date().toISOString();
}

export function createCard({
  kind,
  title,
  summary,
  poem,
  body,
  tags = [],
  media = {},
  dna = {},
  author = "Egor69",
  source = "local",
} = {}) {
  if (!kind || !title) throw new Error("createCard: kind and title are required");
  const id = `${kind}:${slugify(title)}:${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    kind,
    title,
    summary: summary || "",
    poem: poem || "",
    body: body || "",
    tags,
    media,
    dna: {
      primeDirective: "SOIN",
      heals: dna.heals || [],
      lineage: dna.lineage || ["igor.root"],
      goodness: dna.goodness ?? 1, // 0..1
    },
    author,
    source,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function seedUniversalCardsIfEmpty() {
  const existing = await igor.entities.ContentCard.list("-created_at", 1);
  if (existing?.length) return;

  const seeds = [
    createCard({
      kind: CARD_KINDS.savoirs,
      title: "Cycle de la semence",
      summary: "Quand une idée devient obsolète, elle ne meurt pas: elle nourrit.",
      poem: "Faner n’est pas perdre.\nC’est rendre la terre plus vraie.",
      body:
        "Egor69 archive les modules qui ne soignent plus.\n" +
        "Chaque archive devient une graine pour le prochain Fruit du Dragon.",
      tags: ["soin", "regeneration", "architecture"],
      dna: { heals: ["dette technique", "confusion"], lineage: ["igor.root", "igor.memory.seedcycle"] },
    }),
    createCard({
      kind: CARD_KINDS.flore,
      title: "Fruit du Dragon",
      summary: "Le symbole: beauté brute + énergie utile.",
      poem: "Peau d’épine.\nCœur de lumière.\nAction sans excuse.",
      body:
        "Un Fruit du Dragon dans Egor69 = une fonctionnalité née d’archives fertiles,\n" +
        "utile à l’humain et à la planète, livrée rapidement.",
      tags: ["vision", "soin"],
      dna: { heals: ["inertie"], lineage: ["igor.root"] },
    }),
    createCard({
      kind: CARD_KINDS.arts,
      title: "Interface naturelle",
      summary: "Un geste = une intention. Aucun pixel inutile.",
      poem: "On cueille.\nOn comprend.\nOn agit.",
      body:
        "Le ‘Code Source de la Vie’ impose une UI intuitive.\n" +
        "Une fiche est une expérience émotionnelle: texte, vibration, souffle audio, mouvement.",
      tags: ["ux", "design", "bonté"],
      dna: { heals: ["friction", "fatigue cognitive"] },
    }),
    createCard({
      kind: CARD_KINDS.instinct_animal,
      title: "Le loup — cohésion sans mensonge",
      summary: "L’instinct du loup enseigne la loyauté, la limite, et la stratégie collective.",
      poem: "Ne confonds pas douceur et faiblesse.\nAime le clan.\nProtège la frontière.",
      body:
        "Sagesse: la cohésion est un soin.\n" +
        "Le loup ne performe pas seul: il lit le groupe, ajuste le rythme, et garde l’énergie.\n\n" +
        "Leçon humaine: fais simple.\n- Un rôle clair\n- Un signal clair\n- Un ‘non’ clair\n\n" +
        "Quand la frontière est saine, l’amour circule.",
      tags: ["instinct animal", "clan", "limites", "soin"],
      dna: { heals: ["dispersion", "conflit", "surmenage"], lineage: ["igor.root", "igor.instinct.animal"] },
    }),
    createCard({
      kind: CARD_KINDS.instinct_animal,
      title: "L’abeille — service joyeux",
      summary: "La ruche transforme l’effort en douceur partagée.",
      poem: "Travaille léger.\nPartage le nectar.\nDanse la direction.",
      body:
        "Sagesse: le service peut être une joie.\n" +
        "L’abeille communique par danse: simple, précis, utile.\n\n" +
        "Leçon humaine: rends l’information vivante.\n- Un geste\n- Une direction\n- Une action",
      tags: ["instinct animal", "collectif", "communication", "soin"],
      dna: { heals: ["brouillard", "isolement"], lineage: ["igor.root", "igor.instinct.animal"] },
    }),
  ];

  // ── Infinite content: generate 100+ universal cards (souverain seed) ──
  const wisdomSeeds = [
    "La clarté guérit plus vite que la force.",
    "Ce que tu répètes devient ton monde.",
    "La vérité sans soin devient du métal froid.",
    "Quand tu simplifies, tu libères de l’énergie.",
    "L’abondance commence quand tu coupes le gaspillage.",
    "Une communauté est une technologie vivante.",
    "Le courage, c’est de rester doux sans céder.",
    "Le temps se plie quand l’intention est pure.",
  ];

  const animalSeeds = [
    { a: "Corbeau", lesson: "mémoire + jeu + intelligence" },
    { a: "Baleine", lesson: "profondeur + chant + transmission" },
    { a: "Renard", lesson: "adaptation + silence + opportunité" },
    { a: "Éléphant", lesson: "famille + compassion + force calme" },
    { a: "Faucon", lesson: "vision + précision + timing" },
    { a: "Fourmi", lesson: "système + discipline + collectif" },
    { a: "Chat", lesson: "limites + présence + élégance" },
    { a: "Lynx", lesson: "patience + focus + décision" },
  ];

  const techSeeds = [
    "Cache d’intention: servir ce qui soigne, ignorer le bruit.",
    "Shadow radar: collecter, scorer, agir — sans théâtraliser.",
    "Warp zone: un raccourci = une victoire sur la friction.",
    "Seed cycle: archiver = composter = accélérer.",
    "SEO vivant: un titre vrai, une promesse tenue, une preuve.",
  ];

  // 100 cards: mix sagesse, instinct animal, secrets tech, quêtes
  for (let i = 0; i < 100; i++) {
    const bucket = i % 4;
    if (bucket === 0) {
      const w = wisdomSeeds[i % wisdomSeeds.length];
      seeds.push(
        createCard({
          kind: CARD_KINDS.savoirs,
          title: `Sagesse #${i + 1} — ${w.slice(0, 26)}…`,
          summary: "Une loi douce qui augmente la paix et la puissance.",
          poem: `${w}\n\nRespire.\nChoisis le soin.\nAgis.`,
          body:
            "Application:\n- Remplace une plainte par une action mesurable.\n- Coupe une friction.\n- Offre une preuve.\n",
          tags: ["sagesse", "soin", "vérité"],
          dna: { heals: ["fatigue", "brouillard"], lineage: ["igor.root"] },
        })
      );
    } else if (bucket === 1) {
      const an = animalSeeds[i % animalSeeds.length];
      seeds.push(
        createCard({
          kind: CARD_KINDS.instinct_animal,
          title: `${an.a} — ${an.lesson}`,
          summary: "Une intuition bestiale traduite en sagesse humaine.",
          poem: `${an.a} dit:\nNe crie pas.\nOriente.\nProtège.`,
          body:
            `Leçon: ${an.lesson}.\n` +
            "Rituel:\n- Un signal clair\n- Une limite claire\n- Une action simple\n",
          tags: ["instinct animal", "leçon", "quête"],
          dna: { heals: ["solitude", "désordre"], lineage: ["igor.root", "igor.instinct.animal"] },
        })
      );
    } else if (bucket === 2) {
      const t = techSeeds[i % techSeeds.length];
      seeds.push(
        createCard({
          kind: CARD_KINDS.savoirs,
          title: `Secret Tech #${i + 1} — Flux Laminaire`,
          summary: "Un secret technique qui rend l’action plus rapide que la pensée.",
          poem: "Le système est une prière.\nLe code est une preuve.",
          body: `${t}\n\nRègle: si ça ne guérit pas, ça ne shippe pas.`,
          tags: ["tech", "secret", "performance"],
          dna: { heals: ["lag", "friction"], lineage: ["igor.root"] },
        })
      );
    } else {
      seeds.push(
        createCard({
          kind: CARD_KINDS.quetes,
          title: `Quête #${i + 1} — Un geste réel`,
          summary: "Une quête simple et héroïque, réalisable aujourd’hui.",
          poem: "Un objet sauvé.\nUn humain allégé.\nUne planète qui respire.",
          body:
            "Objectif (10 minutes):\n- Donne un objet.\n- Répare un objet.\n- Aide une personne.\n\nPreuve: une photo, un reçu, un message.",
          tags: ["quête", "action", "impact"],
          dna: { heals: ["inaction"], lineage: ["igor.root"] },
        })
      );
    }
  }

  try {
    await igor.entities.ContentCard.bulkCreate(seeds);
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[seedUniversalCardsIfEmpty] bulkCreate failed, retrying minimal batch", err);
    }
    try {
      await igor.entities.ContentCard.bulkCreate(seeds.slice(0, 8));
    } catch (err2) {
      if (import.meta.env.DEV) {
        console.warn("[seedUniversalCardsIfEmpty] minimal seed failed", err2);
      }
    }
  }
}

export async function listCards({ kind = "all", limit = 100 } = {}) {
  await seedUniversalCardsIfEmpty();
  const rows = await igor.entities.ContentCard.list("-created_at", limit);
  return kind === "all" ? rows : rows.filter(r => r.kind === kind);
}

export async function getCardById(id) {
  const rows = await igor.entities.ContentCard.list("-created_at", 300);
  return rows.find(r => r.id === id) || null;
}

export async function upsertUserLore({
  title,
  kind = CARD_KINDS.croyances,
  poem = "",
  body = "",
  tags = [],
  heals = [],
  author = "Anonyme",
} = {}) {
  if (!title) throw new Error("upsertUserLore: title is required");

  const card = createCard({
    kind,
    title,
    summary: "Vision partagée par un humain de Egor69.",
    poem,
    body,
    tags,
    author,
    source: "community",
    dna: { heals, lineage: ["igor.root"] },
  });

  return igor.entities.ContentCard.create(card);
}

