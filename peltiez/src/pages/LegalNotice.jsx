import { Link } from "react-router-dom";
import { Shield, Copyright, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/site";

export default function LegalNotice() {
  return (
    <div className="pb-20 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          ← Retour
        </Link>
        <h1 className="font-display text-4xl font-bold text-foreground flex items-center gap-3">
          <Shield className="h-10 w-10 text-primary" />
          Propriété Intellectuelle
        </h1>
        <p className="text-lg text-muted-foreground">
          {SITE_NAME} est la propriété exclusive et protégée par la loi.
        </p>
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm">
          <span className="font-semibold text-foreground">{SITE_NAME} — Singularité algorithmique · </span>
          <Link to="/legal/singularite" className="text-primary underline underline-offset-2 hover:no-underline">
            Clause Legal Sovereign &amp; Pass Outworld
          </Link>
        </div>
      </div>

      {/* Copyright Notice */}
      <section className="rounded-2xl border-2 border-primary bg-primary/5 p-8 space-y-4">
        <div className="flex items-start gap-3">
          <Copyright className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Avis de Copyright © 2026
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              <strong>{SITE_NAME}</strong> est une création originale, une œuvre de l'esprit, protégée par les lois du Canada et des conventions internationales de propriété intellectuelle.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Tous les droits d'auteur, brevets, marques déposées, secrets commerciaux, et toute autre forme de propriété intellectuelle sont <strong>exclusivement détenus par le créateur et fondateur</strong> de {SITE_NAME}. Aucune cession, transfert, ou partage n'a été consentie envers toute autre personne, entité, ou organisation.
            </p>
          </div>
        </div>
      </section>

      {/* What's Protected */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Éléments Protégés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "Code source et logiciels",
            "Design et interface utilisateur",
            "Architecture système",
            "Base de données et structure",
            "Contenus (textes, images, vidéos)",
            "Stratégies commerciales",
            "Données et analytics",
            "Propriété intellectuelle métier",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
              <span className="text-primary font-bold text-xl">✓</span>
              <span className="text-foreground font-medium">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Unauthorized Use */}
      <section className="rounded-2xl border border-destructive bg-destructive/5 p-8 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-display text-2xl font-bold text-destructive mb-3">
              Utilisation Non Autorisée
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-3">
              L'utilisation, la copie, la modification, la distribution, la reproduction, ou toute appropriation non autorisée de {SITE_NAME} ou de ses composantes est <strong>formellement interdite</strong> et constitue une violation grave des droits d'auteur et des lois de propriété intellectuelle.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Toute violation entraînera des poursuites judiciaires civiles et criminelles conformément aux lois applicables au Québec, au Canada, et aux traités internationaux (ADPIC, WIPO, etc.).
            </p>
          </div>
        </div>
      </section>

      {/* Legal Framework */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Cadre Légal</h2>
        <div className="space-y-3">
          {[
            { title: "Loi sur le droit d'auteur du Canada", desc: "Protection automatique des œuvres originales" },
            { title: "Loi sur les marques de commerce", desc: "Identité visuelle et noms protégés" },
            { title: "Accord ADPIC (OMC)", desc: "Droits de propriété intellectuelle internationaux" },
            { title: "Convention de Berne", desc: "Protection automatique dans 170+ pays" },
            { title: "WIPO (Organisation Mondiale de la Propriété Intellectuelle)", desc: "Reconnaissance et protection globales" },
            { title: "Loi québécoise sur le droit civil", desc: "Protections supplémentaires applicables localement" },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-card rounded-xl border border-border">
              <p className="font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Permitted Use */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Utilisation Autorisée</h2>
        <p className="text-foreground/80">
          {SITE_NAME} est fourni pour une utilisation personnelle et non commerciale exclusive. Les utilisateurs peuvent:
        </p>
        <ul className="space-y-2">
          {[
            "Accéder et utiliser la plateforme selon ses conditions d'utilisation",
            "Consulter le contenu à titre personnel",
            "Participer à la communauté conformément aux règles établies",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-foreground/80">
              <span className="text-primary font-bold mt-0.5">→</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Enforcement */}
      <section className="rounded-2xl border border-border bg-card p-8 space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Mise en Œuvre & Recours</h2>
        <p className="text-foreground/80 leading-relaxed">
          Le créateur se réserve le droit de prendre toute action légale, civile ou criminelle, contre toute partie ayant violé cette propriété intellectuelle, sans avertissement préalable. Les violations peuvent entraîner:
        </p>
        <ul className="space-y-2 mt-3">
          {[
            "Demandes de cessation immédiate (cease & desist)",
            "Poursuites civiles pour dommages et intérêts",
            "Actions criminelles selon les lois applicables",
            "Ordonnances d'injonction",
            "Confiscation et destruction des copies non autorisées",
            "Pénalités financières substantielles",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-foreground/80">
              <span className="text-destructive font-bold">⚖</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section className="rounded-2xl border border-border bg-secondary/30 p-8 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Questions Légales?</h2>
        <p className="text-foreground/80">
          Pour toute question concernant la propriété intellectuelle ou les droits d'utilisation,<br />
          contacte le créateur directement.
        </p>
        <p className="text-xs text-muted-foreground">
          ⚖ © 2026 {SITE_NAME}. Tous droits réservés. | Propriété exclusive protégée par la loi.
        </p>
      </section>

      {/* Back to Home */}
      <div className="text-center">
        <Button asChild size="lg" className="rounded-xl">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
}