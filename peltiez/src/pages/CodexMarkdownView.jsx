import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN } from "@/lib/site";
import { BookOpen, Download, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import SymbolicDisclaimer from "@/components/ui/SymbolicDisclaimer";

const THEMES = {
  investisseur: {
    wrapper: "from-amber-950/30 via-zinc-950 to-emerald-950/20",
    border: "border-amber-500/25",
    accent: "text-amber-400",
    badge: "Investisseur",
    prose: "prose-invert prose-headings:text-amber-100 prose-a:text-emerald-400",
  },
  rituel: {
    wrapper: "from-zinc-950 via-black to-amber-950/15",
    border: "border-[#D4AF37]/30",
    accent: "text-[#FFD700]",
    badge: "Rituel",
    prose: "prose-invert prose-headings:text-[#FFD700] prose-a:text-amber-300/90 prose-p:text-white/80",
  },
  magique: {
    wrapper: "from-violet-950/25 via-zinc-950 to-amber-950/20",
    border: "border-[#BF00FF]/30",
    accent: "text-violet-300",
    badge: "Magique · companion",
    prose: "prose-invert prose-headings:text-violet-200 prose-a:text-[#FFD700]",
  },
  alliance: {
    wrapper: "from-emerald-950/30 via-zinc-950 to-violet-950/20",
    border: "border-emerald-500/30",
    accent: "text-emerald-400",
    badge: "Alliance IA · OMÉGA",
    prose: "prose-invert prose-headings:text-emerald-200 prose-a:text-[#FFD700]",
  },
  preuves: {
    wrapper: "from-sky-950/25 via-zinc-950 to-emerald-950/25",
    border: "border-sky-500/30",
    accent: "text-sky-300",
    badge: "Preuves · 2 min",
    prose: "prose-invert prose-headings:text-sky-100 prose-a:text-emerald-400",
  },
  nature: {
    wrapper: "from-emerald-950/30 via-zinc-950 to-sky-950/20",
    border: "border-emerald-500/25",
    accent: "text-emerald-300",
    badge: "Nature Québec · portails",
    prose: "prose-invert prose-headings:text-emerald-100 prose-a:text-sky-300",
  },
  circulai: {
    wrapper: "from-sky-950/25 via-zinc-950 to-emerald-950/25",
    border: "border-sky-500/30",
    accent: "text-sky-300",
    badge: "Kit régional CirculAI",
    prose: "prose-invert prose-headings:text-sky-100 prose-a:text-emerald-400",
  },
};

export default function CodexMarkdownView({
  slug,
  variant,
  docFile,
  title,
  description,
  canonicalPath,
  disclaimerVariant,
}) {
  const theme = THEMES[variant] ?? THEMES.investisseur;
  const [md, setMd] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/docs/${docFile ?? `codex-${slug}.md`}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setMd(text);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, docFile]);

  return (
    <div className={cn("min-h-[70vh] bg-gradient-to-b pb-24", theme.wrapper)}>
      <div className="container max-w-3xl py-6 sm:py-8 px-4 sm:px-6">
        <SEOMeta title={title} description={description} canonicalUrl={`${SITE_ORIGIN}${canonicalPath}`} />

        <div
          className={cn(
            "mb-8 flex flex-wrap items-center gap-3 rounded-2xl border bg-zinc-950/80 px-4 py-4 backdrop-blur-sm",
            theme.border
          )}
        >
          <BookOpen className={cn("h-8 w-8 shrink-0", theme.accent)} aria-hidden />
          <div className="flex-1 min-w-[12rem]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Codex · {theme.badge}</p>
            <p className="text-sm text-white/70 leading-relaxed">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {variant === "investisseur" && (
              <>
                <Link
                  to="/docs/preuves"
                  className="rounded-lg border border-sky-500/40 px-3 py-1.5 text-sky-200 hover:bg-sky-500/10"
                >
                  Preuves en 2 min
                </Link>
                <Link
                  to="/docs/rituel"
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/10"
                >
                  Édition rituel
                </Link>
              </>
            )}
            {variant === "preuves" && (
              <Link
                to="/docs/investisseur"
                className="rounded-lg border border-amber-500/40 px-3 py-1.5 text-amber-200 hover:bg-amber-500/10"
              >
                Codex investisseur
              </Link>
            )}
            {variant === "nature" && (
              <>
                <Link
                  to="/portail/nature-quebec"
                  className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-emerald-200 hover:bg-emerald-500/10"
                >
                  Hub 12 portails
                </Link>
                <Link
                  to="/docs/nature-quebec-kit"
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/10"
                >
                  Kit activation
                </Link>
                <Link
                  to="/docs/preuves"
                  className="rounded-lg border border-sky-500/40 px-3 py-1.5 text-sky-200 hover:bg-sky-500/10"
                >
                  Preuves 2 min
                </Link>
              </>
            )}
            {variant === "circulai" && (
              <>
                <Link
                  to="/docs/circulai-kit-regional"
                  className="rounded-lg border border-sky-500/40 px-3 py-1.5 text-sky-200 hover:bg-sky-500/10"
                >
                  Hub kit régional
                </Link>
                <Link
                  to="/docs/circulai/equations-systeme"
                  className="rounded-lg border border-amber-500/35 px-3 py-1.5 text-amber-200 hover:bg-amber-500/10"
                >
                  Équations → produit
                </Link>
                <Link
                  to="/docs/circulai/plan-action-quebec"
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/10"
                >
                  Plan action QC
                </Link>
                <Link
                  to="/pilote"
                  className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-emerald-200 hover:bg-emerald-500/10"
                >
                  Pilote 90 j
                </Link>
                <Link
                  to="/entreprises"
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/10"
                >
                  Entreprises
                </Link>
              </>
            )}
            {variant !== "magique" && variant !== "preuves" && variant !== "nature" && variant !== "circulai" && (
              <Link
                to={variant === "investisseur" ? "/docs/rituel" : "/docs/investisseur"}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/10"
              >
                {variant === "investisseur" ? "Édition rituel" : "Édition investisseur"}
              </Link>
            )}
            {variant === "magique" && (
              <>
                <Link to="/docs/investisseur" className="rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/10">
                  Investisseur
                </Link>
                <Link to="/docs/rituel" className="rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/10">
                  Rituel
                </Link>
                <Link to="/docs/preuves" className="rounded-lg border border-sky-500/40 px-3 py-1.5 text-sky-200 hover:bg-sky-500/10">
                  Preuves 2 min
                </Link>
                <Link to="/docs/promesses" className="rounded-lg border border-violet-500/40 px-3 py-1.5 text-violet-200 hover:bg-violet-500/10">
                  Charpente (8 lois)
                </Link>
              </>
            )}
            <a
              href="/encyclopedie.pdf"
              download="encyclopedie.pdf"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 px-3 py-1.5 text-amber-200 hover:bg-amber-500/10"
            >
              <Download className="h-3.5 w-3.5" />
              Encyclopédie PDF
            </a>
            <a
              href={`/docs/${docFile ?? `codex-${slug}.md`}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/10"
            >
              <FileText className="h-3.5 w-3.5" />
              Markdown brut
            </a>
          </div>
        </div>

        <SymbolicDisclaimer className="mb-6" variant={disclaimerVariant ?? "default"} />

        {loading && (
          <p className="text-sm text-white/50 animate-pulse flex items-center gap-2">
            <Sparkles className={cn("h-4 w-4", theme.accent)} />
            Chargement du codex…
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400">
            Impossible de charger le document ({error}). Vérifier{" "}
            <code className="text-xs">public/docs/{docFile ?? `codex-${slug}.md`}</code>.
          </p>
        )}

        {!loading && !error && (
          <article
            className={cn(
              "prose-circulai-responsive rounded-2xl border p-4 sm:p-8 bg-black/40 backdrop-blur-sm",
              theme.border,
              theme.prose
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
