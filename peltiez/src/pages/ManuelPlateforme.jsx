import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN } from "@/lib/site";
import {
  PLATFORM_INVARIANTS,
  THREE_EXPERIENCE_REALMS,
  QUALITY_GATES,
  FINISHING_GRIMOIRE,
} from "@/lib/platformCore";
import manualMd from "@/content/manuel-utilisation-igor.md?raw";
import { BookOpen, Compass, ShieldCheck, Sparkles, Landmark } from "lucide-react";

export default function ManuelPlateforme() {
  return (
    <div className="container max-w-3xl py-8 pb-24">
      <SEOMeta
        title="Manuel d'utilisation — Egor69"
        description="Guide clair : navigation, Verse 3D, portails, XP, Mon univers, UEAIOUY, dépannage — plateforme Peltiez."
        canonicalUrl={`${SITE_ORIGIN}/manuel`}
      />
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-border bg-card/40 px-4 py-3">
        <BookOpen className="h-8 w-8 text-emerald-400 shrink-0" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Documentation utilisateur</p>
          <p className="text-sm text-muted-foreground">
            Images servies depuis <code className="rounded bg-muted px-1">/manual/</code> — rechargement dur (Ctrl+Shift+R) si une image ne
            s’affiche pas après déploiement.
          </p>
        </div>
      </div>

      <section className="mb-10 space-y-4 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-card to-emerald-500/5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Compass className="h-5 w-5 text-amber-400" />
          <h2 className="font-display text-lg font-bold text-foreground">Squelette vivant — invariants & royaumes</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Référence courte pour aligner le développement et la narration : même socle technique et éthique partout. Les détails longs restent dans la
          charte (<Link to="/charte" className="text-primary underline-offset-2 hover:underline">/charte</Link>) et la{" "}
          <Link to="/carte-site" className="text-primary underline-offset-2 hover:underline">carte du site</Link>.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Invariants</p>
            </div>
            <ul className="list-inside list-disc space-y-1.5 text-xs text-muted-foreground">
              {PLATFORM_INVARIANTS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Trois couches routées</p>
            </div>
            <ul className="space-y-2 text-xs">
              {THREE_EXPERIENCE_REALMS.map((r) => (
                <li key={r.id}>
                  <Link to={r.path} className="font-semibold text-primary hover:underline">
                    {r.label}
                  </Link>
                  <span className="text-muted-foreground"> — {r.intent}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Jalons qualité (équipe)</p>
          <ul className="space-y-1.5 font-mono text-[11px] text-muted-foreground sm:text-xs">
            {QUALITY_GATES.map((g) => (
              <li key={g.command}>
                <code className="rounded bg-muted px-1 py-0.5 text-foreground">{g.command}</code> — {g.detail}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-10 space-y-3 rounded-2xl border border-slate-500/25 bg-gradient-to-br from-slate-900/40 via-card to-amber-900/10 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Landmark className="h-5 w-5 text-amber-500/90" aria-hidden />
          <h2 className="font-display text-lg font-bold text-foreground">{FINISHING_GRIMOIRE.title}</h2>
        </div>
        <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
          {FINISHING_GRIMOIRE.lines.map((line, idx) => (
            <li key={idx} className="border-l-2 border-amber-500/35 pl-3">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <article className="prose prose-invert prose-img:rounded-xl prose-img:border prose-img:border-border prose-headings:scroll-mt-24 max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{manualMd}</ReactMarkdown>
      </article>
    </div>
  );
}
