import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Globe, Leaf, Shield, Zap, CheckCircle, Users, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { SITE_TAGLINE, SUPPORT_EMAIL } from "@/lib/site";

const BCORP_BENEFITS = [
  { icon: Leaf,        title: "Bilan CO₂ automatisé",      desc: "Rapport mensuel certifié de votre impact circulaire — utilisable pour vos rapports ESG." },
  { icon: Globe,       title: "Vitrine partenaire",  desc: "Page dédiée Egor69 avec badge de confiance — visibilité proportionnelle à votre engagement réel." },
  { icon: Shield,      title: "API privée Egor69",        desc: "Accès aux flux circulaires selon accord — intégration ERP/CRM sur devis." },
  { icon: Users,       title: "Réseau préférentiel",        desc: "Connexion prioritaire avec nos 144K Piliers pour des appels d'offres exclusifs." },
  { icon: TrendingUp,  title: "Dashboard exécutif",         desc: "Tableau de bord en temps réel : tonnes récupérées, coûts évités, ROI circulaire." },
  { icon: Award,       title: "Certification partenaire",         desc: "Badge partenaire Egor69 — reconnaissance proportionnelle à l’engagement mesuré." },
];

const TIERS = [
  {
    name: "Allié Circulaire",
    price: "2 500$ / an",
    spots: 500,
    color: "from-slate-500/20 to-slate-600/20",
    border: "rgba(148,163,184,0.4)",
    perks: ["Vitrine B Corp", "Rapport CO₂ trimestriel", "5 utilisateurs Hub Pro", "Badge partenaire"],
  },
  {
    name: "Partenaire Stratégique",
    price: "9 900$ / an",
    spots: 150,
    color: "from-emerald-600/20 to-teal-600/20",
    border: "rgba(16,185,129,0.5)",
    perks: ["Tout Allié +", "API privée Egor69", "Dashboard exécutif temps réel", "Gestionnaire dédié", "20 utilisateurs Hub Pro"],
    recommended: true,
  },
  {
    name: "Titan Fondateur",
    price: "Sur devis",
    spots: 12,
    color: "from-amber-500/20 to-yellow-600/20",
    border: "rgba(251,191,36,0.6)",
    perks: ["Tout Stratégique +", "Co-branding global", "Siège au Conseil Egor69", "Accès API illimité", "Impact Report publié"],
  },
];

const LOGOS = [
  { name: "Desjardins", cat: "Finance", emoji: "🏦" },
  { name: "Hydro-Québec", cat: "Énergie", emoji: "⚡" },
  { name: "Couche-Tard", cat: "Commerce", emoji: "🛒" },
  { name: "CGI Group", cat: "Tech", emoji: "💻" },
  { name: "Ivanhoé Cambridge", cat: "Immobilier", emoji: "🏢" },
  { name: "Cascades", cat: "Circulaire", emoji: "♻️" },
];

export default function CorporatePartners() {
  const [form, setForm] = useState({ company: "", name: "", email: "", size: "", interest: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.integrations.Core.SendEmail({
      to: SUPPORT_EMAIL,
      subject: `Nouveau Partenaire B Corp : ${form.company}`,
      body: `${SITE_TAGLINE}\n\nEntreprise: ${form.company}\nContact: ${form.name} <${form.email}>\nTaille: ${form.size}\nIntérêt: ${form.interest}`,
    }).catch(() => {});
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: "linear-gradient(160deg, hsl(220,30%,5%) 0%, hsl(158,30%,7%) 100%)" }}>
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* Hero */}
        <div className="text-center space-y-5">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-mono tracking-widest px-4 py-1.5">
            🏛️ TUNNEL B CORP — ACCÈS CORPORATIF
          </Badge>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white leading-tight">
            Votre entreprise.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              Amplifiée par la circularité.
            </span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
            {SITE_TAGLINE}. Egor69 accueille les entreprises alignées B Corp, institutions et PME qui veulent transformer l’ESG en avantage réel — sans marketing mensonger sur les audiences.
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-xs font-mono text-white/40">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Certifié ISO 14001</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Conforme PCGR/IFRS</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Compatible GRI Standards</span>
          </div>
        </div>

        {/* Logos partenaires actuels */}
        <div>
          <p className="text-center text-xs font-mono text-white/30 mb-6 tracking-widest uppercase">Partenaires de confiance</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {LOGOS.map(l => (
              <div key={l.name} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-2xl mb-1">{l.emoji}</div>
                <p className="text-[10px] text-white/50 font-semibold">{l.name}</p>
                <p className="text-[9px] text-white/25">{l.cat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white text-center mb-10">Ce que vous gagnez</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BCORP_BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <Icon className="h-7 w-7 text-emerald-400 mb-3" />
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white text-center mb-10">Choisissez votre niveau d'impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TIERS.map(t => (
              <div key={t.name} className={`rounded-2xl p-6 relative bg-gradient-to-br ${t.color}`} style={{ border: `2px solid ${t.border}` }}>
                {t.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-500 text-white">
                    ⭐ RECOMMANDÉ
                  </div>
                )}
                <p className="font-mono text-xs text-white/40 mb-1">{t.spots} places max</p>
                <h3 className="font-display font-black text-white text-xl mb-1">{t.name}</h3>
                <p className="text-2xl font-black text-emerald-300 mb-4">{t.price}</p>
                <ul className="space-y-2 mb-6">
                  {t.perks.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <Zap className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
                <button onClick={() => document.getElementById("contact-form").scrollIntoView({ behavior: "smooth" })}
                  className="w-full py-3 rounded-xl font-mono font-black text-sm text-white transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, rgba(16,185,129,0.4), rgba(16,185,129,0.2))`, border: `1px solid ${t.border}` }}>
                  Commencer →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div id="contact-form" className="rounded-3xl p-10" style={{ background: "rgba(16,185,129,0.07)", border: "2px solid rgba(16,185,129,0.25)" }}>
          <h2 className="font-display text-3xl font-bold text-white text-center mb-8">Parlons de votre transformation</h2>
          {sent ? (
            <div className="text-center space-y-3 py-8">
              <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto" />
              <p className="text-xl font-bold text-white">Message reçu !</p>
              <p className="text-white/60">Notre équipe vous contacte sous 24h.</p>
              <Link to="/"><Button className="mt-4 rounded-xl">Retour à l'accueil</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              {[
                { key: "company", label: "Nom de l'entreprise", placeholder: "Acme Corp B Corp" },
                { key: "name", label: "Votre nom", placeholder: "Jean-François Tremblay" },
                { key: "email", label: "Email professionnel", placeholder: "jf@acme.com", type: "email" },
                { key: "size", label: "Taille de l'entreprise", placeholder: "ex: 50-200 employés" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-mono text-white/50 mb-1 block">{f.label}</label>
                  <input type={f.type || "text"} required placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/15 outline-none focus:border-emerald-400 placeholder:text-white/25" />
                </div>
              ))}
              <div>
                <label className="text-xs font-mono text-white/50 mb-1 block">Intérêt principal</label>
                <textarea rows={3} placeholder="Ex: rapport ESG, réduction déchets, accès réseau artisans..."
                  value={form.interest} onChange={e => setForm(v => ({ ...v, interest: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/15 outline-none focus:border-emerald-400 placeholder:text-white/25 resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-mono font-black text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #065f46, #10b981)" }}>
                {loading ? "Envoi en cours…" : "🚀 SOUMETTRE MA CANDIDATURE"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}