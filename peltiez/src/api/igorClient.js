import { MYTHOLOGY_ESOTERIC_PARTIALS } from "@/data/mythologyEsotericSeeds.js";
import { WELLNESS_ESOTERIC_PARTIALS } from "@/data/wellnessEsotericSeeds.js";
import { DIVINATION_ESOTERIC_PARTIALS } from "@/data/divinationEsotericSeeds.js";

const STORAGE_PREFIX = "igor:entity:";

function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function randomId() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function entityKey(name) {
  return `${STORAGE_PREFIX}${name}`;
}

function readEntityStore(name) {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(entityKey(name));
  const arr = safeJsonParse(raw || "[]", []);
  return Array.isArray(arr) ? arr : [];
}

function writeEntityStore(name, rows) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(entityKey(name), JSON.stringify(rows));
}

function ensureSeed(name) {
  const existing = readEntityStore(name);
  if (existing.length) return;

  // Minimal seeds for the most common screens.
  if (name === "Listing") {
    writeEntityStore(name, [
      {
        id: randomId(),
        title: "Première annonce Egor69",
        type: "vente",
        status: "actif",
        price: 42,
        views: 7,
        co2_saved: 3.2,
        created_date: nowIso(),
      },
    ]);
    return;
  }

  if (name === "ConsciousnessDirector") {
    writeEntityStore(name, [
      {
        id: randomId(),
        dimension: "igor",
        active_users_connected: 1,
        global_xp_pool: 100,
        harmony_frequency: 528,
        consciousness_index: 77,
        active_quests: 3,
        collective_evolution_stage: "alpha",
        last_sync: nowIso(),
        next_cosmic_event: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
    ]);
    return;
  }

  if (name === "Archive") {
    writeEntityStore(name, []);
    return;
  }

  if (name === "ContentCard") {
    writeEntityStore(name, []);
    return;
  }

  if (name === "Metric") {
    writeEntityStore(name, []);
    return;
  }

  if (name === "IncidentReport") {
    writeEntityStore(name, []);
    return;
  }

  if (name === "EsotericPractice") {
    const mk = (partial) => ({
      id: randomId(),
      is_published: true,
      created_date: nowIso(),
      difficulty: "intermediaire",
      principles: [],
      ...partial,
    });
    writeEntityStore(name, [
      mk({
        title: "Grimoire et « secret » — dispositif culturel",
        tradition: "alchimie",
        origin: "Europe · histoire des livres",
        description:
          "Le grimoire fixe procédures et symboles ; l’étiquette « secret » peut désigner un manuscrit rituel, un objet ludique (carnet verrouillé) ou un motif de fiction. Distinguer sources savantes, commerce et récit. (Synthèse — croiser avec corpus primaire.)",
        principles: ["Discours d’autorité", "Marchandisation possible"],
      }),
      mk({
        title: "Druidisme antique — prudence des sources",
        tradition: "autre",
        origin: "Monde celtique (témoignages externes)",
        description:
          "Les druides apparaissent surtout chez des auteurs latins (ex. César) et dans des textes irlandais médiévaux : prêtres, juges, détenteurs d’un savoir souvent oral. Nuancer les réinventions néo-druidiques.",
        principles: ["Oralité", "Sources biaisées possibles"],
      }),
      mk({
        title: "Chamanisme — distribution et techniques",
        tradition: "chamanisme",
        origin: "Sibérie · Amériques · Asie",
        description:
          "Pratiques d’états modifiés de conscience (tambour, chant, parfois plantes) pour médiation, soin ou divination. Le néo-chamanisme occidental soulève éthique et appropriation — à signaler.",
        principles: ["Transe / voyage", "Contextes culturels"],
      }),
      mk({
        title: "Sorcières et chasse aux sorcières (XVIe–XVIIe)",
        tradition: "autre",
        origin: "Europe et colonies",
        description:
          "Les accusations mêlent crise sociale, genre et politique ; beaucoup d’accusées étaient des voisines ou des guérisseuses. Appuyer sur archives judiciaires et historiographie.",
        principles: ["Persécution documentée", "Lecture critique"],
      }),
      mk({
        title: "Anges et archanges — hiérarchies variables",
        tradition: "autre",
        origin: "Judaïsme · christianisme · islam",
        description:
          "Messagers et intercesseurs ; noms et rôles d’archanges diffèrent selon canons et traditions postérieures (apocryphes, mystique, art). Séparer canon, commentaire et folklore.",
        principles: ["Médiation", "Sources par courant"],
      }),
      mk({
        title: "J. R. R. Tolkien — mythopoïèse",
        tradition: "autre",
        origin: "Royaume-Uni · XXe siècle",
        description:
          "Terre du Milieu : Hobbit, Seigneur des Anneaux, Silmarillion et corpus posthume. Philologie, langues inventées, tonalité épique — passerelle « savoir / fiction ».",
        principles: ["Légende artificielle", "Profondeur narrative"],
      }),
      mk({
        title: "J. K. Rowling — saga et prolongements",
        tradition: "autre",
        origin: "Royaume-Uni · 1997–",
        description:
          "Harry Potter (7 romans), extensions scénaristiques et œuvres pour adultes. Distinction utile : univers fictionnel vs pratiques spirituelles réelles.",
        principles: ["Initiation scolaire fictionnelle", "Rayonnement global"],
      }),
      mk({
        title: "Michel-Ange — sculpture, fresque, architecture",
        tradition: "autre",
        origin: "Italie · Renaissance",
        description:
          "David, Pietà, plafond de la Sixtine, participation à Saint-Pierre. Œuvres inachevées et carnets : accroches pédagogiques avec visuels de musée / domaine public.",
        principles: ["Terribilità", "Corps et espace"],
      }),
      mk({
        title: "Léonard de Vinci — observation et invention",
        tradition: "autre",
        origin: "Italie · Renaissance",
        description:
          "Peinture (Joconde, Cène), carnets d’anatomie et d’ingénierie. « Saper vedere » : module Art+Science possible sur la plateforme.",
        principles: ["Dessin / mesure", "Curiosité naturelle"],
      }),
      mk({
        title: "William Shakespeare — théâtre et corpus",
        tradition: "autre",
        origin: "Angleterre · 1564–1616",
        description:
          "Tragédies, comédies, histoires ; sonnets. First Folio (1623). Monologues audio et cartes des lieux fictifs pour enrichir une fiche.",
        principles: ["Langue vivante", "Patrimoine mondial"],
      }),
      mk({
        title: "Molière — comédie et satire des mœurs",
        tradition: "autre",
        origin: "France · XVIIe siècle",
        description:
          "Tartuffe, Misanthrope, Avare, Malade imaginaire : censure, cour, comédie-ballet. Parallèle possible avec « rituel social » vs discours du secret.",
        principles: ["Comédie de mœurs", "Polémique publique"],
      }),
      ...MYTHOLOGY_ESOTERIC_PARTIALS.map((p) => mk(p)),
      ...WELLNESS_ESOTERIC_PARTIALS.map((p) => mk(p)),
      ...DIVINATION_ESOTERIC_PARTIALS.map((p) => mk(p)),
    ]);
    return;
  }

  if (name === "Practitioner") {
    writeEntityStore(name, [
      {
        id: "prac-demo-naturo-mtl",
        full_name: "Claire Rousseau — naturopathie",
        bio: "Bilan terrain, sommeil, nutrition douce ; orientation médicale si signaux d’alerte. Consultations en français.",
        specialties: ["naturopathie", "nutrition"],
        is_active: true,
        rating: 4.9,
        consultation_price: 85,
        photo_url: "",
        created_date: nowIso(),
      },
      {
        id: "prac-demo-massage-qc",
        full_name: "Marc Therrien — massage & fascias",
        bio: "Suédois, pierres chaudes, suivi cancer en coordination oncologique. Consentement et pression négociés.",
        specialties: ["massage", "meditation"],
        is_active: true,
        rating: 4.8,
        consultation_price: 70,
        photo_url: "",
        created_date: nowIso(),
      },
      {
        id: "prac-demo-acu",
        full_name: "Mei Lin — acupuncture",
        bio: "MTC et nausées induites ; douleur chronique sélectionnée. Aiguilles à usage unique.",
        specialties: ["acupuncture", "meditation"],
        is_active: true,
        rating: 4.95,
        consultation_price: 95,
        photo_url: "",
        created_date: nowIso(),
      },
      {
        id: "prac-demo-sophro",
        full_name: "Samuel Boisvert — sophrologie",
        bio: "Préparation examens, stress chronique léger, protocols courts. Orientation psychiatrique si besoin.",
        specialties: ["sophrologie", "meditation"],
        is_active: true,
        rating: 4.7,
        consultation_price: 60,
        photo_url: "",
        created_date: nowIso(),
      },
      {
        id: "prac-demo-yoga",
        full_name: "Anaïs Perreault — yoga & mouvement",
        bio: "Hatha doux, respiration, intégration bureau ; pas de promesse thérapeutique hors cadre.",
        specialties: ["yoga", "nutrition"],
        is_active: true,
        rating: 4.85,
        consultation_price: 55,
        photo_url: "",
        created_date: nowIso(),
      },
      {
        id: "prac-demo-herboriste",
        full_name: "Émile Fontaine — herboristerie conseil",
        bio: "Phytothérapie prudente, interactions médicamenteuses signalées ; vente de tisanes et livrets pédagogiques.",
        specialties: ["herboristerie", "nutrition"],
        is_active: true,
        rating: 4.6,
        consultation_price: 45,
        photo_url: "",
        created_date: nowIso(),
      },
      {
        id: "prac-demo-coach",
        full_name: "Jordan Malik — coaching holistique",
        bio: "Cadre biopsychosocial : sommeil, charge mentale, sport léger. Distinction coaching / thérapie clinique.",
        specialties: ["coaching", "meditation"],
        is_active: true,
        rating: 4.75,
        consultation_price: 80,
        photo_url: "",
        created_date: nowIso(),
      },
      {
        id: "prac-demo-nutri",
        full_name: "Drissa Koné — nutrition fonctionnelle",
        bio: "Repas, micronutrition ciblée avec bilan ; vigilance interactions thyroïdiennes et anticoagulants.",
        specialties: ["nutrition", "naturopathie"],
        is_active: true,
        rating: 4.88,
        consultation_price: 90,
        photo_url: "",
        created_date: nowIso(),
      },
      {
        id: "prac-demo-homeo",
        full_name: "Hélène Morisset — homéopathie (information)",
        bio: "Séances d’information et cadre de prudence ; orientation médicale pour toute pathologie grave. Pas de substitution aux antibiotiques.",
        specialties: ["homeopathie", "naturopathie"],
        is_active: true,
        rating: 4.2,
        consultation_price: 65,
        photo_url: "",
        created_date: nowIso(),
      },
    ]);
    return;
  }

  if (name === "Transaction") {
    writeEntityStore(name, []);
    return;
  }

  // Default: empty store
  writeEntityStore(name, []);
}

function makeEntityApi(name) {
  ensureSeed(name);

  const notify = (event) => {
    if (typeof window === "undefined") return;
    try {
      window.dispatchEvent(
        new CustomEvent("igor:entity-event", {
          detail: { entity: name, ...event },
        }),
      );
    } catch {
      // ignore
    }
  };

  return {
    subscribe(handler) {
      if (typeof window === "undefined") return () => {};

      const onEvt = (e) => {
        const detail = e?.detail;
        if (!detail || detail.entity !== name) return;
        handler(detail);
      };

      window.addEventListener("igor:entity-event", onEvt);
      return () => window.removeEventListener("igor:entity-event", onEvt);
    },
    async list(sort = null, limit = 100) {
      const rows = readEntityStore(name);
      let out = [...rows];

      // Support "-created_date" quick sort
      if (typeof sort === "string" && sort.length > 1) {
        const desc = sort.startsWith("-");
        const field = desc ? sort.slice(1) : sort;
        out.sort((a, b) => {
          const av = a?.[field];
          const bv = b?.[field];
          if (av === bv) return 0;
          if (av == null) return 1;
          if (bv == null) return -1;
          return desc ? (av < bv ? 1 : -1) : (av < bv ? -1 : 1);
        });
      }

      return out.slice(0, limit);
    },
    async filter(query = {}, sort = null, limit = 100) {
      const rows = await this.list(sort, Number.POSITIVE_INFINITY);
      const q = query && typeof query === "object" ? query : {};
      const out = rows.filter((row) => {
        return Object.entries(q).every(([k, v]) => row?.[k] === v);
      });
      return out.slice(0, limit);
    },
    async get(id) {
      const rows = readEntityStore(name);
      const row = rows.find((r) => r?.id === id);
      if (!row) throw new Error(`${name}.get: not found`);
      return row;
    },
    async create(data) {
      const rows = readEntityStore(name);
      const row = { id: randomId(), created_date: nowIso(), ...data };
      rows.unshift(row);
      writeEntityStore(name, rows);
      notify({ op: "create", record: row });
      return row;
    },
    async update(id, patch) {
      const rows = readEntityStore(name);
      const idx = rows.findIndex(r => r?.id === id);
      if (idx === -1) throw new Error(`${name}.update: not found`);
      rows[idx] = { ...rows[idx], ...patch, updated_date: nowIso() };
      writeEntityStore(name, rows);
      notify({ op: "update", record: rows[idx] });
      return rows[idx];
    },
    async delete(id) {
      const rows = readEntityStore(name);
      writeEntityStore(name, rows.filter(r => r?.id !== id));
      notify({ op: "delete", id });
      return { ok: true };
    },
    async bulkCreate(records = []) {
      const rows = readEntityStore(name);
      const created = [];
      for (const r of Array.isArray(records) ? records : []) {
        const row = { id: randomId(), created_date: nowIso(), ...r };
        rows.unshift(row);
        created.push(row);
      }
      writeEntityStore(name, rows);
      if (created.length) notify({ op: "bulkCreate", records: created });
      return created;
    },
  };
}

async function localFunctionInvoke(name, payload) {
  switch (name) {
    case "goldenNuggets": {
      const nuggets = [
        {
          emoji: "🟡",
          type: "opportunite",
          urgency: "haute",
          value_score: 8,
          title: "Scanner: partenaires locaux",
          insight: "Repère 5 commerces alignés et propose un échange circulaire.",
          action: "Ouvrir un canal partenaire + offre d’essai 7 jours",
        },
        {
          emoji: "⚡",
          type: "tendance",
          urgency: "moyenne",
          value_score: 6,
          title: "Micro-communautés",
          insight: "Les hubs de quartier convertissent mieux que les feeds globaux.",
          action: "Activer ‘MicroCommunautés’ comme homepage alternative",
        },
      ];

      return {
        top_opportunity: nuggets[0].title,
        scan_summary: "Scan local (mode souverain) — données simulées, prêtes à être branchées sur ta source temps-réel.",
        synthesis: {
          opportunite: "Focus partenaires + activation Micro-communautés",
          strategie: "Ship vite, mesure, itère, verrouille le réseau",
          gain_cad: "$500–$2,000 / semaine (hypothèse early)",
        },
        nuggets,
      };
    }

    case "executeNugget": {
      const nugget = payload?.nugget || {};
      return {
        plan_action: `1) Définir l’objectif (KPI)\n2) Écrire l’offre simple\n3) Lancer en 24h\n4) Mesurer + améliorer`,
        brouillon_subvention: `Objet: Déploiement rapide Egor69\nRésumé: Accélérer l’économie circulaire via un radar d’opportunités et des micro-communautés.`,
        ressources: [
          "Checklist lancement: landing + analytics + boucle feedback",
          "Script outreach partenaires (DM + email)",
          `Nugget: ${nugget.title || "N/A"}`,
        ],
      };
    }

    case "syncDynamicFeed": {
      return {
        ok: true,
        synced_at: new Date().toISOString(),
        note: "Mode souverain : synchronisation simulée (aucun appel HTTP /api/functions requis).",
      };
    }

    case "secureExportUserData": {
      const stamp = new Date().toISOString();
      let hashHex = "";
      try {
        if (globalThis.crypto?.subtle) {
          const digest = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(`sovereign-export|${stamp}`),
          );
          hashHex = Array.from(new Uint8Array(digest))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        }
      } catch {
        hashHex = "";
      }
      if (!hashHex) {
        hashHex = `stub-${randomId()}${randomId()}`;
      }
      return {
        ok: true,
        filename: `export-egor69-${stamp.slice(0, 10)}.json`,
        content_sha256: hashHex,
        export: {
          sovereignty: "local",
          generated_at: stamp,
          message:
            "Jeu de données d’exemple en mode souverain — remplacer par une vraie source si branchage métier.",
          listings: [],
          stats: {},
        },
      };
    }

    case "generateMonthlyReport": {
      const month = new Date().toISOString().slice(0, 7);
      const body =
        `Rapport d’impact mensuel — Egor69 (mode souverain)\n` +
        `Période : ${month}\n` +
        `Généré : ${new Date().toISOString()}\n\n` +
        `Ce fichier texte remplace un PDF tant que la chaîne de production n’est pas branchée.\n` +
        `Sections prévues : CO₂, annonces, scoops, engagement — valeurs N/A en démo.\n`;
      return {
        ok: true,
        filename: `rapport-impact-${month}.txt`,
        mime: "text/plain;charset=utf-8",
        body,
      };
    }

    default:
      return {
        ok: false,
        notImplemented: true,
        function: name,
        message: `Function '${name}' is not implemented in sovereign mode yet.`,
        payload,
      };
  }
}

export const igor = {
  // Local-only runtime surface (no external infra dependency).
  entities: new Proxy(
    {},
    {
      get(_target, prop) {
        if (typeof prop !== "string") return undefined;
        return makeEntityApi(prop);
      },
    }
  ),
  functions: {
    async invoke(name, payload) {
      const data = await localFunctionInvoke(name, payload);
      return { data };
    },
  },
  integrations: {
    Core: {
      async SendEmail() {
        return { ok: true, note: "stub_send_email" };
      },
      async UploadFile({ file } = {}) {
        return {
          ok: true,
          fileId: randomId(),
          name: file?.name || "upload",
          note: "stub_upload_file",
        };
      },
      async ExtractDataFromUploadedFile() {
        return { ok: true, extracted: [], note: "stub_extract" };
      },
      async InvokeLLM({ prompt } = {}) {
        return {
          ok: true,
          text:
            typeof prompt === "string"
              ? `Mode souverain (stub LLM): ${prompt.slice(0, 240)}`
              : "Mode souverain (stub LLM).",
          note: "stub_invoke_llm",
        };
      },
    },
  },
  auth: {
    async isAuthenticated() {
      return import.meta.env.VITE_IGOR_SOVEREIGN_ADMIN === "1";
    },
    async me() {
      if (import.meta.env.VITE_IGOR_SOVEREIGN_ADMIN === "1") {
        return {
          role: "admin",
          email: "sovereign-admin@egor69.local",
          full_name: "Administrateur Egor69",
        };
      }
      return null;
    },
    logout() {
      // no-op in sovereign mode
    },
    redirectToLogin() {
      // no-op in sovereign mode
    },
  },
};

