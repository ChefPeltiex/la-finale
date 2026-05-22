import { Link } from "react-router-dom";
import { Download, BookOpen, Printer, Network } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import { Button } from "@/components/ui/button";

const TOMES = [
  { n: "I", file: "tome-I.pdf", label: "L'Être · héros" },
  { n: "II", file: "tome-II.pdf", label: "3 Natures" },
  { n: "III", file: "tome-III.pdf", label: "CirculAI" },
  { n: "IV", file: "tome-IV.pdf", label: "Egor69" },
  { n: "V", file: "tome-V.pdf", label: "Québec" },
  { n: "VI", file: "tome-VI.pdf", label: "Codex & systèmes" },
  { n: "VII", file: "tome-VII.pdf", label: "Atlas · index" },
];

export default function EncyclopedieHub() {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10 max-w-3xl mx-auto">
      <SEOMeta
        title="Encyclopédie Totale — Téléchargements PDF | Egor69"
        description="PDF maître et 7 tomes — imprimable, maillage 108 fiches, dont vous êtes le héros."
        canonicalUrl="/encyclopedie"
      />
      <p className="text-[#FFD700] text-xs font-semibold tracking-widest uppercase mb-2">Contenant des sept tomes</p>
      <h1 className="font-display text-3xl font-bold text-white mb-3">Encyclopédie Totale</h1>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        Dont vous êtes le héros — atlas hybride CirculAI &amp; Egor69. Téléchargez le PDF maître pour l&apos;impression
        (A4) ou un tome à la fois.
      </p>
      <Link
        to="/encyclopedie"
        className="inline-block text-[#FFD700] text-sm font-semibold hover:underline mb-8"
      >
        ← Retour à la lecture illustrée (12 planches)
      </Link>

      <div className="rounded-2xl border border-[#FFD700]/30 bg-card/80 p-6 mb-8">
        <BookOpen className="h-8 w-8 text-[#FFD700] mb-3" aria-hidden />
        <h2 className="font-bold text-lg text-white mb-2">PDF maître (contenant)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Couverture face &amp; dos (histoire Dominic), volumes, maillage, planches, index — cible ≥ 1000 pages.
        </p>
        <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          <a href="/encyclopedie.pdf" download="encyclopedie-totale.pdf" target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" />
            Télécharger encyclopédie.pdf
          </a>
        </Button>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <Printer className="h-3.5 w-3.5" />
          Notice d&apos;impression incluse en tête d&apos;annexe dans le PDF maître.
        </p>
      </div>

      <h2 className="font-bold text-white mb-3 flex items-center gap-2">
        <Network className="h-5 w-5 text-[#FFD700]" />
        Sept tomes (PDF séparés)
      </h2>
      <ul className="space-y-2 mb-8">
        {TOMES.map((t) => (
          <li key={t.n}>
            <a
              href={`/encyclopedie/${t.file}`}
              download={t.file}
              className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 hover:border-[#FFD700]/40 transition"
            >
              <span className="text-sm">
                <span className="text-[#FFD700] font-mono mr-2">Tome {t.n}</span>
                {t.label}
              </span>
              <Download className="h-4 w-4 text-[#FFD700]/80" />
            </a>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link to="/entrer" className="text-[#FFD700] hover:underline">
          Deux portes · /entrer
        </Link>
        <Link to="/world" className="text-muted-foreground hover:text-foreground">
          Verse Egor69
        </Link>
        <Link to="/circulai" className="text-muted-foreground hover:text-foreground">
          Kit CirculAI
        </Link>
      </div>
    </div>
  );
}
