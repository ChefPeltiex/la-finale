import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import SymbolicDisclaimer from "@/components/ui/SymbolicDisclaimer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ENTERPRISE_JOURNEY,
  ENTERPRISE_TODAY,
  ENTERPRISE_ROADMAP,
  ENTERPRISE_SECTORS,
} from "@/data/enterpriseOffering";
import { CIRCULAI_BRAND, SITE_ORIGIN, SUPPORT_EMAIL } from "@/lib/site";
import {
  Building2,
  CheckCircle,
  Clock,
  Rocket,
  ArrowRight,
  FileText,
  Shield,
  Sparkles,
} from "lucide-react";

const EMPTY_FORM = {
  company: "",
  projectLabel: "",
  projectIdea: "",
  name: "",
  email: "",
  size: "",
};

function SectionHead({ icon: Icon, iconClass, title }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-6 w-6 ${iconClass}`} />
      <h2 className="font-display text-xl font-bold text-white">{title}</h2>
    </div>
  );
}

function ListItem({ title, desc }) {
  return (
    <div>
      <p className="font-semibold text-white text-sm">{title}</p>
      <p className="text-xs text-white/50 mt-1 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function CorporatePartners() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = [
      `CirculAI — demande entreprise`,
      ``,
      `Entreprise: ${form.company}`,
      `Libellé du projet: ${form.projectLabel}`,
      `Contact: ${form.name} <${form.email}>`,
      `Taille: ${form.size}`,
      ``,
      `Description de l'idée:`,
      form.projectIdea,
    ].join("\n");

    await base44.integrations.Core.SendEmail({
      to: SUPPORT_EMAIL,
      subject: `Projet entreprise — ${form.projectLabel || form.company}`,
      body,
    }).catch(() => {});

    setSent(true);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: "linear-gradient(160deg, hsl(220,30%,5%) 0%, hsl(158,30%,7%) 100%)" }}
    >
      <SEOMeta
        compact
        title={`Entreprises — ${CIRCULAI_BRAND} · pilote & co-construction`}
        description="Déposez votre idée d'entreprise avec son libellé. CirculAI : ce qui est disponible aujourd'hui (pilote 90 jours, hub circulaire) et ce qui est en projection — sans promesses irréalistes."
        keywords="circulai entreprise, pilote 90 jours, économie circulaire québec, PME, co-construction"
        canonicalUrl={`${SITE_ORIGIN}/entreprises`}
      />

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        <header className="text-center space-y-5">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-mono tracking-widest px-4 py-1.5">
            ENTREPRISES · {CIRCULAI_BRAND}
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight">
            Donnez-nous votre idée.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              On la bâtit avec vous.
            </span>
          </h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto leading-relaxed">
            Un libellé, une vision, un pilote mesuré — puis les modules CirculAI déjà en ligne. Pas cinquante logiciels
            dès le premier jour : un hub qui grandit avec votre réalité.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button
              asChild
              size="lg"
              className="rounded-2xl h-12 font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <a href="#projet-entreprise">
                Déposer mon idée <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-2xl h-12 border-white/25 text-white">
              <Link to="/pilote">Voir le pilote 90 jours</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="rounded-2xl h-12 text-white/70">
              <Link to="/docs/preuves">Preuves en 2 min</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="rounded-2xl h-12 text-sky-200/90">
              <Link to="/docs/circulai-kit-regional">
                <FileText className="h-4 w-4 mr-1" aria-hidden />
                Kit pilote régional
              </Link>
            </Button>
          </div>
        </header>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-white text-center">Le parcours en trois temps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ENTERPRISE_JOURNEY.map(({ step, title, desc }) => (
              <div
                key={step}
                className="rounded-2xl p-6 border border-emerald-500/25"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <span className="text-xs font-mono text-emerald-400/90">Étape {step}</span>
                <h3 className="font-bold text-white mt-2 mb-2">{title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl p-6 sm:p-8 border border-emerald-500/35 bg-emerald-950/20 space-y-4">
            <SectionHead icon={CheckCircle} iconClass="text-emerald-400" title="Disponible aujourd'hui" />
            <ul className="space-y-4">
              {ENTERPRISE_TODAY.map(({ title, desc }) => (
                <li key={title} className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden />
                  <ListItem title={title} desc={desc} />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl p-6 sm:p-8 border border-amber-500/25 bg-amber-950/15 space-y-4">
            <SectionHead icon={Clock} iconClass="text-amber-300" title="En projection (avec vous)" />
            <p className="text-sm text-white/50 -mt-2">
              Priorisé après un pilote réussi — pas vendu comme déjà livré.
            </p>
            <ul className="space-y-4">
              {ENTERPRISE_ROADMAP.map(({ title, desc }) => (
                <li key={title} className="flex gap-3">
                  <Rocket className="h-5 w-5 text-amber-300/90 shrink-0 mt-0.5" aria-hidden />
                  <ListItem title={title} desc={desc} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <SymbolicDisclaimer className="border-white/10" />

        <section
          className="rounded-3xl p-8 border border-white/10"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-start gap-3">
            <Shield className="h-8 w-8 text-cyan-300 shrink-0" />
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-white">Ce que nous visons — sans vous mentir</h2>
              <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                Moins de complexité au démarrage : un interlocuteur, un pilote, des preuves. À terme : données
                circulaires mieux structurées, moins de paperasse répétitive grâce à des modèles et checklists assistés
                — toujours avec validation humaine pour le juridique et la conformité.
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                Le meilleur investissement reste le vôtre : du temps pour vous et vos proches. CirculAI ne le promet pas
                par magie ; on le facilite en réduisant la friction opérationnelle, étape par étape.
              </p>
            </div>
          </div>
        </section>

        <section>
          <p className="text-center text-xs font-mono text-white/35 mb-4 tracking-widest uppercase">
            Secteurs que nous accompagnons (exemples)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ENTERPRISE_SECTORS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="text-xl mb-1">{s.emoji}</div>
                <p className="text-[11px] text-white/55 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl p-8 text-center border border-amber-500/25 bg-amber-950/15 space-y-4">
          <Building2 className="h-10 w-10 text-amber-200 mx-auto" />
          <h2 className="font-display text-2xl font-bold text-white">Abonnement entreprise</h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
            Pas de paiement en ligne « tout-en-un » aujourd&apos;hui. Après échange sur votre idée et un pilote cadré, nous
            proposons un forfait selon modules, utilisateurs et accompagnement — objectif : vous faire économiser temps,
            outils redondants et allers-retours inutiles, avec des gains mesurables sur le pilote d&apos;abord.
          </p>
          <p className="text-xs text-white/40 font-mono">
            Les passes sur{" "}
            <Link to="/pricing" className="text-emerald-400/90 underline">
              /pricing
            </Link>{" "}
            servent aux parcours individuels (créateurs, explorateurs).
          </p>
        </section>

        <section
          id="projet-entreprise"
          className="rounded-3xl p-8 sm:p-10 scroll-mt-24"
          style={{ background: "rgba(16,185,129,0.07)", border: "2px solid rgba(16,185,129,0.25)" }}
        >
          <div className="flex items-center gap-2 justify-center mb-2">
            <FileText className="h-6 w-6 text-emerald-400" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-center">
              Déposez votre idée d&apos;entreprise
            </h2>
          </div>
          <p className="text-center text-white/55 text-sm mb-8 max-w-lg mx-auto">
            Libellé court + description. Nous vous répondons pour cadrer le pilote — pas de spam, pas de promesse
            automatique.
          </p>

          {sent ? (
            <div className="text-center space-y-3 py-8">
              <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto" />
              <p className="text-xl font-bold text-white">Projet reçu</p>
              <p className="text-white/60 text-sm">
                Si l&apos;envoi email est configuré, nous avons votre message. Sinon, écrivez-nous à{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-300 underline">
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                <Button asChild className="rounded-xl">
                  <Link to="/pilote">Ouvrir le pilote 90 jours</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/20 text-white">
                  <Link to="/">Accueil</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              {[
                { key: "company", label: "Nom de l'entreprise", placeholder: "Coop / PME / OBNL", required: true },
                {
                  key: "projectLabel",
                  label: "Libellé du projet (court)",
                  placeholder: "Ex: Hub réparation quartier Rosemont",
                  required: true,
                },
                { key: "name", label: "Votre nom", placeholder: "Prénom Nom", required: true },
                {
                  key: "email",
                  label: "Courriel professionnel",
                  placeholder: "vous@entreprise.ca",
                  type: "email",
                  required: true,
                },
                { key: "size", label: "Taille de l'équipe", placeholder: "ex: 5–20 personnes", required: false },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-mono text-white/50 mb-1 block">
                    {f.label}
                    {f.required ? " *" : ""}
                  </label>
                  <input
                    type={f.type || "text"}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) => setForm((v) => ({ ...v, [f.key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/15 outline-none focus:border-emerald-400 placeholder:text-white/25"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-mono text-white/50 mb-1 block">Votre idée (description) *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Que voulez-vous simplifier ? Quels outils remplacez-vous ? Quelles preuves comptent pour vous ?"
                  value={form.projectIdea}
                  onChange={(e) => setForm((v) => ({ ...v, projectIdea: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/15 outline-none focus:border-emerald-400 placeholder:text-white/25 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-mono font-black text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}
              >
                {loading ? "Envoi en cours…" : "Envoyer mon idée — on bâtit ensemble"}
              </button>
            </form>
          )}
        </section>

        <footer className="text-center text-xs text-white/35 pb-8">
          <p className="flex flex-wrap items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <Link to="/hub-fondations" className="text-emerald-400/80 hover:underline">
              Hub fondations
            </Link>
            <span>·</span>
            <Link to="/docs/magique" className="text-emerald-400/80 hover:underline">
              Codex
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
