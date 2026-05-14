import { Shield, Lock, Sparkles, Eye, Server } from "lucide-react";

const SPLIT = [
  { pct: 60, label: "Communauté & Créateurs",  desc: "Redistribué aux membres actifs, artisans, contributeurs",  color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  { pct: 20, label: "Planète & Impact",         desc: "Projets de reforestation, CO₂, associations environnementales", color: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-50" },
  { pct: 12, label: "Fondateur · Le Génie 👑",  desc: "Rémunération du créateur — le Robin des Bois garde sa part",  color: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50" },
  { pct: 8,  label: "R&D & Infrastructure",     desc: "Sécurité, innovation, nouvelles fonctionnalités",             color: "bg-purple-500",  text: "text-purple-700",  bg: "bg-purple-50" },
];

const SECURITY = [
  { icon: Lock,    title: "Coffre-fort quantique",   desc: "Chiffrement AES-256 + couche post-quantique. Vos données sont hermétiquement scellées." },
  { icon: Eye,     title: "Zéro vente de données",   desc: "Nous ne vendons, ne louons, ne partageons JAMAIS vos données personnelles. Jamais. Point." },
  { icon: Server,  title: "Souveraineté numérique",  desc: "Serveurs hébergés hors Big Tech. Votre vie privée est notre mission constitutionnelle." },
  { icon: Shield,  title: "Audit indépendant",       desc: "Transparence totale. Rapport de sécurité publié chaque trimestre par des experts tiers." },
];

export default function RevenueCharter() {
  return (
    <div className="space-y-8">

      {/* Security Vault */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 p-6 sm:p-10"
        style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #111827 60%, #0f2027 100%)" }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <Lock className="h-96 w-96 text-white" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">Promesse de fondation · Gravée dans le marbre</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            🔐 Le Coffre-Fort le Plus Sécurisé<br />
            <span className="text-emerald-400">de Toute l'Histoire</span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
            Vos données ne sont pas un produit. Elles sont votre propriété absolue et inaliénable. 
            CirculAI Hub ne les vendra jamais, quoi qu'il arrive — même sous pression commerciale, 
            juridique ou financière. C'est une promesse constitutionnelle.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECURITY.map(s => (
              <div key={s.title} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <s.icon className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{s.title}</p>
                  <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Robin Hood Revenue Split */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 tracking-wide uppercase">Charte Financière · Transparence totale</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            🏹 Le Modèle Robin des Bois
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
            Chaque dollar généré sur la plateforme est réparti selon cette charte publique et immuable. 
            Le fondateur garde sa part légitime pour alimenter le génie — le reste revient au peuple.
          </p>
        </div>

        {/* Visual bar */}
        <div className="flex rounded-2xl overflow-hidden h-10 mb-6 shadow-inner">
          {SPLIT.map(s => (
            <div key={s.label} className={`${s.color} flex items-center justify-center`} style={{ width: `${s.pct}%` }}>
              <span className="text-white text-xs font-bold">{s.pct}%</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SPLIT.map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-border`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-2xl font-bold ${s.text}`}>{s.pct}%</span>
                <p className={`text-sm font-semibold ${s.text}`}>{s.label}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-2xl text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            🤝 <strong className="text-foreground">Engagement public</strong> — Cette répartition est gravée dans les statuts de CirculAI Hub. 
            Aucun investisseur extérieur ne peut la modifier sans vote communautaire. 
            <strong className="text-foreground"> Votre confiance est notre capital le plus précieux.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}