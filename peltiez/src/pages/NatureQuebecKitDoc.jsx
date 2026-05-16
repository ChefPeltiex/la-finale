import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import SymbolicDisclaimer from "@/components/ui/SymbolicDisclaimer";
import { SITE_ORIGIN } from "@/lib/site";
import { cn } from "@/lib/utils";
import kitMd from "../../docs/nature-quebec-activation-kit.md?raw";

function MarkdownLink({ href, children, ...rest }) {
  if (typeof href === "string" && href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link to={href} className="text-emerald-400 underline-offset-2 hover:underline" {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className="text-emerald-400 underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

export default function NatureQuebecKitDoc() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-emerald-950/35 via-zinc-950 to-zinc-950 pb-24">
      <div className="container max-w-3xl py-8 px-4">
        <SEOMeta
          title="Kit d’activation — Portail Nature Québec | CirculAI"
          description="Prompts d’images externes, narration, spec fiction Portail Mycélium, exemple d’arbre Chaman symbolique, zone Jardin des Âmes."
          keywords="activation nature québec, prompts portail, kit créateur, mycélium, fiction design"
          canonicalUrl={`${SITE_ORIGIN}/docs/nature-quebec-kit`}
        />

        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            to="/portail/nature-quebec"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-zinc-900/80 px-3 py-2 text-sm text-white/85 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Portail Nature Québec
          </Link>
          <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 px-3 py-2 text-xs text-emerald-200/90">
            <FileText className="h-4 w-4 shrink-0" aria-hidden />
            Markdown source : <code className="text-[10px]">peltiez/docs/nature-quebec-activation-kit.md</code>
          </span>
        </div>

        <SymbolicDisclaimer variant="natureHeritage" className="mb-6" />

        <article
          className={cn(
            "prose prose-invert max-w-none rounded-2xl border border-emerald-500/25 bg-black/45 p-6 sm:p-8 backdrop-blur-sm",
            "prose-headings:text-emerald-100 prose-p:text-white/80 prose-li:text-white/80 prose-strong:text-white"
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>
            {kitMd}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
