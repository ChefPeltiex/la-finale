import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Search, MapPin, Gift, Loader2, Sparkles, ArrowRight, Zap, AlertCircle, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Score de proximité géographique basé sur les mots communs dans les localisations
function geoScore(userCity, listingLocation) {
  if (!userCity || !listingLocation) return 0;
  const u = userCity.toLowerCase();
  const l = listingLocation.toLowerCase();
  if (l.includes(u) || u.includes(l)) return 1;
  // Mots communs (province, région)
  const uWords = u.split(/[\s,]+/).filter(w => w.length > 2);
  const lWords = l.split(/[\s,]+/).filter(w => w.length > 2);
  const common = uWords.filter(w => lWords.includes(w));
  return common.length > 0 ? 0.6 : 0;
}

function MatchCard({ match }) {
  const pct = Math.round(match.score * 100);
  const scoreColor = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#6366f1";
  return (
    <Link to={`/annonce/${match.listing.id}`}
      className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group">
      {/* Image / Icône */}
      <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        {match.listing.image_url
          ? <img src={match.listing.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          : <div className="w-full h-full flex items-center justify-center">
              <Gift className="h-6 w-6 text-emerald-500" />
            </div>
        }
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {match.listing.title}
          </h3>
          {/* Score */}
          <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black text-white"
            style={{ background: scoreColor }}>
            {pct}% match
          </div>
        </div>

        {match.reason && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2 italic">"{match.reason}"</p>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          {match.listing.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-emerald-500" /> {match.listing.location}
            </span>
          )}
          {match.listing.condition && (
            <Badge variant="outline" className="text-[10px] py-0">{match.listing.condition}</Badge>
          )}
          {match.geoNear && (
            <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
              <Zap className="h-3 w-3" /> Zone proche
            </span>
          )}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
    </Link>
  );
}

export default function BesoinsMatch() {
  const [besoin, setBesoin]       = useState("");
  const [ville, setVille]         = useState("");
  const [email, setEmail]         = useState("");
  const [alertMe, setAlertMe]     = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [results, setResults]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [searched, setSearched]   = useState("");

  const { data: dons = [] } = useQuery({
    queryKey: ["dons-actifs"],
    queryFn: () => base44.entities.Listing.filter({ type: "don", status: "actif" }, "-created_date", 200),
    staleTime: 120_000,
  });

  const handleSearch = useCallback(async () => {
    if (!besoin.trim() || dons.length === 0) return;
    setLoading(true);
    setResults(null);
    setSearched(besoin);

    // Pré-filtrage géographique côté client
    const geoFiltered = dons.map(l => ({ listing: l, geo: geoScore(ville, l.location) }));
    const nearby = geoFiltered.filter(x => x.geo > 0).map(x => x.listing);
    const pool = (nearby.length >= 5 ? nearby : dons).slice(0, 60);

    const sample = pool.map(l => ({
      id: l.id, titre: l.title, desc: l.description?.slice(0, 80) || "",
      ville: l.location || "", etat: l.condition || "", cat: l.category || "",
    }));

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un moteur de matching prédictif pour CirculAI Hub.

BESOIN DE L'UTILISATEUR : "${besoin}"
SA VILLE / RÉGION : "${ville || "non précisée"}"

DONS DISPONIBLES :
${JSON.stringify(sample)}

Analyse sémantiquement le besoin et retourne les 5 meilleures correspondances.
Pour chaque résultat, donne :
- listing_id : l'id exact de l'annonce
- score : entre 0.0 et 1.0 (précision du match besoin ↔ don)
- reason : une explication courte (max 15 mots) pourquoi c'est un bon match

Classe par score décroissant. Ne retourne que des annonces pertinentes (score > 0.3).`,
      response_json_schema: {
        type: "object",
        properties: {
          matches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                listing_id: { type: "string" },
                score:      { type: "number" },
                reason:     { type: "string" },
              }
            }
          },
          summary: { type: "string" },
        }
      }
    });

    const enriched = (res.matches || [])
      .map(m => {
        const listing = dons.find(l => l.id === m.listing_id);
        if (!listing) return null;
        const geo = geoScore(ville, listing.location);
        return { listing, score: m.score, reason: m.reason, geoNear: geo > 0 };
      })
      .filter(Boolean)
      .sort((a, b) => {
        // Boost léger pour les annonces géographiquement proches
        const aS = a.score + (a.geoNear ? 0.08 : 0);
        const bS = b.score + (b.geoNear ? 0.08 : 0);
        return bS - aS;
      });

    setResults({ matches: enriched, summary: res.summary });
    setLoading(false);
  }, [besoin, ville, dons]);

  const examples = ["Un vélo pour aller au travail", "Des livres pour enfants", "Une table de cuisine", "Vêtements taille M", "Un ordinateur portable"];

  return (
    <div className="pb-20 space-y-8 max-w-2xl mx-auto px-4 pt-6">

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>
          <Sparkles className="h-3.5 w-3.5" /> Matching Prédictif IA
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">
          Trouve ce dont tu as besoin
        </h1>
        <p className="text-muted-foreground">
          Décris ton besoin. L'IA connecte instantanément avec les dons disponibles près de chez toi.
        </p>
      </div>

      {/* Formulaire */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <div>
          <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wide">
            De quoi as-tu besoin ?
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Ex: un vélo, des vêtements, une table…"
              value={besoin}
              onChange={e => setBesoin(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
          </div>
          {/* Exemples rapides */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {examples.map(ex => (
              <button key={ex} onClick={() => setBesoin(ex)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-muted hover:bg-muted/70 text-muted-foreground transition-colors font-medium">
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wide">
            Ta ville / région <span className="text-muted-foreground/60 font-normal">(optionnel)</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Montréal, Québec, Paris…"
              value={ville}
              onChange={e => setVille(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        {/* Email notification opt-in */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={alertMe} onChange={e => { setAlertMe(e.target.checked); setEmailSent(false); }}
              className="rounded border-border" />
            <span className="text-xs font-medium text-foreground">M'envoyer un email si des correspondances sont trouvées</span>
          </label>
          {alertMe && (
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="ton@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailSent(false); }}
              />
            </div>
          )}
          {emailSent && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-xl p-3">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              Email envoyé à {email} avec les correspondances trouvées !
            </div>
          )}
        </div>

        <Button onClick={handleSearch} disabled={!besoin.trim() || loading || dons.length === 0}
          className="w-full rounded-xl font-bold gap-2 h-11">
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyse en cours…</>
            : <><Sparkles className="h-4 w-4" /> Trouver des dons ({dons.length} disponibles)</>
          }
        </Button>

        {dons.length === 0 && (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl p-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            Aucun don actif pour l'instant. <Link to="/publier" className="underline font-bold">Publier le premier !</Link>
          </div>
        )}
      </div>

      {/* Résultats */}
      {results && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-foreground">
                {results.matches.length > 0
                  ? `${results.matches.length} correspondance${results.matches.length > 1 ? "s" : ""} trouvée${results.matches.length > 1 ? "s" : ""}`
                  : "Aucune correspondance trouvée"}
              </h2>
              <p className="text-xs text-muted-foreground">pour « {searched} »{ville ? ` · ${ville}` : ""}</p>
            </div>
            {results.matches.length > 0 && results.matches[0].geoNear && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                <MapPin className="h-3 w-3 mr-1" /> Résultats locaux en priorité
              </Badge>
            )}
          </div>

          {results.summary && (
            <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-200/50">
              <p className="text-xs text-violet-600 font-medium">💡 {results.summary}</p>
            </div>
          )}

          {results.matches.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
              <Gift className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Aucun don correspondant trouvé.</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Tu peux élargir ta zone ou essayer un terme différent.</p>
              <Button asChild size="sm" variant="outline" className="rounded-xl">
                <Link to="/marketplace">Voir tout le marketplace</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {results.matches.map((m, i) => <MatchCard key={i} match={m} />)}
            </div>
          )}

          <div className="text-center pt-2">
            <Link to="/marketplace?type=don"
              className="text-sm text-primary hover:underline flex items-center gap-1 justify-center font-semibold">
              Voir tous les dons disponibles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}