import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { BookOpen, Plus, Heart, Star, Loader2, Send, X, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["Économie circulaire", "Réparation", "Don", "Négociation", "Communauté", "Vie pratique", "Sagesse"];

function LessonCard({ lesson, onLike, likedIds }) {
  const [expanded, setExpanded] = useState(false);
  const liked = likedIds.includes(lesson.id);
  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:border-primary/20 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-lg">{lesson.emoji || "💡"}</span>
            <Badge variant="outline" className="text-xs">{lesson.category}</Badge>
          </div>
          <h3 className="font-bold text-foreground text-sm leading-snug">{lesson.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">par <strong>{lesson.author_name || "Anonyme"}</strong></p>
        </div>
        <button
          onClick={() => onLike(lesson)}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
            liked ? "bg-rose-100 text-rose-600" : "bg-muted text-muted-foreground hover:bg-rose-50 hover:text-rose-500"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-rose-500" : ""}`} />
          {lesson.likes || 0}
        </button>
      </div>

      <p className={`text-sm text-muted-foreground leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
        {lesson.wisdom}
      </p>

      {lesson.wisdom?.length > 120 && (
        <button onClick={() => setExpanded(e => !e)}
          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1.5">
          {expanded ? <><ChevronUp className="h-3 w-3" /> Réduire</> : <><ChevronDown className="h-3 w-3" /> Lire la suite</>}
        </button>
      )}
    </div>
  );
}

export default function Heritage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [likedIds, setLikedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("heritage_liked") || "[]"); } catch { return []; }
  });
  const [form, setForm] = useState({ title: "", wisdom: "", author_name: "", category: CATEGORIES[0], emoji: "💡" });

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me(), staleTime: Infinity });

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["heritage-lessons"],
    queryFn: () => base44.entities.MicroLesson.list("-created_date", 100),
    staleTime: 60_000,
  });

  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.MicroLesson.create(data),
    onSuccess: () => { qc.invalidateQueries(["heritage-lessons"]); setShowForm(false); setForm({ title: "", wisdom: "", author_name: "", category: CATEGORIES[0], emoji: "💡" }); },
  });

  const likeMutation = useMutation({
    mutationFn: ({ lesson }) => base44.entities.MicroLesson.update(lesson.id, { likes: (lesson.likes || 0) + 1 }),
    onSuccess: () => qc.invalidateQueries(["heritage-lessons"]),
  });

  const handleLike = (lesson) => {
    if (likedIds.includes(lesson.id)) return;
    const next = [...likedIds, lesson.id];
    setLikedIds(next);
    localStorage.setItem("heritage_liked", JSON.stringify(next));
    likeMutation.mutate({ lesson });
  };

  const filtered = lessons.filter(l => {
    const matchCat = selectedCat === "all" || l.category === selectedCat;
    const matchSearch = !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.wisdom?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const EMOJIS = ["💡", "🌱", "🔧", "🤝", "♻️", "❤️", "⚡", "🌍", "👴", "📚"];

  return (
    <div className="pb-20 space-y-8 max-w-3xl mx-auto px-4 pt-6">

      {/* Header */}
      <div className="rounded-3xl p-8 border border-border relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(16,185,129,0.04))" }}>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-7 w-7 text-amber-500" />
              <h1 className="font-display text-3xl font-black text-foreground">Héritage Vivant</h1>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Le savoir des anciens, transmis aux bâtisseurs de demain.<br />
              Partage ce que tu as appris. Reçois la sagesse de ceux qui sont passés avant toi.
            </p>
          </div>
          <Button onClick={() => setShowForm(s => !s)} className="rounded-xl gap-2 font-bold shrink-0">
            {showForm ? <><X className="h-4 w-4" /> Annuler</> : <><Plus className="h-4 w-4" /> Partager</>}
          </Button>
        </div>
        <div className="mt-5 flex gap-4 text-center">
          {[
            { val: lessons.length, label: "Leçons partagées" },
            { val: lessons.reduce((s, l) => s + (l.likes || 0), 0), label: "Cœurs reçus" },
            { val: new Set(lessons.map(l => l.author_name).filter(Boolean)).size, label: "Bâtisseurs" },
          ].map(({ val, label }) => (
            <div key={label} className="flex-1 bg-card rounded-xl p-3 border border-border">
              <p className="text-xl font-black text-foreground">{val}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4 animate-fade-in-up">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" /> Partager une leçon de vie
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Ton nom</label>
              <input className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
                placeholder={user?.full_name || "Dominic, Alex, Sam…"}
                value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Catégorie</label>
                <select className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
                  value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Icône</label>
                <div className="flex flex-wrap gap-1">
                  {EMOJIS.map(em => (
                    <button key={em} onClick={() => setForm(f => ({ ...f, emoji: em }))}
                      className={`text-lg p-1 rounded-lg transition-all ${form.emoji === em ? "bg-primary/20 scale-110" : "hover:bg-muted"}`}>
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Titre de la leçon</label>
              <input className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
                placeholder="Ce que j'ai appris sur les dons gratuits…"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Ta sagesse (raconte)</label>
              <textarea className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm resize-none"
                rows={4} placeholder="Partage ton expérience, ton conseil, ton histoire…"
                value={form.wisdom} onChange={e => setForm(f => ({ ...f, wisdom: e.target.value }))} />
            </div>
            <Button
              onClick={() => addMutation.mutate({ ...form, likes: 0 })}
              disabled={!form.title || !form.wisdom || addMutation.isPending}
              className="w-full rounded-xl gap-2 font-bold">
              {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Graver dans l'Héritage
            </Button>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm"
            placeholder="Chercher une leçon, un conseil…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelectedCat("all")}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${selectedCat === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
            Toutes
          </button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setSelectedCat(c)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${selectedCat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <BookOpen className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Aucune leçon trouvée.</p>
          <p className="text-sm text-muted-foreground mt-1">Sois le premier à partager ta sagesse.</p>
          <Button onClick={() => setShowForm(true)} size="sm" className="mt-4 rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Partager une leçon
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} onLike={handleLike} likedIds={likedIds} />
          ))}
        </div>
      )}
    </div>
  );
}