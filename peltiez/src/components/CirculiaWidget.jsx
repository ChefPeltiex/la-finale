import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Sparkles, X, ArrowRight, Loader2, Package, Gift, RefreshCw, Wrench, ChevronDown, Brain } from "lucide-react";

const PAGE_CONTEXT = {
  "/":              "L'utilisateur est sur la page d'accueil. Il découvre le Hub.",
  "/marketplace":   "L'utilisateur parcourt le marketplace. Il cherche à acheter, échanger ou donner.",
  "/publier":       "L'utilisateur veut publier une annonce.",
  "/profil":        "L'utilisateur consulte son profil et ses annonces.",
  "/city-hubs":     "L'utilisateur explore les Hubs urbains locaux.",
  "/negociation-ia":"L'utilisateur utilise l'IA de négociation.",
  "/recommandations":"L'utilisateur cherche des recommandations.",
  "/artisans":      "L'utilisateur explore les artisans locaux.",
  "/smart-contrats":"L'utilisateur veut sécuriser un échange.",
};

const TYPE_ICON  = { vente: Package, don: Gift, échange: RefreshCw, réparation: Wrench };
const TYPE_COLOR = { vente: "text-blue-500", don: "text-emerald-500", échange: "text-purple-500", réparation: "text-amber-500" };

const lastFetchMap = {};
const THROTTLE_MS = 90_000;

const HIDDEN_PATHS = [
  "/intro",
  "/welcome",
  "/underworld",
  "/etherealm",
  "/netherealm",
  "/outworld",
  "/arene-virtuelle",
];

export default function CirculiaWidget() {
  const location = useLocation();
  const { trackPage, trackListing, getSummary } = useUserPreferences();

  const [open, setOpen]           = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [reco, setReco]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [hasNew, setHasNew]       = useState(false);
  const [adapted, setAdapted]     = useState(false);
  const prevPath = useRef(null);

  const { data: listings = [] } = useQuery({
    queryKey: ["listings-widget"],
    queryFn: () => base44.entities.Listing.filter({ status: "actif" }, "-created_date", 100),
    staleTime: 120_000,
  });

  // Track page visit + trigger analyse
  useEffect(() => {
    const path = location.pathname;
    if (path === prevPath.current) return;
    prevPath.current = path;
    if (HIDDEN_PATHS.includes(path) || listings.length === 0) return;

    trackPage(path);

    const now = Date.now();
    if (lastFetchMap[path] && now - lastFetchMap[path] < THROTTLE_MS) return;
    lastFetchMap[path] = now;

    analyse(path);
  }, [location.pathname, listings]);

  const analyse = async (path) => {
    if (listings.length === 0) return;
    setLoading(true);
    setHasNew(false);

    const ctx = PAGE_CONTEXT[path] || `L'utilisateur navigue sur la page ${path}.`;
    const { summary: prefSummary, viewedIds } = getSummary();

    // Exclure les annonces déjà vues, favoriser des nouvelles
    const fresh = listings.filter(l => !viewedIds.includes(l.id));
    const pool  = (fresh.length >= 10 ? fresh : listings).slice(0, 50);

    const sample = pool.map(l => ({
      id: l.id, titre: l.title, type: l.type, prix: l.price || 0, ville: l.location || "", cat: l.category || "",
    }));

    const userContext = prefSummary
      ? `\n\nPROFIL APPRIS DE L'UTILISATEUR (auto-apprentissage) :\n${prefSummary}`
      : "";

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es Circulia, assistant IA hyper-personnalisé de CirculAI Hub.
Contexte de navigation : ${ctx}${userContext}

Annonces disponibles (${sample.length}) :
${JSON.stringify(sample)}

En tenant compte du profil appris, sélectionne 3 annonces parfaitement adaptées à cet utilisateur précis.
Pour chaque annonce, donne une micro-raison ultra-personnalisée (max 12 mots, "tu" conversationnel, réfère-toi à ses préférences si connues).
Génère aussi 1 conseil personnalisé très court (max 15 mots).
Si des préférences sont connues, adapte vraiment le choix — sinon recommande les annonces les plus populaires.`,
      response_json_schema: {
        type: "object",
        properties: {
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                listing_id:  { type: "string" },
                micro_raison:{ type: "string" },
              }
            }
          },
          conseil: { type: "string" },
          is_personalized: { type: "boolean" },
        }
      }
    });

    const enriched = (res.suggestions || [])
      .map(s => {
        const l = listings.find(x => x.id === s.listing_id);
        return l ? { ...s, listing: l } : null;
      })
      .filter(Boolean)
      .slice(0, 3);

    setReco({ suggestions: enriched, conseil: res.conseil, personalized: res.is_personalized });
    setAdapted(!!res.is_personalized && !!prefSummary);
    setLoading(false);
    setHasNew(true);
  };

  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col items-end gap-2">

      {/* Panel */}
      {open && !minimized && (
        <div className="w-72 sm:w-80 rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in-up"
          style={{ background: "hsl(var(--card))" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(16,185,129,0.06))" }}>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-bold text-foreground">Circulia</span>
              {adapted && (
                <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#10b981)" }}>
                  <Brain className="h-2.5 w-2.5" /> adapté
                </span>
              )}
              {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(true)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Conseil */}
          {reco?.conseil && (
            <div className="px-4 py-2.5 border-b border-border bg-violet-500/5">
              <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">💡 {reco.conseil}</p>
            </div>
          )}

          {/* Suggestions */}
          <div className="p-3 space-y-2">
            {loading && !reco && (
              <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground text-xs">
                <Loader2 className="h-4 w-4 animate-spin" /> Analyse en cours…
              </div>
            )}

            {reco?.suggestions?.map((s, i) => {
              const Icon = TYPE_ICON[s.listing.type] || Package;
              const iconColor = TYPE_COLOR[s.listing.type] || "text-primary";
              return (
                <Link key={i} to={`/annonce/${s.listing.id}`}
                  onClick={() => { trackListing(s.listing); setOpen(false); }}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors group">
                  <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    {s.listing.image_url
                      ? <img src={s.listing.image_url} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <Icon className={`h-4 w-4 ${iconColor}`} />
                        </div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {s.listing.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{s.micro_raison}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Icon className={`h-3 w-3 ${iconColor}`} />
                      <span className={`text-[10px] font-bold capitalize ${iconColor}`}>{s.listing.type}</span>
                      {s.listing.price > 0 && <span className="text-[10px] text-muted-foreground">· {s.listing.price}$</span>}
                    </div>
                  </div>
                </Link>
              );
            })}

            {reco?.suggestions?.length === 0 && !loading && (
              <p className="text-xs text-muted-foreground text-center py-4">Aucune suggestion pour cette page.</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
            <Link to="/recommandations" onClick={() => setOpen(false)}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              Recherche avancée <ArrowRight className="h-3 w-3" />
            </Link>
            <button onClick={() => analyse(location.pathname)} disabled={loading}
              className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Actualiser
            </button>
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        onClick={() => { setOpen(o => !o); setMinimized(false); setHasNew(false); }}
        className="relative h-12 w-12 rounded-2xl shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #7c3aed, #10b981)" }}
        title="Circulia · Recommandations IA personnalisées"
      >
        <Sparkles className="h-5 w-5 text-white" />
        {hasNew && !open && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 border-2 border-background flex items-center justify-center">
            <span className="text-[8px] font-black text-white">3</span>
          </span>
        )}
      </button>
    </div>
  );
}