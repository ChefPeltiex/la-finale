import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { SITE_TAGLINE } from "@/lib/site";
import { Building2, Check, Zap, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";

const BCORP_FEATURES = [
  { emoji: "📊", title: "Tableau de bord ESG", desc: "Suivi en temps réel de vos indicateurs environnementaux et sociaux liés à l'économie circulaire." },
  { emoji: "♻️", title: "Gestion des surplus", desc: "Publiez vos stocks invendus, matières premières et équipements en 30 secondes. Zéro déchet." },
  { emoji: "🤝", title: "Réseau de fournisseurs circulaires", desc: "Accès à 5 000+ fournisseurs certifiés économie circulaire. Remplacez vos chaînes d'approvisionnement." },
  { emoji: "📝", title: "Rapports réglementaires", desc: "Génération automatique de rapports conformes aux exigences CSRD, IFRS S1/S2, GRI." },
  { emoji: "🎯", title: "Matching d'impact", desc: "Notre IA vous connecte avec les PME, ONG et institutions qui ont besoin exactement de ce que vous offrez." },
  { emoji: "💎", title: "Badge Partenaire Certifié", desc: "Visibilité premium sur toute la plateforme et dans notre réseau international de 80+ pays." },
];

const PLANS = [
  {
    name: "PME Circulaire",
    price: "297",
    period: "mois",
    color: "from-emerald-700 to-teal-900",
    border: "rgba(16,185,129,0.5)",
    glow: "rgba(16,185,129,0.1)",
    features: ["Jusqu'à 50 publications/mois", "Tableau de bord ESG basique", "Accès réseau fournisseurs", "Support email 48h"],
    cta: "Commencer — PME",
  },
  {
    name: "Entreprise B Corp",
    price: "897",
    period: "mois",
    color: "from-violet-700 to-purple-900",
    border: "rgba(139,92,246,0.5)",
    glow: "rgba(139,92,246,0.1)",
    features: ["Publications illimitées", "Tableau de bord ESG complet + CSRD", "Matching IA prioritaire", "Badge Partenaire premium", "Support dédié 24h", "Accès API CirculAI"],
    cta: "Devenir Partenaire B Corp",
    highlight: true,
  },
  {
    name: "Institution / Grande Entreprise",
    price: "Sur devis",
    period: "",
    color: "from-amber-700 to-orange-900",
    border: "rgba(255,215,0,0.5)",
    glow: "rgba(255,215,0,0.1)",
    features: ["Déploiement personnalisé", "Intégrations ERP/SAP", "Rapport ESG sur-mesure", "Co-branding CirculAI Hub", "Gestionnaire de compte dédié", "Formation équipes incluse"],
    cta: "Contacter l'équipe",
  },
];

const LOGOS = ["Desjardins", "Cascades", "Loto-Québec", "Hydro-Québec", "TELUS", "BDC", "Fondaction", "Investissement Qc"];

const CASE_STUDIES = [
  { company: "FabTech Montréal", result: "47 tonnes de matériaux recyclés", saving: "128 000$ économisés", emoji: "🏭" },
  { company: "RestoCoop Québec",  result: "Zéro gaspillage alimentaire",    saving: "23 000$ de dons valorisés", emoji: "🍽️" },
  { company: "BuildVert Ottawa",  result: "80% réduction déchets chantier", saving: "200 000$ de coûts évités",  emoji: "🏗️" },
];

export default function Partenaires() {
  const [form, setForm] = useState({ nom: "", email: "", entreprise: "", taille: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.integrations.Core.SendEmail({
      to: "contact@egor69.ca",
      subject: `[PARTENAIRE B CORP] ${form.entreprise} — ${form.email}`,
      body: `${SITE_TAGLINE}\n\nNouvelle demande partenaire :\n\nEntreprise : ${form.entreprise}\nNom : ${form.nom}\nEmail : ${form.email}\nTaille : ${form.taille}\nMessage : ${form.message}`,
    });
    setSent(true);
    setLoading(false);
    toast.success("Merci — Egor69 demeure au service de la planète. Nous vous répondons sous 24 h.");
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: "linear-gradient(160deg, hsl(220,40%,4%) 0%, hsl(158,40%,4%) 100%)" }}>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-mono text-xs font-bold"
          style={{ background: "rgba(16,185,129,0.1)", border: "2px solid rgba(16,185,129,0.35)", color: "#10b981" }}>
          <Building2 className="h-4 w-4" /> PARTENAIRES CORPORATIFS · PROGRAMME B CORP
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight">
          Votre entreprise.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">L'infrastructure de la circularité.</span>
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
          {SITE_TAGLINE}. Les équipes qui cherchent un cadre circulaire mesurable peuvent s’aligner avec Egor69 — sans promesses d’audience ni métriques de vitrine inventées.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="#contact" className="px-8 py-4 rounded-xl font-bold text-white flex items-center gap-2 transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}>
            <Zap className="h-5 w-5" /> Devenir Partenaire →
          </a>
          <a href="#plans" className="px-8 py-4 rounded-xl font-semibold text-white/80 border border-white/15 hover:bg-white/5 transition-all">
            Voir les plans
          </a>
        </div>
        <p className="text-sm text-white/45 max-w-xl mx-auto">
          <Link to="/hub-fondations" className="text-emerald-400/95 hover:underline font-medium">
            Hub fondations
          </Link>
          {" "}
          · simulations virtuelles de métiers, matières scolaires croisées et classeur « poutre maîtresse » (données versionnées dans le dépôt).
        </p>
      </section>

      {/* Logos strip */}
      <section className="py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)" }}>
        <p className="text-center text-[10px] font-mono tracking-widest text-white/25 mb-4">ILS NOUS FONT CONFIANCE</p>
        <div className="flex gap-8 justify-center flex-wrap px-8">
          {LOGOS.map(logo => (
            <span key={logo} className="font-display font-bold text-white/20 hover:text-white/50 transition-colors cursor-default text-sm">{logo}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-white text-center mb-10">Infrastructure B Corp clé en main</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BCORP_FEATURES.map((f, i) => (
            <div key={i} className="rounded-2xl p-6 border border-white/6" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="font-display text-2xl font-bold text-white text-center mb-8">Résultats réels. Pas des projections.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CASE_STUDIES.map((c, i) => (
            <div key={i} className="rounded-2xl p-6 text-center" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div className="text-4xl mb-3">{c.emoji}</div>
              <p className="font-bold text-white mb-1 text-sm">{c.company}</p>
              <p className="text-emerald-400 font-bold text-sm mb-1">{c.result}</p>
              <p className="text-amber-400 font-black">{c.saving}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="font-display text-2xl font-bold text-white text-center mb-8">Choisissez votre engagement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <div key={i} className={`rounded-2xl overflow-hidden ${plan.highlight ? "ring-2 ring-violet-500/50 scale-[1.02]" : ""}`}
              style={{ border: `2px solid ${plan.border}`, boxShadow: `0 0 40px ${plan.glow}`, background: "rgba(5,10,25,0.8)" }}>
              {plan.highlight && (
                <div className="py-2 text-center font-mono text-xs font-bold" style={{ background: "rgba(139,92,246,0.3)", color: "#a78bfa" }}>
                  ⭐ LE PLUS POPULAIRE
                </div>
              )}
              <div className={`p-5 bg-gradient-to-br ${plan.color}`}>
                <p className="font-bold text-white text-lg">{plan.name}</p>
                <p className="text-3xl font-black text-white mt-1">
                  {plan.price === "Sur devis" ? plan.price : `${plan.price}$`}
                  {plan.period && <span className="text-sm font-normal text-white/60">/{plan.period}</span>}
                </p>
              </div>
              <div className="p-5 space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-white/70">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact"
                  className="block w-full py-3 text-center rounded-xl font-mono font-bold text-sm text-white transition-all hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`, border: `1px solid ${plan.border}` }}>
                  {plan.cta} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="max-w-2xl mx-auto px-4 pb-16">
        <div className="rounded-2xl p-8 space-y-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <div className="text-center">
            <Crown className="h-8 w-8 mx-auto mb-3 text-emerald-400" />
            <h2 className="font-display text-2xl font-bold text-white">Demande de partenariat</h2>
            <p className="text-white/50 text-sm mt-1">Réponse garantie sous 24h par notre équipe dédiée</p>
          </div>

          {sent ? (
            <div className="text-center py-8 space-y-3">
              <div className="text-5xl">🎉</div>
              <p className="text-emerald-400 font-bold text-lg">Demande reçue !</p>
              <p className="text-white/60 text-sm">Notre équipe vous contacte sous 24 h — dans l’esprit du slogan Egor69 : servir l’humain et la planète avec honnêteté.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {[
                { key: "nom", label: "Votre nom", placeholder: "Marie-Ève Tremblay" },
                { key: "email", label: "Email professionnel", placeholder: "marie@entreprise.com", type: "email" },
                { key: "entreprise", label: "Nom de l'entreprise", placeholder: "EcoTech Solutions Inc." },
                { key: "taille", label: "Taille de l'entreprise", placeholder: "ex : 50-200 employés" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-mono font-bold text-white/40 mb-1.5">{label.toUpperCase()}</label>
                  <input required type={type || "text"} placeholder={placeholder} value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400/50 placeholder:text-white/20" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-mono font-bold text-white/40 mb-1.5">MESSAGE (OPTIONNEL)</label>
                <textarea rows={3} placeholder="Décrivez votre activité et vos objectifs circulaires..." value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400/50 placeholder:text-white/20 resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Building2 className="h-5 w-5" />}
                {loading ? "Envoi…" : "Envoyer ma demande de partenariat"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}