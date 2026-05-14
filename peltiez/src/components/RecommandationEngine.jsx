import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Sparkles, Loader2, ArrowRight, Gift, RefreshCw, Wrench, Package, Star, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Score proximité géographique
function geoScore(userCity, listingLocation) {
  if (!userCity || !listingLocation) return 0;
  const u = userCity.toLowerCase();
  const l = listingLocation.toLowerCase();
  if (l.includes(u) || u.includes(l)) return 1;
  const uW = u.split(/[\s,]+/).filter(w => w.length > 2);
  const lW = l.split(/[\s,]+/).filter(w => w.length > 2);
  return uW.some(w => lW.includes(w)) ? 0.5 : 0;
}

const TYPE_CONFIG = {
  vente:      { label: "Vente",      color: "bg-blue-100 text-blue-700",      icon: Package },
  don:        { label: "Don",        color: "bg-emerald-100 text-emerald-700", icon: Gift },
  réparation: { label: "Réparation", color: "bg-amber-100 text-amber-700",    icon: Wrench },
  échange:    { label: "Échange",    color: "bg-purple-100 text-purple-700",  icon: RefreshCw },
};

const SUGGESTIONS_RAPIDES = [
  "Un vélo ou trottinette électrique",
  "Du matériel photo ou vidéo",
  "Des meubles pour mon appartement",
  "Des vêtements taille M femme",
  "Un ordinateur portable",
  "Des livres ou jeux de société",
  "Du matériel de sport",
  "Une machine à café",
];

export default function RecommandationEngine({ compact = false }) {
  const [besoin, setBesoin] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommandations, setRecommandations] = useState(null);
  const [contexte, setContexte] = useState(null);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me(), staleTime: Infinity });

  const { data: ecoProfile } = useQuery({
    queryKey: ["eco-profile-reco", user?.email],
    queryFn: () => base44.entities.EcoProfile.filter({ user_email: user.email }, "-created_date", 1).then(r => r[0] || null),
    enabled: !!user,
    staleTime: 60_000,
  });

  const { data: myListings = [] } = useQuery({
    queryKey: ["my-listings-reco", user?.email],
    queryFn: () => base44.entities.Listing.filter({ created_by: user.email }, "-created_date", 20),
    enabled: !!user,
    staleTime: 60_000,
  });

  const userCity = ecoProfile?.city || "";

  const { data: listings = [] } = useQuery({
    queryKey: ["listings-reco"],
    queryFn: () => base44.entities.Listing.filter({ status: "actif" }, "-created_date", 200),
    staleTime: 60_000,
  });

  const analyser = async (query = besoin) => {
    if (!query.trim() || listings.length === 0) return;
    setLoading(true);
    setRecommandations(null);

    // Pré-boost local : trier les annonces avec score géo d'abord
    const sortedListings = [...listings].sort((a, b) => {
      const gA = geoScore(userCity, a.location);
      const gB = geoScore(userCity, b.location);
      // Boost dons/échanges locaux
      const boostA = gA * 3 + (a.type === "don" || a.type === "échange" ? 1 : 0);
      const boostB = gB * 3 + (b.type === "don" || b.type === "échange" ? 1 : 0);
      return boostB - boostA;
    });

    // Profil utilisateur pour personnalisation
    const profileContext = user ? [
      userCity ? `Ville de l'utilisateur : ${userCity}` : "",
      myListings.length > 0 ? `Catégories déjà publiées : ${[...new Set(myListings.map(l => l.category).filter(Boolean))].join(", ")}` : "",
      ecoProfile?.level ? `Niveau : ${ecoProfile.level}` : "",
    ].filter(Boolean).join(" | ") : "";

    const catalog = sortedListings.slice(0, 80).map(l => ({
      id: l.id,
      titre: l.title,
      type: l.type,
      description: (l.description || "").slice(0, 120),
      prix: l.price || 0,
      ville: l.location || "",
      etat: l.condition || "",
      co2: l.co2_saved || 0,
      local: geoScore(userCity, l.location) > 0,
    }));

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es Circulia, le moteur de recommandation de CirculAI Hub.

Un utilisateur cherche : "${query}"
${profileContext ? `\nPROFIL UTILISATEUR : ${profileContext}` : ""}

PRIORITÉS DE SCORING (ordre décroissant) :
1. Pertinence sémantique avec le besoin (critère principal)
2. Annonces LOCALES (champ "local: true") → bonus +15 points
3. Type "don" ou "échange" → bonus +10 points (circularité)
4. Meilleur état (neuf, très bon) → bonus +5 points

Voici le catalogue trié par priorité locale :
${JSON.stringify(catalog, null, 2)}

Retourne les meilleures correspondances. Valorise fortement les dons/échanges locaux.
Génère aussi 3 conseils personnalisés.`,
      response_json_schema: {
        type: "object",
        properties: {
          recommandations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                listing_id: { type: "string" },
                score_match: { type: "number" },
                raison: { type: "string" },
                tag_highlight: { type: "string" },
              }
            }
          },
          resume_recherche: { type: "string" },
          conseils: { type: "array", items: { type: "string" } },
          categorie_detectee: { type: "string" },
        }
      }
    });

    // Enrich with listing data + geo flag
    const enriched = (res.recommandations || []).map(r => {
      const l = listings.find(x => x.id === r.listing_id);
      if (!l) return null;
      return { ...r, listing: l, isLocal: geoScore(userCity, l.location) > 0 };
    }).filter(Boolean);

    setRecommandations(enriched);
    setContexte({ resume: res.resume_recherche, conseils: res.conseils, categorie: res.categorie_detectee });
    setLoading(false);
  };

  if (compact) {
    return (
      <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <p className="font-bold text-foreground text-sm">Recommandations IA</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Que cherchez-vous ?"
            value={besoin}
            onChange={e => setBesoin(e.target.value)}
            onKeyDown={e => e.key === "Enter" && analyser()}
            className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
          />
          <Button onClick={() => analyser()} disabled={loading || !besoin.trim()} size="sm" className="rounded-xl px-4 gap-1 font-bold shrink-0">
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          </Button>
        </div>
        {recommandations && recommandations.length > 0 && (
          <div className="space-y-2">
            {recommandations.slice(0, 3).map((r, i) => {
              return (
                <Link key={i} to={`/annonce/${r.listing.id}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                  <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0 bg-border">
                    {r.listing.image_url && <img src={r.listing.image_url} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{r.listing.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{r.raison}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-600 shrink-0">{r.score_match}%</span>
                </Link>
              );
            })}
            <Link to="/recommandations" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
              Voir toutes les recommandations <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-violet-500" />
          <h2 className="font-bold text-foreground">Décrivez votre besoin</h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: Un vélo de ville, des meubles IKEA, un ordinateur portable..."
            value={besoin}
            onChange={e => setBesoin(e.target.value)}
            onKeyDown={e => e.key === "Enter" && analyser()}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
          />
          <Button onClick={() => analyser()} disabled={loading || !besoin.trim()}
            className="rounded-xl px-5 font-bold gap-2 shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #10b981)", border: "none", color: "white" }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4" /> Trouver</>}
          </Button>
        </div>

        {/* Suggestions rapides */}
        {!recommandations && !loading && (
          <div>
            <p className="text-xs text-muted-foreground font-semibold mb-2">Suggestions rapides :</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS_RAPIDES.map(s => (
                <button key={s} onClick={() => { setBesoin(s); analyser(s); }}
                  className="px-3 py-1.5 rounded-full text-xs bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all font-medium">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500 mx-auto mb-3" />
          <p className="font-semibold text-foreground">Circulia analyse le catalogue…</p>
          <p className="text-sm text-muted-foreground mt-1">{listings.length} annonces passées en revue</p>
        </div>
      )}

      {/* Results */}
      {recommandations && !loading && (
        <div className="space-y-5 animate-fade-in-up">
          {/* Contexte */}
          {contexte && (
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl border border-violet-400/20"
              style={{ background: "rgba(124,58,237,0.05)" }}>
              <div className="flex-1">
                {contexte.categorie && (
                  <Badge className="mb-2 bg-violet-500/10 text-violet-600 border-0 font-bold">
                    Catégorie détectée : {contexte.categorie}
                  </Badge>
                )}
                <p className="text-sm text-foreground leading-relaxed">{contexte.resume}</p>
              </div>
              <button onClick={() => { setRecommandations(null); setContexte(null); setBesoin(""); }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0">
                <RefreshCw className="h-3 w-3" /> Réinitialiser
              </button>
            </div>
          )}

          {/* Recommandations */}
          {recommandations.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground font-medium mb-2">Aucune annonce correspondante pour le moment</p>
              <p className="text-sm text-muted-foreground mb-4">Soyez le premier à publier cet article !</p>
              <Button asChild size="sm" className="rounded-xl"><Link to="/publier">Publier une annonce</Link></Button>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-3">
                {recommandations.length} résultat{recommandations.length > 1 ? "s" : ""} · Triés par pertinence IA
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommandations.map((r, i) => {
                  const cfg = TYPE_CONFIG[r.listing.type] || TYPE_CONFIG.don;
                  const Icon = cfg.icon;
                  const isTop = i === 0;
                  return (
                    <Link key={i} to={`/annonce/${r.listing.id}`}
                      className={`group bg-card rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all relative ${isTop ? "border-violet-400/40 ring-1 ring-violet-400/20" : "border-border"}`}>
                      {isTop && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-violet-600 text-white border-0 text-[10px] font-bold flex items-center gap-1">
                            <Star className="h-2.5 w-2.5 fill-white" /> Meilleur match
                          </Badge>
                        </div>
                      )}

                      {/* Score badge */}
                      <div className="absolute top-2 right-2 z-10 h-9 w-9 rounded-full flex items-center justify-center font-black text-xs text-white"
                        style={{ background: r.score_match >= 70 ? "#10b981" : r.score_match >= 40 ? "#f59e0b" : "#6366f1" }}>
                        {r.score_match}
                      </div>

                      <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                        {r.listing.image_url
                          ? <img src={r.listing.image_url} alt={r.listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          : <div className="w-full h-full flex items-center justify-center"><Icon className="h-10 w-10 text-muted-foreground/20" /></div>
                        }
                        <div className={`absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
                          <Icon className="h-3 w-3" /> {cfg.label}
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">{r.listing.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{r.raison}</p>
                        {r.tag_highlight && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">✦ {r.tag_highlight}</span>
                        )}
                        <div className="flex items-center justify-between mt-3 flex-wrap gap-1">
                          {r.listing.price > 0
                            ? <span className="font-bold text-primary text-sm">{r.listing.price} $</span>
                            : <span className="text-emerald-600 text-xs font-bold">Gratuit</span>
                          }
                          <div className="flex items-center gap-1.5">
                            {r.isLocal && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                <MapPin className="h-2.5 w-2.5" /> Local
                              </span>
                            )}
                            {(r.listing.type === "don" || r.listing.type === "échange") && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-full">
                                <Zap className="h-2.5 w-2.5" /> Circulaire
                              </span>
                            )}
                            {r.listing.location && <span className="text-xs text-muted-foreground">{r.listing.location}</span>}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Conseils */}
          {contexte?.conseils?.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-5 space-y-2">
              <p className="font-bold text-foreground text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> Conseils de recherche personnalisés
              </p>
              {contexte.conseils.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-violet-500 font-bold shrink-0 mt-0.5">→</span>
                  <p className="text-muted-foreground">{c}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}