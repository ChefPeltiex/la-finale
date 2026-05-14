import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Moon, Sparkles, Search, Loader2, ChevronDown, ChevronUp, Star, Eye, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SYMBOLES = [
  { emoji: "🐍", nom: "Serpent", signification: "Transformation, guérison, renouveau. Le serpent qui mue symbolise une renaissance personnelle imminente.", theme: "Transformation" },
  { emoji: "🌊", nom: "Océan / Vagues", signification: "Les émotions profondes, l'inconscient collectif. Nager = naviguer sa vie intérieure. Être submergé = être dépassé par ses émotions.", theme: "Émotions" },
  { emoji: "✈️", nom: "Voler", signification: "Ambitions, liberté, désir de s'élever au-dessus des problèmes. Voler sans aide = confiance en soi absolue.", theme: "Liberté" },
  { emoji: "🏚️", nom: "Maison abandonnée", signification: "Une partie négligée de toi-même. Chaque pièce représente un aspect de ta psyché. Les sous-sols = l'inconscient.", theme: "Psyché" },
  { emoji: "🦁", nom: "Lion", signification: "Courage, leadership, puissance intérieure. Être poursuivi par un lion = fuir sa propre force ou responsabilité.", theme: "Courage" },
  { emoji: "💀", nom: "Mort", signification: "JAMAIS une mort littérale. Symbolise une fin de cycle, une transformation radicale, un lâcher-prise nécessaire.", theme: "Fin de cycle" },
  { emoji: "🌙", nom: "Lune", signification: "L'intuition, le féminin sacré, les cycles. Pleine lune = accomplissement. Nouvelle lune = nouveau départ.", theme: "Intuition" },
  { emoji: "🌳", nom: "Arbre", signification: "Ta vie, tes racines familiales, ta croissance personnelle. Arbre mort = relation ou projet à lâcher.", theme: "Croissance" },
  { emoji: "🔑", nom: "Clé", signification: "La solution à un problème existe en toi. Une porte verrouillée = une opportunité ou vérité encore inaccessible.", theme: "Solution" },
  { emoji: "🔥", nom: "Feu", signification: "Passion, purification, colère ou transformation. Feu maîtrisé = pouvoir. Feu incontrôlé = émotions débordantes.", theme: "Passion" },
  { emoji: "🪞", nom: "Miroir", signification: "Ton reflet révèle comment tu te perçois vraiment. Image déformée = fausse perception de soi.", theme: "Identité" },
  { emoji: "🌈", nom: "Arc-en-ciel", signification: "Espoir après une période difficile. Pont entre deux états de conscience ou deux phases de vie.", theme: "Espoir" },
  { emoji: "👶", nom: "Bébé", signification: "Un nouveau projet, une idée naissante ou une partie vulnérable de toi qui a besoin d'attention.", theme: "Nouveauté" },
  { emoji: "🪜", nom: "Escalier", signification: "Progression spirituelle ou professionnelle. Monter = aspiration. Descendre = introspection.", theme: "Progression" },
  { emoji: "💧", nom: "Pluie", signification: "Purification, larmes refoulées, abondance ou bénédiction. Pluie torrentielle = libération émotionnelle intense.", theme: "Purification" },
  { emoji: "🕊️", nom: "Colombe blanche", signification: "Paix intérieure, message spirituel, âme qui cherche la liberté. Messager d'une autre dimension.", theme: "Spirituel" },
];

const THEMES = [
  { icon: "😱", titre: "Être poursuivi", explication: "Tu évites quelque chose dans ta vie réelle. La peur n'est pas la menace externe — c'est TOI. Retourne-toi et affronte ce qui te poursuit dans le rêve.", conseil: "Demande-toi : qu'est-ce que j'évite depuis longtemps ?" },
  { icon: "🦷", titre: "Dents qui tombent", explication: "Angoisse de perte, peur du jugement d'autrui ou anxiété concernant ton image et ta communication. Très commun en période de stress.", conseil: "Réévalue ta relation à l'opinion des autres." },
  { icon: "📚", titre: "Examen raté", explication: "Tu te sens évalué ou jugé dans ta vie. Syndrome de l'imposteur. Peur de ne pas être à la hauteur d'une situation réelle.", conseil: "Identifie dans quel domaine tu te sous-estimes." },
  { icon: "🌀", titre: "Chute dans le vide", explication: "Sentiment de perte de contrôle, insécurité ou transition brutale. Se réveiller en sursaut = ton cerveau qui recalibre ton équilibre.", conseil: "Qu'est-ce qui te semble hors de contrôle en ce moment ?" },
  { icon: "🔄", titre: "Rêve récurrent", explication: "Ton inconscient insiste. Un message non compris ou une situation non résolue revient jusqu'à ce que tu l'intègres.", conseil: "Tiens un journal de rêves — le schéma révèle la clé." },
  { icon: "✨", titre: "Rêve lucide", explication: "Tu deviens conscient que tu rêves. État rare et puissant. Peut être cultivé — c'est la porte vers l'exploration pure de l'inconscient.", conseil: "Pratique la réalité check : demande-toi 5x/jour 'Est-ce que je rêve ?'" },
];

function SymboleCard({ s }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all hover:border-violet-300/30">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors">
        <span className="text-2xl shrink-0">{s.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-sm">{s.nom}</p>
          <Badge variant="outline" className="text-[10px] mt-0.5">{s.theme}</Badge>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-border/50">
          <p className="text-sm text-foreground leading-relaxed">{s.signification}</p>
        </div>
      )}
    </div>
  );
}

export default function RevesSymboles() {
  const [reve, setReve] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyse, setAnalyse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSymboles = SYMBOLES.filter(s =>
    !searchQuery ||
    s.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.theme.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const analyserReve = async () => {
    if (!reve.trim()) return;
    setLoading(true);
    setAnalyse(null);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert en onirologie (science des rêves), psychologie jungienne et symbolisme spirituel.

Analyse ce rêve de façon profonde, bienveillante et éclairante :

RÊVE : "${reve}"

Donne une analyse complète incluant les symboles principaux, le message de l'inconscient, un conseil actionnable concret et la dimension spirituelle.`,
      response_json_schema: {
        type: "object",
        properties: {
          titre: { type: "string" },
          symboles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                symbole: { type: "string" },
                signification: { type: "string" }
              }
            }
          },
          message_central: { type: "string" },
          inconscient: { type: "string" },
          conseil: { type: "string" },
          dimension_spirituelle: { type: "string" },
          emotion_dominante: { type: "string" },
          phase_de_vie: { type: "string" }
        }
      }
    });
    setAnalyse(res);
    setLoading(false);
  };

  return (
    <div className="pb-20 space-y-10 max-w-3xl mx-auto px-4 pt-6">

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden text-center p-10"
        style={{ background: "linear-gradient(135deg, hsl(240,40%,6%) 0%, hsl(270,50%,10%) 50%, hsl(220,50%,8%) 100%)" }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: (Math.sin(i * 3) * 1 + 1.5) + "px",
              height: (Math.sin(i * 3) * 1 + 1.5) + "px",
              left: ((i * 17 + 5) % 95) + "%",
              top: ((i * 23 + 3) % 90) + "%",
              opacity: 0.15 + (i % 5) * 0.1,
            }} />
        ))}
        <div className="relative z-10 space-y-4">
          <div className="text-6xl mb-2">🌙</div>
          <Badge className="bg-violet-600 text-white border-0 font-bold px-4 py-1">
            ONIROLOGIE · PSYCHOLOGIE JUNGIENNE
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
            Rêves et Symboles
          </h1>
          <p className="text-white/60 max-w-lg mx-auto leading-relaxed">
            Chaque rêve est un message codé de ton inconscient.
            Décrypte ses symboles, comprends ses messages, et transforme tes nuits en guidance.
          </p>
        </div>
      </div>

      {/* Analyseur IA */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-violet-500" />
          <h2 className="font-bold text-foreground">Analyse ton rêve par l'IA</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Décris ton rêve avec le plus de détails possible — personnages, lieux, émotions, couleurs.
        </p>
        <textarea
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400/30 resize-none"
          rows={5}
          placeholder="J'étais dans une maison inconnue, il y avait un serpent doré qui me regardait sans bouger. Je ressentais une étrange paix malgré la peur..."
          value={reve}
          onChange={e => setReve(e.target.value)}
        />
        <Button onClick={analyserReve} disabled={!reve.trim() || loading}
          className="w-full rounded-xl font-bold gap-2 h-11"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", border: "none" }}>
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Déchiffrage en cours…</>
            : <><Moon className="h-4 w-4" /> Analyser mon rêve</>}
        </Button>
      </div>

      {/* Résultat analyse */}
      {analyse && (
        <div className="space-y-5 animate-fade-in-up">
          <div className="rounded-2xl border border-violet-400/20 overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.05), rgba(168,85,247,0.03))" }}>
            <div className="p-5 border-b border-violet-400/10">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-5 w-5 text-violet-500" />
                <h3 className="font-display font-bold text-foreground text-lg">{analyse.titre || "Analyse de ton rêve"}</h3>
              </div>
              {analyse.emotion_dominante && (
                <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-xs">{analyse.emotion_dominante}</Badge>
              )}
            </div>

            <div className="p-5 space-y-5">
              {analyse.symboles?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Symboles détectés</p>
                  <div className="space-y-2">
                    {analyse.symboles.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-muted rounded-xl">
                        <Star className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-sm text-foreground">{s.symbole}{" — "}</span>
                          <span className="text-sm text-muted-foreground">{s.signification}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analyse.message_central && (
                <div className="p-4 rounded-xl border border-violet-300/20 bg-violet-500/5">
                  <p className="text-xs font-bold text-violet-500 uppercase tracking-wide mb-1">Message central</p>
                  <p className="text-sm text-foreground leading-relaxed">{analyse.message_central}</p>
                </div>
              )}

              {analyse.inconscient && (
                <div className="p-4 rounded-xl bg-muted">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Ce que dit ton inconscient</p>
                  <p className="text-sm text-foreground leading-relaxed">{analyse.inconscient}</p>
                </div>
              )}

              {analyse.conseil && (
                <div className="p-4 rounded-xl border border-emerald-300/20 bg-emerald-500/5">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Conseil actionnable
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{analyse.conseil}</p>
                </div>
              )}

              {analyse.dimension_spirituelle && (
                <div className="p-4 rounded-xl border border-amber-300/20 bg-amber-500/5">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Dimension spirituelle
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{analyse.dimension_spirituelle}</p>
                </div>
              )}

              {analyse.phase_de_vie && (
                <p className="text-xs text-muted-foreground text-center italic">
                  Phase de vie actuelle : <strong className="text-foreground">{analyse.phase_de_vie}</strong>
                </p>
              )}
            </div>
          </div>

          <Button variant="outline" onClick={() => { setAnalyse(null); setReve(""); }}
            className="w-full rounded-xl">
            Analyser un autre rêve
          </Button>
        </div>
      )}

      {/* Thèmes récurrents */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Heart className="h-5 w-5 text-rose-500" />
          <h2 className="font-display text-2xl font-bold text-foreground">Rêves récurrents démystifiés</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEMES.map((t, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:border-violet-300/20 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{t.icon}</span>
                <h3 className="font-bold text-foreground">{t.titre}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.explication}</p>
              <div className="px-3 py-2 rounded-xl bg-violet-500/5 border border-violet-300/20">
                <p className="text-xs font-semibold text-violet-600">{"💡 " + t.conseil}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dictionnaire */}
      <section>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-blue-400" />
            <h2 className="font-display text-2xl font-bold text-foreground">Dictionnaire des Symboles</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              className="pl-8 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30 w-48"
              placeholder="Chercher…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredSymboles.map((s, i) => <SymboleCard key={i} s={s} />)}
        </div>
        {filteredSymboles.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <Moon className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p>Aucun symbole trouvé</p>
          </div>
        )}
      </section>

      {/* Conseil final */}
      <div className="rounded-3xl p-8 text-center space-y-4"
        style={{ background: "linear-gradient(135deg, hsl(240,40%,6%), hsl(270,50%,10%))" }}>
        <div className="text-4xl">📓</div>
        <h2 className="font-display text-2xl font-bold text-white">Tiens un journal de rêves</h2>
        <p className="text-white/60 max-w-md mx-auto leading-relaxed text-sm">
          Note tes rêves dans les 5 premières minutes après le réveil.
          C'est la pratique la plus puissante pour décoder ton inconscient.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {[
            { emoji: "⏰", tip: "Écris dès le réveil, avant de bouger" },
            { emoji: "🎨", tip: "Note les couleurs et émotions ressenties" },
            { emoji: "🔍", tip: "Cherche les patterns sur plusieurs semaines" },
          ].map((t, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-xl mb-1">{t.emoji}</p>
              <p className="text-xs text-white/60">{t.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}