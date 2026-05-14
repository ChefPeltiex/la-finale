import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "fr", label: "Français",    flag: "🇫🇷" },
  { code: "en", label: "English",     flag: "🇬🇧" },
  { code: "es", label: "Español",     flag: "🇪🇸" },
  { code: "pt", label: "Português",   flag: "🇧🇷" },
  { code: "ar", label: "العربية",     flag: "🇸🇦" },
  { code: "sw", label: "Kiswahili",   flag: "🇰🇪" },
  { code: "zh", label: "中文",         flag: "🇨🇳" },
  { code: "ja", label: "日本語",       flag: "🇯🇵" },
  { code: "de", label: "Deutsch",     flag: "🇩🇪" },
  { code: "wo", label: "Wolof",       flag: "🇸🇳" },
];

export default function LanguageSelector({ compact = false }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => {
    return LANGUAGES.find(l => l.code === (localStorage.getItem("circul_lang") || "fr")) || LANGUAGES[0];
  });
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (lang) => {
    setSelected(lang);
    localStorage.setItem("circul_lang", lang.code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border bg-card hover:bg-accent transition-all text-sm font-medium text-foreground"
        aria-label="Changer la langue"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        {!compact && <span className="hidden sm:inline text-xs">{selected.label}</span>}
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-1.5 max-h-72 overflow-y-auto">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => select(lang)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                  selected.code === lang.code
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <span className="text-lg leading-none">{lang.flag}</span>
                <span>{lang.label}</span>
                {selected.code === lang.code && <span className="ml-auto text-primary text-xs">✓</span>}
              </button>
            ))}
          </div>
          <div className="border-t border-border px-3 py-2">
            <p className="text-[10px] text-muted-foreground text-center">10 langues · Traduction IA</p>
          </div>
        </div>
      )}
    </div>
  );
}