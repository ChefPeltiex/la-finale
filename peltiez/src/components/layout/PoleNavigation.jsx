import { memo, useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Home, Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinkTarget } from "@/lib/accueilSections";
import {
  poleLabel,
  getPoleIdForPath,
  getBlockIdForPath,
  getBlocksForPole,
  blockDescription,
  resolveNavItemForRoute,
  NAV_POLES,
  HOME_POLE_ICON,
} from "@/config/navPoles";
import { loadDisplayMode } from "@/lib/displayMode";
import usePilotMode from "@/hooks/usePilotMode";

function routeIsActive(location, to) {
  if (typeof to === "string") {
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  }
  const base = to.pathname || "/";
  const wantHash = to.hash ? (to.hash.startsWith("#") ? to.hash : `#${to.hash}`) : "";
  if (location.pathname !== base) return false;
  if (wantHash) return location.hash === wantHash;
  return true;
}

const PoleNavLink = memo(function PoleNavLink({ item, isActive, onClick, featured }) {
  const Icon = item.icon;
  return (
    <Link
      to={navLinkTarget(item)}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
        featured
          ? isActive
            ? "text-[#FFD700] bg-[#FFD700]/15 border border-[#D4AF37]/50"
            : "text-[#FFD700]/90 bg-[#FFD700]/5 border border-[#D4AF37]/30 hover:bg-[#FFD700]/12"
          : isActive
            ? "text-white bg-white/10"
            : "text-white/45 hover:text-white/85 hover:bg-white/5"
      )}
    >
      {featured ? (
        <Sparkles className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-[#FFD700]" : "text-[#FFD700]/70")} />
      ) : (
        <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? item.color : "text-white/35")} />
      )}
      <span className="truncate">{item.label}</span>
    </Link>
  );
});

export const PoleNavSidebar = memo(function PoleNavSidebar({ navItems, NavLinkComponent, onNavigate, proShell = false }) {
  const location = useLocation();
  const { pilotMode } = usePilotMode();
  const [simple, setSimple] = useState(() => loadDisplayMode() === "simple");
  const activePole = getPoleIdForPath(location.pathname);
  const activeBlock = getBlockIdForPath(location.pathname, location.hash);
  const [expandedPoles, setExpandedPoles] = useState(() => new Set([activePole]));
  const [expandedBlocks, setExpandedBlocks] = useState(() => new Set(activeBlock ? [`${activePole}:${activeBlock}`] : []));
  const [advancedPoles, setAdvancedPoles] = useState(() => new Set());

  useEffect(() => {
    const onMode = () => setSimple(loadDisplayMode() === "simple");
    window.addEventListener("egor69-display-mode", onMode);
    return () => window.removeEventListener("egor69-display-mode", onMode);
  }, []);

  useEffect(() => {
    setExpandedPoles((prev) => new Set([...prev, activePole]));
    if (activeBlock) {
      setExpandedBlocks((prev) => new Set([...prev, `${activePole}:${activeBlock}`]));
    }
  }, [activePole, activeBlock]);

  const togglePole = (id) => {
    setExpandedPoles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBlock = (poleId, blockId) => {
    const key = `${poleId}:${blockId}`;
    setExpandedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAdvanced = (poleId) => {
    setAdvancedPoles((prev) => {
      const next = new Set(prev);
      if (next.has(poleId)) next.delete(poleId);
      else next.add(poleId);
      return next;
    });
  };

  const polesWithBlocks = useMemo(
    () =>
      NAV_POLES.map((pole) => {
        const allBlocks = getBlocksForPole(pole.id);
        const pilotBlocks = getBlocksForPole(pole.id, { pilotOnly: true });
        const showAdvanced = advancedPoles.has(pole.id);
        const visibleBlocks =
          pilotMode && !showAdvanced ? pilotBlocks : allBlocks;
        const hiddenCount =
          pilotMode && !showAdvanced ? allBlocks.length - pilotBlocks.length : 0;
        return { pole, allBlocks, visibleBlocks, hiddenCount, showAdvanced };
      }),
    [pilotMode, advancedPoles]
  );

  const HubIcon = HOME_POLE_ICON;

  return (
    <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide relative z-10">
      <Link
        to="/"
        className={cn(
          "flex items-center gap-2.5 px-3 py-2.5 mb-2 rounded-xl text-sm font-semibold transition-all border",
          location.pathname === "/" && !location.hash
            ? proShell
              ? "text-emerald-800 bg-emerald-50 border-emerald-200/80"
              : "text-[#FFD700] bg-[#FFD700]/10 border-[#D4AF37]/45"
            : proShell
              ? "text-foreground/70 hover:text-foreground border-transparent hover:bg-zinc-100"
              : "text-white/75 hover:text-white border-transparent hover:bg-white/5"
        )}
      >
        <HubIcon className="h-4 w-4 shrink-0 text-emerald-400" />
        <span>Hub principal</span>
      </Link>

      {polesWithBlocks.map(({ pole, visibleBlocks, hiddenCount, showAdvanced }) => {
        const isPoleOpen = expandedPoles.has(pole.id);
        const PoleIcon = pole.icon;
        const poleActive = activePole === pole.id;

        return (
          <div key={pole.id} className="mb-1">
            <button
              type="button"
              onClick={() => togglePole(pole.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                poleActive
                  ? proShell
                    ? "text-emerald-800 bg-emerald-50 border border-emerald-200/80"
                    : "text-[#FFD700] bg-[#FFD700]/10 border border-[#D4AF37]/40"
                  : proShell
                    ? "text-foreground/70 hover:text-foreground hover:bg-zinc-100 border border-transparent"
                    : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <PoleIcon className={cn("h-4 w-4 shrink-0", pole.color)} />
              <span className="flex-1 text-left truncate">{poleLabel(pole, simple)}</span>
              {isPoleOpen ? (
                <ChevronDown className={cn("h-3.5 w-3.5", proShell ? "text-foreground/40" : "text-white/40")} />
              ) : (
                <ChevronRight className={cn("h-3.5 w-3.5", proShell ? "text-foreground/40" : "text-white/40")} />
              )}
            </button>

            {isPoleOpen && (
              <div className={cn("mt-1 ml-1 pl-2 border-l space-y-1", proShell ? "border-emerald-200/60" : "border-[#D4AF37]/15")}>
                {visibleBlocks.map((block) => {
                  const blockKey = `${pole.id}:${block.id}`;
                  const isBlockOpen = expandedBlocks.has(blockKey);
                  const blockActive = poleActive && activeBlock === block.id;

                  return (
                    <div key={block.id} className="rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleBlock(pole.id, block.id)}
                        className={cn(
                          "w-full flex items-start gap-2 px-2.5 py-2 rounded-lg text-left transition-all",
                          blockActive
                            ? proShell
                              ? "bg-emerald-50 border border-emerald-200/60"
                              : "bg-[#FFD700]/8 border border-[#D4AF37]/35"
                            : proShell
                              ? "hover:bg-zinc-100 border border-transparent"
                              : "hover:bg-white/[0.04] border border-transparent"
                        )}
                      >
                        <span className="flex-1 min-w-0">
                          <span className={cn("block text-[11px] font-bold tracking-wide", proShell ? "text-emerald-800" : "text-[#FFD700]/95")}>
                            {block.label}
                          </span>
                          {isBlockOpen && (
                            <span className={cn("block text-[10px] mt-0.5 leading-snug", proShell ? "text-muted-foreground" : "text-white/40")}>
                              {blockDescription(block, simple)}
                            </span>
                          )}
                        </span>
                        {isBlockOpen ? (
                          <ChevronDown className={cn("h-3 w-3 shrink-0 mt-0.5", proShell ? "text-emerald-600/60" : "text-[#D4AF37]/60")} />
                        ) : (
                          <ChevronRight className={cn("h-3 w-3 shrink-0 mt-0.5", proShell ? "text-foreground/30" : "text-white/30")} />
                        )}
                      </button>

                      {isBlockOpen && (
                        <div className="pb-1 pl-1 space-y-0.5">
                          {block.routes.map((route) => {
                            const item = resolveNavItemForRoute(navItems, route.to);
                            const syntheticItem = item || {
                              path: typeof route.to === "string" ? route.to : route.to.pathname || "/",
                              hash:
                                typeof route.to === "object" && route.to.hash
                                  ? route.to.hash.replace(/^#/, "")
                                  : undefined,
                              label: route.label,
                              icon: block.featured ? Sparkles : pole.icon,
                              color: pole.color,
                            };
                            const isActive = routeIsActive(location, route.to);
                            const featured = block.featured && route.to === "/world";

                            return NavLinkComponent ? (
                              <NavLinkComponent
                                key={routeKey(route.to)}
                                item={syntheticItem}
                                isActive={isActive}
                                onClick={onNavigate}
                              />
                            ) : (
                              <PoleNavLink
                                key={routeKey(route.to)}
                                item={syntheticItem}
                                isActive={isActive}
                                featured={featured}
                                onClick={onNavigate}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={() => toggleAdvanced(pole.id)}
                    className={cn(
                      "mt-1 flex w-full items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-colors",
                      proShell
                        ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                        : "text-[#FFD700]/80 hover:text-[#FFD700] hover:bg-[#FFD700]/10"
                    )}
                  >
                    <Layers className="h-3.5 w-3.5 shrink-0" />
                    Tout voir (avancé) · {hiddenCount} blocs
                  </button>
                )}
                {hiddenCount > 0 && showAdvanced && (
                  <button
                    type="button"
                    onClick={() => toggleAdvanced(pole.id)}
                    className={cn(
                      "mt-0.5 flex w-full items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] transition-colors",
                      proShell ? "text-muted-foreground hover:text-foreground" : "text-white/40 hover:text-white/60"
                    )}
                  >
                    Replier le menu avancé
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
});

function routeKey(to) {
  if (typeof to === "string") return to;
  return `${to.pathname || "/"}${to.hash || ""}`;
}

/** Barre mobile : 5 pôles. */
export const PoleMobileBottomNav = memo(function PoleMobileBottomNav({ location, onNavigate }) {
  const [simple, setSimple] = useState(() => loadDisplayMode() === "simple");

  useEffect(() => {
    const onMode = () => setSimple(loadDisplayMode() === "simple");
    window.addEventListener("egor69-display-mode", onMode);
    return () => window.removeEventListener("egor69-display-mode", onMode);
  }, []);

  const activePole = getPoleIdForPath(location.pathname);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 flex justify-around items-stretch py-2 z-50 pole-mobile-nav min-h-[56px]"
      style={{
        background: "rgba(8,8,12,0.96)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(212,175,55,0.25)",
      }}
    >
      <Link
        to="/"
        onClick={onNavigate}
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 py-2 px-1.5 rounded-xl transition-all min-w-0 min-h-[44px]",
          location.pathname === "/" && !location.hash ? "text-[#FFD700]" : "text-white/35"
        )}
      >
        <Home className="h-5 w-5" />
        <span className="text-[8px] font-medium text-center leading-tight">Hub</span>
      </Link>
      {NAV_POLES.map((pole) => {
        const isActive = activePole === pole.id;
        const Icon = pole.icon;
        return (
          <Link
            key={pole.id}
            to={pole.defaultPath}
            onClick={onNavigate}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-2 px-1.5 rounded-xl transition-all min-w-0 max-w-[4.25rem] min-h-[44px]",
              isActive ? "text-[#FFD700]" : "text-white/35"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
            <span className="text-[8px] font-medium text-center leading-tight line-clamp-2">
              {simple ? pole.label.split(" ")[0] : pole.label.replace("Univers ", "")}
            </span>
          </Link>
        );
      })}
    </nav>
  );
});




