import { useState } from "react";
import SEOMeta from "@/components/SEOMeta";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import {
  Moon, Sparkles, Loader2, ChevronDown, ChevronUp,
  Plus, BookOpen, Star, Trash2, Calendar, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EMOTIONS = ["Peur", "Joie", "Tristesse", "Confusion", "Sérénité", "Anxiété", "Émerveillement", "Colère", "Amour", "Nostalgie"];
const ARCHETYPES = {
  "L'Ombre": "shadow",
  "L'Anima/Animus": "anima",
  "Le Héros": "hero",
  "Le Sage": "sage",
  "Le Trickster": "trickster",
  "La Grande Mère": "mother",
  "L'Enfant": "child",
  "Le Soi": "self",
};
const ARCHETYPE_DESC = {
  "L'Ombre": { emoji: "🌑", color: "#6366f1", desc: "Ce que tu refuses de voir en toi. Intégrer l'ombre = accéder à ta pleine puissance." },
  "L'Anima/Animus": { emoji: "☯️", color: "#ec4899", desc: "Ta part féminine ou masculine intérieure. Appel à l'équilibre et à l'intégration." },
  "Le Héros": { emoji: "⚔️", color: "#f59e0b", desc: "La quête de transformation. Tu es en train de surmonter un défi majeur." },
  "Le Sage": { emoji: "🦉", color: "#8b5cf6", desc: "Ta sagesse intérieure s'exprime. Écoute ton intuition profonde." },
  "Le Trickster": { emoji: "🃏", color: "#10b981", desc: "Chaos créateur. Ce rêve brise tes habitudes pour libérer une nouvelle perspective." },
  "La Grande Mère": { emoji: "🌿", color: "#34d399", desc: "Nourrir, protéger, créer. Appel à la compassion envers toi-même et les autres." },
  "L'Enfant": { emoji: "✨", color: "#fbbf24", desc: "Innocence, nouveau départ, potentiel pur. Une renaissance est possible." },
  "Le Soi": { emoji: "🌀", color: "#a855f7", desc: "Intégration totale. Tu touches à l'essence de qui tu es vraiment." },
};

const MOOD_EMOJIS = ["", "😱", "😟", "😐", "😊", "✨"];

function DreamCard({ dream, onDelete, onReinterpret }) {
  const [open, setOpen] = useState(false);
  const [reinterpreting, setReinterpreting] = useState(false);
  const archInfo = dream.archetype ? ARCHETYPE_DESC[dream.archetype] : null;

  const handleReinterpret = async (e) => {
    e.stopPropagation();
    setReinterpreting(true);
    await onReinterpret(dream);
    setReinterpreting(false);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all hover:border-violet-300/20">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
          style={{ background: archInfo ? `${archInfo.color}18` : "rgba(99,102,241,0.1)" }}>
          {archInfo?.emoji || "🌙"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-sm line-clamp-1">{dream.title || "Rêve sans titre"}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {dream.dream_date && <span className="text-[10px] text-muted-foreground">{new Date(dream.dream_date).toLocaleDateString("fr-FR")}</span>}
            {dream.archetype && <Badge variant="outline" className="text-[10px]">{dream.archetype}</Badge>}
            {dream.mood_score && <span className="text-xs">{MOOD_EMOJIS[dream.mood_score]}</span>}
            {dream.lucid && <Badge className="text-[10px] bg-cyan-100 text-cyan-700 border-0">Lucide</Badge>}
            {dream.recurring && <Badge className="text-[10px] bg-amber-100 text-amber-700 border-0">Récurrent</Badge>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleReinterpret} disabled={reinterpreting}
            title="Réinterpréter avec l'IA"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10 transition-colors disabled:opacity-50">
            {reinterpreting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(dream.id); }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-border/50 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed italic">{'"'}{dream.dream_text}{'"'}</p>

          {dream.emotions?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {dream.emotions.map(e => (
                <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
              ))}
            </div>
          )}

          {dream.symbols?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Symboles</p>
              <div className="flex gap-2 flex-wrap">
                {dream.symbols.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 font-medium">✦ {s}</span>
                ))}
              </div>
            </div>
          )}

          {archInfo && (
            <div className="p-3 rounded-xl" style={{ background: `${archInfo.color}10`, border: `1px solid ${archInfo.color}30` }}>
              <p className="text-xs font-bold mb-1" style={{ color: archInfo.color }}>
                {archInfo.emoji} Archétype : {dream.archetype}
              </p>
              <p className="text-xs text-muted-foreground">{archInfo.desc}</p>
            </div>
          )}

          {dream.message && (
            <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-300/20">
              <p className="text-xs font-bold text-violet-500 mb-1">Message principal</p>
              <p className="text-sm text-foreground leading-relaxed">{dream.message}</p>
            </div>
          )}

          {dream.interpretation && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Interprétation</p>
              <p className="text-sm text-foreground leading-relaxed">{dream.interpretation}</p>
            </div>
          )}

          {dream.conseil && (
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-300/20">
              <p className="text-xs font-bold text-emerald-600 mb-1">Conseil actionnable</p>
              <p className="text-sm text-foreground">{dream.conseil}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RevesJournal() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "", dream_text: "", dream_date: new Date().toISOString().split("T")[0],
    emotions: [], mood_score: 3, lucid: false, recurring: false
  });
  const [generating, setGenerating] = useState(false);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me(), staleTime: Infinity });

  const { data: dreams = [], isLoading } = useQuery({
    queryKey: ["dream-journal", user?.email],
    queryFn: () => base44.entities.DreamJournal.filter({ user_email: user.email }, "-dream_date", 50),
    enabled: !!user,
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.DreamJournal.delete(id),
    onSuccess: () => queryClient.invalidateQueries(["dream-journal"]),
  });

  const toggleEmotion = (e) => {
    setForm(f => ({
      ...f,
      emotions: f.emotions.includes(e) ? f.emotions.filter(x => x !== e) : [...f.emotions, e]
    }));
  };

  const handleReinterpret = async (dream) => {
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert en psychologie jungienne et symbolisme onirique.

Rêve : "${dream.dream_text}"
Émotions : ${(dream.emotions || []).join(", ") || "non précisées"}
Rêve lucide : ${dream.lucid ? "oui" : "non"}
Récurrent : ${dream.recurring ? "oui" : "non"}

Analyse en profondeur :
1. Les symboles clés présents
2. L'archétype jungien dominant parmi : ${Object.keys(ARCHETYPES).join(", ")}
3. Le message central de l'inconscient
4. Une interprétation psychologique et spirituelle
5. Un conseil concret et actionnable`,
      response_json_schema: {
        type: "object",
        properties: {
          symbols: { type: "array", items: { type: "string" } },
          archetype: { type: "string" },
          message: { type: "string" },
          interpretation: { type: "string" },
          conseil: { type: "string" }
        }
      }
    });
    await base44.entities.DreamJournal.update(dream.id, {
      symbols: res.symbols || [],
      archetype: res.archetype || "",
      message: res.message || "",
      interpretation: res.interpretation || "",
      conseil: res.conseil || "",
    });
    queryClient.invalidateQueries(["dream-journal"]);
  };

  const handleSubmit = async () => {
    if (!form.dream_text.trim() || !user) return;
    setGenerating(true);

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert en psychologie jungienne et symbolisme onirique.

Rêve : "${form.dream_text}"
Émotions : ${form.emotions.join(", ") || "non précisées"}
Rêve lucide : ${form.lucid ? "oui" : "non"}
Récurrent : ${form.recurring ? "oui" : "non"}

Analyse en profondeur :
1. Les symboles clés présents
2. L'archétype jungien dominant parmi : ${Object.keys(ARCHETYPES).join(", ")}
3. Le message central de l'inconscient
4. Une interprétation psychologique et spirituelle
5. Un conseil concret et actionnable`,
      response_json_schema: {
        type: "object",
        properties: {
          symbols: { type: "array", items: { type: "string" } },
          archetype: { type: "string" },
          message: { type: "string" },
          interpretation: { type: "string" },
          conseil: { type: "string" }
        }
      }
    });

    await base44.entities.DreamJournal.create({
      user_email: user.email,
      title: form.title || form.dream_text.slice(0, 40) + "…",
      dream_text: form.dream_text,
      dream_date: form.dream_date,
      emotions: form.emotions,
      mood_score: form.mood_score,
      lucid: form.lucid,
      recurring: form.recurring,
      symbols: res.symbols || [],
      archetype: res.archetype || "",
      message: res.message || "",
      interpretation: res.interpretation || "",
      conseil: res.conseil || "",
    });

    queryClient.invalidateQueries(["dream-journal"]);
    setForm({ title: "", dream_text: "", dream_date: new Date().toISOString().split("T")[0], emotions: [], mood_score: 3, lucid: false, recurring: false });
    setShowForm(false);
    setGenerating(false);
  };

  const filteredDreams = dreams.filter(d =>
    !search || d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.dream_text?.toLowerCase().includes(search.toLowerCase()) ||
    d.archetype?.toLowerCase().includes(search.toLowerCase())
  );

  const topArchetype = dreams.length > 0
    ? Object.entries(dreams.reduce((acc, d) => { if (d.archetype) acc[d.archetype] = (acc[d.archetype] || 0) + 1; return acc; }, {}))
        .sort((a, b) => b[1] - a[1])[0]
    : null;

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Journal des Rêves — Interprétation Spirituelle & Archétypes Jungiens",
    "description": "Enregistrez et interprétez vos rêves avec l'IA. Symboles, archétypes jungiens, messages de l'inconscient, guidance spirituelle personnalisée."
  };

  return (
    <div className="pb-20 space-y-8 max-w-2xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Journal des Rêves — Interprétation Spirituelle & Archétypes Jungiens | CirculAI Hub"
        description="Enregistrez vos rêves et découvrez leur signification cachée. IA d'interprétation : symboles oniriques, archétypes jungiens, messages de l'inconscient, conseils spirituels personnalisés."
        keywords="interprétation rêves, psychologie jungienne, archétypes, symboles rêves, rêve spirituel, inconscient, ésotérisme, bien-être, développement personnel, méditation"
        canonicalUrl="https://egor69.ca/reves"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden text-center p-8"
        style={{ background: "linear-gradient(135deg, hsl(240,40%,6%) 0%, hsl(270,50%,10%) 50%, hsl(220,50%,8%) 100%)" }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white pointer-events-none"
            style={{
              width: (Math.sin(i * 7) * 1.5 + 1.5) + "px",
              height: (Math.sin(i * 7) * 1.5 + 1.5) + "px",
              left: (i * 5.3) % 100 + "%",
              top: (i * 7.7) % 100 + "%",
              opacity: 0.2 + (i % 4) * 0.1,
            }} />
        ))}
        <div className="relative z-10 space-y-3">
          <div className="text-5xl mb-1">🌙</div>
          <h1 className="font-display text-4xl font-black text-white">Journal des Rêves</h1>
          <h2 className="sr-only">Interprétation spirituelle, archétypes jungiens et symbolisme onirique</h2>
          <p className="text-white/60 text-sm max-w-sm mx-auto leading-relaxed">
            Note tes songes. L'IA les déchiffre à travers les archétypes jungiens et te livre leur message caché.
          </p>
        </div>
      </div>

      {/* Stats rapides */}
      {dreams.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-2xl font-black text-violet-500">{dreams.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Rêves notés</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-2xl font-black text-cyan-500">{dreams.filter(d => d.lucid).length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Lucides</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-lg font-black text-amber-500">{topArchetype ? ARCHETYPE_DESC[topArchetype[0]]?.emoji : "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{topArchetype ? topArchetype[0] : "Archétype"}</p>
          </div>
        </div>
      )}

      {/* Bouton nouveau rêve */}
      <Button onClick={() => setShowForm(s => !s)}
        className="w-full rounded-xl font-bold gap-2 h-11"
        style={showForm ? {} : { background: "linear-gradient(135deg,#6366f1,#a855f7)", border: "none" }}>
        {showForm ? "Annuler" : <><Plus className="h-4 w-4" /> Noter un rêve</>}
      </Button>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-5 animate-fade-in-up">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <Moon className="h-4 w-4 text-violet-500" /> Nouveau rêve
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-muted-foreground mb-1.5 block uppercase tracking-wide">Titre (optionnel)</label>
              <input className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                placeholder="Le serpent d'or, La maison inconnue…"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1.5 flex items-center gap-1 block uppercase tracking-wide">
                <Calendar className="h-3 w-3" /> Date
              </label>
              <input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30"
                value={form.dream_date} onChange={e => setForm(f => ({ ...f, dream_date: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1.5 block uppercase tracking-wide">Ambiance</label>
              <div className="flex gap-1 h-10 items-center">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, mood_score: n }))}
                    className="text-xl transition-transform hover:scale-110">
                    {form.mood_score >= n ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block uppercase tracking-wide">Description du rêve *</label>
            <textarea className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30 resize-none"
              rows={5}
              placeholder="J'étais dans une forêt ancienne, un aigle blanc tournoyait au-dessus de moi. Je ressentais une paix profonde malgré l'obscurité..."
              value={form.dream_text} onChange={e => setForm(f => ({ ...f, dream_text: e.target.value }))} />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wide">Émotions ressenties</label>
            <div className="flex gap-2 flex-wrap">
              {EMOTIONS.map(e => (
                <button key={e} onClick={() => toggleEmotion(e)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    form.emotions.includes(e)
                      ? "bg-violet-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.lucid} onChange={e => setForm(f => ({ ...f, lucid: e.target.checked }))}
                className="rounded" />
              <span className="text-sm text-foreground">Rêve lucide</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.recurring} onChange={e => setForm(f => ({ ...f, recurring: e.target.checked }))}
                className="rounded" />
              <span className="text-sm text-foreground">Récurrent</span>
            </label>
          </div>

          <Button onClick={handleSubmit} disabled={!form.dream_text.trim() || generating}
            className="w-full rounded-xl font-bold gap-2 h-11"
            style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", border: "none" }}>
            {generating
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Interprétation en cours…</>
              : <><Sparkles className="h-4 w-4" /> Enregistrer et interpréter</>}
          </Button>
        </div>
      )}

      {/* Journal */}
      {dreams.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-violet-500" /> Mes rêves
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input className="pl-8 pr-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-violet-400/30 w-40"
                placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin text-violet-500 mx-auto" /></div>
          ) : filteredDreams.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun rêve trouvé</p>
          ) : (
            <div className="space-y-3">
              {filteredDreams.map(d => (
                <DreamCard key={d.id} dream={d} onDelete={id => deleteMutation.mutate(id)} onReinterpret={handleReinterpret} />
              ))}
            </div>
          )}
        </div>
      )}

      {dreams.length === 0 && !showForm && (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <div className="text-5xl mb-4">🌙</div>
          <p className="font-semibold text-foreground mb-2">Ton journal est vide</p>
          <p className="text-sm text-muted-foreground mb-4">Note ton premier rêve ce matin et découvre ce que ton inconscient te dit.</p>
        </div>
      )}

      {/* Archétypes jungiens */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" /> Les 8 Archétypes Jungiens
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(ARCHETYPE_DESC).map(([name, info]) => (
            <div key={name} className="rounded-xl border border-border p-4 hover:shadow-sm transition-all"
              style={{ borderLeft: `3px solid ${info.color}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{info.emoji}</span>
                <p className="font-bold text-sm text-foreground">{name}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{info.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}