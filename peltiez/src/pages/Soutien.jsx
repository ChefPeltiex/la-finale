import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  HeartHandshake,
  Landmark,
  Building2,
  Shield,
  ArrowRight,
  Mail,
  Sparkles,
} from "lucide-react";
import { SITE_ORIGIN, SITE_TAGLINE, SUPPORT_EMAIL } from "@/lib/site";

const cardBase =
  "flex flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-950/90 via-zinc-950/85 to-black/80 p-6 sm:p-8 shadow-xl backdrop-blur-md";

export default function Soutien() {
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Soutien Egor69 — organisation ou partenariat")}`;

  return (
    <div className="space-y-12 pb-20">
      <SEOMeta
        title="Soutenir Egor69"
        description="Freemium de la connaissance, adhésion communautaire et offres territoires — financement aligné avec le mode souverain."
        canonicalUrl={`${SITE_ORIGIN}/soutien`}
        keywords="soutien, abonnement, pricing, atlas vivant, souveraineté, don, Egor69"
      />

      <header className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-violet-950/30 p-8 sm:p-12">
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, rgba(16,185,129,0.25), transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(139,92,246,0.2), transparent 45%)",
          }}
        />
        <div className="relative z-10 max-w-3xl space-y-4">
          <Badge className="bg-emerald-500/15 text-emerald-200 border-emerald-500/30 font-semibold">
            Pérennité · lancement 21 mai
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white leading-tight">
            Soutenir le réseau, sans trahir le cadre
          </h1>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed">
            {SITE_TAGLINE} Ici, tout est regroupé pour particulier, contributeur et organisation : même promesse de
            transparence, pas de publicité invasive comme seul pilier, et une voie claire vers les passes Stripe déjà
            câblés sur la page Pricing.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="rounded-xl font-bold gap-2">
              <Link to="/pricing">
                Voir les passes <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10">
              <Link to="/hub-souverain">Hub souverain</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className={cardBase}>
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30">
            <BookOpen className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="font-display text-xl font-bold text-white">Connaissance · freemium honnête</h2>
          <p className="mt-2 flex-1 text-sm text-white/70 leading-relaxed">
            L’Atlas et les fiches vivantes restent le cœur accessible : le « soin » circule en lecture. Les passes
            (Netherealm, Etherealm, Outworld) ouvrent profondeur, radar et options produit — sans confondre gratuité de
            base et expertise avancée.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button asChild size="sm" variant="secondary" className="rounded-lg">
              <Link to="/atlas?section=fiches-vivantes">Atlas vivant</Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="text-emerald-200 hover:text-white">
              <Link to="/pricing">Passes & tarifs</Link>
            </Button>
          </div>
        </article>

        <article className={cardBase}>
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/35">
            <HeartHandshake className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="font-display text-xl font-bold text-white">Communauté · adhésion & pacte de soin</h2>
          <p className="mt-2 flex-1 text-sm text-white/70 leading-relaxed">
            Adhésion mensuelle existante (parcours Abonnement), badges et priorités selon les paliers. Pour un soutien
            récurrent type « pacte » sans passer par une intégration tierce immédiate, l’e-mail humain reste le filet
            le plus clair — on documente ensuite les flux (Stripe Billing, dons) au fil des releases.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button asChild size="sm" className="rounded-lg font-bold">
              <Link to="/abonnement">Abonnements</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-lg border-white/20 text-white hover:bg-white/10">
              <a href={mailto}>
                <Mail className="mr-2 h-4 w-4 inline" aria-hidden />
                {SUPPORT_EMAIL}
              </a>
            </Button>
          </div>
        </article>

        <article className={cardBase}>
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-100 ring-1 ring-sky-400/35">
            <Building2 className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="font-display text-xl font-bold text-white">Territoires · B2B / B2G</h2>
          <p className="mt-2 flex-1 text-sm text-white/70 leading-relaxed">
            Tableaux de bord, ateliers radar ou exports responsables pour municipalités, associations et entreprises
            locales : c’est une offre à cadrer (données, DPA, SLA). Le premier pas est un échange structuré, pas un
            checkout silencieux.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button asChild size="sm" variant="secondary" className="rounded-lg">
              <Link to="/contact">Contact projet</Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="text-sky-200 hover:text-white">
              <Link to="/hub-fondations">Hub fondations</Link>
            </Button>
          </div>
        </article>
      </section>

      <section
        className="rounded-3xl border border-white/10 p-6 sm:p-8"
        style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(6,78,59,0.25))",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="shrink-0 rounded-2xl bg-white/10 p-3 text-emerald-200">
              <Shield className="h-6 w-6" aria-hidden />
            </div>
            <div className="space-y-2 max-w-2xl">
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Landmark className="h-5 w-5 text-emerald-300" aria-hidden />
                Mode souverain = argument pour les payeurs
              </h2>
              <p className="text-sm text-white/75 leading-relaxed">
                Secrets côté serveur, pas de clés Stripe dans le bundle, HTTPS en production, et documentation sur le
                périmètre données (local vs agrégé). La section Hub souverain et le journal de transparence complètent
                cette lecture pour les décideurs.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button asChild size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/hub-souverain">Noyau souverain</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/transparency-log">Transparence</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center space-y-3">
        <Sparkles className="h-8 w-8 text-amber-300 mx-auto opacity-90" aria-hidden />
        <p className="text-sm text-white/70 max-w-xl mx-auto">
          Cette page est le point d’entrée unique « Soutien » : marketplace pour les objets, ici pour la pérennité du
          service et des contenus. Les chiffres communautaires affichés ailleurs sur la plateforme restent des signaux
          de radar — pas une promesse comptable.
        </p>
        <Button asChild variant="link" className="text-emerald-300">
          <Link to="/">Retour à l’accueil</Link>
        </Button>
      </section>
    </div>
  );
}
