import { useState } from "react";
import { Globe } from "lucide-react";
import { LANGUAGES } from "@/lib/translations";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent transition-all text-sm font-medium text-foreground",
          compact && "px-2 py-1.5"
        )}
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span>{current.flag}</span>
        {!compact && <span className="hidden sm:inline">{current.label}</span>}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[160px]">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors text-left",
                  l.code === lang ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
                )}
              >
                <span className="text-lg">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}