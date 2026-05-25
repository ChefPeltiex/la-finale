import { memo, useEffect, useRef, useState, useCallback, lazy, Suspense } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import MagicParticles from "./MagicParticles";
import StardustLayer from "./StardustLayer";
import { Menu, X, Recycle, ChevronRight, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationCenter from "./NotificationCenter";
import Footer from "./layout/Footer";
import GlobalSearchBar from "./layout/GlobalSearchBar";
import { PoleNavSidebar, PoleMobileBottomNav } from "./layout/PoleNavigation";
import { LAYOUT_NAV_ITEMS } from "@/config/layoutNavItems";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import GuideAgent from "./guide/GuideAgent";
import CirculiaWidget from "./CirculiaWidget";
import MaintenanceBanner from "./MaintenanceBanner";
import GlobalLaunchAlert from "./GlobalLaunchAlert";
import DeploymentCountdownBanner from "./DeploymentCountdownBanner";
import FirstVisitWelcomeGate from "./FirstVisitWelcomeGate";
import { EXPERIENCE_FLAGS } from "@/lib/experienceFlags";
import { getPlatformShellVariant } from "@/lib/platformVisual";
import ScorpionHarpoon from "./ScorpionHarpoon";
import StrategicConversionStrip from "./StrategicConversionStrip";
import ContextualLinksPanel from "./ContextualLinksPanel";
import { initGodModeSpeed, setGodModeSpeed } from "@/lib/godMode";
import AudienceWayfinder from "./AudienceWayfinder";
import WorldRealmSwitcher from "./WorldRealmSwitcher";
import GlobalNavCirculai from "./GlobalNavCirculai";
import HelpFab from "./HelpFab";
/** KaTeX uniquement dans un chunk async (pas dans le shell Layout + index). */
const SovereigntyFormulaRibbon = lazy(() => import("./SovereigntyFormulaRibbon"));
import { filterNavItemsForPreferences, loadUniversePreferences } from "@/lib/universePreferences";
import { navLinkTarget } from "@/lib/accueilSections";
import { filterNavItemsForPilot } from "@/config/pilotScope";
import usePilotMode from "@/hooks/usePilotMode";

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
    "/entrer",
    "/arene-virtuelle",
    "/pantheon-3d",
  ]);
  if (exact.has(pathname)) return true;
  if (pathname.startsWith("/encyclopedie-biblique/scene/")) return true;
  return false;
}

const NavLink = memo(function NavLink({ item, isActive, onClick, proShell = false }) {
  const Icon = item.icon;
  return (
    <Link
      to={navLinkTarget(item)}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden",
        proShell
          ? isActive
            ? "nav-link-pro-active"
            : "nav-link-pro"
          : isActive
            ? "text-white shadow-lg"
            : "text-white/50 hover:text-white/90 hover:bg-white/5"
      )}
      style={!proShell && isActive ? {
        background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(99,102,241,0.15))",
        border: "1px solid rgba(16,185,129,0.3)"
      } : {}}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-emerald-400 rounded-r-full" />
      )}
      <span
        className={cn(
          "flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200",
          proShell
            ? isActive
              ? "bg-emerald-100"
              : "bg-zinc-100 group-hover:bg-zinc-200"
            : isActive
              ? "bg-white/10"
              : "group-hover:bg-white/5"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4",
            proShell
              ? isActive
                ? "text-emerald-700"
                : "text-muted-foreground group-hover:text-foreground"
              : isActive
                ? item.color
                : "text-white/40 group-hover:text-white/70"
          )}
        />
      </span>
      <span className="flex-1">{item.label}</span>
      {isActive && (
        <ChevronRight className={cn("h-3 w-3", proShell ? "text-emerald-600/50" : "text-white/30")} />
      )}
    </Link>
  );
});

export default function Layout() {
  const location = useLocation();
  const { pilotMode } = usePilotMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileNavAdvanced, setMobileNavAdvanced] = useState(false);
  const [universePrefs, setUniversePrefs] = useState(loadUniversePreferences);
  const clicksRef = useRef([]);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen(v => !v), []);

  useEffect(() => {
    initGodModeSpeed();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

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

  const preferenceNavItems = filterNavItemsForPreferences(LAYOUT_NAV_ITEMS, universePrefs);
  const visibleNavItems = filterNavItemsForPilot(preferenceNavItems, pilotMode, mobileNavAdvanced);

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

  const shellVariant = getPlatformShellVariant(location.pathname);
  const proShell =
    EXPERIENCE_FLAGS.platformProShell &&
    (shellVariant === "pro" ||
      (shellVariant === "home" && EXPERIENCE_FLAGS.platformCleanHome));
  const showCanvas = EXPERIENCE_FLAGS.layoutCanvasEffects && !proShell;
  const showFormulaRibbon = !proShell && EXPERIENCE_FLAGS.sovereigntyBanner !== false;

  // Sur shell pro/clair, retirer la classe .dark sinon texte blanc sur fond blanc.
  useEffect(() => {
    const root = document.documentElement;
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem("theme-preference") : null;
    if (proShell) {
      root.classList.remove("dark");
    } else if (saved !== "light") {
      root.classList.add("dark");
    }
  }, [proShell]);

  return (
    <div
      className={cn(
        "min-h-screen",
        proShell ? "platform-layout-pro" : "bg-background cosmic-bg cinema"
      )}
    >
      {EXPERIENCE_FLAGS.firstVisitWelcomeGate ? <FirstVisitWelcomeGate /> : null}
      {!proShell ? <AudienceWayfinder /> : null}
      {showCanvas ? <MagicParticles /> : null}
      {showCanvas ? <StardustLayer /> : null}
      {/* Global Launch Alert */}
      {EXPERIENCE_FLAGS.globalLaunchAlert ? <GlobalLaunchAlert /> : null}

      {/* Maintenance Banner (optionnel) */}
      <MaintenanceBanner isActive={false} />

      {/* ── Desktop Sidebar ── */}
      <aside
        className={cn(
          "platform-sidebar fixed left-0 top-0 bottom-0 w-64 hidden lg:flex flex-col z-40 overflow-hidden",
          !proShell && "cosmic-sidebar-dark"
        )}
        style={
          proShell
            ? undefined
            : {
                background: "linear-gradient(180deg, hsl(220,30%,8%) 0%, hsl(220,25%,6%) 100%)",
                borderRight: "1px solid rgba(212,175,55,0.22)",
              }
        }
      >

        {!proShell && (
          <>
            <div className="absolute top-20 -left-8 h-40 w-40 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsla(158,80%,50%,1), transparent 70%)" }} />
            <div className="absolute bottom-32 -right-8 h-32 w-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsla(260,80%,60%,1), transparent 70%)" }} />
          </>
        )}

        <div className="relative z-10 p-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className={cn(
                "h-10 w-10 rounded-2xl flex items-center justify-center relative",
                proShell ? "bg-emerald-600" : "glow-green"
              )}
              style={
                proShell
                  ? undefined
                  : { background: "linear-gradient(135deg, hsl(158,60%,35%), hsl(158,80%,25%))" }
              }
            >
              <Recycle className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(135deg, hsla(158,80%,60%,0.3), transparent)" }} />
            </div>
            <div className="min-w-0">
              <p
                className={cn(
                  "font-display text-sm font-bold leading-none",
                  proShell ? "text-foreground" : "text-white"
                )}
              >
                Egor69
              </p>
              <p className={cn("text-[10px] mt-0.5", proShell ? "text-emerald-700" : "text-emerald-400/60")}>
                CirculAI · Québec
              </p>
            </div>
          </Link>
          <LanguageSwitcher compact />
        </div>

        <div
          className={cn(
            "mx-5 mb-3 flex items-center gap-2 px-3 py-1.5 rounded-lg",
            proShell ? "bg-emerald-50 border border-emerald-200/80" : ""
          )}
          style={
            proShell
              ? undefined
              : { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }
          }
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span
            className={cn(
              "text-[10px] font-medium",
              proShell ? "text-emerald-800" : "text-emerald-400/70"
            )}
          >
            En ligne
          </span>
        </div>

        <PoleNavSidebar
          navItems={visibleNavItems}
          NavLinkComponent={(props) => <NavLink {...props} proShell={proShell} />}
          proShell={proShell}
        />

        <div
          className={cn(
            "relative z-10 m-4 p-4 rounded-2xl overflow-hidden",
            proShell && "platform-card-emerald"
          )}
          style={
            proShell
              ? undefined
              : {
                  background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(99,102,241,0.08))",
                  border: "1px solid rgba(16,185,129,0.2)",
                }
          }
        >
          <p className={cn("text-xs font-semibold mb-2", proShell ? "text-foreground/80" : "text-white/70")}>
            Pilote & boutique
          </p>
          <div className="flex flex-col gap-1.5">
            {EXPERIENCE_FLAGS.worldRealmSwitcher ? (
              <div className="flex justify-center pb-1">
                <WorldRealmSwitcher />
              </div>
            ) : null}
            <Link
              to="/docs/circulai-kit-regional"
              className={cn(
                "block text-center rounded-lg border py-1.5 text-[11px] font-semibold transition-colors",
                proShell
                  ? "border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                  : "border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/10"
              )}
            >
              Kit municipal CirculAI
            </Link>
            <Link
              to="/boutique"
              className={cn(
                "block text-center rounded-xl py-2 text-[11px] font-bold transition-colors",
                proShell
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-emerald-500/90 text-zinc-950 hover:bg-emerald-400"
              )}
            >
              Boutique →
            </Link>
          </div>
        </div>

        {/* Legal Notice */}
        <div
          className={cn(
            "relative z-10 mx-4 mb-4 px-3 py-2 rounded-lg text-center text-[9px]",
            proShell ? "text-muted-foreground" : "text-white/40"
          )}
        >
          <p>© 2026 Egor69 - Propriété exclusive protégée par la loi</p>
          <Link
            to="/legal"
            className={cn(
              "underline mt-1 block transition-colors",
              proShell ? "text-muted-foreground hover:text-foreground" : "text-white/50 hover:text-white/80"
            )}
          >
            Propriété Intellectuelle
          </Link>
        </div>
      </aside>

      <GlobalSearchBar />

      {/* ── Mobile Header ── */}
      <header
        className={cn(
          "lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 min-h-14 h-14 mobile-header-safe",
          proShell && "bg-white/95 border-b border-border backdrop-blur-md"
        )}
        style={
          proShell
            ? undefined
            : {
                background: "rgba(10,12,20,0.85)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }
        }
      >
        <Link to="/" className="flex items-center gap-2">
          <div
            className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center",
              proShell && "bg-emerald-600"
            )}
            style={
              proShell
                ? undefined
                : { background: "linear-gradient(135deg, hsl(158,60%,35%), hsl(158,80%,25%))" }
            }
          >
            <Recycle className="h-4 w-4 text-white" />
          </div>
          <span
            className={cn(
              "font-display font-bold text-sm",
              proShell ? "text-foreground" : "text-white"
            )}
          >
            Egor69
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className={cn(
              "min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-all",
              proShell
                ? "text-muted-foreground hover:text-foreground hover:bg-zinc-100"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={closeMobile}
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div
            className="absolute top-14 left-0 right-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] overflow-y-auto overscroll-contain p-2"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "hsl(220,30%,8%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <PoleNavSidebar navItems={visibleNavItems} NavLinkComponent={NavLink} onNavigate={closeMobile} />
            {pilotMode && !mobileNavAdvanced && preferenceNavItems.length > visibleNavItems.length && (
              <button
                type="button"
                onClick={() => setMobileNavAdvanced(true)}
                className="w-full mt-2 px-3 py-3 rounded-xl text-xs font-medium text-[#FFD700]/90 border border-[#D4AF37]/30 hover:bg-[#FFD700]/10 min-h-[44px]"
              >
                Tout voir (avancé) · {preferenceNavItems.length - visibleNavItems.length}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main
        className={cn(
          "platform-main lg:ml-64 pt-[6.5rem] lg:pt-11 min-h-screen app-main-with-mobile-nav",
          proShell && "text-foreground"
        )}
      >
        {proShell ? <GlobalNavCirculai /> : null}
        {EXPERIENCE_FLAGS.deploymentCountdown && !proShell ? <DeploymentCountdownBanner /> : null}
        <div
          className={cn(
            "max-w-6xl mx-auto p-4 sm:p-6 lg:p-8",
            EXPERIENCE_FLAGS.strategicConversionStrip && !proShell && "pb-28 lg:pb-10"
          )}
        >
          {showFormulaRibbon ? (
            <div className="mb-6">
              <Suspense fallback={null}>
                <SovereigntyFormulaRibbon />
              </Suspense>
            </div>
          ) : null}
          <Outlet />
          {EXPERIENCE_FLAGS.contextualLinksPanel && !proShell ? <ContextualLinksPanel /> : null}
        </div>
      </main>

      {EXPERIENCE_FLAGS.strategicConversionStrip ? <StrategicConversionStrip /> : null}

      <PoleMobileBottomNav location={location} onNavigate={closeMobile} />

      {/* ── Footer ── */}
      <Footer />

      {/* ── Circulia Floating Widget ── */}
      {EXPERIENCE_FLAGS.circuliaWidget ? <CirculiaWidget /> : null}

      {/* ── Scorpion Harpoon (engagement) ── */}
      {EXPERIENCE_FLAGS.scorpionHarpoon ? <ScorpionHarpoon /> : null}

      {EXPERIENCE_FLAGS.onboardingFlow ? <OnboardingFlow /> : null}
      {EXPERIENCE_FLAGS.guideAgent && !location.pathname.startsWith("/world") ? <GuideAgent /> : null}

      {/* ── Floating Help FAB (panneau contextuel + lien /aide) ── */}
      <HelpFab />
    </div>
  );
}