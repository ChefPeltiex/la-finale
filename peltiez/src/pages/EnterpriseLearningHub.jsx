import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FoundationBeamLedger from "@/components/FoundationBeamLedger";
import {
  MASTER_BEAM_META,
  CAREER_SIMULATIONS,
  SCHOOL_SUBJECT_STRANDS,
} from "@/data/masterBeamFoundation";
import { SITE_ORIGIN } from "@/lib/site";
import { Building2, GraduationCap, Layers, Sparkles, KeyRound } from "lucide-react";
import { useState } from "react";

export default function EnterpriseLearningHub() {
  const [showLore, setShowLore] = useState(false);

  const careerColumns = [
    { key: "role", label: "Rôle simulé" },
    { key: "sector", label: "Secteur" },
    { key: "enterpriseType", label: "Type org." },
    { key: "durationMin", label: "Durée (min)" },
    { key: "skills", label: "Compétences clés" },
    { key: "eduMatieres", label: "Matières liées" },
  ];

  const careerRows = CAREER_SIMULATIONS.map((c) => ({
    ...c,
    durationMin: String(c.durationMin),
  }));

  const subjectColumns = [
    { key: "label", label: "Axe" },
    { key: "focus", label: "Focus Egor69" },
    { key: "linkedCareers", label: "IDs simulations liées" },
  ];

  const subjectRows = SCHOOL_SUBJECT_STRANDS.map((s) => ({
    ...s,
    linkedCareers: s.linkedCareers.join(", "),
  }));

  return (
    <div className="pb-24 max-w-6xl mx-auto px-4 space-y-12">
      <SEOMeta
        title="Hub entreprises & éducation — simulations métiers & poutre maîtresse"
        description="Simulations virtuelles de métiers pour organisations variées, matières scolaires croisées, registre central versionné (poutre maîtresse). Fiction narrative séparée de la réalité technique."
        keywords="igor entreprises, simulation métier, éducation, données centralisées"
        canonicalUrl={`${SITE_ORIGIN}/hub-fondations`}
      />

      <header className="pt-10 space-y-4">
        <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-300">
          Entreprises · formation · grille unique
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">
          Atelier des fondations — entreprises & savoirs
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
          Simulations de métiers pour imaginer des parcours pro dans l&apos;économie circulaire et l&apos;ESS ; croisement avec les
          matières scolaires pour donner du contexte réel aux leçons — le tout indexé dans la{" "}
          <strong className="text-foreground">{MASTER_BEAM_META.title}</strong>, un registre unique dans le code (pas une base SQL
          exposée ici).
        </p>
      </header>

      <section className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/5 to-purple-500/5 p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <Layers className="h-8 w-8 text-primary shrink-0 mt-1" />
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">{MASTER_BEAM_META.title}</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{MASTER_BEAM_META.subtitle}</p>
            <p className="text-sm text-foreground/85 mt-3 leading-relaxed border-l-2 border-primary/40 pl-3">
              <strong>Réalité technique :</strong> {MASTER_BEAM_META.technicalTruth}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button type="button" variant="outline" size="sm" className="rounded-lg gap-1" onClick={() => setShowLore((v) => !v)}>
                <Sparkles className="h-4 w-4" />
                {showLore ? "Masquer" : "Voir"} la métaphore narrative
              </Button>
              <Button asChild variant="ghost" size="sm" className="rounded-lg gap-1">
                <Link to="/security">
                  <KeyRound className="h-4 w-4" />
                  Clés & sécurité réelle
                </Link>
              </Button>
            </div>
            {showLore && (
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-4 text-sm space-y-2">
                <p className="text-foreground/90 italic">{MASTER_BEAM_META.loreMetaphor}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  Constantes fiction : π ≈ {MASTER_BEAM_META.constants.piEcho} · tour « lore » {MASTER_BEAM_META.constants.towerHeightKmLore}{" "}
                  km — pure fantaisie, pas une mesure d&apos;infra.
                </p>
                <p className="text-xs text-muted-foreground">
                  Dominic Pelletier — gardien de porte dans la narration Egor69 : les vraies clés sont les secrets d&apos;env et la
                  charte ; si tu as « perdu les clés », change les tokens et relis la doc Stripe.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-sky-600" />
          <h2 className="font-display text-2xl font-bold">Simulations virtuelles de métiers</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Chaque ligne est une capsule pour jouer la journée type : entreprise associée = contexte, pas un contrat réel.
        </p>
        <FoundationBeamLedger
          title="Registre métiers — poutre maîtresse"
          columns={careerColumns}
          rows={careerRows}
          footnote="Export CSV futur : même schéma pour éviter les tables divergentes."
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-violet-600" />
          <h2 className="font-display text-2xl font-bold">Aspects éducatifs & matières</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Volet scolaire transversal : pas un programme ministériel officiel, mais des ponts vers les simulations ci-dessus.
        </p>
        <FoundationBeamLedger
          title="Axes disciplinaires — même classeur"
          columns={subjectColumns}
          rows={subjectRows}
          footnote="Les IDs relient explicitement aux lignes métiers pour audits pédagogiques internes."
        />
      </section>

      <footer className="flex flex-wrap gap-3 pt-8 border-t border-border">
        <Button asChild className="rounded-xl">
          <Link to="/partenaires">Partenaires entreprises</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/fast-track">FastTrack</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/tutorials">Tutoriels</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/charte">Charte</Link>
        </Button>
      </footer>
    </div>
  );
}
