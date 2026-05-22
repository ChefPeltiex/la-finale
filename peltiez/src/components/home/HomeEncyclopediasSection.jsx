import { Link } from "react-router-dom";
import {
  BookOpen,
  ScrollText,
  Briefcase,
  Flame,
  Download,
  ArrowRight,
  ExternalLink,
  Network,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useDisplayMode from "@/hooks/useDisplayMode";
import { Button } from "@/components/ui/button";

const EDITIONS = [
  {
    id: "pdf",
    icon: BookOpen,
    label: "Aperçu encyclopédie (PDF)",
    labelSimple: "Aperçu PDF",
    desc: "PDF maître ≥1000 p. — 7 tomes, 126 fiches (loisirs & sports inclus), A4.",
    href: "/encyclopedie.pdf",
    external: true,
    download: false,
  },
  {
    id: "hub-tomes",
    icon: BookOpen,
    label: "Hub téléchargements · 7 tomes",
    labelSimple: "7 tomes PDF",
    desc: "Contenant, dos fondateur, index — page /encyclopedie.",
    to: "/encyclopedie",
  },
  {
    id: "pdf-complet",
    icon: BookOpen,
    label: "Édition complète · 19 $ CA",
    labelSimple: "Édition complète",
    desc: "PDF assemblé complet — soutien direct au projet CirculAI.",
    to: "/boutique?product=encyclopedie-complete",
  },
  {
    id: "magique",
    icon: ScrollText,
    label: "Codex magique · companion",
    labelSimple: "Codex",
    desc: "Texte source, formules et index des planches (companion).",
    to: "/docs/magique",
  },
  {
    id: "preuves",
    icon: ShieldCheck,
    label: "Preuves en 2 minutes",
    labelSimple: "Preuves",
    desc: "Checklist vérifiable : site, PDF, GitHub, Codex — sans croire sur parole.",
    to: "/docs/preuves",
  },
  {
    id: "investisseur",
    icon: Briefcase,
    label: "Édition investisseur",
    labelSimple: "Investisseur",
    desc: "Résumé exécutif, traction et pilote 90 jours.",
    to: "/docs/investisseur",
  },
  {
    id: "rituel",
    icon: Flame,
    label: "Édition rituel",
    labelSimple: "Rituel",
    desc: "Rituels courts, respiration et pratique personnelle.",
    to: "/docs/rituel",
  },
  {
    id: "alliance",
    icon: Network,
    label: "Alliance IA · OMÉGA",
    labelSimple: "Alliance IA",
    desc: "Orchestration multi-agents, protocole Φ et ponts techniques.",
    to: "/docs/alliance",
  },
];

function EditionTile({ edition, simple }) {
  const Icon = edition.icon;
  const title = simple ? edition.labelSimple : edition.label;

  const tileClass = cn(
    "pilot-card group flex flex-col p-5 transition-all duration-300",
    "hover:border-[#FFD700]/55 hover:shadow-[0_0_24px_rgba(255,215,0,0.12)] hover:-translate-y-0.5"
  );

  const inner = (
    <>
      <Icon className="h-7 w-7 text-[#FFD700] mb-3" aria-hidden />
      <h3 className="font-display font-bold text-base text-white leading-snug">{title}</h3>
      <p className="text-xs text-white/55 mt-1.5 leading-relaxed flex-1">{edition.desc}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#FFD700]/90 group-hover:text-[#FFD700]">
        {edition.external ? "Ouvrir" : "Lire"}
        {edition.external ? (
          <ExternalLink className="h-3.5 w-3.5" />
        ) : (
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        )}
      </span>
    </>
  );

  if (edition.href) {
    const isLargePdf = edition.href.endsWith(".pdf");
    return (
      <a
        href={edition.href}
        {...(edition.download && !isLargePdf ? { download: "encyclopedie.pdf" } : {})}
        target={edition.external || isLargePdf ? "_blank" : undefined}
        rel={edition.external || isLargePdf ? "noopener noreferrer" : undefined}
        className={tileClass}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link to={edition.to} className={tileClass}>
      {inner}
    </Link>
  );
}

export default function HomeEncyclopediasSection() {
  const { simple } = useDisplayMode();

  return (
    <section
      id="accueil-encyclopedies"
      className="scroll-mt-28 lg:scroll-mt-8 max-w-6xl mx-auto px-4 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-6 sm:p-8 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 15% 20%, rgba(255,215,0,0.12), transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(57,255,20,0.06), transparent 45%)",
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]/90 mb-2">
                {simple ? "Codex" : "Savoirs · CirculAI"}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                {simple ? "Encyclopédies" : "Encyclopédies & Codex"}
              </h2>
              <p className="text-sm text-white/60 mt-2 max-w-xl">
                {simple
                  ? "Aperçu gratuit et édition complète — Codex en ligne."
                  : "Aperçu PDF gratuit, édition complète à prix accessible, Codex investisseur & rituel — sans promesse creuse."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-2 border-[#FFD700]/70 bg-black font-bold text-amber-100 shadow-[0_0_28px_rgba(255,215,0,0.15)] hover:border-[#FFD700] hover:bg-zinc-950"
              >
                <a
                  href="/encyclopedie.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Download className="h-4 w-4 text-[#FFD700]" aria-hidden />
                  {simple ? "Aperçu gratuit" : "Aperçu gratuit (PDF)"}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-xl border-0 bg-emerald-600 font-bold text-white hover:bg-emerald-500"
              >
                <Link to="/boutique?product=encyclopedie-complete" className="inline-flex items-center gap-2">
                  {simple ? "Édition complète" : "Édition complète · 19 $ CA"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-[11px] text-amber-200/75 mb-4 max-w-2xl leading-relaxed">
            <Link to="/encyclopedie" className="text-[#FFD700] hover:underline">
              Hub encyclopédie
            </Link>
            {" "}· PDF maître <span className="font-mono text-[10px]">encyclopedie.pdf</span> + tomes I–VII ·
            soutien boutique (19&nbsp;$ CA) optionnel.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {EDITIONS.map((edition) => (
              <EditionTile key={edition.id} edition={edition} simple={simple} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
