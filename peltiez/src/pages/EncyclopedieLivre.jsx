import { Link } from "react-router-dom";
import { BookOpen, ChevronDown, Download, Network } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import PlancheHeroCard from "@/components/encyclopedie/PlancheHeroCard";
import { ENCYCLOPEDIE_GRANDS_ARTICLES } from "@/data/encyclopedieGrandsArticles";
import { ENCYCLOPEDIE_VOLUMES } from "@/data/encyclopedieVolumes";
import { Button } from "@/components/ui/button";

export default function EncyclopedieLivre() {
  return (
    <div className="min-h-screen bg-black text-[#F5F0E6]">
      <SEOMeta
        title="Encyclopédie illustrée — Douze planches | Egor69"
        description="Lecture Larousse : images or et noir, textes approfondis, dont vous êtes le héros."
        canonicalUrl="/encyclopedie"
      />

      <header className="relative border-b border-[#D4AF37]/25 px-4 py-14 text-center max-w-4xl mx-auto">
        <p className="text-[#D4AF37] text-xs font-semibold tracking-[0.35em] uppercase mb-3">
          Contenant des sept tomes
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-[#FFD700] uppercase tracking-wide mb-4">
          Encyclopédie Totale
        </h1>
        <p className="text-sm md:text-base text-[#F5F0E6]/75 leading-relaxed max-w-2xl mx-auto">
          Comme un Larousse illustré : chaque chapitre ouvre sur une <strong className="text-[#FFD700] font-normal">planche</strong>,
          puis un article long — terrain CirculAI, rêve Egor69, vous au centre.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          <Link
            to="/entrer"
            className="rounded-full border border-[#D4AF37]/50 px-4 py-2 text-[#FFD700] hover:bg-[#D4AF37]/10 transition"
          >
            Deux portes
          </Link>
          <a
            href="#telechargements"
            className="rounded-full border border-white/15 px-4 py-2 text-[#F5F0E6]/80 hover:border-[#FFD700]/40 transition"
          >
            PDF imprimable
          </a>
          <Link
            to="/codex-metaphores"
            className="rounded-full border border-[#D4AF37]/30 px-4 py-2 text-[#F5F0E6]/80 hover:border-[#FFD700]/50 transition"
          >
            Codex métaphores
          </Link>
        </div>
      </header>

      <section className="px-4 py-8 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-[#D4AF37]/25 bg-zinc-950/80 p-6 text-center">
          <p className="text-xs text-[#D4AF37] uppercase tracking-[0.2em]">Dont vous êtes le héros</p>
          <p className="mt-3 text-sm text-[#F5F0E6]/80 leading-relaxed max-w-xl mx-auto">
            Une planche plein écran, une légende en or, puis l&apos;article — comme un Larousse illustré, pas un mur de texte
            avec une annexe « Résonances » à la fin.
          </p>
          <Link
            to="/encyclopedie/lire/nouvelles-portes"
            className="inline-block mt-4 text-sm text-[#FFD700] hover:underline"
          >
            Commencer par la porte →
          </Link>
        </div>
      </section>

      <section className="px-4 py-6 max-w-6xl mx-auto border-t border-[#D4AF37]/15">
        <h2 className="font-display text-sm text-[#D4AF37] uppercase tracking-wider mb-4">Sept tomes (lecture)</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {ENCYCLOPEDIE_VOLUMES.map((v) => (
            <li key={v.n}>
              <a
                href={v.index}
                className="block rounded-lg border border-white/10 px-3 py-2.5 hover:border-[#FFD700]/40 transition"
              >
                <span className="text-[#FFD700] font-semibold">Tome {v.n}</span>
                <span className="text-[#F5F0E6]/85"> — {v.title}</span>
                <span className="block text-[10px] text-[#F5F0E6]/45 mt-0.5">{v.tag}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 py-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-[#FFD700]" aria-hidden />
          <h2 className="font-display text-lg text-[#FFD700] uppercase tracking-wider">
            Douze grands chapitres
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {ENCYCLOPEDIE_GRANDS_ARTICLES.map((article) => (
            <PlancheHeroCard key={article.id} article={article} />
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-[#F5F0E6]/50 max-w-xl mx-auto">
          Cliquez une carte pour lire l&apos;article complet : planche plein écran, légende dorée, chapitre markdown et maillage 126 fiches.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            to="/encyclopedie/atlas-peano"
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 px-5 py-2.5 text-sm text-[#FFD700] hover:bg-[#D4AF37]/10 transition"
          >
            <Network className="h-4 w-4" />
            Atlas Peano — parcourir les 126 fiches
          </Link>
        </div>
      </section>

      <section className="px-4 py-10 max-w-3xl mx-auto border-t border-[#D4AF37]/15">
        <details className="rounded-2xl border border-emerald-500/25 bg-emerald-950/10">
          <summary className="cursor-pointer list-none px-5 py-4 text-sm text-emerald-200/90 font-medium">
            Vos images à brancher (quand vous les envoyez)
          </summary>
          <div className="px-5 pb-5 text-sm text-[#F5F0E6]/70 space-y-2 leading-relaxed">
            <p>
              Déposez les fichiers dans{" "}
              <code className="text-[#FFD700] text-xs">la finale/assets/codex-encyclopedie-incoming/</code>
            </p>
            <p className="font-mono text-xs text-[#F5F0E6]/50">
              npm run encyclopedie:import-images
              <br />
              npm run encyclopedie:public
            </p>
            <p>
              Table de correspondance :{" "}
              <code className="text-xs">docs/encyclopedie/planches-mapping.json</code> — guide{" "}
              <code className="text-xs">IMPORT-PLANCHES.md</code>
            </p>
          </div>
        </details>
      </section>

      <section id="telechargements" className="px-4 py-12 max-w-3xl mx-auto border-t border-[#D4AF37]/20">
        <details className="group rounded-2xl border border-[#D4AF37]/30 bg-zinc-950/80">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-[#FFD700] font-semibold">
            <span className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Téléchargements PDF (impression)
            </span>
            <ChevronDown className="h-5 w-5 transition group-open:rotate-180" />
          </summary>
          <div className="px-5 pb-5 text-sm text-[#F5F0E6]/70 space-y-4">
            <p>
              Le PDF maître regroupe tomes, maillage et annexes. Pour la lecture à l&apos;écran, préférez les cartes ci-dessus.
            </p>
            <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 w-full sm:w-auto">
              <a href="/encyclopedie.pdf" download="encyclopedie-totale.pdf" target="_blank" rel="noopener noreferrer">
                Télécharger encyclopédie.pdf
              </a>
            </Button>
            <ul className="space-y-2 pt-2">
              {[
                { n: "I", file: "tome-I.pdf" },
                { n: "II", file: "tome-II.pdf" },
                { n: "III", file: "tome-III.pdf" },
                { n: "IV", file: "tome-IV.pdf" },
                { n: "V", file: "tome-V.pdf" },
                { n: "VI", file: "tome-VI.pdf" },
                { n: "VII", file: "tome-VII.pdf" },
              ].map((t) => (
                <li key={t.n}>
                  <a
                    href={`/encyclopedie/${t.file}`}
                    download={t.file}
                    className="flex justify-between rounded-lg border border-white/10 px-3 py-2 hover:border-[#FFD700]/40"
                  >
                    <span>Tome {t.n}</span>
                    <Download className="h-4 w-4 text-[#D4AF37]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </section>
    </div>
  );
}
