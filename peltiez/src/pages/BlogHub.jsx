import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { BookOpen, Search, Loader2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BlogHub() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: posts = [], isLoading: loadingPosts, error: postsError } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      try {
        const data = await base44.entities.BlogPost.filter({ is_published: true }, "-created_date", 50);
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.error("BlogPost fetch error:", err);
        return [];
      }
    },
    staleTime: 300_000,
    retry: 2,
  });

  const { data: sheets = [], isLoading: loadingSheets, error: sheetsError } = useQuery({
    queryKey: ["educational-sheets"],
    queryFn: async () => {
      try {
        const data = await base44.entities.EducationalSheet.filter({ is_published: true }, "-created_date", 30);
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.error("EducationalSheet fetch error:", err);
        return [];
      }
    },
    staleTime: 300_000,
    retry: 2,
  });

  const { data: gallery = [], isLoading: loadingGallery } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      try {
        const data = await base44.entities.GalleryImage.filter({}, "-created_date", 20);
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.error("GalleryImage fetch error:", err);
        return [];
      }
    },
    staleTime: 300_000,
    retry: 2,
  });

  const filteredPosts = useMemo(() =>
    posts.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q);
      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCategory && p.title && p.content;
    }),
    [posts, search, categoryFilter]
  );

  const categories = ["all", ...new Set(posts.map(p => p.category).filter(Boolean))];

  useEffect(() => {
    const id = (location.hash || "").replace(/^#/, "");
    if (!id) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(t);
  }, [location.hash, posts, sheets]);

  return (
    <div className="pb-20 space-y-10 max-w-6xl mx-auto px-4 pt-6">
      {/* Hero */}
      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-violet-500/10 to-emerald-500/10 border border-violet-200/20">
        <BookOpen className="h-12 w-12 text-violet-500 mx-auto mb-3" />
        <h1 className="font-display text-4xl font-black text-foreground">Blog &amp; Ressources</h1>
        <p className="text-muted-foreground mt-2">Articles, fiches educatives, galeries et histoire</p>
      </div>

      {/* Errors */}
      {(postsError || sheetsError) && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
          Certaines ressources n'ont pu être chargées. Veuillez rafraîchir.
        </div>
      )}

      {/* Articles Blog */}
      <section className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl font-bold text-foreground">Articles Blog</h2>
          <Badge variant="secondary">{filteredPosts.length}</Badge>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all capitalize ${
                categoryFilter === cat ? "bg-violet-600 text-white" : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-violet-400/30 text-sm"
            placeholder="Rechercher articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        {loadingPosts ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /></div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-dashed border-border text-muted-foreground">
            Aucun article trouvé
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPosts.map(post => (
              <article key={post.id} id={`blog-post-${post.id}`} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md hover:border-violet-300/50 transition-all hover:-translate-y-0.5 scroll-mt-24">
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-2 justify-between">
                    <h3 className="font-bold text-foreground text-sm line-clamp-2">{post.title}</h3>
                    {post.views_count > 0 && (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  {post.excerpt && <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-2 border-t">
                    {post.author && <span>✏️ {post.author}</span>}
                    {post.read_time_minutes && <span>📖 {post.read_time_minutes} min</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Fiches Educatives */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Fiches Éducatives</h2>
        {loadingSheets ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-emerald-500" /></div>
        ) : sheets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Aucune fiche disponible</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sheets.map(sheet => (
              <div key={sheet.id} id={`edu-sheet-${sheet.id}`} className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-all scroll-mt-24">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">📚</span>
                  <h3 className="font-bold text-sm text-foreground line-clamp-1">{sheet.title}</h3>
                </div>
                {sheet.description && <p className="text-xs text-muted-foreground mb-2">{sheet.description}</p>}
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="outline" className="text-[9px] capitalize">{sheet.subject}</Badge>
                  <Badge variant="outline" className="text-[9px] capitalize">{sheet.difficulty}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Galerie */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Galerie Images</h2>
        {loadingGallery ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-emerald-500" /></div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Aucune image</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.slice(0, 12).map(img => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square">
                {img.image_url ? (
                  <img src={img.image_url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No image</div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-center p-2 text-xs">
                  {img.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}