import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MapPin, Leaf, Package, ArrowRight, Search, Globe, Zap, RefreshCw, Wrench, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── City Database ─────────────────────────────────────────────────
const CITIES = {
  montreal: {
    name: "Montréal", country: "🇨🇦 Canada", region: "Québec",
    population: "2,1M", color: "#ef4444", emoji: "🍁",
    slogan: "La métropole circulaire francophone du monde",
    highlights: ["STM éco-mobilité", "Marché Jean-Talon bio", "Friperies légendaires"],
    languages: ["Français", "English"],
  },
  paris: {
    name: "Paris", country: "🇫🇷 France", region: "Île-de-France",
    population: "2,1M", color: "#6366f1", emoji: "🗼",
    slogan: "La capitale du style et de la seconde vie",
    highlights: ["Vide-greniers du Marais", "Repair cafés du 11e", "Biocoop réseau"],
    languages: ["Français"],
  },
  toronto: {
    name: "Toronto", country: "🇨🇦 Canada", region: "Ontario",
    population: "2,9M", color: "#3b82f6", emoji: "🏙️",
    slogan: "The circular city of the Great Lakes",
    highlights: ["Kensington Market upcycling", "Green bins network", "Bunz Trading Zone"],
    languages: ["English", "French"],
  },
  dakar: {
    name: "Dakar", country: "🇸🇳 Sénégal", region: "Cap-Vert",
    population: "3,7M", color: "#f59e0b", emoji: "🌍",
    slogan: "Le hub circulaire de l'Afrique de l'Ouest",
    highlights: ["Sandaga solidaire", "Réparation Médina", "Wolof sharing culture"],
    languages: ["Français", "Wolof"],
  },
  brussels: {
    name: "Bruxelles", country: "🇧🇪 Belgique", region: "Région Bruxelles-Capitale",
    population: "1,2M", color: "#10b981", emoji: "🏛️",
    slogan: "Le cœur institutionnel de l'économie circulaire",
    highlights: ["RecycleArt BRUSOC", "Repair Together asbl", "Brocantes hebdo"],
    languages: ["Français", "Nederlands"],
  },
  lyon: {
    name: "Lyon", country: "🇫🇷 France", region: "Auvergne-Rhône-Alpes",
    population: "520K", color: "#8b5cf6", emoji: "🦁",
    slogan: "La Presqu'île du partage et du goût",
    highlights: ["Emmaüs Presqu'île", "Les Halles bio", "Vrac & Co"],
    languages: ["Français"],
  },
  casablanca: {
    name: "Casablanca", country: "🇲🇦 Maroc", region: "Grand Casablanca",
    population: "3,7M", color: "#f97316", emoji: "🌙",
    slogan: "La Casa circulaire — Souk 2.0",
    highlights: ["Derb Omar solidaire", "Fondouks rénovés", "Coopératives féminines"],
    languages: ["Français", "Darija"],
  },
  tokyo: {
    name: "Tokyo", country: "🇯🇵 Japon", region: "Kanto",
    population: "13,9M", color: "#ec4899", emoji: "⛩️",
    slogan: "Mottainai — rien ne se perd, tout se transforme",
    highlights: ["Hard-Off reconditionné", "Koenji vintage", "Eco-Edo spirit"],
    languages: ["日本語", "English"],
  },
  nairobi: {
    name: "Nairobi", country: "🇰🇪 Kenya", region: "Nairobi County",
    population: "4,4M", color: "#22c55e", emoji: "🦁",
    slogan: "Silicon Savannah — circular from the roots",
    highlights: ["Gikomba market upcycling", "M-Pesa circular payments", "Eco-bricks community"],
    languages: ["English", "Kiswahili"],
  },
  saopaulo: {
    name: "São Paulo", country: "🇧🇷 Brésil", region: "État de São Paulo",
    population: "12,3M", color: "#16a34a", emoji: "🌴",
    slogan: "A maior metrópole circular da América Latina",
    highlights: ["Feira da Liberdade troca", "Catadores cooperativa", "Mercado da Bela Vista"],
    languages: ["Português"],
  },
  berlin: {
    name: "Berlin", country: "🇩🇪 Allemagne", region: "Brandenburg",
    population: "3,7M", color: "#64748b", emoji: "🐻",
    slogan: "Arm aber Sexy — reich durch Kreislaufwirtschaft",
    highlights: ["Mauerpark Flohmarkt", "Repair Café Friedrichshain", "UFA-Fabrik circular"],
    languages: ["Deutsch", "English"],
  },
  abidjan: {
    name: "Abidjan", country: "🇨🇮 Côte d'Ivoire", region: "Lagunes",
    population: "5,4M", color: "#f59e0b", emoji: "🌺",
    slogan: "Paris de l'Afrique — la circularité en mouvement",
    highlights: ["Marché de Treichville", "Friperie de Cocody", "Femmes entrepreneures"],
    languages: ["Français", "Dioula"],
  },
  quebec: {
    name: "Québec", country: "🇨🇦 Canada", region: "Québec",
    population: "531K", color: "#3b82f6", emoji: "❄️",
    slogan: "La Vieille Capitale, nouvelle économie",
    highlights: ["Vestiaire collectif", "Repair café Limoilou", "Épicerie coopérative"],
    languages: ["Français"],
  },
};

const ALL_CITIES = Object.entries(CITIES).map(([slug, data]) => ({ slug, ...data }));

const TYPE_CONFIG = {
  vente: { label: "Vente", color: "bg-blue-100 text-blue-700", icon: Package },
  don: { label: "Don", color: "bg-emerald-100 text-emerald-700", icon: Gift },
  réparation: { label: "Réparation", color: "bg-amber-100 text-amber-700", icon: Wrench },
  échange: { label: "Échange", color: "bg-purple-100 text-purple-700", icon: RefreshCw },
};

// ── City Hub Page ─────────────────────────────────────────────────
function CityHubPage({ city, slug }) {
  const { data: listings = [] } = useQuery({
    queryKey: ["listings-city", slug],
    queryFn: () => base44.entities.Listing.list("-created_date", 200),
    staleTime: 60_000,
  });

  const localListings = useMemo(() => {
    const name = city.name.toLowerCase();
    return listings.filter(l =>
      l.location && l.location.toLowerCase().includes(name)
    );
  }, [listings, city.name]);

  const stats = useMemo(() => ({
    total: localListings.length,
    co2: localListings.reduce((s, l) => s + (l.co2_saved || 0), 0).toFixed(1),
    dons: localListings.filter(l => l.type === "don").length,
    reparations: localListings.filter(l => l.type === "réparation").length,
  }), [localListings]);

  return (
    <div className="pb-20 space-y-10">
      {/* Hero */}
      <div className="rounded-3xl overflow-hidden relative p-8 sm:p-12"
        style={{ background: `linear-gradient(135deg, ${city.color}18, ${city.color}08)`, border: `2px solid ${city.color}30` }}>
        <div className="absolute top-4 right-4 text-6xl opacity-20">{city.emoji}</div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="text-white border-0 font-bold" style={{ background: city.color }}>
              Hub Autonome CirculAI
            </Badge>
            <span className="text-muted-foreground text-sm">{city.country} · {city.region}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">
            {city.emoji} Hub de <span style={{ color: city.color }}>{city.name}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl italic">« {city.slogan} »</p>
          <div className="flex gap-2 flex-wrap">
            {city.languages.map(l => (
              <span key={l} className="px-3 py-1 rounded-full text-xs font-bold bg-card border border-border">{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Annonces locales", val: stats.total || "—", color: "text-blue-600" },
          { icon: Leaf, label: "kg CO₂ évité", val: stats.co2 || "0", color: "text-emerald-600" },
          { icon: Gift, label: "Dons actifs", val: stats.dons || "0", color: "text-rose-600" },
          { icon: Wrench, label: "Réparations", val: stats.reparations || "0", color: "text-amber-600" },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-5 text-center">
            <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
            <p className={`text-2xl font-black ${color}`}>{val}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Local Highlights */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" style={{ color: city.color }} /> Points forts locaux
        </h2>
        <div className="flex flex-col gap-2">
          {city.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted">
              <span className="text-lg">{["🌱", "♻️", "🤝"][i] || "✨"}</span>
              <span className="text-sm text-foreground">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Local Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-foreground">
            Annonces à {city.name}
          </h2>
          <Link to={`/marketplace?location=${city.name}`} className="text-sm text-primary hover:underline flex items-center gap-1">
            Tout voir <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {localListings.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
            <Globe className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium mb-2">Pas encore d'annonces à {city.name}</p>
            <p className="text-muted-foreground text-sm mb-4">Soyez le premier à ouvrir le Hub !</p>
            <Button asChild size="sm" className="rounded-xl">
              <Link to="/publier">Publier la première annonce</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {localListings.slice(0, 6).map(l => {
              const cfg = TYPE_CONFIG[l.type] || TYPE_CONFIG.don;
              const Icon = cfg.icon;
              return (
                <Link key={l.id} to={`/annonce/${l.id}`}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {l.image_url
                      ? <img src={l.image_url} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center"><Icon className="h-10 w-10 text-muted-foreground/20" /></div>
                    }
                    <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
                      <Icon className="h-3 w-3" /> {cfg.label}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{l.title}</p>
                    {l.price > 0 && <p className="text-primary font-bold text-sm mt-1">{l.price} $</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-8 text-center space-y-4 border"
        style={{ background: `${city.color}08`, borderColor: `${city.color}25` }}>
        <h3 className="font-display text-2xl font-bold text-foreground">Rejoindre le Hub {city.name}</h3>
        <p className="text-muted-foreground">Publiez votre première annonce et activez votre Hub local.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button asChild className="rounded-xl font-bold" style={{ background: city.color, border: "none", color: "white" }}>
            <Link to="/publier">Publier une annonce</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/city-hubs">← Tous les Hubs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── City Directory Page ───────────────────────────────────────────
function CityDirectory() {
  const [search, setSearch] = useState("");
  const filtered = ALL_CITIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-20 space-y-10">
      {/* Hero */}
      <div className="rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-border"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(99,102,241,0.04))" }}>
        <div className="text-5xl">🌍</div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">
          Hubs Urbains CirculAI
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Chaque ville devient un <strong className="text-foreground">Hub autonome</strong> de l'économie circulaire.<br />
          Annonces localisées · Communauté propre · Impact mesuré.
        </p>
        <div className="flex justify-center gap-8 text-sm">
          <div className="text-center"><p className="text-3xl font-black text-primary">{ALL_CITIES.length}</p><p className="text-muted-foreground text-xs">Hubs actifs</p></div>
          <div className="text-center"><p className="text-3xl font-black text-emerald-400">6</p><p className="text-muted-foreground text-xs">Continents</p></div>
          <div className="text-center"><p className="text-3xl font-black text-violet-400">∞</p><p className="text-muted-foreground text-xs">En expansion</p></div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher une ville, un pays..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(city => (
          <Link key={city.slug} to={`/city-hubs/${city.slug}`}
            className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: city.color }} />
            <div className="flex items-start gap-4">
              <div className="text-4xl">{city.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">{city.name}</h3>
                  <Badge className="text-[10px] font-bold text-white border-0 px-1.5" style={{ background: city.color }}>HUB</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{city.country} · {city.region}</p>
                <p className="text-xs text-muted-foreground italic line-clamp-2">« {city.slogan} »</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                {city.languages.slice(0, 2).map(l => (
                  <span key={l} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">{l}</span>
                ))}
              </div>
              <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
                Ouvrir <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Add your city */}
      <div className="rounded-2xl border border-dashed border-primary/30 p-8 text-center space-y-3">
        <Zap className="h-8 w-8 text-primary mx-auto" />
        <h3 className="font-display text-xl font-bold text-foreground">Votre ville n'est pas là ?</h3>
        <p className="text-muted-foreground text-sm">Publiez votre première annonce avec votre ville — elle sera automatiquement intégrée au réseau.</p>
        <Button asChild className="rounded-xl font-bold">
          <Link to="/publier">Activer mon Hub local →</Link>
        </Button>
      </div>
    </div>
  );
}

// ── Router entry point ────────────────────────────────────────────
export default function CityHub() {
  const { citySlug } = useParams();
  const city = citySlug ? CITIES[citySlug] : null;

  if (citySlug && !city) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Hub introuvable pour « {citySlug} »</p>
        <Button asChild variant="outline"><Link to="/city-hubs">← Tous les Hubs</Link></Button>
      </div>
    );
  }

  if (city) return <CityHubPage city={city} slug={citySlug} />;
  return <CityDirectory />;
}