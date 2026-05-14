import { useState, useEffect, lazy, Suspense } from "react";
import SEOMeta from "@/components/SEOMeta";
import { Link, useLocation } from "react-router-dom";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import SovereigntyLaws from "@/components/SovereigntyLaws";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import useProximityNotifications from "@/hooks/useProximityNotifications";
import useFicheVivanteProximityAlert from "@/hooks/useFicheVivanteProximityAlert";
import CosmicHero from "@/components/CosmicHero";
import SovereigntyMatrix from "@/components/SovereigntyMatrix";
import ImpactCharts from "@/components/ImpactCharts";
import JoinTheRevolution from "@/components/JoinTheRevolution";
import InteractiveMap from "@/components/InteractiveMap";
import { SITE_ORIGIN, SITE_TAGLINE } from "@/lib/site";
import { Package, ArrowRight, Recycle, Wrench, Gift, RefreshCw,
  Users, Star, Shield, Heart, Globe, CheckCircle,
  Sparkles, HandHeart, MapPin, Crown, Earth, Building2, GraduationCap, Cpu, Infinity, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VictoryWall from "@/components/VictoryWall";
import ValuesCosmos from "@/components/ValuesCosmos";

const MathematicsMonument = lazy(() => import("@/components/MathematicsMonument.jsx"));
const PlanetStage = lazy(() => import("@/components/PlanetStage"));

const TYPE_CONFIG = {
  vente:      { label: "Vente",      color: "bg-blue-100 text-blue-700",       icon: Package },
  don:        { label: "Don",        color: "bg-emerald-100 text-emerald-700",  icon: Gift },
  réparation: { label: "Réparation", color: "bg-amber-100 text-amber-700",     icon: Wrench },
  échange:    { label: "Échange",    color: "bg-purple-100 text-purple-700",   icon: RefreshCw },
};
const CONDITION_LABELS = { neuf: "Neuf", "très bon": "Très bon", bon: "Bon", acceptable: "Acceptable" };

// Stats calculées via ImpactDashboard component (déplacé pour centralisation)

const COMMUNITY_SECTIONS = [
  { icon: Gift,      title: "Dons & Partage",       desc: "Offrez ce dont vous n'avez plus besoin. Trouvez des trésors gratuits partout dans le monde.", color: "from-emerald-500 to-green-700",  link: "/marketplace?type=don" },
  { icon: RefreshCw, title: "Échanges & Troc",      desc: "Proposez un échange équitable sans dépenser un sou — l'économie du futur, maintenant.",       color: "from-purple-500 to-violet-700", link: "/marketplace?type=échange" },
  { icon: Wrench,    title: "Réparation",            desc: "Connectez-vous avec des artisans dans 80+ pays. Réparez plutôt que jeter.",                    color: "from-amber-500 to-orange-700",  link: "/marketplace?type=réparation" },
  { icon: Package,   title: "Vente Locale & Globale",desc: "Vendez vos objets à des voisins ou à l'autre bout du monde. Impact minimal.",                 color: "from-blue-500 to-cyan-700",     link: "/marketplace?type=vente" },
];

const HOW_IT_WORKS = [
  { step: "01", icon: Package,  title: "Publiez",       desc: "En 2 minutes — décrivez, photographiez, publiez. Simple comme bonjour." },
  { step: "02", icon: Users,    title: "Connectez-vous",desc: "Un membre vous contacte. Échangez en toute sécurité sur la plateforme." },
  { step: "03", icon: Earth,    title: "Impactez",      desc: "L'objet repart pour une nouvelle vie. Votre CO₂ économisé s'affiche en temps réel." },
];

const TESTIMONIALS = [
  { name: "Marie-Ève T.", city: "Québec, Canada",    text: "J'ai donné mon vieux vélo et reçu une machine à coudre. Une communauté qui change ma façon de consommer!", emoji: "🌱", stars: 5 },
  { name: "Lucas M.",     city: "Paris, France",      text: "30 objets vendus en 2 mois. Simple, rapide, et l'impact CO₂ affiché me motive encore plus.",             emoji: "⭐", stars: 5 },
  { name: "Amara N.",     city: "Dakar, Sénégal",     text: "Une plateforme accessible, multilingue, vraiment tournée vers l'avenir. Je recommande à tous.",            emoji: "♻️", stars: 5 },
  { name: "Yuki T.",      city: "Tokyo, Japon",        text: "Egor69 en a fait une réalité quotidienne. 100 objets sauvés depuis 1 an!",                                 emoji: "🌍", stars: 5 },
];

const PILLARS = [
  { icon: Earth,         title: "Portée mondiale",             desc: "Une vision sans frontière : don, échange et réparation pensés pour voyager — sans promesse de chiffres irréalistes.",    color: "from-blue-500 to-cyan-600" },
  { icon: Cpu,           title: "IA au service du bien",       desc: "Notre IA calcule l'impact CO₂, suggère des échanges équitables, détecte les fraudes et optimise tout.",      color: "from-violet-500 to-purple-600" },
  { icon: Building2,     title: "Partenaires institutionnels", desc: "Des organisations utilisent Egor69 pour transformer leurs surplus en impact mesurable.",                  color: "from-amber-500 to-orange-600" },
  { icon: GraduationCap, title: "Éducation circulaire",        desc: "Des écoles intègrent Egor69 comme outil d’éducation environnementale et d’action locale.",                color: "from-emerald-500 to-teal-600" },
];

/** Pas de citations médias fictives : SEO éthique & confiance long terme. */
const PRESS = [
  { name: "Atlas vivant", quote: "Des fiches immersives : arts, savoirs, faune, flore — comme une encyclopédie qui respire." },
  { name: "Zelda Tower", quote: "Radar discipliné : signaux forts, sources vérifiables. Le bruit reste dehors." },
  { name: "Genèse", quote: "Chaque module porte l’ADN Egor69 : SOIN, souveraineté, régénération." },
  { name: "Sentinelle", quote: "La vérité avec garde-fous : transparence sans exploitation ni doxxing." },
];

function ListingCard({ listing }) {
  const cfg = TYPE_CONFIG[listing.type] || TYPE_CONFIG.don;
  const Icon = cfg.icon;
  return (
    <Link to={`/annonce/${listing.id}`}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5">
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {listing.image_url ? (
          <img src={listing.image_url} alt={listing.title} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
          <Icon className="h-3 w-3" /> {cfg.label}
        </div>
        {listing.price > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold">
            {listing.price}$
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{listing.title}</h3>
        {listing.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{listing.description}</p>}
        <div className="flex items-center justify-between mt-3">
          {listing.condition && <Badge variant="outline" className="text-xs">{CONDITION_LABELS[listing.condition] || listing.condition}</Badge>}
          {listing.location && <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {listing.location}</span>}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [userLocation, setUserLocation] = useState('');
  const location = useLocation();

  /** Ancres /#accueil-… : la page n’avait pas d’`id` sur les blocs + le scroll natif ne se rejoue pas toujours après navigation SPA. */
  useEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!id) return;
    const run = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const t = window.setTimeout(run, 80);
    const t2 = window.setTimeout(run, 450);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [location.pathname, location.hash]);

  // Récupérer la localisation de l'utilisateur + activer notifications
  useEffect(() => {
    base44.auth.me().then(user => {
      if (user && user.location) {
        setUserLocation(user.location);
      }
    });
  }, []);

  // Activate proximity notifications
  useProximityNotifications(userLocation, !!userLocation);
  useFicheVivanteProximityAlert();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings-recent"],
    queryFn: () => base44.entities.Listing.filter({ status: 'actif' }, "-created_date", 6),
    staleTime: 60_000,
  });

  const { data: allListings = [] } = useQuery({
    queryKey: ["listings-all"],
    queryFn: () => base44.entities.Listing.filter({ status: 'actif' }, "-created_date", 100),
    staleTime: 60_000,
  });


  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Egor69",
    "description": SITE_TAGLINE,
    "url": SITE_ORIGIN,
  };

  return (
    <div className="space-y-20 pb-20">
      <SEOMeta
        title="Egor69"
        description={SITE_TAGLINE}
        keywords="igor, économie circulaire, don, échange, réparation, radar, golden nuggets, encyclopédie vivante, planète"
        canonicalUrl={SITE_ORIGIN}
        schemaData={seoSchema}
      />

      {/* Mur de la Victoire (Radar temps réel) */}
      <div id="accueil-radar" className="scroll-mt-28 lg:scroll-mt-8">
        <VictoryWall />
      </div>

      {/* Planète au premier plan (3D + son opt-in) */}
      <div id="accueil-planete" className="max-w-6xl mx-auto scroll-mt-28 px-4 lg:scroll-mt-8 lg:px-8">
        <Suspense
          fallback={
            <div className="flex h-[min(420px,50vh)] items-center justify-center rounded-3xl border border-border/60 bg-muted/20 text-sm text-muted-foreground">
              Chargement 3D…
            </div>
          }
        >
          <PlanetStage />
        </Suspense>
      </div>

      {/* Cosmos de valeurs (bonheur infini) */}
      <div id="accueil-cosmos" className="max-w-6xl mx-auto scroll-mt-28 px-4 lg:scroll-mt-8 lg:px-8">
        <ValuesCosmos />
      </div>

      {/* L'Origine (Frontispice Egor69) */}
      <div id="accueil-origine" className="max-w-5xl mx-auto scroll-mt-28 px-4 lg:scroll-mt-8 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-10 sm:p-14">
          <div className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at 20% 30%, rgba(16,185,129,0.18), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.16), transparent 55%), radial-gradient(ellipse at 50% 85%, rgba(56,189,248,0.14), transparent 60%)",
              filter: "blur(0px)",
            }}
          />
          <div className="relative z-10 text-center space-y-4">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[11px] font-black tracking-[0.25em] text-white/70 uppercase">
              L&apos;Origine
            </div>
            <p
              className="font-display text-2xl sm:text-4xl font-black leading-tight"
              style={{
                background: "linear-gradient(90deg, #fbbf24 0%, #fde68a 35%, #10b981 70%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow: "0 0 30px rgba(251,191,36,0.15)",
              }}
            >
              DE MOI, PAR MOI, POUR MOI. DOMINIC PELLETIER.
            </p>
            <p className="text-sm sm:text-base text-white/70 max-w-3xl mx-auto leading-relaxed">
              Mon histoire n’est pas une plainte. C’est un carburant. Ici, chaque pixel refuse la médiocrité et choisit le soin, la vitesse, et la souveraineté.
            </p>
          </div>
        </div>
      </div>

      {/* Mathematics Monument */}
      <div id="accueil-mathematiques" className="max-w-6xl mx-auto scroll-mt-28 px-4 lg:scroll-mt-8 lg:px-8">
        <Suspense fallback={<p className="py-12 text-center text-sm text-muted-foreground">Chargement des formules…</p>}>
          <MathematicsMonument />
        </Suspense>
      </div>

      {/* Join The Revolution CTA */}
      <div id="accueil-revolte" className="scroll-mt-28 lg:scroll-mt-8">
        <JoinTheRevolution />
      </div>
      {/* Sovereignty Matrix */}
      <div id="accueil-matrice" className="max-w-6xl mx-auto scroll-mt-28 px-4 lg:scroll-mt-8 lg:px-8">
        <SovereigntyMatrix />
      </div>

      {/* Onboarding Tutorial */}
      <OnboardingTutorial />

      {/* 10 Universal Laws of Sovereignty */}
      <div id="accueil-lois" className="max-w-7xl mx-auto scroll-mt-28 px-4 lg:scroll-mt-8 lg:px-8">
        <SovereigntyLaws />
      </div>

      {/* Interactive Map - Local Listings */}
      <div id="accueil-carte" className="max-w-6xl mx-auto scroll-mt-28 px-4 lg:scroll-mt-8 lg:px-8">
        <InteractiveMap />
      </div>

      {/* ── COSMIC HERO ── */}
      <div id="accueil-sanctuaire" className="scroll-mt-28 lg:scroll-mt-8">
      <CosmicHero
        className="rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(220,40%,5%) 0%, hsl(240,35%,8%) 40%, hsl(158,40%,8%) 100%)" }}
      >
        <div className="relative" style={{ background: "linear-gradient(135deg, hsl(220,40%,5%) 0%, hsl(240,35%,8%) 40%, hsl(158,40%,8%) 100%)" }}>

          {/* Aurora blobs */}
          <div className="absolute top-0 left-1/4 h-80 w-80 opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, hsla(158,80%,50%,1), transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute top-10 right-1/4 h-60 w-60 opacity-15 pointer-events-none"
            style={{ background: "radial-gradient(circle, hsla(260,80%,60%,1), transparent 70%)", filter: "blur(50px)" }} />
          <div className="absolute bottom-0 right-10 h-40 w-40 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, hsla(30,80%,60%,1), transparent 70%)", filter: "blur(40px)" }} />

          <div className="relative z-10 px-8 py-16 sm:py-24">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full text-xs font-bold"
              style={{ background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.4)", color: "rgba(16,185,129,1)" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              ✦ SANCTUAIRE CIRCULAIRE · PRÉSENCE GLOBALE · EN DIRECT
            </div>

            <h1 className="font-display text-6xl sm:text-8xl font-black text-white leading-none mb-3 tracking-tight" itemProp="headline">
              <span className="text-rainbow">Egor69</span><br />
              <span style={{ background: "linear-gradient(135deg, #34d399, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                LA vérité du présent.
              </span>
            </h1>
            <p className="font-bold text-sm sm:text-base mb-6 tracking-widest uppercase"
              style={{ color: "rgba(251,191,36,0.9)", textShadow: "0 0 20px rgba(251,191,36,0.4)" }}>
              La vérité des vérités · Le futur n'est plus aux portes · Il est LÀ · MAINTENANT
            </p>

            <p className="text-white/70 text-lg sm:text-2xl max-w-3xl leading-relaxed mb-10 font-semibold">
              Un empire du SOIN : circulation des biens, des savoirs et des quêtes — avec une esthétique cosmique et une exigence de vérité.
              <br /><br />
              <span className="text-emerald-300">Radar, encyclopédie vivante, paiement sobre : nous visons l’excellence sans inflation marketing.</span>
              <br /><br />
              <span className="text-amber-300 font-bold italic">L’instant où tu agis compte plus que le bruit du monde.</span>
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button asChild size="lg" className="rounded-xl font-bold shadow-2xl px-10 text-base border-0 text-white uppercase tracking-wide"
                style={{ background: "linear-gradient(135deg, hsl(158,60%,35%), hsl(260,70%,40%))" }}>
                <Link to="/publier">👑 Entrer dans le sanctuaire <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-xl border-2 border-amber-500/85 bg-black px-8 text-base font-bold uppercase tracking-[0.14em] text-amber-100 shadow-[0_0_32px_rgba(212,175,55,0.14)] transition-colors hover:border-amber-300 hover:bg-zinc-950 hover:text-amber-50"
              >
                <a
                  href="/encyclopedie.pdf"
                  download="encyclopedie.pdf"
                  className="inline-flex items-center gap-2 font-serif normal-case tracking-normal"
                >
                  <Download className="h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                  <span className="font-semibold tracking-tight">Télécharger l’encyclopédie (PDF)</span>
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl text-white hover:bg-white/10 text-base"
                style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                <Link to="/marketplace">Explorer les annonces</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl text-cyan-400 hover:bg-cyan-500/10 text-base"
                style={{ borderColor: "rgba(34,211,238,0.3)" }}>
                <Link to="/vision"><Infinity className="mr-2 h-4 w-4" /> Vision Universelle</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl text-violet-300 hover:bg-violet-500/10 text-base"
                style={{ borderColor: "rgba(167,139,250,0.35)" }}>
                <Link to="/world"><Sparkles className="mr-2 h-4 w-4" /> Verse 3D · gameplay WebGL</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-white/35 text-xs font-bold">
              {[
                { icon: Crown,       label: "SOUVERAIN",             color: "text-amber-400" },
                { icon: Globe,       label: "MONDE OUVERT",           color: "text-emerald-400" },
                { icon: Shield,      label: "ZÉRO PUB (OBJECTIF)",      color: "text-violet-400" },
                { icon: Cpu,         label: "IA AU SERVICE DU BIEN",   color: "text-blue-400" },
                { icon: Infinity,    label: "RÉGÉNÉRATION",           color: "text-cyan-400" },
              ].map(({ icon: Icon, label, color }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 ${color}`} /> {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CosmicHero>
      </div>

      {/* ── PRESS ── */}
      <section id="accueil-presse" className="scroll-mt-28 lg:scroll-mt-8">
        <p className="text-center text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-6">Ce que tu vas vivre ici</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PRESS.map(p => (
            <div key={p.name} className="bg-card border border-border rounded-2xl p-5 text-center hover:shadow-md hover:border-primary/20 transition-all hover:-translate-y-0.5">
              <p className="font-display font-bold text-foreground text-lg mb-2">{p.name}</p>
              <p className="text-xs text-muted-foreground italic leading-relaxed">« {p.quote} »</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE COUNTERS / IMPACT CHARTS ── */}
      <div id="accueil-impact" className="scroll-mt-28 lg:scroll-mt-8">
        <ImpactCharts listings={allListings} />
      </div>

      {/* ── 4 PILLARS ── */}
      <section id="accueil-piliers" className="scroll-mt-28 lg:scroll-mt-8">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Pourquoi Egor69 ?</Badge>
          <h2 className="font-display text-3xl font-bold text-foreground">Une plateforme bâtie pour le monde entier</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PILLARS.map(p => (
            <div key={p.title} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all hover:border-primary/20 flex gap-4 hover:-translate-y-0.5">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <p.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1.5">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="accueil-etapes" className="scroll-mt-28 lg:scroll-mt-8">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Comment ça marche</Badge>
          <h2 className="font-display text-3xl font-bold text-foreground">3 étapes pour changer le monde</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map(item => (
            <div key={item.step} className="relative bg-card rounded-2xl border border-border p-6 text-center hover:shadow-md hover:border-primary/30 transition-all hover:-translate-y-0.5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow">
                {item.step}
              </div>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mt-3 mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMUNITY SECTIONS ── */}
      <section id="accueil-communaute" className="scroll-mt-28 lg:scroll-mt-8">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Communauté mondiale</Badge>
          <h2 className="font-display text-3xl font-bold text-foreground">Que cherchez-vous ?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COMMUNITY_SECTIONS.map(s => (
            <Link key={s.title} to={s.link}
              className={`group relative overflow-hidden rounded-2xl p-7 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${s.color}`}>
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <s.icon className="h-40 w-40 absolute -right-6 -bottom-6" />
              </div>
              <div className="relative z-10">
                <div className="h-11 w-11 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4">{s.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 px-3 py-1.5 rounded-full">
                  Explorer <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── VISION CTA ── */}
      <CosmicHero id="accueil-vision" className="scroll-mt-28 rounded-3xl overflow-hidden lg:scroll-mt-8">
        <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center"
          style={{ background: "linear-gradient(135deg, hsl(260,70%,10%) 0%, hsl(158,60%,12%) 100%)" }}>
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, hsla(158,80%,40%,0.4), transparent 70%)" }} />
          <div className="relative z-10">
            <Crown className="h-16 w-16 text-amber-400 mx-auto mb-6 float animate-pulse" />
            <h2 className="font-display text-4xl sm:text-6xl font-black text-white mb-6">
              Une couronne de circularité.<br />
              <span className="text-emerald-300">Pas de mensonge comptable. Juste de l’action.</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8 text-xl leading-relaxed font-semibold">
              Nous ne vendons pas de foule imaginaire. Nous bâtissons une expérience majestueuse : atlas, radar, quêtes, et flux financiers Ω lorsque tu configures Stripe.
              <br />Grandir avec intégrité — voilà le luxe Egor69.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="rounded-xl font-bold px-8 border-0"
                style={{ background: "linear-gradient(135deg, hsl(158,60%,35%), hsl(260,60%,40%))" }}>
                <Link to="/vision">✨ Découvrir la Vision <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl text-white hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                <Link to="/alliance">🤝 L'Alliance Mondiale</Link>
              </Button>
            </div>
          </div>
        </div>
      </CosmicHero>

      {/* Jeux & Defis */}
      <section id="accueil-jeux" className="scroll-mt-28 lg:scroll-mt-8">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-purple-600 text-white border-0 font-bold">Jeux et Defis</Badge>
          <h2 className="font-display text-3xl font-bold text-foreground">Jouer. Apprendre. Changer le monde.</h2>
          <p className="text-muted-foreground text-lg mt-3 max-w-2xl mx-auto">Chaque defi complete = points, badges, et un reel impact sur la planete.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {[
            { icon: "🎮", title: "Arcade Circulaire", desc: "Mini-jeux avec twist ecologique", color: "from-blue-500/20 to-cyan-500/20", link: "/game", tag: "Debutant" },
            { icon: "⚔️", title: "Quetes Epiques", desc: "Missions solo et cooperatives", color: "from-orange-500/20 to-red-500/20", link: "/jeu", tag: "Tous niveaux" },
            { icon: "🏆", title: "Classement", desc: "Monte en rang avec tes actions réelles", color: "from-amber-500/20 to-yellow-500/20", link: "/playtime", tag: "Hardcore" },
            { icon: "🎯", title: "Defis Quotidiens", desc: "3 defis/jour = +50 XP", color: "from-emerald-500/20 to-green-500/20", link: "/jeu", tag: "5 min/jour" },
            { icon: "🌟", title: "Evenements Saisonniers", desc: "Tournois thematiques", color: "from-violet-500/20 to-purple-500/20", link: "/campaigns", tag: "Limite" },
            { icon: "👥", title: "Cooperation Multiplayer", desc: "Forme des equipes et gagne", color: "from-pink-500/20 to-rose-500/20", link: "/alliance", tag: "2-100 joueurs" },
          ].map((game, i) => (
            <Link key={i} to={game.link} className={`relative rounded-2xl p-6 border border-border bg-gradient-to-br ${game.color} hover:shadow-lg hover:border-primary/30 transition-all hover:-translate-y-1 group`}>
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">{game.icon}</div>
                <Badge variant="outline" className="text-xs">{game.tag}</Badge>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{game.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{game.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Explorer <ArrowRight className="h-3 w-3" /></div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── GAME CTA ── */}
      <section id="accueil-jeux-cta" className="relative scroll-mt-28 rounded-3xl overflow-hidden lg:scroll-mt-8"
        style={{ background: "linear-gradient(135deg,hsl(260,60%,20%) 0%,hsl(220,50%,14%) 50%,hsl(158,50%,12%) 100%)" }}>
        <div className="relative z-10 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-6">
          <div className="text-6xl float-slow">🎮</div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Rejoins le Mouvement Global</h2>
            <p className="text-white/60 mb-4">Économique. Culturelle. Immersive. Chaque bonne action = XP, badges, récompenses.</p>
            <Button asChild size="lg" className="rounded-xl font-bold shadow-xl border-0"
              style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)" }}>
              <Link to="/jeu">🏆 Rejoindre le jeu <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── RECENT LISTINGS ── */}
      <section id="accueil-annonces" className="scroll-mt-28 lg:scroll-mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Annonces récentes</h2>
            <p className="text-sm text-muted-foreground mt-1">Des trésors qui attendent — près de chez vous ou à l'autre bout du globe</p>
          </div>
          <Link to="/marketplace" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4 space-y-3"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded" /></div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
            <Recycle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Aucune annonce pour le moment</p>
            <Button asChild className="mt-4 rounded-xl" size="sm"><Link to="/publier">Soyez le premier !</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="accueil-temoignages" className="scroll-mt-28 lg:scroll-mt-8">
        <div className="text-center mb-8">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Témoignages du monde entier</Badge>
          <h2 className="font-display text-3xl font-bold text-foreground">Ils ont changé leurs habitudes</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-card rounded-2xl border border-border p-6 hover:shadow-md hover:border-primary/20 transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-5 italic">« {t.text} »</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">{t.emoji}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECURITY PLEDGE ── */}
      <section id="accueil-securite" className="scroll-mt-28 rounded-3xl border border-white/5 p-8 sm:p-12 lg:scroll-mt-8"
        style={{ background: "linear-gradient(135deg, hsl(220,30%,7%), hsl(220,25%,5%))" }}>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "rgba(16,185,129,0.8)" }}>
              <Shield className="h-3.5 w-3.5" /> Promesse Absolue
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-4">🔒 Vos données sont sacrées</h2>
            <p className="text-white/50 text-lg leading-relaxed mb-2">
              Nous ne vendons <strong className="text-white">jamais</strong> vos données. Jamais. Sur notre honneur.
            </p>
            <p className="text-white/30 text-sm">Chiffrement AES-256 · RGPD · Zéro vente · Éthique by design.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield,      label: "AES-256" },
              { icon: Globe,       label: "Zéro vente" },
              { icon: CheckCircle, label: "RGPD / LPRPDE" },
              { icon: Heart,       label: "Éthique by design" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl px-4 py-3 text-white/60 text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <Icon className="h-4 w-4 text-emerald-400 shrink-0" /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section id="accueil-cta-final" className="scroll-mt-28 rounded-3xl border border-border bg-gradient-to-br from-secondary to-accent p-8 text-center lg:scroll-mt-8">
        <HandHeart className="h-10 w-10 mx-auto mb-4 text-primary" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Chaque geste compte. Commencez aujourd'hui.</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">Rejoignez Egor69 — rapide, simple, planétairement impactant.</p>
        <Button asChild size="lg" className="rounded-xl font-bold shadow-md">
          <Link to="/publier">Démarrer gratuitement →</Link>
        </Button>
      </section>

    </div>
  );
}