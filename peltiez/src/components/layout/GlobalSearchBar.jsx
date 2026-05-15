import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useDisplayMode from "@/hooks/useDisplayMode";
import { GLOBAL_SEARCH_INDEX, searchGlobalIndex } from "@/lib/globalSearchIndex";

const PLACEHOLDER_DEEP = "Rechercher une page, un module…";
const PLACEHOLDER_SIMPLE = "Rechercher…";

function SearchResults({ results, activeIndex, onSelect, listId }) {
  if (results.length === 0) {
    return (
      <p className="px-3 py-2.5 text-xs text-white/45" role="status">
        Aucun résultat
      </p>
    );
  }
  return (
    <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto py-1">
      {results.map((item, i) => (
        <li key={item.path} role="option" aria-selected={i === activeIndex}>
          <button
            type="button"
            className={cn(
              "w-full text-left px-3 py-2 text-sm transition-colors",
              i === activeIndex
                ? "bg-[#FFD700]/15 text-[#FFD700]"
                : "text-white/80 hover:bg-white/5 hover:text-white"
            )}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(item)}
          >
            <span className="font-medium block truncate">{item.title}</span>
            <span className="text-[10px] text-white/35 truncate block">{item.path}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

const SearchField = memo(function SearchField({
  query,
  setQuery,
  results,
  activeIndex,
  setActiveIndex,
  open,
  setOpen,
  onNavigateTo,
  simple,
  inputId,
  listId,
  compact,
}) {
  const inputRef = useRef(null);
  const placeholder = simple ? PLACEHOLDER_SIMPLE : PLACEHOLDER_DEEP;

  const go = useCallback(
    (item) => {
      if (!item) return;
      onNavigateTo(item);
      setQuery("");
      setOpen(false);
      setActiveIndex(0);
    },
    [onNavigateTo, setQuery, setOpen, setActiveIndex]
  );

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[activeIndex] ?? results[0];
      if (pick) go(pick);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative flex-1 min-w-0">
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D4AF37]/70"
        aria-hidden
      />
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        autoComplete="off"
        spellCheck={false}
        value={query}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onFocus={() => query.trim() && setOpen(true)}
        onKeyDown={onKeyDown}
        className={cn(
          "w-full rounded-lg border bg-[#0a0c14]/90 text-sm text-white placeholder:text-white/35",
          "border-[#D4AF37]/35 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/40",
          compact ? "h-9 pl-9 pr-8 text-xs" : "h-10 pl-10 pr-9"
        )}
      />
      {query && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/40 hover:text-white/80"
          aria-label="Effacer la recherche"
          onClick={() => {
            setQuery("");
            setOpen(false);
            inputRef.current?.focus();
          }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {open && query.trim() && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-[#D4AF37]/30 shadow-xl"
          style={{ background: "hsl(220,28%,7%)" }}
        >
          <SearchResults
            results={results}
            activeIndex={activeIndex}
            onSelect={go}
            listId={listId}
          />
        </div>
      )}
    </div>
  );
});

export default memo(function GlobalSearchBar() {
  const navigate = useNavigate();
  const { simple } = useDisplayMode();
  const baseId = useId();
  const inputIdDesktop = `${baseId}-search-desktop`;
  const listIdDesktop = `${baseId}-list-desktop`;
  const inputIdMobile = `${baseId}-search-mobile`;
  const listIdMobile = `${baseId}-list-mobile`;
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const results = searchGlobalIndex(GLOBAL_SEARCH_INDEX, query);

  const onNavigateTo = useCallback(
    (item) => {
      navigate(item.to);
    },
    [navigate]
  );

  useEffect(() => {
    const onDoc = (e) => {
      const inDesktop = desktopRef.current?.contains(e.target);
      const inMobile = mobileRef.current?.contains(e.target);
      if (!inDesktop && !inMobile) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const fieldProps = {
    query,
    setQuery,
    results,
    activeIndex,
    setActiveIndex,
    open,
    setOpen,
    onNavigateTo,
    simple,
  };

  return (
    <>
      <div
        ref={desktopRef}
        className="hidden lg:flex fixed top-0 left-64 right-0 z-[45] h-11 items-center gap-2 px-4 border-b border-[#D4AF37]/25"
        style={{ background: "linear-gradient(180deg, hsl(220,30%,7%) 0%, hsl(220,28%,6%) 100%)" }}
      >
        <SearchField {...fieldProps} inputId={inputIdDesktop} listId={listIdDesktop} compact={false} />
      </div>

      <div
        className={cn(
          "lg:hidden fixed left-0 right-0 z-[45] border-b border-[#D4AF37]/20 top-14",
          mobileExpanded ? "h-11" : "h-10"
        )}
        style={{ background: "rgba(8,10,16,0.96)", backdropFilter: "blur(16px)" }}
      >
        {!mobileExpanded ? (
          <div className="flex h-10 items-center justify-end px-3">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4AF37]/30 text-[#FFD700] hover:bg-[#FFD700]/10"
              aria-label="Ouvrir la recherche"
              aria-expanded={false}
              onClick={() => setMobileExpanded(true)}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div ref={mobileRef} className="flex h-11 items-center gap-2 px-3">
            <SearchField
              {...fieldProps}
              inputId={inputIdMobile}
              listId={listIdMobile}
              compact
            />
            <button
              type="button"
              className="shrink-0 rounded-lg p-2 text-white/50 hover:text-white hover:bg-white/5"
              aria-label="Fermer la recherche"
              onClick={() => {
                setMobileExpanded(false);
                setOpen(false);
                setQuery("");
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
});
