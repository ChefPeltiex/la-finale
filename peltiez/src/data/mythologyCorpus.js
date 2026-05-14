/**
 * Corpus mythologiques comparés — visée pédagogique (sources antiques, réceptions modernes, prudence interprétative).
 * Aucune prétention d’orthopraxie religieuse ; contextualiser toujours les traditions vivantes.
 */

/** @typedef {{ id: string, label: string, region: string, period: string, overview: string, pantheon: string[], themes: string[], syncretism: string, caution: string, further: string[] }} MythFamily */

/** @type {MythFamily[]} */
export const MYTHOLOGY_FAMILIES = [
  {
    id: "grecque",
    label: "Mythologie grecque",
    region: "Égée, Hellade, Grande-Grèce, colonies méditerranéennes",
    period: "IIe millénaire av. J.-C. → antiquité tardive ; réception infinie (Renaissance, romantisme, cinéma).",
    overview:
      "Panorama polythéiste articulé autour de l’Olympe, des chthoniens et des héros culturels. Les mythes grecs circulent par la poésie (Homère, Hésiode), la tragédie et la vase-peinture ; ils fixent des normes sur le pouvoir, la justice, la mortalité et la métamorphose. La distinction entre « mythe » religieux, allegoria philosophique et fiction littéraire est déjà ancienne chez les auteurs antiques. Les versions divergent selon les cités et les époques : il n’existe pas une « Bible païenne » unique.",
    pantheon: [
      "Zeus / Jupiter — souveraineté céleste, foudre, ordre cosmique (nombreux épisodes de justice ambivalente).",
      "Héra / Junon — mariage, cité, souveraineté féminine ; jalousies mythiques souvent lues comme allégories politiques.",
      "Poséidon — mers, séismes, chevaux ; rivalités fondateurs (Athènes).",
      "Athéna — stratégie, artisanat, citoyenneté ; patronne d’Athènes.",
      "Apollon & Artémis — mesure, oracle, chasse sauvage ; lumière et limite.",
      "Déméter & Koré / Perséphone — cycles agricoles et initiations (Éleusis).",
      "Dionysos — extase, théâtre, dissolution/recomposition des frontières.",
      "Hadès & Perséphone — chthonie, loi des morts, récits de descente (katabase).",
      "Hermès — passages, messager, psychopompe.",
      "Héphaïstos — forge, technique, marginalité sacrée.",
      "Arès / Aphrodite / Héstia — guerre désordonnée, désir, foyer sacré du polos.",
    ],
    themes: ["Moira et hubris", "Xenia (hospitalité sacrée)", "Héroïsation et kleos", "Métamorphoses (Ovide comme réécriture latine)", "Tragédie et conflit de normes"],
    syncretism:
      "Interprétations romaines, néo-platoniciennes, puis chrétiennes (Euhemeros, allégories morales) ; aujourd’hui fantasy et psychologie analytique (outils critiques, non dogmes).",
    caution:
      "Ne pas confondre sources archéologiques (cultes locaux) et récits tardifs ; attention aux projections nationalistes modernes sur « l’âme grecque ».",
    further: ["Hésiode, Théogonie", "Homère, Iliade & Odyssée", "Burkert (travaux sur la religion grecque)", "CNRS / encyclopédies spécialisées"],
  },
  {
    id: "egyptienne",
    label: "Mythologie égyptienne",
    region: "Vallée du Nil, déserts adjacents, influences nubienne et méditerranéenne",
    period: "Pré-dynastique → époque gréco-romaine ; théologies multiples selon nome et dynastie.",
    overview:
      "Système théologique en strates : dieux locaux, triades, fusions (ex. syncrétismes d’Amon), mythes de création divergents (Héliopolis, Hermopolis, Memphis, Thèbes). Osiris, Isis, Horus et Seth structurent la royauté, la fertilité et l’outre-tombe. L’écrit hiéroglyphique et les images temple sont des modes de transmission aussi importants que les récits linéaires. La « mort » du dieu et sa régénération rythment le cosmos et le pharaon.",
    pantheon: [
      "Rê / Atoum — soleil créateur (versions héliopolitaines).",
      "Geb & Nout — terre et ciel ; espace cosmique pour le dieu solaire.",
      "Osiris — roi tué, juge des morts, végétation ; Isis — magie, fidélité, trône.",
      "Horus — royauté vivante ; Seth — tempête, désert, désordre nécessaire.",
      "Ptah — parole créatrice (Memphis) ; Thot — écrit, mesure du temps.",
      "Hathor / Sekhmet — lactée et lionne ; Anubis — passages funéraires.",
      "Maât — vérité-cosmique ; Ammout — dévoreuse des cœurs pesés.",
    ],
    themes: ["Pesée du cœur", "Duat et cartographie infernale", "Renouvellement du roi-dieu", "Animalité divine (zoomorphisme)", "Multilinguisme (hiéroglyphes, démotique, grec)"],
    syncretism:
      "Époque ptolémaïque et romaine : identifications grecques (Sérapis), cultes isiaques dans le bassin méditerranéen.",
    caution:
      "Éviter l’exotisme « mystique Égypte » sans contexte funéraire et social ; respecter les sensibilités sur la réutilisation d’images sacrées.",
    further: ["Livre des Morts (traductions commentées)", "Assmann (mémoire culturelle)", "Museo Egizio / Louvre — notices"],
  },
  {
    id: "celtique",
    label: "Mythologie celtique (Irlande, Galles, Bretagne)",
    region: "Îles britanniques, Armorique ; traces continentales (Gaule, Hispania)",
    period: "Âge du fer → christianisation ; rémanences médiévales (cycles irlandais, Mabinogion).",
    overview:
      "Corpus fragmenté : sources chrétiennes médiévales (Lebor Gabála, Táin Bó Cúailnge, Mabinogion) mêlent matériaux plus anciens et cadres monastiques. Dieux panthéistes souvent réduits en « rois sidhe », héros semi-divins (Cú Chulainn), géographie enchantée (Tír na nÓg). La druidité antique est surtout vue par des auteurs extérieurs (César) : prudence méthodologique maximale.",
    pantheon: [
      "Dagda — plente, club, chaudron ; Morrigan — guerre, corbeaux, souveraineté.",
      "Lugh — arts, lumière ; Brigit — forge, poésie, seuil (syncrétisme sainte Brigitte).",
      "Manannán mac Lir — mer, autres mondes ; Rhiannon / Pryderi cycle gallois.",
      "Arawn — Annwn (autre monde gallois) ; Lleu Llaw Gyffes — druide et roi dans le quatrième branchement.",
    ],
    themes: ["Autres mondes (sid)", "Initiation guerrière", "Géographie sacrée", "Chevaux et bovins mythiques", "Christianisation et recodage"],
    syncretism:
      "Légendes arthuriennes empruntent des motifs celtiques ; néodruidismes modernes réinventent des pratiques — à distinguer des sources.",
    caution:
      "Ne pas amalgamer toutes les « Celtes » ; les sources irlandaises ne sont pas galloises ; éviter la pure invention « druidique » commerciale.",
    further: ["Mabinogion (trad.)", "Táin (extraits commentés)", "Delamarre (onomastique)", "articles Académie"],
  },
  {
    id: "nordique",
    label: "Mythologie nordique (scandinave & germanique du Nord)",
    region: "Scandinavie, Islande, expansions vikings",
    period: "Viking Age + Edda poétique et en prose (XIIIe s., Islande).",
    overview:
      "Cosmologie en mondes (Yggdrasil), Ragnarök comme horizon de destruction/régénération, dieux Æsir et Vanir (échange Njörd/Freyr/Freya). Odin : souveraineté magique, sacrifice de soi sur l’arbre ; Thor : protection de l’ordre cosmique contre géants ; Loki : ambivalence, moteur narratif. Snorri Sturluson systématise mais interprète — toujours croiser archéologie (amulettes, pierres runiques) et poésies skaldiques.",
    pantheon: [
      "Odin — runes, valkyries, einherjar ; Frigg — savoir différé.",
      "Thor — Mjöllnir ; Freyja — seiðr, fécondité ; Freyr — paix agraire.",
      "Týr — contrat guerrier ; Heimdall — seuil du Bifröst ; Hel — royaume éponyme.",
      "Jörmungandr / Fenrir / Sleipnir — cosmologie et enjeux du Ragnarök.",
    ],
    themes: ["Honneur et gift-cycle", "Runes et performativité", "Givre vs feu", "Mort héroïque", "Christianisation tardive des sources"],
    syncretism:
      "Influences continentales germaniques ; récupérations politiques du XIXe–XXe s. à dénoncer clairement.",
    caution:
      "Usages néo-païens et extrémistes : séparer reconstitution historique, pratique spirituelle contemporaine et idéologies.",
    further: ["Edda poétique", "Edda de Snorri", "Simek (dictionnaire)", "recherches archéologiques RN"],
  },
  {
    id: "mesopotamienne",
    label: "Mythologies mésopotamiennes",
    region: "Sumér, Akkad, Babylone, Assyrie",
    period: "IVe millénaire → Ier millénaire av. J.-C. ; traductions cunéiformes modernes.",
    overview:
      "Récits de création (Enuma Elish), déluge (version akkadienne), descente d’Inanna/Ishtar, épopée de Gilgamesh. Les dieux incarnent forces cosmiques et institutions (Marduk à Babylone). La transmission repose sur tablettes d’argile : multiples versions coexistantes.",
    pantheon: [
      "Anu / Enlil / Ea (Enki) — triade souveraine et eaux/connaissance.",
      "Inanna / Ishtar — astre du matin/soir, guerre et désir ; Dumuzi / Tammuz — cycles végétaux.",
      "Shamash — justice solaire ; Sin — lune ; Nergal — peste et monde souterrain.",
      "Tiamat & Apsû — eaux primordiales (mythe babylonien).",
    ],
    themes: ["Déluge et moralité", "Ville et dieu patron", "Divination et présages", "Roi comme intermédiaire", "Bilinguisme suméro-akkadien"],
    syncretism:
      "Influences sur Bible hébraïque (récits du déluge, psaumes de création) — comparaisons documentées, non polémiques simplistes.",
    caution:
      "Lecture des traductions spécialisées ; éviter les « clés ésotériques » pseudo-cunéiformes.",
    further: ["Enuma Elish (trad.)", "Gilgamesh (Andrew George)", "Bottero", "Oriental Institute"],
  },
  {
    id: "indienne",
    label: "Mythologie / itihāsa indiens (Véda, épopées, Purāṇa)",
    region: "Sous-continent indien, diaspora",
    period: "Véda (composition sur siècles) → épopées (Mahābhārata, Rāmāyaṇa) → Purāṇa médiévaux ; traditions vivantes.",
    overview:
      "Ensembles textuels massifs : hymnes védaques, rituels brāhmaṇa, spéculations Upanishad, récits épiques, encyclopédies puraniques. Les « polytheisms » se déclinent en traditions dévotionnelles (bhakti) monothéistes fonctionnelles (Viṣṇu, Śiva, Devī). Les avatars, les cycles cosmiques (yuga) et les combats dieux-démons structurent des éthiques de dharmic duty.",
    pantheon: [
      "Indra — tempête, souverain des dévas ; Agni — feu sacrificiel.",
      "Viṣṇu & avatars (Rāma, Kṛṣṇa) — préservation cosmique ; Śiva — ascèse, destruction régénératrice.",
      "Durgā / Kālī — déesses guerrières ; Brahmā — création (moins central en bhakti).",
      "Krishna dans le Bhagavad-Gītā — champ de bataille comme allégorie éthique (lectures multiples).",
    ],
    themes: ["Dharma et dette rituelle", "Karma & renaissance (interprétations scolaires)", "Bhakti et poésie régionale", "Icônographie temple", "Colonialisme et réception occidentale"],
    syncretism:
      "Bouddhisme et jaïnisme partagent lexiques ; syncrétismes locaux (tribal + classique).",
    caution:
      "Traditions vivantes : éviter l’appropriation commerciale des mantras et des images de divinités ; privilégier sources académiques indiennes contemporaines.",
    further: ["Doniger (avec débats de lecture)", "Biardeau", "Clay Sanskrit Library"],
  },
  {
    id: "japonaise",
    label: "Mythologie japonaise (Shintō, Kojiki, Nihon Shoki)",
    region: "Archipel, influences continentales",
    period: "VIIIe s. (fixation écrite) → syncrétisme shinbutsu ; restauration Meiji et modernité.",
    overview:
      "Kojiki et Nihon Shoki fondent une généalogie divine jusqu’à l’empereur ; kami innombrables (nature, ancêtres, virtuoses locales). Izanagi / Izanami : création des îles et chthonie ; Amaterasu / Susanoo : cycles de lumière et tempête. Le shintō n’est pas calqué sur le polythéisme méditerranéen : prêter attention aux catégories locales (matsuri, kannushi).",
    pantheon: [
      "Amaterasu — soleil, tissage ; Susanoo — tempête ; Tsukuyomi — lune.",
      "Inari — riz, renards messagers ; Hachiman — guerre et souveraineté.",
      "Raijin & Fujin — orage et vent ; kitsune / tengu — figures intermédiaires.",
    ],
    themes: ["Impureté et purification (harae)", "Frontière humain/non-humain", "Bouddhisme et honji suijaku", "Yōkai pop moderne vs sources"],
    syncretism:
      "Bouddhisme esotérique, zen, cultes populaires ; mythologie médiatique (anime) comme nouvelle couche.",
    caution:
      "Respect des sites sacrés et des pratiquants ; ne pas réduire le Japon à « folklore exotique ».",
    further: ["Kojiki (trad.)", "Grapard", "articles Kokugakuin"],
  },
  {
    id: "chinoise",
    label: "Mythologie chinoise (classique & populaire)",
    region: "Chine historique, influences asiatiques",
    period: "Classiques (Shijing, Chuci) → syncrétismes taoïste/bouddhiste ; littérature des dieux.",
    overview:
      "Pan Gu cosmogonie tardive mais populaire ; déesse Nuwa répare le ciel ; Fuxi et trigrammes. Le panthéon impérial et les cultes locaux se superposent ; le taoïsme organise des hiérarchies célestes (Jade Emperor dans traditions ultérieures). La mythologie se lit aussi en chroniques historiographiques et romans (Investiture des dieux).",
    pantheon: [
      "Ciel / Terre / Eaux — tripolarité rituelle ; dragons comme régulateurs pluvieux.",
      "Pantheon taoïste — Triade Qing, liturgies d’exorcisme ; Mazu — déesse des marins (culte vivant).",
      "Hou Yi & Chang’e — lune et archerie (multiples versions).",
    ],
    themes: ["Mandat du Ciel", "Mérite et bureaucratie céleste", "Yin-yang et cosmologie", "Opéras et rituels locaux"],
    syncretism:
      "Bouddhisme mahayana, cultes ancêtres, religion populaire ; diaspora.",
    caution:
      "Éviter les amalgames « tout est tao » ; attention aux lectures New Age déconnectées des contextes.",
    further: ["Birrell", "Yuan Mei (trad.)", "Cambridge History of China (extraits)"],
  },
  {
    id: "romaine",
    label: "Mythologie romaine & religion civique",
    region: "Italie, empire méditerranéen",
    period: "Monarchie → Empire ; interpretatio graeca ; christianisation.",
    overview:
      "Intégration politique des cultes (pontifices, augures, flamines) ; dieux calqués sur le grec mais rites propres (Jupiter Capitolinus, Vesta, Mars Ultor). Les mythes fondateurs (Énée, Romulus) servent la légitimité impériale. L’« éclectisme » romain est une stratégie d’empire autant qu’une spiritualité.",
    pantheon: [
      "Jupiter, Junon, Minerve — triade capitoline ; Vénus Génétrix — légitimité julio-claudienne.",
      "Mars, Quirinus — triade archaïque avec Jupiter ; Janus — seuils.",
      "Cybele, Isis, Mithra — cultes importés et contrôlés.",
    ],
    themes: ["Religion d’État", "Divination augurale", "Apothéose impériale", "Saturnales et renversements rituel"],
    syncretism:
      "Hellenism, orientalisme religieux, puis conciles chrétiens.",
    caution:
      "Ne pas projeter le polythéisme romain sur la République tardive sans nuances juridiques.",
    further: ["Ovid, Metamorphoses", "Beard-North-Price", "CIL commentaries"],
  },
  {
    id: "yoruba",
    label: "Religions et mythologies Yorùbá",
    region: "Nigeria, Bénin, Togo ; diaspora (Candomblé, Santería, etc.)",
    period: "Oralités profondes → codifications modernes ; traditions vivantes.",
    overview:
      "Òrìṣà multiples (Ifá, divination par noix de palme), Obatala, Ṣàngó, Ọya, Yemọja… — chacun des « chemins » et des styles musicaux, couleurs, jours. Le monde est dialogique : équilibre, initiations, responsabilités communautaires. Les diasporas créent des syncrétismes avec christianisme et spiritisme — toujours documenter le contexte national.",
    pantheon: [
      "Ọlọrun / Olódùmarè — transcendance souvent peu mythifiée ; Òrìṣà comme médiateurs.",
      "Ṣàngó — foudre, justice ; Ọya — vents, cimetière ; Yemọja — eaux mères.",
      "Èṣù — passages, ambivalence (non « diable » chrétien).",
    ],
    themes: ["Ifá et poésie divinatoire", "Initiation", "Offerenda et cuisine sacrée", "Diaspora et créolité"],
    syncretism:
      "Santería cubaine, Candomblé brésilien — respecter initiations et secret rituel légitime.",
    caution:
      "Appropriation massive en commerce ésotérique : citer des praticiens et chercheurs autochtones ; ne pas extraire symboles hors contexte.",
    further: ["Abimbola", "Drewal", "UNESCO ICH listings"],
  },
  {
    id: "polynesienne",
    label: "Mythologies polynésiennes",
    region: "Triangle Polynésie (nombreuses langues et îles)",
    period: "Oralités ; codifications missionnaires et anthropologiques (XXe).",
    overview:
      "Maui capricieux, Tangaroa, Tāne, Hina — cycles de création, pêche, navigation. La mer n’est pas décor : espace de survie, d’orientation stellaire, de tapu (interdits sacrés). Chaque archipel a ses variantes ; la « Polynésie » unifiée est un repère géographique, pas un dogme mythique unique.",
    pantheon: [
      "Maui — îles, soleil, câbles cosmiques (versions divergentes).",
      "Tangaroa / Kanaloa — océan ; Tāne — forêts ; Tu / Kū — guerre / agriculture (selon îles).",
    ],
    themes: ["Navigation et étoiles", "Tapu / noa", "Répartition des pouvoirs claniques", "Réponses au colonialisme"],
    syncretism:
      "Christianisme et réveils ; revitalisations culturelles contemporaines.",
    caution:
      "Éviter la fusion « tatou + tikis + Maui Disney » ; créditer les collecteurs autochtones contemporains.",
    further: ["Beckwith (Hawaii)", "Māori traditions — Te Ara", "ORSTOM ethnologies"],
  },
  {
    id: "amerindigenous",
    label: "Mythologies des Amériques (aperçu comparatif)",
    region: "Turtle Island → Amérique latine — milliers de nations distinctes",
    period: "Pré-contact → aujourd’hui ; oralités, codex, traditions vivantes.",
    overview:
      "Impossible de « résumer » l’ensemble : Inuit, Nations Haudenosaunee, Navajo (Diné Bahaneʼ), Maya (Popol Vuh), Aztèques (cinq soleils), Inca (Inti, Viracocha selon sources), Amazonie… Chaque peuple porte des récits de création, de tricksters, de relations avec non-humains. La plateforme doit signaler le génocide, les politiques d’acculturation et les revitalisations actuelles.",
    pantheon: [
      "Exemples non hiérarchisés : Wisakedjak (Anishinaabe), Coyote (Plateau / Californie), Quetzalcoatl (complexe nahua), Viracocha (Andes, sources coloniales à filtrer).",
    ],
    themes: ["Trickster", "Turtle Island cosmologies", "Codex et archéologie", "Revitalisation et souveraineté culturelle"],
    syncretism:
      "Syncrétismes coloniaux et résistances ; Néo-indigénisme commercial à critiquer.",
    caution:
      "Prioriser voix autochtones et traités ; ne pas extraire rites ; attention aux faux chamanismes.",
    further: ["Deloria", "King", "Popol Vuh (trad. commentée)", "NMAI resources"],
  },
];
