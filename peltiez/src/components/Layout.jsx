import { memo, useEffect, useRef, useState, useCallback, lazy, Suspense } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import MagicParticles from "./MagicParticles";
import StardustLayer from "./StardustLayer";
import {
  Home, ShoppingBag, PlusCircle, User, Menu, X, Recycle,
  Newspaper, Gamepad2,
  ChevronRight, Flame, Heart, HeartHandshake, Shield, Globe, BarChart3, Users, Sparkles, BookOpen, FileText, Star, Radar, CheckCircle2, Bell, Leaf, DollarSign, Building2,
  Gem,
  Palette,
  Cuboid,
  Plug,
  Map,
  Info,
  Mail,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationCenter from "./NotificationCenter";
import Footer from "./layout/Footer";
import CirculiaWidget from "./CirculiaWidget";
import MaintenanceBanner from "./MaintenanceBanner";
import GlobalLaunchAlert from "./GlobalLaunchAlert";
import DeploymentCountdownBanner from "./DeploymentCountdownBanner";
import FirstVisitWelcomeGate from "./FirstVisitWelcomeGate";
import { EXPERIENCE_FLAGS } from "@/lib/experienceFlags";
import ScorpionHarpoon from "./ScorpionHarpoon";
import StrategicConversionStrip from "./StrategicConversionStrip";
import ContextualLinksPanel from "./ContextualLinksPanel";
import { initGodModeSpeed, setGodModeSpeed } from "@/lib/godMode";

/** KaTeX uniquement dans un chunk async (pas dans le shell Layout + index). */
const SovereigntyFormulaRibbon = lazy(() => import("./SovereigntyFormulaRibbon"));
import { WORLD_ETHOS } from "@/lib/site";
import { filterNavItemsForPreferences, loadUniversePreferences } from "@/lib/universePreferences";
import { navLinkTarget } from "@/lib/accueilSections";

/** Routes sans chrome (canvas plein écran, royaumes immersifs, intro). */
function layoutIsFullBleed(pathname) {
  const exact = new Set([
    "/intro",
    "/welcome",
    "/underworld",
    "/etherealm",
    "/netherealm",
    "/outworld",
    "/world",
    "/arene-virtuelle",
    "/pantheon-3d",
  ]);
  if (exact.has(pathname)) return true;
  if (pathname.startsWith("/encyclopedie-biblique/scene/")) return true;
  return false;
}

const NAV_ITEMS = [
  // Core
  { path: "/", label: "Accueil", icon: Home, color: "text-emerald-400" },
  { path: "/world", label: "🌐 Verse 3D", icon: Sparkles, color: "text-cyan-300" },
  { path: "/marketplace", label: "Marketplace", icon: ShoppingBag, color: "text-blue-400" },
  { path: "/profil", label: "Mon Profil", icon: User, color: "text-pink-400" },
  { path: "/avatar-creator", label: "Studio Avatar", icon: Palette, color: "text-fuchsia-400" },
  { path: "/mon-univers", label: "Mon univers", icon: Gem, color: "text-fuchsia-300" },
  { path: "/alerts", label: "📬 Mes Alertes", icon: Bell, color: "text-blue-400" },
  { path: "/atlas", label: "📚 Atlas Vivant", icon: BookOpen, color: "text-violet-300" },
  { path: "/manuel", label: "Manuel", icon: FileText, color: "text-emerald-300" },
  { path: "/outils-integration", label: "Outils & intégrations", icon: Plug, color: "text-sky-300" },
  { path: "/carte-site", label: "Carte & parcours", icon: Map, color: "text-lime-300" },
  { path: "/vision", label: "Vision", icon: Eye, color: "text-sky-300" },
  { path: "/about", label: "À propos", icon: Info, color: "text-zinc-200" },
  { path: "/contact", label: "Contact", icon: Mail, color: "text-teal-300" },
  { path: "/hub-fondations", label: "Hub fondations", icon: Building2, color: "text-sky-200" },
  { path: "/hub-souverain", label: "Hub souverain", icon: Leaf, color: "text-emerald-300" },
  { path: "/pricing", label: "💳 Pricing", icon: DollarSign, color: "text-amber-300" },
  { path: "/soutien", label: "Soutien", icon: HeartHandshake, color: "text-rose-300" },
  { path: "/pantheon-renders", label: "🏛️ Panthéon (Renders)", icon: Sparkles, color: "text-violet-300" },
  { path: "/pantheon-3d", label: "🧿 Panthéon (3D)", icon: Globe, color: "text-cyan-300" },
  { path: "/ue-aiouy", label: "UEAIOUY — ponts UE", icon: Cuboid, color: "text-emerald-400" },
  { path: "/encyclopedie-biblique", label: "📖 Encyclopédie Biblique", icon: BookOpen, color: "text-amber-200" },
  // Intelligence & Truth
  { path: "/paparazzi", label: "🎬 Paparazzi", icon: Flame, color: "text-orange-400" },
  { path: "/authenticity", label: "🔐 Authenticity", icon: Shield, color: "text-emerald-400" },
  { path: "/reporters", label: "🌍 Reporters", icon: Radar, color: "text-cyan-400" },
  { path: "/fact-check", label: "✅ Fact Check", icon: CheckCircle2, color: "text-emerald-400" },
  { path: "/transparency-log", label: "📋 Transparency", icon: Shield, color: "text-cyan-400" },
  { path: "/sentinelle", label: "🛡️ Sentinelle", icon: Shield, color: "text-amber-300" },
  // Content
  { path: "/publier", label: "Publier", icon: PlusCircle, color: "text-violet-400" },
  { path: "/actualite", label: "Actualité", icon: Newspaper, color: "text-amber-400" },
  { path: "/blog", label: "Blog", icon: BookOpen, color: "text-blue-400" },
  // Community
  { path: "/feed", label: "Community", icon: Users, color: "text-emerald-400" },
  { path: "/wellness", label: "Wellness", icon: Heart, color: "text-rose-400" },
  { path: "/jeu", label: "Games", icon: Gamepad2, color: "text-orange-400" },
  { path: "/vault", label: "Mon Coffre", icon: Heart, color: "text-rose-400" },
  // Spiritual & Mystical
  { path: "/carte-ciel", label: "✨ Carte du Ciel", icon: Sparkles, color: "text-violet-400" },
  { path: "/numerology", label: "🔢 Numérologie", icon: Star, color: "text-yellow-400" },
  // Nature & Discovery
  { path: "/sanctuary", label: "🦁 Sanctuary Animaux", icon: Heart, color: "text-emerald-400" },
  { path: "/fauna-hub", label: "🦁 Faune", icon: Users, color: "text-orange-400" },
  { path: "/flora-hub", label: "🌿 Flore", icon: Leaf, color: "text-green-400" },
  { path: "/insects-hub", label: "🦋 Insectes", icon: Sparkles, color: "text-lime-400" },
  { path: "/minerals-hub", label: "💎 Géologie & Minéraux", icon: Shield, color: "text-cyan-400" },
  { path: "/cosmic-portal", label: "🌌 Cosmique", icon: Globe, color: "text-indigo-400" },
  { path: "/admin", label: "Admin", icon: BarChart3, color: "text-red-400" },
]

function navItemIsActive(location, item) {
  if (location.pathname !== item.path) return false;
  if (item.hash) {
    const want = item.hash.startsWith("#") ? item.hash : `#${item.hash}`;
    return location.hash === want;
  }
  return true;
}

const NavLink = memo(function NavLink({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <Link
      to={navLinkTarget(item)}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden",
        isActive
          ? "text-white shadow-lg"
          : "text-white/50 hover:text-white/90 hover:bg-white/5"
      )}
      style={isActive ? {
        background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(99,102,241,0.15))",
        border: "1px solid rgba(16,185,129,0.3)"
      } : {}}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-emerald-400 rounded-r-full" />
      )}
      <span className={cn(
        "flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200",
        isActive ? "bg-white/10" : "group-hover:bg-white/5"
      )}>
        <Icon className={cn("h-4 w-4", isActive ? item.color : "text-white/40 group-hover:text-white/70")} />
      </span>
      <span className="flex-1">{item.label}</span>
      {isActive && <ChevronRight className="h-3 w-3 text-white/30" />}
    </Link>
  );
});

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [universePrefs, setUniversePrefs] = useState(loadUniversePreferences);
  const clicksRef = useRef([]);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen(v => !v), []);

  useEffect(() => {
    initGodModeSpeed();
  }, []);

  useEffect(() => {
    const onCustom = (ev) => {
      if (ev?.detail) setUniversePrefs(ev.detail);
      else setUniversePrefs(loadUniversePreferences());
    };
    const onStorage = (ev) => {
      if (ev.key === "igor:universe:v2") setUniversePrefs(loadUniversePreferences());
    };
    window.addEventListener("igor-universe-change", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("igor-universe-change", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const visibleNavItems = filterNavItemsForPreferences(NAV_ITEMS, universePrefs);
  const bottomNavItems = visibleNavItems.slice(0, 5);

  useEffect(() => {
    const onPointer = () => {
      const now = performance.now();
      const arr = clicksRef.current;
      arr.push(now);
      while (arr.length && now - arr[0] > 900) arr.shift();
      const cps = arr.length / 0.9;
      const speed = 1 + Math.min(1.2, cps / 10);
      setGodModeSpeed(speed);
    };
    window.addEventListener("pointerdown", onPointer, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointer);
  }, []);

  if (layoutIsFullBleed(location.pathname)) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background cosmic-bg cinema">
      {EXPERIENCE_FLAGS.firstVisitWelcomeGate ? <FirstVisitWelcomeGate /> : null}
      <MagicParticles />
      <StardustLayer />
      {/* Global Launch Alert */}
      {EXPERIENCE_FLAGS.globalLaunchAlert ? <GlobalLaunchAlert /> : null}

      {/* Maintenance Banner (optionnel) */}
      <MaintenanceBanner isActive={false} />

      {/* ── Desktop Sidebar ── */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 hidden lg:flex flex-col z-40 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, hsl(220,30%,8%) 0%, hsl(220,25%,6%) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)"
        }}>

        {/* Ambient glow blobs */}
        <div className="absolute top-20 -left-8 h-40 w-40 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(158,80%,50%,1), transparent 70%)" }} />
        <div className="absolute bottom-32 -right-8 h-32 w-32 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(260,80%,60%,1), transparent 70%)" }} />

        {/* Logo */}
        <div className="relative z-10 p-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl flex items-center justify-center relative glow-green"
              style={{ background: "linear-gradient(135deg, hsl(158,60%,35%), hsl(158,80%,25%))" }}>
              <Recycle className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(135deg, hsla(158,80%,60%,0.3), transparent)" }} />
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-bold text-white leading-none">Egor69</p>
              <p className="text-[10px] text-white/30 mt-0.5 leading-snug line-clamp-3">{WORLD_ETHOS.tagline}</p>
            </div>
          </Link>
          <LanguageSwitcher compact />
        </div>

        {/* Live indicator */}
        <div className="mx-5 mb-3 flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-[10px] text-emerald-400/70 font-medium">Réseau vivant · Ouvert au monde · En direct</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-hide relative z-10">
          {visibleNavItems.map(item => (
            <NavLink
              key={`${item.path}${item.hash || ""}`}
              item={item}
              isActive={navItemIsActive(location, item)}
            />
          ))}
        </nav>

        {/* Bottom card */}
        <div className="relative z-10 m-4 p-4 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(99,102,241,0.08))",
            border: "1px solid rgba(16,185,129,0.2)"
          }}>
          <p className="text-xs font-semibold text-white/70 mb-0.5">♻️ Chaque geste compte</p>
          <p className="text-[10px] text-white/30 mb-3">Impact mesurable · Circularité · Souveraineté</p>
          <Link
            to="/pricing"
            className="block text-center rounded-xl bg-emerald-500/90 py-2 text-[11px] font-bold text-zinc-950 hover:bg-emerald-400 transition-colors"
          >
            Voir abonnements →
          </Link>
        </div>

        {/* Legal Notice */}
        <div className="relative z-10 mx-4 mb-4 px-3 py-2 rounded-lg text-center text-[9px] text-white/40">
          <p>© 2026 Egor69 - Propriété exclusive protégée par la loi</p>
          <Link to="/legal" className="text-white/50 hover:text-white/80 transition-colors underline mt-1 block">
            Propriété Intellectuelle
          </Link>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-4"
        style={{
          background: "rgba(10,12,20,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(158,60%,35%), hsl(158,80%,25%))" }}>
            <Recycle className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-white text-sm">Egor69</span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <LanguageSwitcher compact />
          <button onClick={toggleMobile} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={closeMobile}
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="absolute top-14 left-0 right-0 p-3 space-y-0.5"
            onClick={e => e.stopPropagation()}
            style={{ background: "hsl(220,30%,8%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {visibleNavItems.map(item => (
              <NavLink
                key={`${item.path}${item.hash || ""}`}
                item={item}
                isActive={navItemIsActive(location, item)}
                onClick={closeMobile}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        {EXPERIENCE_FLAGS.deploymentCountdown ? <DeploymentCountdownBanner /> : null}
        <div className={cn("max-w-6xl mx-auto p-4 sm:p-6 lg:p-8", EXPERIENCE_FLAGS.strategicConversionStrip && "pb-28 lg:pb-10")}>
          <div className="mb-6">
            <Suspense fallback={null}>
              <SovereigntyFormulaRibbon />
            </Suspense>
          </div>
          <Outlet />
          <ContextualLinksPanel />
        </div>
      </main>

      {EXPERIENCE_FLAGS.strategicConversionStrip ? <StrategicConversionStrip /> : null}

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 flex justify-around py-2 z-50"
        style={{
          background: "rgba(10,12,20,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)"
        }}>
        {bottomNavItems.map(item => {
          const isActive = navItemIsActive(location, item);
          const Icon = item.icon;
          return (
            <Link
              key={`${item.path}${item.hash || ""}`}
              to={navLinkTarget(item)}
              className={cn("flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all",
                isActive ? "text-white" : "text-white/30")}>
              <Icon className={cn("h-5 w-5 transition-all", isActive && `${item.color} scale-110`)} />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Circulia Floating Widget ── */}
      {EXPERIENCE_FLAGS.circuliaWidget ? <CirculiaWidget /> : null}

      {/* ── Scorpion Harpoon (engagement) ── */}
      <ScorpionHarpoon />
    </div>
  );
}