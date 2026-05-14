import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import {
  Crown, Zap, Brain, Globe, Wrench, Shield, Sparkles, ArrowRight,
  Flame, Star, Users, Leaf, Package, Gift, MapPin, Scale, Infinity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Âme de l'utilisateur (détectée via son activité) ─────────────
const SOULS = {
  artisan:   { label: "Artisan", emoji: "🔨", color: "#f59e0b", desc: "Créateur de valeur concrète", theme: "amber" },
  visionnaire: { label: "Visionnaire", emoji: "🌌", color: "#6366f1", desc: "Bâtisseur de futurs possibles", theme: "violet" },
  gardien:   { label: "Gardien", emoji: "🌿", color: "#10b981", desc: "Protecteur de la circularité", theme: "emerald" },
  sage:      { label: "Sage", emoji: "📚", color: "#3b82f6", desc: "Transmetteur de sagesse ancestrale", theme: "blue" },
  guerrier:  { label: "Guerrier", emoji: "⚔️", color: "#ef4444", desc: "Combattant de l'ancien monde", theme: "red" },
};

// ── Citations ancestrales ─────────────────────────────────────────
const ANCESTRAL_WISDOM = [
  { auteur: "Egor69", origine: "Souveraineté", texte: "Le don n'est jamais un hasard. Il crée un lien plus fort que la peur.", emoji: "🎁" },
  { auteur: "Wangari Maathai", origine: "Kenya, Prix Nobel", texte: "Il est très important que les femmes s'impliquent dans le monde des affaires et contribuent au développement économique.", emoji: "🌳" },
  { auteur: "Léopold Sédar Senghor", origine: "Négritude, Sénégal", texte: "L'émotion est nègre, la raison est hellène. Et ensemble elles font l'Homme total.", emoji: "✨" },
  { auteur: "Thomas Sankara", origine: "Burkina Faso", texte: "On peut voler le peuple, mais jamais son âme. C'est de là que naît la résistance.", emoji: "🔥" },
  { auteur: "Simone Weil", origine: "Philosophe française", texte: "L'attention est la forme la plus rare et pure de la générosité.", emoji: "💎" },
  { auteur: "Cheikh Anta Diop", origine: "Égyptologie africaine", texte: "L'Afrique doit s'unir pour peser de tout son poids dans les affaires du monde.", emoji: "🌍" },
];

// ── Modules du Hub ────────────────────────────────────────────────
const MODULES = [
  { path: "/recommandations", icon: Sparkles, label: "Recommandations IA", desc: "Trouver en langage naturel", color: "#7c3aed", badge: "IA" },
  { path: "/negociation-ia",  icon: Brain,     label: "Négociation IA",      desc: "Maximiser chaque échange",  color: "#6366f1", badge: "IA" },
  { path: "/city-hubs",       icon: MapPin,    label: "Hubs Urbains",        desc: "12 villes, 6 continents",   color: "#ef4444", badge: "LIVE" },
  { path: "/smart-contrats",  icon: Shield,    label: "Smart Contrats",      desc: "Sécuriser vos échanges",   color: "#10b981", badge: "" },
  { path: "/artisans",        icon: Wrench,    label: "Artisans Hub",        desc: "Économie des savoir-faire", color: "#f59e0b", badge: "" },
  { path: "/conseil-jedi",    icon: Scale,     label: "Conseil Jedi",        desc: "Gouvernance collective",    color: "#3b82f6", badge: "" },
  { path: "/piliers",         icon: Crown,     label: "Les 144 000",         desc: "Piliers du changement",     color: "#ec4899", badge: "" },
  { path: "/micro-outils",    icon: Zap,       label: "Micro-Outils",        desc: "Calculateurs d'impact",     color: "#14b8a6", badge: "" },
  { path: "/portails-mondiaux",icon: Globe,    label: "Portails Mondiaux",   desc: "Connexions planétaires",    color: "#8b5cf6", badge: "" },
  { path: "/marketplace",     icon: Package,   label: "Marketplace",         desc: "Toutes les annonces",       color: "#0ea5e9", badge: "" },
  { path: "/communautes",     icon: Users,     label: "Communautés",         desc: "Micro-réseaux locaux",      color: "#22c55e", badge: "" },
  { path: "/epic-journey",    icon: Flame,     label: "Épopée Personnelle",  desc: "Votre quête de vie",        color: "#f97316", badge: "" },
];

function SoulDetector({ listings, ecoProfile }) {
  return useMemo(() => {
    if (!listings || !ecoProfile) return SOULS.gardien;
    const repairs = listings.filter(l => l.type === "réparation").length;
    const dons    = listings.filter(l => l.type === "don").length;
    const co2     = ecoProfile?.total_co2_saved || 0;
    if (repairs >= 5) return SOULS.artisan;
    if (dons >= 10)   return SOULS.gardien;
    if (co2 >= 100)   return SOULS.gardien;
    return SOULS.visionnaire;
  }, [listings, ecoProfile]);
}

export default function MaitreDuJeu() {
  const [wisdomIdx, setWisdomIdx] = useState(0);
  const [wisdomAnim, setWisdomAnim] = useState(true);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me(), staleTime: Infinity });

  const { data: listings = [] } = useQuery({
    queryKey: ["listings-mj", user?.email],
    queryFn: () => base44.entities.Listing.filter({ created_by: user.email }, "-created_date", 50),
    enabled: !!user,
    staleTime: 60_000,
  });

  const { data: ecoProfile } = useQuery({
    queryKey: ["eco-mj", user?.email],
    queryFn: () => base44.entities.EcoProfile.filter({ user_email: user.email }, "-created_date", 1).then(r => r[0] || null),
    enabled: !!user,
    staleTime: 60_000,
  });

  const { data: allListings = [] } = useQuery({
    queryKey: ["all-listings-mj"],
    queryFn: () => base44.entities.Listing.filter({ status: "actif" }, "-created_date", 500),
    staleTime: 60_000,
  });

  const soul = SoulDetector({ listings, ecoProfile });

  // Rotate wisdom every 8 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setWisdomAnim(false);
      setTimeout(() => {
        setWisdomIdx(i => (i + 1) % ANCESTRAL_WISDOM.length);
        setWisdomAnim(true);
      }, 300);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const globalStats = useMemo(() => ({
    annonces: allListings.length,
    co2: allListings.reduce((s, l) => s + (l.co2_saved || 0), 0).toFixed(0),
    dons: allListings.filter(l => l.type === "don").length,
    villes: new Set(allListings.map(l => l.location).filter(Boolean)).size,
  }), [allListings]);

  const myStats = useMemo(() => ({
    total: listings.length,
    co2: listings.reduce((s, l) => s + (l.co2_saved || 0), 0).toFixed(1),
    actif: listings.filter(l => l.status === "actif").length,
    revenus: listings.filter(l => l.type === "vente").reduce((s, l) => s + (l.price || 0), 0),
  }), [listings]);

  const wisdom = ANCESTRAL_WISDOM[wisdomIdx];

  return (
    <div className="pb-20 space-y-8 max-w-5xl mx-auto px-4 pt-6">

      {/* ── THRONE HEADER ── */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12"
        style={{
          background: `linear-gradient(135deg, ${soul.color}15 0%, rgba(16,185,129,0.06) 50%, rgba(99,102,241,0.06) 100%)`,
          border: `2px solid ${soul.color}30`,
        }}>
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/2"
          style={{ background: `radial-gradient(circle, ${soul.color}, transparent)` }} />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="h-20 w-20 rounded-3xl flex items-center justify-center text-5xl shadow-2xl flex-shrink-0"
            style={{ background: `${soul.color}20`, border: `2px solid ${soul.color}40` }}>
            {soul.emoji}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <Badge className="font-bold text-white border-0 px-3 py-1" style={{ background: soul.color }}>
                Âme : {soul.label}
              </Badge>
              <span className="text-muted-foreground text-sm">{soul.desc}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-1">
              {user ? `Bienvenue, ${user.full_name?.split(" ")[0] || "Maître"}` : "Centre de Commandement"}
            </h1>
            <p className="text-muted-foreground text-base">
              Votre Hub CirculAI · Tous vos modules en un seul endroit · Impact mesuré en temps réel
            </p>
          </div>
          <Button asChild className="rounded-xl font-bold gap-2 shrink-0"
            style={{ background: soul.color, border: "none", color: "white" }}>
            <Link to="/publier"><Zap className="h-4 w-4" /> Publier</Link>
          </Button>
        </div>
      </div>

      {/* ── SAGESSE ANCESTRALE ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-1.5 text-center text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
          style={{ background: "rgba(16,185,129,0.05)" }}>
          📜 Héritage Ancestral · La mémoire qui nourrit le présent
        </div>
        <div className={`p-6 transition-all duration-300 ${wisdomAnim ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <div className="flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">{wisdom.emoji}</span>
            <div>
              <p className="text-foreground font-medium leading-relaxed italic mb-3">« {wisdom.texte} »</p>
              <div className="flex items-center gap-2">
                <p className="font-bold text-foreground text-sm">{wisdom.auteur}</p>
                <span className="text-muted-foreground text-xs">· {wisdom.origine}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-4 flex items-center gap-1.5">
          {ANCESTRAL_WISDOM.map((_, i) => (
            <button key={i} onClick={() => { setWisdomAnim(false); setTimeout(() => { setWisdomIdx(i); setWisdomAnim(true); }, 150); }}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === wisdomIdx ? "20px" : "6px", background: i === wisdomIdx ? "#10b981" : "hsl(var(--border))" }} />
          ))}
        </div>
      </div>

      {/* ── STATS GLOBALES + MES STATS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Annonces actives", val: globalStats.annonces, icon: Package, color: "text-blue-500", sub: "sur le Hub" },
          { label: "kg CO₂ évité", val: globalStats.co2, icon: Leaf, color: "text-emerald-500", sub: "collectivement" },
          { label: "Dons publiés", val: globalStats.dons, icon: Gift, color: "text-rose-500", sub: "objets offerts" },
          { label: "Villes actives", val: globalStats.villes, icon: MapPin, color: "text-violet-500", sub: "sur la planète" },
        ].map(({ label, val, icon: Icon, color, sub }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-4 text-center">
            <Icon className={`h-5 w-5 mx-auto mb-1.5 ${color}`} />
            <p className={`text-2xl font-black ${color}`}>{val}</p>
            <p className="text-xs font-semibold text-foreground mt-0.5">{label}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── MON IMPACT PERSONNEL ── */}
      {user && myStats.total > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5">
          <p className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" /> Mon impact personnel
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Annonces", val: myStats.total },
              { label: "Actives", val: myStats.actif, cls: "text-emerald-600" },
              { label: "kg CO₂", val: myStats.co2, cls: "text-emerald-600" },
              { label: "Revenus $", val: myStats.revenus, cls: "text-amber-600" },
            ].map(({ label, val, cls = "text-foreground" }) => (
              <div key={label} className="text-center p-3 rounded-xl bg-muted">
                <p className={`text-lg font-black ${cls}`}>{val}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODULES DU HUB ── */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Infinity className="h-5 w-5 text-primary" /> Tous les Modules · L'Écosystème Complet
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.path} to={mod.path}
                className="group flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 transition-all">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: `${mod.color}15`, border: `1px solid ${mod.color}30` }}>
                  <Icon className="h-5 w-5" style={{ color: mod.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{mod.label}</p>
                    {mod.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white"
                        style={{ background: mod.color }}>{mod.badge}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{mod.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── REDISTRIBUTION ARTISANS & PILIERS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-amber-400/20 p-6 space-y-3"
          style={{ background: "rgba(245,158,11,0.04)" }}>
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-foreground">Redistribution Artisans</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Chaque transaction sur le Hub génère une contribution directe aux artisans locaux.
            L'économie circulaire redistribue la valeur là où elle est créée.
          </p>
          <Button asChild size="sm" variant="outline" className="rounded-xl gap-2 w-full">
            <Link to="/artisans"><Wrench className="h-3.5 w-3.5" /> Rejoindre les Artisans</Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-violet-400/20 p-6 space-y-3"
          style={{ background: "rgba(124,58,237,0.04)" }}>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-violet-500" />
            <h3 className="font-bold text-foreground">Réseau des 144 000 Piliers</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Les Piliers reçoivent en priorité les ressources, opportunités et connexions générées
            par l'ensemble du réseau mondial CirculAI Hub.
          </p>
          <Button asChild size="sm" variant="outline" className="rounded-xl gap-2 w-full">
            <Link to="/piliers"><Crown className="h-3.5 w-3.5" /> Devenir Pilier</Link>
          </Button>
        </div>
      </div>

      {/* ── MANIFESTE FINAL ── */}
      <div className="rounded-3xl p-8 text-center space-y-4 border"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(99,102,241,0.04), rgba(245,158,11,0.04))", borderColor: "rgba(16,185,129,0.2)" }}>
        <div className="text-4xl">∞</div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          On ne survit plus. <span className="text-primary">On VIT.</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
          CirculAI Hub n'est pas une plateforme. C'est un <strong className="text-foreground">mouvement vivant</strong>.
          Chaque don, chaque échange, chaque réparation est un acte de résistance contre l'ancien monde.
          Le passé de nos ancêtres nourrit notre présent pour sécuriser l'avenir de nos enfants.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button asChild className="rounded-xl font-bold gap-2">
            <Link to="/publier"><Zap className="h-4 w-4" /> Agir maintenant</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl gap-2">
            <Link to="/vision"><Infinity className="h-4 w-4" /> La Vision</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}