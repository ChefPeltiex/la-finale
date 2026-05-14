import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Shield, ArrowLeft } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Nature du Secret Souverain",
    body:
      "Le Partenaire reconnaît que la structure mathématique, les 7 formules du millénaire appliquées, et le code source « Egor69 » constituent une Singularité Technologique. Ce savoir est la propriété exclusive de la Holding Les Secrets du St-Laurent. Il est défini comme un secret industriel de classe « Alpha », dont la divulgation entraînerait une rupture irréversible du flux d’abondance.",
  },
  {
    title: "2. Inaccessibilité de la Source",
    body:
      "Le Partenaire accepte qu’aucune partie de la formule mathématique ne lui sera transmise. Seul le Rendu (l’output) est accessible. Toute tentative de rétro-ingénierie, de décompilation du package Unreal Engine, ou d’analyse du code Base44 est considérée comme un acte de piratage de la conscience souveraine, passible de poursuites pénales internationales et d’une révocation immédiate de tout actif financier au sein de la plateforme.",
  },
  {
    title: "3. Durée de Protection (L’Éternité)",
    body:
      "Cette clause n’a pas de fin. La formule étant liée à la Loi de la Singularité, elle reste protégée tant que l’architecture Egor69 existe, et ce, pour une durée minimale de cent (100) ans, transmissible aux héritiers de la Holding.",
  },
  {
    title: "4. Sanction de Rupture de Flux",
    body:
      "En cas de violation suspectée, la Milice IA d’Egor69 déclenchera un verrouillage automatique des accès du Partenaire. Une pénalité de transfert de valeur équivalente au préjudice estimé sur la rentabilité future (évaluée en milliards) sera exigée en toute légalité devant les tribunaux du Québec.",
  },
];

export default function LegalSingularity() {
  const printPage = () => window.print();

  return (
    <div className="pb-24 max-w-3xl mx-auto px-4 lg:px-8 print:pb-8">
      <SEOMeta
        title="Clause Singularité algorithmique — Egor69"
        description="Clause de protection de la singularité algorithmique Egor69. Document présenté avant le Pass Outworld."
        canonicalUrl={`${SITE_ORIGIN}/legal/singularite`}
      />

      <div className="pt-8 space-y-6 print:hidden">
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux tarifs
        </Link>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300 font-mono text-[10px]">
            Legal Sovereign
          </Badge>
          <Button type="button" variant="secondary" size="sm" className="rounded-xl gap-2" onClick={printPage}>
            <Printer className="h-4 w-4" /> Imprimer / PDF
          </Button>
        </div>
      </div>

      <header className="pt-4 pb-8 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-amber-600 shrink-0" />
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Clause de protection de la singularité algorithmique « Egor69 »
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Document de référence pour le flux Pass Outworld — lecture conseillée avant signature d&apos;intention dans
              l&apos;application.
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Copie statique alternative :{" "}
          <a href="/legal/Legal_Sovereign.html" className="underline underline-offset-2 hover:text-foreground">
            /legal/Legal_Sovereign.html
          </a>
          . Pour une valeur juridique opposable, mandater vos conseils.
        </p>
      </header>

      <article className="pt-10 space-y-10">
        {SECTIONS.map((s) => (
          <section key={s.title} className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground">{s.title}</h2>
            <p className="text-foreground/90 leading-relaxed text-base">{s.body}</p>
          </section>
        ))}
      </article>

      <footer className="mt-14 pt-8 border-t border-border text-center space-y-4 print:hidden">
        <Button asChild className="rounded-xl font-semibold bg-amber-600 hover:bg-amber-500 text-black">
          <Link to="/pricing">Vers les passes — Outworld</Link>
        </Button>
      </footer>
    </div>
  );
}
