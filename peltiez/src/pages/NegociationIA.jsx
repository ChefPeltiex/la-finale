import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Zap, Brain, ArrowRight, ArrowLeftRight, Loader2, CheckCircle, TrendingUp, Lightbulb, RefreshCw, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const EXEMPLES = [
  { emoji: "💻", objet: "MacBook Pro 2019", valeur: "800$", besoin: "Vélo de route ou équipement photo" },
  { emoji: "📷", objet: "Appareil photo Canon EOS", valeur: "400$", besoin: "Instruments de musique ou cours" },
  { emoji: "🛋️", objet: "Canapé 3 places IKEA", valeur: "300$", besoin: "Électroménager ou meubles chambre" },
  { emoji: "🚲", objet: "Vélo de montagne Trek", valeur: "500$", besoin: "Matériel de camping ou kayak" },
];

const ETAPES = [
  { num: "01", titre: "Décrivez votre objet", desc: "Modèle, état, valeur estimée, photos si dispo" },
  { num: "02", titre: "Précisez votre besoin", desc: "Ce que vous voulez obtenir en échange" },
  { num: "03", titre: "L'IA négocie pour vous", desc: "Analyse du marché, suggestions d'échanges, script de négociation" },
  { num: "04", titre: "Échangez en confiance", desc: "Grâce au Smart Contrat CirculAI généré automatiquement" },
];

export default function NegociationIA() {
  const [objet, setObjet] = useState("");
  const [valeur, setValeur] = useState("");
  const [besoin, setBesoin] = useState("");
  const [etat, setEtat] = useState("bon");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { data: listings = [] } = useQuery({
    queryKey: ["listings-negociation"],
    queryFn: () => base44.entities.Listing.filter({ status: "actif" }, "-created_date", 100),
    staleTime: 60_000,
  });

  const analyser = async () => {
    if (!objet.trim() || !besoin.trim()) return;
    setLoading(true);
    setResult(null);

    // Find matching listings from the platform
    const matchingListings = listings.filter(l =>
      besoin.toLowerCase().split(" ").some(mot =>
        (l.title || "").toLowerCase().includes(mot) ||
        (l.description || "").toLowerCase().includes(mot)
      )
    ).slice(0, 5);

    const matchText = matchingListings.length > 0
      ? `Voici des annonces existantes sur CirculAI Hub qui pourraient correspondre : ${matchingListings.map(l => `"${l.title}" (${l.type}, ${l.location || ""})`).join(", ")}.`
      : "Aucune annonce correspondante sur la plateforme actuellement.";

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es Circulia, l'IA de négociation universelle de CirculAI Hub. Aide cet utilisateur à optimiser son échange d'objet.

Objet proposé : ${objet}
État : ${etat}
Valeur estimée : ${valeur || "non précisée"}
Ce qu'il recherche en échange : ${besoin}

${matchText}

Génère une analyse complète en JSON avec :
- score_echangeabilite (0-100) : score de facilité d'échange
- valeur_marche_estime : estimation honnête de la valeur marché en CAD/EUR
- objets_equivalents (array de 4-5 strings) : objets de valeur équivalente qui feraient de bons échanges
- strategie_negociation (string) : 3-4 phrases de conseils tactiques pour négocier efficacement
- message_contact (string) : un message prêt à copier pour contacter un vendeur/donneur (naturel, humain, efficace, ~80 mots)
- timing_optimal (string) : quand et comment proposer l'échange pour maximiser les chances
- erreurs_a_eviter (array de 3 strings) : les erreurs classiques à éviter
- indice_urgence (string : "faible" | "moyen" | "élevé") : urgence de trouver un échange selon le marché
- conseil_photo (string) : conseil sur comment photographier l'objet pour maximiser l'attractivité`,
      response_json_schema: {
        type: "object",
        properties: {
          score_echangeabilite: { type: "number" },
          valeur_marche_estime: { type: "string" },
          objets_equivalents: { type: "array", items: { type: "string" } },
          strategie_negociation: { type: "string" },
          message_contact: { type: "string" },
          timing_optimal: { type: "string" },
          erreurs_a_eviter: { type: "array", items: { type: "string" } },
          indice_urgence: { type: "string" },
          conseil_photo: { type: "string" },
        }
      }
    });

    setResult({ ...res, matchingListings });
    setLoading(false);
  };

  const scoreColor = result
    ? result.score_echangeabilite >= 70 ? "#10b981"
    : result.score_echangeabilite >= 40 ? "#f59e0b"
    : "#ef4444"
    : "#6366f1";

  const urgenceColor = { faible: "#10b981", moyen: "#f59e0b", élevé: "#ef4444" };

  return (
    <div className="pb-20 space-y-10 max-w-4xl mx-auto px-4 pt-8">

      {/* Hero */}
      <div className="rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-border relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.05))" }}>
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-400 text-xs font-bold mb-4">
            <Brain className="h-3.5 w-3.5" /> IA DE NÉGOCIATION UNIVERSELLE · CIRCULIA
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">
            Échangez <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-emerald-500">plus vite</span>.<br />
            Négociez <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">mieux</span>.
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-3">
            Décrivez votre objet et votre besoin. Circulia analyse le marché CirculAI Hub,
            évalue votre objet et vous donne un <strong className="text-foreground">plan de négociation complet</strong> en secondes.
          </p>
        </div>
      </div>

      {/* Étapes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ETAPES.map(e => (
          <div key={e.num} className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-2xl font-black text-primary mb-1">{e.num}</p>
            <p className="font-bold text-foreground text-xs mb-1">{e.titre}</p>
            <p className="text-muted-foreground text-[10px] leading-relaxed">{e.desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-violet-500" /> Analyser mon échange
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Mon objet *</label>
            <input
              type="text"
              placeholder="Ex: MacBook Pro 2019, iPhone 13, Vélo Trek, Canapé IKEA..."
              value={objet}
              onChange={e => setObjet(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Valeur estimée</label>
              <input
                type="text"
                placeholder="Ex: 400$, 150€..."
                value={valeur}
                onChange={e => setValeur(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">État</label>
              <select
                value={etat}
                onChange={e => setEtat(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
              >
                <option value="neuf">Neuf / jamais utilisé</option>
                <option value="très bon">Très bon état</option>
                <option value="bon">Bon état</option>
                <option value="acceptable">Acceptable</option>
                <option value="à réparer">À réparer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Ce que je cherche en échange *</label>
            <textarea
              placeholder="Ex: Un vélo de route, du matériel photo, cours de musique, mobilier, électroménager..."
              value={besoin}
              onChange={e => setBesoin(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none"
            />
          </div>
        </div>

        <Button
          onClick={analyser}
          disabled={loading || !objet.trim() || !besoin.trim()}
          className="w-full rounded-xl font-bold h-12 text-base gap-2"
          style={{ background: "linear-gradient(135deg, #6366f1, #10b981)", border: "none", color: "white" }}
        >
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Circulia analyse...</> : <><Brain className="h-4 w-4" /> Lancer l'analyse IA</>}
        </Button>

        {/* Exemples */}
        <div>
          <p className="text-xs text-muted-foreground font-semibold mb-2">Exemples rapides :</p>
          <div className="flex flex-wrap gap-2">
            {EXEMPLES.map((ex, i) => (
              <button key={i} onClick={() => { setObjet(`${ex.objet} (${ex.valeur})`); setBesoin(ex.besoin); }}
                className="px-3 py-1.5 rounded-full text-xs bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all font-medium">
                {ex.emoji} {ex.objet}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in-up">

          {/* Score + valeur */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card rounded-2xl border p-6 text-center col-span-1" style={{ borderColor: `${scoreColor}40` }}>
              <p className="text-xs text-muted-foreground font-bold mb-2">SCORE D'ÉCHANGEABILITÉ</p>
              <div className="relative h-24 w-24 mx-auto mb-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor} strokeWidth="3"
                    strokeDasharray={`${result.score_echangeabilite} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black" style={{ color: scoreColor }}>{result.score_echangeabilite}</span>
                </div>
              </div>
              <p className="text-xs font-bold" style={{ color: scoreColor }}>
                {result.score_echangeabilite >= 70 ? "🟢 Excellent" : result.score_echangeabilite >= 40 ? "🟡 Moyen" : "🔴 Difficile"}
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-muted-foreground">VALEUR MARCHÉ ESTIMÉE</p>
                <Badge className="font-black text-sm px-3" style={{ background: scoreColor + "20", color: scoreColor }}>
                  {result.valeur_marche_estime}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-muted-foreground">URGENCE MARCHÉ</p>
                <Badge className="font-bold capitalize" style={{
                  background: (urgenceColor[result.indice_urgence] || "#6366f1") + "20",
                  color: urgenceColor[result.indice_urgence] || "#6366f1"
                }}>
                  {result.indice_urgence}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2">TIMING OPTIMAL</p>
                <p className="text-sm text-foreground leading-relaxed">{result.timing_optimal}</p>
              </div>
            </div>
          </div>

          {/* Objets équivalents */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-violet-500" /> Objets de valeur équivalente
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.objets_equivalents?.map((o, i) => (
                <span key={i} className="px-3 py-2 rounded-xl text-sm font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-400/20">
                  ✦ {o}
                </span>
              ))}
            </div>
          </div>

          {/* Stratégie */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-2">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Stratégie de négociation
            </h3>
            <p className="text-sm text-foreground leading-relaxed">{result.strategie_negociation}</p>
          </div>

          {/* Message prêt à copier */}
          <div className="bg-card rounded-2xl border border-emerald-400/30 p-6 space-y-3"
            style={{ background: "rgba(16,185,129,0.04)" }}>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Message prêt à envoyer
            </h3>
            <div className="bg-muted rounded-xl p-4 text-sm text-foreground leading-relaxed italic border border-border">
              {result.message_contact}
            </div>
            <Button
              onClick={() => navigator.clipboard.writeText(result.message_contact)}
              variant="outline" size="sm" className="rounded-xl gap-2">
              📋 Copier le message
            </Button>
          </div>

          {/* Erreurs à éviter */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-2">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" /> Erreurs à éviter
            </h3>
            <div className="space-y-2">
              {result.erreurs_a_eviter?.map((e, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 font-bold mt-0.5 flex-shrink-0">✗</span>
                  <p className="text-foreground">{e}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conseil photo */}
          {result.conseil_photo && (
            <div className="bg-card rounded-2xl border border-border p-5 flex items-start gap-3">
              <span className="text-2xl">📸</span>
              <div>
                <p className="font-bold text-foreground text-sm mb-1">Conseil photo pour maximiser l'attractivité</p>
                <p className="text-sm text-muted-foreground">{result.conseil_photo}</p>
              </div>
            </div>
          )}

          {/* Annonces correspondantes sur le Hub */}
          {result.matchingListings?.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" /> Annonces trouvées sur CirculAI Hub
              </h3>
              <div className="space-y-2">
                {result.matchingListings.map(l => (
                  <Link key={l.id} to={`/annonce/${l.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                    {l.image_url
                      ? <img src={l.image_url} alt={l.title} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                      : <div className="h-10 w-10 rounded-lg bg-border flex-shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{l.location || "Sans localisation"}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA Smart Contrat */}
          <div className="rounded-2xl p-6 text-center border space-y-3"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(16,185,129,0.04))", borderColor: "rgba(99,102,241,0.2)" }}>
            <p className="font-bold text-foreground">Prêt à conclure l'échange ?</p>
            <p className="text-sm text-muted-foreground">Sécurisez votre transaction avec un Smart Contrat CirculAI gratuit.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button asChild className="rounded-xl font-bold gap-2">
                <Link to="/smart-contrats"><CheckCircle className="h-4 w-4" /> Générer un contrat</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl gap-2">
                <Link to="/publier"><Package className="h-4 w-4" /> Publier mon annonce</Link>
              </Button>
            </div>
          </div>

          {/* Reset */}
          <div className="text-center">
            <Button variant="ghost" onClick={() => { setResult(null); setObjet(""); setBesoin(""); setValeur(""); }}
              className="gap-2 text-muted-foreground rounded-xl">
              <RefreshCw className="h-4 w-4" /> Nouvelle analyse
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}