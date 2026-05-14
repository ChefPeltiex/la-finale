import { createContext, useContext, useState, useCallback } from "react";

export const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "pt", label: "Português", flag: "🇧🇷", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇲🇦", dir: "rtl" },
];

const T = {
  fr: {
    home: "Accueil", marketplace: "Marketplace", post: "Publier", profile: "Mon Profil",
    game: "Jouer 🎮", news: "Actualité", subscribe: "S'abonner",
    hero_title: "Egor69 — sanctuaire circulaire & cosmos souverain.",
    hero_sub: "Donnez, échangez, réparez. Radar, atlas vivant, quêtes — ambition mondiale, promesses mesurées.",
    join_free: "🚀 Rejoindre gratuitement", browse: "Explorer les annonces",
    game_cta: "🎮 Jouer & Gagner", game_sub: "Chaque bonne action = XP + récompenses réelles",
    tagline:
      "Egor69 — fidèle serviteur de l'humanité pour le service de la planète et de tout l'univers entier",
  },
  en: {
    home: "Home", marketplace: "Marketplace", post: "Post", profile: "My Profile",
    game: "Play 🎮", news: "News", subscribe: "Subscribe",
    hero_title: "Egor69 — sovereign circular cosmos.",
    hero_sub: "Give, exchange, repair. Radar, living atlas, quests — global ambition, honest metrics.",
    join_free: "🚀 Join for free", browse: "Browse listings",
    game_cta: "🎮 Play & Win", game_sub: "Every good deed = XP + real rewards",
    tagline: "Circular Economy · Global",
  },
  es: {
    home: "Inicio", marketplace: "Mercado", post: "Publicar", profile: "Mi Perfil",
    game: "Jugar 🎮", news: "Noticias", subscribe: "Suscribirse",
    hero_title: "Egor69 — cosmos circular soberano.",
    hero_sub: "Da, intercambia, repara. Radar, atlas vivo, misiones — ambición global, métricas honestas.",
    join_free: "🚀 Únete gratis", browse: "Ver anuncios",
    game_cta: "🎮 Jugar y Ganar", game_sub: "Cada buena acción = XP + recompensas reales",
    tagline: "Economía circular · Global",
  },
  pt: {
    home: "Início", marketplace: "Mercado", post: "Publicar", profile: "Meu Perfil",
    game: "Jogar 🎮", news: "Notícias", subscribe: "Assinar",
    hero_title: "Egor69 — cosmos circular soberano.",
    hero_sub: "Doe, troque, repare. Radar, atlas vivo, missões — ambição global, métricas honestas.",
    join_free: "🚀 Entrar grátis", browse: "Ver anúncios",
    game_cta: "🎮 Jogar & Ganhar", game_sub: "Cada boa ação = XP + recompensas reais",
    tagline: "Economia circular · Global",
  },
  ar: {
    home: "الرئيسية", marketplace: "السوق", post: "نشر", profile: "ملفي",
    game: "🎮 العب", news: "الأخبار", subscribe: "اشترك",
    hero_title: "Egor69 — كون دائري سيادي.",
    hero_sub: "تبرع، تبادل، أصلح. رادار، أطلس حي، مهام — طموح عالمي ووعود قابلة للقياس.",
    join_free: "🚀 انضم مجاناً", browse: "استعرض الإعلانات",
    game_cta: "🎮 العب واربح", game_sub: "كل عمل خير = نقاط تجربة + مكافآت حقيقية",
    tagline: "الاقتصاد الدائري · عالمي",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("fr");
  const t = useCallback((key) => T[lang]?.[key] || T.fr[key] || key, [lang]);
  const currentLang = LANGUAGES.find(l => l.code === lang);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currentLang, dir: currentLang?.dir || "ltr" }}>
      <div dir={currentLang?.dir || "ltr"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}