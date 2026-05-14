export const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "sw", label: "Kiswahili", flag: "🌍" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
];

export const T = {
  fr: {
    home: "Accueil", marketplace: "Marketplace", publish: "Publier",
    profile: "Mon Profil", news: "Actualité", subscribe: "S'abonner", game: "Jouer",
    tagline:
      "Egor69 — fidèle serviteur de l'humanité pour le service de la planète et de tout l'univers entier",
    hero_title: "Egor69 — cosmos circulaire souverain.",
    hero_sub: "Donnez, échangez, réparez. Radar, atlas vivant, quêtes — ambition mondiale, vérité mesurable.",
    join_free: "Rejoindre gratuitement",
    browse: "Explorer les annonces",
    security_title: "Vos données sont sacrées",
    security_sub: "Nous ne vendons jamais vos données. Jamais. C'est une promesse gravée dans notre code et dans notre âme.",
    game_cta: "🎮 Jouer pour le Bien",
    game_desc: "Gagnez des points en faisant le bien. Chaque action réelle = récompense réelle.",
  },
  en: {
    home: "Home", marketplace: "Marketplace", publish: "Post Item",
    profile: "My Profile", news: "News", subscribe: "Subscribe", game: "Play",
    tagline: "Circular Economy · Worldwide",
    hero_title: "Egor69 — sovereign circular cosmos.",
    hero_sub: "Give, exchange, repair. Radar, living atlas, quests — global ambition, honest metrics.",
    join_free: "Join for free",
    browse: "Browse listings",
    security_title: "Your data is sacred",
    security_sub: "We never sell your data. Ever. This is a promise engraved in our code and our soul.",
    game_cta: "🎮 Play for Good",
    game_desc: "Earn points by doing good. Every real action = real reward.",
  },
  es: {
    home: "Inicio", marketplace: "Mercado", publish: "Publicar",
    profile: "Mi Perfil", news: "Noticias", subscribe: "Suscribirse", game: "Jugar",
    tagline: "Economía circular · Mundial",
    hero_title: "La revolución circular empieza aquí.",
    hero_sub: "Da, intercambia, repara. La primera plataforma mundial de economía circular con IA.",
    join_free: "Unirse gratis",
    browse: "Ver anuncios",
    security_title: "Tus datos son sagrados",
    security_sub: "Nunca vendemos tus datos. Nunca. Es una promesa grabada en nuestro código y nuestra alma.",
    game_cta: "🎮 Jugar por el Bien",
    game_desc: "Gana puntos haciendo el bien. Cada acción real = recompensa real.",
  },
  pt: {
    home: "Início", marketplace: "Mercado", publish: "Publicar",
    profile: "Meu Perfil", news: "Notícias", subscribe: "Assinar", game: "Jogar",
    tagline: "Economia circular · Mundial",
    hero_title: "A revolução circular começa aqui.",
    hero_sub: "Doe, troque, repare. A primeira plataforma mundial de economia circular com IA.",
    join_free: "Junte-se gratuitamente",
    browse: "Ver anúncios",
    security_title: "Seus dados são sagrados",
    security_sub: "Nunca vendemos seus dados. Nunca. É uma promessa gravada em nosso código e em nossa alma.",
    game_cta: "🎮 Jogar pelo Bem",
    game_desc: "Ganhe pontos fazendo o bem. Cada ação real = recompensa real.",
  },
  sw: {
    home: "Nyumbani", marketplace: "Soko", publish: "Chapisha",
    profile: "Wasifu Wangu", news: "Habari", subscribe: "Jiandikishe", game: "Cheza",
    tagline: "Uchumi wa Mzunguko · Duniani Kote",
    hero_title: "Mapinduzi ya mzunguko yanaanza hapa.",
    hero_sub: "Toa, badilishana, rekebisha. Jukwaa la kwanza duniani la uchumi wa mzunguko linaloendeshwa na AI.",
    join_free: "Jiunge bure",
    browse: "Angalia matangazo",
    security_title: "Data yako ni takatifu",
    security_sub: "Hatuuzi data yako kamwe. Ni ahadi iliyochongwa katika msimbo na roho yetu.",
    game_cta: "🎮 Cheza kwa Wema",
    game_desc: "Pata pointi kwa kufanya mema. Kila kitendo halisi = tuzo halisi.",
  },
  ar: {
    home: "الرئيسية", marketplace: "السوق", publish: "نشر",
    profile: "ملفي", news: "أخبار", subscribe: "اشترك", game: "العب",
    tagline: "الاقتصاد الدوري · عالمي",
    hero_title: "الثورة الدائرية تبدأ هنا.",
    hero_sub: "تبرع، تبادل، أصلح. أول منصة عالمية للاقتصاد الدوري مدعومة بالذكاء الاصطناعي.",
    join_free: "انضم مجاناً",
    browse: "تصفح الإعلانات",
    security_title: "بياناتك مقدسة",
    security_sub: "لا نبيع بياناتك أبداً. أبداً. هذا وعد منقوش في كودنا وروحنا.",
    game_cta: "🎮 العب من أجل الخير",
    game_desc: "اكسب نقاطاً بفعل الخير. كل فعل حقيقي = مكافأة حقيقية.",
  },
};

export function getLang() {
  return localStorage.getItem("circul_lang") || "fr";
}

export function setLang(code) {
  localStorage.setItem("circul_lang", code);
  window.dispatchEvent(new Event("lang_change"));
}

export function useT() {
  const [lang, setLangState] = typeof window !== "undefined"
    ? (function() {
        const [l, sl] = [getLang(), (v) => sl(v)];
        return [l, sl];
      })()
    : ["fr", () => {}];
  return T[lang] || T.fr;
}