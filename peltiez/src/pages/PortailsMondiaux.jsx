import { useState, useMemo } from "react";
import { Globe, Search, Clock, Languages, Rocket, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PORTAILS = [
  { pays: "Québec / Canada",  flag: "🍁", lang: "fr/en", status: "live",    url: "/",              focus: "Économie circulaire pionnière",    members: "Ouvert" },
  { pays: "France",           flag: "🇫🇷", lang: "fr",    status: "live",    url: "/",              focus: "Réparation & anti-gaspillage",     members: "Ouvert" },
  { pays: "Sénégal",          flag: "🇸🇳", lang: "fr/wo", status: "beta",    url: "/",              focus: "Économie locale & artisanat",      members: "Co-design" },
  { pays: "Maroc",            flag: "🇲🇦", lang: "fr/ar", status: "beta",    url: "/",              focus: "Souveraineté alimentaire",         members: "Co-design" },
  { pays: "Côte d'Ivoire",    flag: "🇨🇮", lang: "fr",    status: "beta",    url: "/",              focus: "Agriculture & biodiversité",       members: "Co-design" },
  { pays: "Belgique",         flag: "🇧🇪", lang: "fr/nl", status: "live",    url: "/",              focus: "Mobilité douce & zéro déchet",    members: "Ouvert" },
  { pays: "Suisse",           flag: "🇨🇭", lang: "fr/de", status: "live",    url: "/",              focus: "Finance éthique & circularité",    members: "Ouvert" },
  { pays: "Brésil",           flag: "🇧🇷", lang: "pt",    status: "coming",  url: null,             focus: "Forêts & biodiversité Amazonie",  members: "—" },
  { pays: "Mexique",          flag: "🇲🇽", lang: "es",    status: "coming",  url: null,             focus: "Économie solidaire",               members: "—" },
  { pays: "Espagne",          flag: "🇪🇸", lang: "es",    status: "coming",  url: null,             focus: "Réparation & maker culture",       members: "—" },
  { pays: "Italie",           flag: "🇮🇹", lang: "it",    status: "coming",  url: null,             focus: "Design circulaire & artisanat",   members: "—" },
  { pays: "Allemagne",        flag: "🇩🇪", lang: "de",    status: "coming",  url: null,             focus: "Industrie circulaire",             members: "—" },
  { pays: "Nigeria",          flag: "🇳🇬", lang: "en/yo", status: "coming",  url: null,             focus: "Tech & entrepreneuriat vert",      members: "—" },
  { pays: "Kenya",            flag: "🇰🇪", lang: "en/sw", status: "coming",  url: null,             focus: "Energie solaire & agroécologie",  members: "—" },
  { pays: "Inde",             flag: "🇮🇳", lang: "hi/en", status: "coming",  url: null,             focus: "Repair economy & jugaad",          members: "—" },
  { pays: "Japon",            flag: "🇯🇵", lang: "ja",    status: "coming",  url: null,             focus: "Mottainai — zéro gaspillage",      members: "—" },
  { pays: "Corée du Sud",     flag: "🇰🇷", lang: "ko",    status: "coming",  url: null,             focus: "Tech verte & économie sociale",   members: "—" },
  { pays: "Australie",        flag: "🇦🇺", lang: "en",    status: "coming",  url: null,             focus: "Conservation & permaculture",      members: "—" },
  { pays: "Argentine",        flag: "🇦🇷", lang: "es",    status: "coming",  url: null,             focus: "Troc & coopératives",              members: "—" },
  { pays: "Pays-Bas",         flag: "🇳🇱", lang: "nl",    status: "coming",  url: null,             focus: "Économie circulaire systémique",   members: "—" },
  { pays: "Suède",            flag: "🇸🇪", lang: "sv",    status: "coming",  url: null,             focus: "Économie 1,5°C",                  members: "—" },
  { pays: "Portugal",         flag: "🇵🇹", lang: "pt",    status: "coming",  url: null,             focus: "Économie bleue & artisanat",      members: "—" },
  { pays: "Ghana",            flag: "🇬🇭", lang: "en/ak", status: "coming",  url: null,             focus: "Économie locale & innovation",    members: "—" },
  { pays: "Colombie",         flag: "🇨🇴", lang: "es",    status: "coming",  url: null,             focus: "Biodiversité & cafés circulaires", members: "—" },
  { pays: "Haïti",            flag: "🇭🇹", lang: "fr/ht", status: "coming",  url: null,             focus: "Résilience communautaire",         members: "—" },
];

const STATUS_CFG = {
  live:    { label: "LIVE",       color: "bg-emerald-500", text: "text-emerald-100", badge: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)" },
  beta:    { label: "BÊTA",       color: "bg-amber-500",   text: "text-amber-100",   badge: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)" },
  coming:  { label: "BIENTÔT",    color: "bg-slate-600",   text: "text-slate-300",   badge: "rgba(100,100,120,0.15)",border: "rgba(100,100,120,0.3)" },
};

export default function PortailsMondiaux() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() =>
    PORTAILS.filter(p => {
      const matchSearch = !search || p.pays.toLowerCase().includes(search.toLowerCase()) || p.focus.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || p.status === filter;
      return matchSearch && matchFilter;
    }), [search, filter]);

  const liveCount = PORTAILS.filter(p => p.status === "live").length;
  const betaCount = PORTAILS.filter(p => p.status === "beta").length;
  return (
    <div className="pb-20 space-y-10 max-w-6xl mx-auto px-4 pt-8">
      {/* Hero */}
      <div className="rounded-3xl p-10 text-center space-y-5"
        style={{ background: "linear-gradient(135deg, rgba(5,10,25,0.95), rgba(5,20,12,0.95))", border: "2px solid rgba(16,185,129,0.25)" }}>
        <Globe className="h-14 w-14 text-emerald-400 mx-auto float" style={{ animation: "float 4s ease-in-out infinite" }} />
        <h1 className="font-display text-5xl font-black text-white">🌍 Déploiement Multiversel</h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Une entrée Egor69 pour chaque culture — feuille de route honnête, sans inventaire d’utilisateurs fictifs.
        </p>
        <div className="flex justify-center gap-10">
          {[
            { val: liveCount,    label: "Portails LIVE",   color: "text-emerald-400" },
            { val: betaCount,    label: "En bêta",          color: "text-amber-400" },
            { val: PORTAILS.length, label: "Pays ciblés",  color: "text-blue-400" },
          ].map(({ val, label, color }) => (
            <div key={label} className="text-center">
              <p className={`text-4xl font-black ${color}`}>{val}</p>
              <p className="text-white/40 text-xs mt-1 font-mono">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un pays ou une spécialité…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:border-primary/50" />
        </div>
        <div className="flex gap-2">
          {[["all","Tous"], ["live","Live"], ["beta","Bêta"], ["coming","Bientôt"]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ background: filter === v ? "hsl(var(--primary))" : "hsl(var(--muted))", color: filter === v ? "white" : "hsl(var(--muted-foreground))" }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((portail, i) => {
          const cfg = STATUS_CFG[portail.status];
          return (
            <div key={i} className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              style={{ borderColor: cfg.border, background: cfg.badge }}>
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{portail.flag}</span>
                  <div>
                    <p className="font-bold text-foreground">{portail.pays}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Languages className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{portail.lang}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded ${cfg.color} ${cfg.text}`}>{cfg.label}</span>
                  {portail.members !== "—" && (
                    <span className="text-[10px] font-bold text-primary">{portail.members}</span>
                  )}
                </div>
              </div>
              <div className="px-5 pb-4 space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">🎯 {portail.focus}</p>
                {portail.status === "live" ? (
                  <Link to="/" className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
                    <Rocket className="h-3.5 w-3.5" /> Visiter le portail →
                  </Link>
                ) : portail.status === "beta" ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5" /> Accès bêta en cours
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> Lancement prévu 2026
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Portail */}
      <div className="rounded-2xl p-8 text-center space-y-4"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.1))", border: "2px solid rgba(16,185,129,0.2)" }}>
        <Globe className="h-10 w-10 mx-auto text-primary" />
        <h2 className="font-display text-2xl font-bold text-foreground">Votre pays n'est pas dans la liste ?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Inscrivez-vous comme Ambassadeur CirculAI. Nous vous aidons à lancer le portail de votre nation.</p>
        <Link to="/piliers" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02]"
          style={{ background: "hsl(var(--primary))" }}>
          Devenir Ambassadeur <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}