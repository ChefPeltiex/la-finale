import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import RepairCard from "@/components/RepairCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Wrench, Plus, Search, 
  X, Loader2, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "électronique", "électroménager", "vêtements", "mobilier", 
  "vélos", "outils", "informatique", "autre"
];

const TYPES = [
  { key: "all", label: "Tous" },
  { key: "question", label: "❓ Questions" },
  { key: "tutoriel", label: "📚 Tutoriels" },
  { key: "conseil", label: "💡 Conseils" },
  { key: "success_story", label: "⭐ Succès" },
];

export default function RepairHub() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [newThread, setNewThread] = useState({
    title: "",
    content: "",
    category: "électronique",
    type: "question",
    tags: "",
    difficulty_level: "moyen"
  });

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const { data: discussions = [], isLoading } = useQuery({
    queryKey: ["repair-discussions"],
    queryFn: () => base44.entities.RepairDiscussion.filter(
      { is_featured: true }, 
      "-upvotes", 
      100
    ).then(featured => {
      return base44.entities.RepairDiscussion.filter(
        {}, 
        "-created_date", 
        100
      ).then(all => [...featured, ...all.filter(a => !featured.some(f => f.id === a.id))]);
    }),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Vous devez être connecté");
      if (!newThread.title || !newThread.content) throw new Error("Titre et contenu requis");

      return base44.entities.RepairDiscussion.create({
        title: newThread.title,
        content: newThread.content,
        category: newThread.category,
        type: newThread.type,
        author_email: user.email,
        author_name: user.full_name || user.email.split("@")[0],
        tags: newThread.tags ? newThread.tags.split(",").map(t => t.trim()) : [],
        difficulty_level: newThread.difficulty_level,
        upvotes: 0,
        helpful_count: 0,
        replies_count: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["repair-discussions"]);
      setNewThread({
        title: "",
        content: "",
        category: "électronique",
        type: "question",
        tags: "",
        difficulty_level: "moyen"
      });
      setShowCreate(false);
    },
  });

  const filtered = useMemo(() => {
    let result = discussions;

    if (selectedType !== "all") {
      result = result.filter(d => d.type === selectedType);
    }

    if (selectedCategory !== "tous") {
      result = result.filter(d => d.category === selectedCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => 
        d.title.toLowerCase().includes(q) || 
        (d.content && d.content.toLowerCase().includes(q))
      );
    }

    // Featured et pinned en premier
    return result.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return b.is_pinned ? 1 : -1;
      if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1;
      return (b.upvotes || 0) - (a.upvotes || 0);
    });
  }, [discussions, search, selectedType, selectedCategory]);

  useEffect(() => {
    const id = location.hash?.replace(/^#/, "");
    if (!id || !id.startsWith("repair-thread-")) return;
    if (isLoading) return;
    const el = document.getElementById(id);
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => window.clearTimeout(t);
  }, [location.hash, location.pathname, isLoading, filtered.length]);

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "CommunityForum",
    "name": "Repair Hub — Tutoriels et Conseils Communautaires",
    "description": "Espace d'échange pour tutoriels de réparation, conseils et partage de compétences entre utilisateurs."
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Repair Hub — Tutoriels & Conseils Communautaires | CirculAI"
        description="Espace collaboratif pour partager tutoriels de réparation, conseils et astuces. Connectez-vous avec des experts et apprenez à réparer."
        keywords="réparation, tutoriel, conseil, DIY, partage compétences, communauté"
        canonicalUrl="https://egor69.ca/repair"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/20">
        <Wrench className="h-12 w-12 text-orange-600 mx-auto mb-3" />
        <h1 className="font-display text-4xl font-black text-foreground">
          Repair Hub
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Communauté mondiale de réparation. Partagez vos tutoriels, posez des questions, apprenez des experts.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-4 text-center">
          <p className="text-3xl font-black text-amber-600">{discussions.length}</p>
          <p className="text-xs text-amber-700 mt-1 font-bold">Discussions</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-300 p-4 text-center">
          <p className="text-3xl font-black text-emerald-600">{new Set(discussions.map(d => d.author_email)).size}</p>
          <p className="text-xs text-emerald-700 mt-1 font-bold">Contributeurs</p>
        </div>
        <div className="bg-blue-50 rounded-2xl border-2 border-blue-300 p-4 text-center">
          <p className="text-3xl font-black text-blue-600">{discussions.filter(d => d.type === "tutoriel").length}</p>
          <p className="text-xs text-blue-700 mt-1 font-bold">Tutoriels</p>
        </div>
        <div className="bg-purple-50 rounded-2xl border-2 border-purple-300 p-4 text-center">
          <p className="text-3xl font-black text-purple-600">{discussions.reduce((s, d) => s + (d.upvotes || 0), 0)}</p>
          <p className="text-xs text-purple-700 mt-1 font-bold">Votes totaux</p>
        </div>
      </div>

      {/* Create New */}
      {!showCreate ? (
        <Button onClick={() => setShowCreate(true)} size="lg" className="w-full rounded-xl h-12 gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold">
          <Plus className="h-5 w-5" /> Créer une discussion
        </Button>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-foreground">Nouvelle discussion</h2>
            <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Titre (ex: Comment réparer une fermeture éclair cassée)"
            value={newThread.title}
            onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />

          <Textarea
            placeholder="Décrivez votre question, tutoriel ou conseil en détail..."
            value={newThread.content}
            onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
            className="w-full rounded-lg min-h-[120px]"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={newThread.category}
              onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>

            <select
              value={newThread.type}
              onChange={(e) => setNewThread({ ...newThread, type: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
              <option value="question">Question</option>
              <option value="tutoriel">Tutoriel</option>
              <option value="conseil">Conseil</option>
              <option value="success_story">Succès</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Tags (séparés par des virgules)"
              value={newThread.tags}
              onChange={(e) => setNewThread({ ...newThread, tags: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary"
            />

            <select
              value={newThread.difficulty_level}
              onChange={(e) => setNewThread({ ...newThread, difficulty_level: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <Button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !newThread.title || !newThread.content}
            className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold">
            {createMutation.isPending ? "Création..." : "Publier"}
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl h-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TYPES.map(t => (
            <button key={t.key}
              onClick={() => setSelectedType(t.key)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-all",
                selectedType === t.key ? "bg-orange-600 text-white border-orange-600" : "bg-card border-border text-foreground hover:bg-accent"
              )}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("tous")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all",
              selectedCategory === "tous" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:bg-accent"
            )}>
            Tous
          </button>
          {CATEGORIES.map(c => (
            <button key={c}
              onClick={() => setSelectedCategory(c)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all capitalize",
                selectedCategory === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:bg-accent"
              )}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <AlertCircle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Aucune discussion trouvée</p>
          <p className="text-sm text-muted-foreground mt-1">Soyez le premier à publier !</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(discussion => (
              <RepairCard key={discussion.id} discussion={discussion} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}