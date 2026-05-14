import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { Link, useLocation } from "react-router-dom";
import {
  Heart, Users,
  Search, Calendar, Loader2, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HolisticWellness() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  const { data: practitioners = [], isLoading: loadingPractitioners } = useQuery({
    queryKey: ["practitioners"],
    queryFn: () => base44.entities.Practitioner.filter({ is_active: true }, "-rating", 100),
    staleTime: 120_000,
  });

  const SPECIALTIES = [
    "naturopathie",
    "acupuncture",
    "massage",
    "coaching",
    "meditation",
    "nutrition",
    "yoga",
    "herboristerie",
    "sophrologie",
    "homeopathie",
    "aromatherapie",
    "reflexologie",
  ];

  const filteredPractitioners = useMemo(() =>
    practitioners.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.full_name.toLowerCase().includes(q) || (p.bio || "").toLowerCase().includes(q);
      const matchSpecialty = specialtyFilter === "all" || (p.specialties || []).includes(specialtyFilter);
      return matchSearch && matchSpecialty;
    }),
    [practitioners, search, specialtyFilter]
  );

  useEffect(() => {
    const id = location.hash?.replace(/^#/, "");
    if (!id || !id.startsWith("wellness-praticien-")) return;
    if (loadingPractitioners) return;
    const el = document.getElementById(id);
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => window.clearTimeout(t);
  }, [location.hash, location.pathname, loadingPractitioners, filteredPractitioners.length]);

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Wellness Hub — Praticiens & Médecines Douces",
    "description": "Réservez consultations avec praticiens certifiés (naturopathes, thérapeutes). Contenu éducatif bien-être + gamification."
  };

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title="Wellness Hub — Praticiens de Santé Naturelle & Bien-être | CirculAI Hub"
        description="Trouvez praticiens certifiés (naturopathie, yoga, nutrition). Réservez consultations. Contenu éducatif + quêtes gamifiées pour votre bien-être."
        keywords="naturopathe, médecine douce, consultation, yoga, meditation, nutrition, bien-être, reiki, acupuncture"
        canonicalUrl="https://egor69.ca/wellness"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden p-12 text-center"
        style={{ background: "linear-gradient(135deg, hsl(120,40%,8%) 0%, hsl(140,50%,10%) 100%)" }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(120,80%,50%,0.4), transparent 70%)" }} />
        <div className="relative z-10 space-y-4">
          <div className="text-5xl mb-2">🌿</div>
          <h1 className="font-display text-4xl font-black text-white">Wellness Hub</h1>
          <h2 className="sr-only">Praticiens de santé naturelle et ressources bien-être</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Découvrez praticiens certifiés, réservez consultations, et progressez avec des quêtes de bien-être gamifiées.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <Button asChild variant="secondary" className="rounded-xl font-semibold bg-white/15 text-white border-0 hover:bg-white/25">
              <Link to="/bien-etre-lexique">Lexique herboristerie, massages, homéopathie…</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-xl font-semibold bg-white/15 text-white border-0 hover:bg-white/25">
              <Link to="/world">Anneau bien-être du Verse 3D</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Praticiens */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-500" /> Praticiens Certifiés
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Réservez avec les meilleurs praticiens près de vous</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSpecialtyFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              specialtyFilter === "all" ? "bg-emerald-600 text-white" : "bg-card border border-border text-muted-foreground hover:bg-accent"
            }`}>
            Tous ({practitioners.length})
          </button>
          {SPECIALTIES.map(s => (
            <button
              key={s}
              onClick={() => setSpecialtyFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all capitalize ${
                specialtyFilter === s ? "bg-emerald-600 text-white" : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            placeholder="Rechercher praticien..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        {loadingPractitioners ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>
        ) : filteredPractitioners.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
            <Heart className="h-12 w-12 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-muted-foreground">Aucun praticien trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPractitioners.map(p => (
              <Link
                key={p.id}
                id={`wellness-praticien-${p.id}`}
                to={{ pathname: "/wellness", hash: `#wellness-praticien-${p.id}` }}
                className="group scroll-mt-24 bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-emerald-300/50 transition-all hover:-translate-y-1"
              >
                <div className="aspect-video bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center overflow-hidden">
                  {p.photo_url ? (
                    <img src={p.photo_url} alt={p.full_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <Heart className="h-16 w-16 text-white/20" />
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-emerald-600 transition-colors">{p.full_name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {(p.specialties || []).slice(0, 2).map(s => (
                        <Badge key={s} variant="outline" className="text-[10px] capitalize">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  {p.consultation_price && (
                    <div className="text-xs text-emerald-600 font-bold">{p.consultation_price}$ CAD</div>
                  )}
                  <Button className="w-full rounded-lg text-sm font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                    <Calendar className="h-3.5 w-3.5" /> Réserver
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Gamification */}
      <section className="rounded-3xl p-8 text-center"
        style={{ background: "linear-gradient(135deg, hsl(280,60%,15%), hsl(240,50%,12%))" }}>
        <Award className="h-12 w-12 text-amber-400 mx-auto mb-3" />
        <h2 className="font-display text-2xl font-bold text-white mb-2">Quêtes de Bien-être</h2>
        <p className="text-white/70 mb-4 max-w-xl mx-auto">
          Complétez des défis quotidiens de meditation, yoga, ou nutrition. Gagnez XP et débloquez badges !
        </p>
        <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white font-bold border-0">
          <Link to="/wellness-quests">Voir Mes Quêtes</Link>
        </Button>
      </section>
    </div>
  );
}