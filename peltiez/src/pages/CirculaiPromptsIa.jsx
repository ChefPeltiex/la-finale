import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import CodexCopyBlock from "@/components/codex/CodexCopyBlock";
import {
  CIRCULAI_PROMPTS_COPY,
  PROMPT_GUARDRAIL,
  PROMPT_SOURCES,
} from "@/data/circulaiPrompts";
import { CIRCULAI_BRAND, SITE_ORIGIN } from "@/lib/site";
import { Button } from "@/components/ui/button";

export default function CirculaiPromptsIa() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-950/20 via-zinc-950 to-black text-white pb-16">
      <div className="container max-w-3xl py-10 px-4">
        <SEOMeta
          title={`Prompts IA — ${CIRCULAI_BRAND}`}
          description="Méta-prompt, challenger, mairie, seconde main, encyclopédie — adaptés Québec, ton humble."
          canonicalUrl={`${SITE_ORIGIN}/circulai/prompts-ia`}
        />

        <Link to="/codex-metaphores" className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Codex métaphores
        </Link>

        <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400">Outils · pas magie</p>
        <h1 className="mt-2 text-3xl font-bold">Prompts IA pour ton projet</h1>
        <p className="mt-3 text-white/70 leading-relaxed">
          Inspirés d&apos;articles pros (liens ci-dessous), recalibrés pour CirculAI et Egor69 — avec la ligne rouge intégrée.
        </p>

        <section className="mt-8 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
          <h2 className="text-sm font-bold text-amber-200">Garde-fou — coller en tête de chat</h2>
          <CodexCopyBlock title="Garde-fou" audience="Toujours" body={PROMPT_GUARDRAIL} />
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-bold text-sky-200">10 prompts prêts à copier</h2>
          {CIRCULAI_PROMPTS_COPY.map((p) => (
            <CodexCopyBlock
              key={p.id}
              title={p.title}
              audience={`${p.tag} · ${p.source}`}
              body={p.body}
            />
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">Sources web</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {PROMPT_SOURCES.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-300 hover:underline inline-flex items-center gap-1"
                >
                  {s.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="border-white/20 rounded-xl">
            <a href="/docs/circulai/prompts-ia-guide.md" download>
              Télécharger le .md
            </a>
          </Button>
          <Button asChild className="bg-sky-600 hover:bg-sky-500 rounded-xl">
            <Link to="/docs/circulai-kit-regional">Kit régional</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/encyclopedie">
              <BookOpen className="h-4 w-4 mr-2" />
              Encyclopédie
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
