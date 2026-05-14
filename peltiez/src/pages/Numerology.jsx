import { useState } from "react";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { Loader2, Hash, Calendar, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DIVINATION_METHODS = [
  { name: "Numérologie", emoji: "🔢", desc: "Nombres de destinée, chemin de vie, compatibilité" },
  { name: "Tarot Divinatoire", emoji: "🃏", desc: "Tirage quotidien, lecture profonde des arcanes" },
  { name: "Oracle des Anges", emoji: "👼", desc: "Messages des êtres de lumière et guidance spirituelle" },
  { name: "Astrologie Védique", emoji: "🪐", desc: "Horoscope selon les traditions hindoues" },
  { name: "Géomancie", emoji: "🌍", desc: "Divination par les éléments et énergies terrestres" },
  { name: "Runes", emoji: "ᚱ", desc: "Ancien alphabet nordique et ses significations" }
];

const NUMBER_MEANINGS = {
  1: { name: "Leadership", color: "from-red-500 to-orange-500", emoji: "👑" },
  2: { name: "Dualité", color: "from-blue-500 to-cyan-500", emoji: "⚖️" },
  3: { name: "Créativité", color: "from-yellow-500 to-orange-500", emoji: "✨" },
  4: { name: "Stabilité", color: "from-green-500 to-emerald-500", emoji: "🏗️" },
  5: { name: "Liberté", color: "from-purple-500 to-violet-500", emoji: "🦅" },
  6: { name: "Harmonie", color: "from-pink-500 to-rose-500", emoji: "🕊️" },
  7: { name: "Spiritualité", color: "from-indigo-500 to-blue-500", emoji: "🔮" },
  8: { name: "Abondance", color: "from-amber-500 to-yellow-500", emoji: "💎" },
  9: { name: "Sagesse", color: "from-violet-500 to-purple-500", emoji: "🌟" }
};

export default function Numerology() {
  const [form, setForm] = useState({ full_name: "", birth_date: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!form.full_name.trim() || !form.birth_date) return;
    setLoading(true);

    const res = await base44.functions.invoke("syncNumerologyProfile", {
      full_name: form.full_name,
      birth_date: form.birth_date
    });

    setResult(res.data?.numerology);
    setLoading(false);
  };

  const NumberCard = ({ num, icon }) => {
    const info = NUMBER_MEANINGS[num];
    return (
      <div className={`bg-gradient-to-br ${info.color} text-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}>
        <div className="text-4xl mb-2">{info.emoji}</div>
        <div className="text-5xl font-black mb-1">{num}</div>
        <p className="font-bold text-sm mb-2">{info.name}</p>
        <p className="text-xs opacity-90 leading-relaxed">{icon}</p>
      </div>
    );
  };

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Numérologie et Divination",
    "description": "Découvrez votre profil numérologique complet et autres méthodes divinatoires."
  };

  return (
    <div className="pb-20 space-y-10 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Numérologie et Méthodes Divinatoires"
        description="Explorez votre destinée avec numérologie, tarot, oracle, astrologie, géomancie et runes."
        keywords="numérologie, tarot, oracle, runes, astrologie, divination, spiritualité"
        canonicalUrl="https://egor69.ca/numerology"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-12 text-center" style={{
        background: "linear-gradient(135deg, hsl(260,60%,12%), hsl(280,50%,14%))"
      }}>
        <div className="text-6xl mb-4">🔮</div>
        <h1 className="font-display text-4xl font-black text-white">Numerologie et Divination</h1>
        <p className="text-white/60 mt-3 text-lg max-w-2xl mx-auto">
          Decouvre ta destinee a travers les nombres, les cartes et les energies cosmiques.
        </p>
      </div>

      {/* Formulaire */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
        <h2 className="font-bold text-foreground flex items-center gap-2">
          <Hash className="h-5 w-5 text-violet-500" /> Profil Numerologique
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wide">Nom complet</label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
              placeholder="Jean-Marie Dupont"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wide flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Date de naissance
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
              value={form.birth_date}
              onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))}
            />
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!form.full_name.trim() || !form.birth_date || loading}
          className="w-full rounded-xl font-bold gap-2 h-11"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Calcul en cours…</>
            : <><Wand2 className="h-4 w-4" /> Reveler mon Profil Numerologique</>}
        </Button>
      </div>

      {/* Résultats */}
      {result && (
        <div className="space-y-8 animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberCard num={result.life_path.number} icon={result.life_path.meaning} />
            <NumberCard num={result.destiny.number} icon={result.destiny.meaning} />
            <NumberCard num={result.soul_urge.number} icon={result.soul_urge.meaning} />
            <NumberCard num={result.personality.number} icon={result.personality.meaning} />
            <NumberCard num={result.personal_year.number} icon={result.personal_year.meaning} />
          </div>

          {result.lucky_numbers?.length > 0 && (
            <div className="p-6 rounded-2xl border border-amber-200/30 bg-amber-500/5">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-3">Tes nombres porte-bonheur</p>
              <div className="flex flex-wrap gap-2">
                {result.lucky_numbers.map(n => (
                  <Badge key={n} className="bg-amber-100 text-amber-700 border-amber-200 text-sm font-bold py-1 px-3">
                    {n}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Autres méthodes divinatoires */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Autres Methodes Divinatoires</h2>
          <p className="text-muted-foreground">Bientot disponibles sur CirculAI Hub</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIVINATION_METHODS.map(method => (
            <div key={method.name} className="rounded-2xl border border-border bg-card p-6 hover:shadow-md hover:border-primary/20 transition-all hover:-translate-y-0.5 text-center">
              <div className="text-4xl mb-3">{method.emoji}</div>
              <h3 className="font-bold text-foreground mb-1">{method.name}</h3>
              <p className="text-xs text-muted-foreground">{method.desc}</p>
              <Badge variant="outline" className="mt-3 text-[10px]">A venir</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Message de clôture */}
      <div className="rounded-3xl p-8 text-center" style={{
        background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(99,102,241,0.1))"
      }}>
        <p className="text-sm text-foreground/70 leading-relaxed max-w-2xl mx-auto">
          La divination n est pas du hasard. C est l univers qui te parle a travers les symboles, les nombres et les energies.
        </p>
      </div>
    </div>
  );
}