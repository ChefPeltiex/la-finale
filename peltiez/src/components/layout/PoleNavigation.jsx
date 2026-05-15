import { memo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinkTarget } from "@/lib/accueilSections";
import {
  groupNavItemsByPole,
  poleLabel,
  getPoleIdForPath,
  NAV_POLES,
} from "@/config/navPoles";
import { loadDisplayMode } from "@/lib/displayMode";

function navItemIsActive(location, item) {
  if (location.pathname !== item.path) return false;
  if (item.hash) {
    const want = item.hash.startsWith("#") ? item.hash : `#${item.hash}`;
    return location.hash === want;
  }
  return true;
}

const PoleNavLink = memo(function PoleNavLink({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <Link
      to={navLinkTarget(item)}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
        isActive ? "text-white bg-white/10" : "text-white/45 hover:text-white/85 hover:bg-white/5"
      )}
    >
      <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? item.color : "text-white/35")} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
});

export const PoleNavSidebar = memo(function PoleNavSidebar({ navItems, NavLinkComponent }) {
  const location = useLocation();
  const [simple, setSimple] = useState(() => loadDisplayMode() === "simple");
  const activePole = getPoleIdForPath(location.pathname);
  const [expanded, setExpanded] = useState(() => new Set([activePole]));
  const groups = groupNavItemsByPole(navItems);

  useEffect(() => {
    const onMode = () => setSimple(loadDisplayMode() === "simple");
    window.addEventListener("egor69-display-mode", onMode);
    return () => window.removeEventListener("egor69-display-mode", onMode);
  }, []);

  useEffect(() => {
    setExpanded((prev) => new Set([...prev, activePole]));
  }, [activePole]);

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide relative z-10">
      {groups.map(({ pole, items }) => {
        const isOpen = expanded.has(pole.id);
        const PoleIcon = pole.icon;
        const poleActive = activePole === pole.id;
        return (
          <div key={pole.id} className="mb-1">
            <button
              type="button"
              onClick={() => toggle(pole.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                poleActive
                  ? "text-[#FFD700] bg-[#FFD700]/10 border border-[#D4AF37]/40"
                  : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <PoleIcon className={cn("h-4 w-4 shrink-0", pole.color)} />
              <span className="flex-1 text-left truncate">{poleLabel(pole, simple)}</span>
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-white/40" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-white/40" />
              )}
            </button>
            {isOpen && (
              <div className="mt-0.5 ml-2 pl-2 border-l border-[#D4AF37]/20 space-y-0.5">
                {items.map((item) =>
                  NavLinkComponent ? (
                    <NavLinkComponent
                      key={`${item.path}${item.hash || ""}`}
                      item={item}
                      isActive={navItemIsActive(location, item)}
                    />
                  ) : (
                    <PoleNavLink
                      key={`${item.path}${item.hash || ""}`}
                      item={item}
                      isActive={navItemIsActive(location, item)}
                    />
                  )
                )}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
});

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
      className="lg:hidden fixed bottom-0 left-0 right-0 flex justify-around py-2 z-50 pole-mobile-nav"
      style={{
        background: "rgba(8,8,12,0.96)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(212,175,55,0.25)",
      }}
    >
      {NAV_POLES.map((pole) => {
        const isActive = activePole === pole.id;
        const Icon = pole.icon;
        return (
          <Link
            key={pole.id}
            to={pole.defaultPath}
            onClick={onNavigate}
            className={cn(
              "flex flex-col items-center gap-0.5 py-1 px-1 rounded-xl transition-all min-w-0 max-w-[4.5rem]",
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
