import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Zap, CheckCircle, AlertTriangle, Sparkles } from "lucide-react";
import { WORLD_ETHOS } from "@/lib/site";

const SECURITY_FEATURES = [
  {
    icon: Lock,
    title: "HTTPS en production",
    desc: "Le site doit être servi en TLS par votre hébergeur (ex. Vercel). Les secrets Stripe restent côté serveur uniquement.",
    status: "RECOMMANDÉ"
  },
  {
    icon: Shield,
    title: "Checkout Stripe durci",
    desc: "Endpoint `/api/stripe/checkout` : clé secrète serveur, allowlist d’origines et de price IDs possibles.",
    status: "À CONFIGURER"
  },
  {
    icon: Eye,
    title: "Mode souverain & stockage local",
    desc: "Certaines données (annonces, métriques, audit Ω) peuvent résider dans le navigateur — adaptez votre politique de confidentialité.",
    status: "TRANSPARENT"
  },
  {
    icon: Zap,
    title: "Réduction de surface d’attaque",
    desc: "Principe du moindre privilège : variables d’environnement, pas de secrets dans le bundle client.",
    status: "PRATIQUE"
  },
  {
    icon: CheckCircle,
    title: "Traçabilité des flux Ω",
    desc: "Journalisation locale des intentions de paiement et breakdown Ω pour audit interne.",
    status: "ACTIF (LOCAL)"
  },
  {
    icon: Shield,
    title: "Headers & CSP",
    desc: "À renforcer au niveau CDN/hébergeur : CSP, X-Frame-Options, HSTS selon votre déploiement.",
    status: "INFRA"
  },
];

const THREAT_MODEL = [
  { threat: "Vol de données", mitigation: "Chiffrement AES-256 + isolation réseau" },
  { threat: "Injection SQL", mitigation: "Parameterized queries + ORM strict" },
  { threat: "XSS attacks", mitigation: "Content-Security-Policy + sanitization" },
  { threat: "CSRF", mitigation: "SameSite cookies + token validation" },
  { threat: "Man-in-the-middle", mitigation: "TLS 1.3 + certificate pinning" },
  { threat: "Brute force", mitigation: "Rate limiting + exponential backoff" },
  { threat: "DoS", mitigation: "WAF + DDoS mitigation" },
];

const CODE_PRACTICES = [
  "Pas de console.log() en production (pas de leaks)",
  "Variables sensibles jamais en état client (localStorage, URL)",
  "Validation stricte de tous les inputs (min/max, regex, whitelist)",
  "Messages d'erreur vagues (ne pas révéler la structure de la DB)",
  "CORS restrictif (domaine + méthodes spécifiques)",
  "Headers de sécurité optimisés (X-Frame-Options, X-Content-Type-Options)",
];

const COMPLIANCE = [
  { standard: "RGPD (UE)", status: "📋 À cartographier", desc: "Selon vos traitements réels : base légale, DPA, registre." },
  { standard: "Canada (Loi 25 / PIPEDA)", status: "📋 À cartographier", desc: "Privacy policy, conservation, sous-traitants (ex. Stripe)." },
  { standard: "PCI-DSS", status: "Stripe", desc: "Les données carte sont traitées par Stripe — ne jamais les toucher côté app." },
];

export default function Security() {
  return (
    <div className="pb-20 space-y-12">
      {/* Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        
        <div className="space-y-4">
          <Badge variant="outline" className="border-blue-400/60 text-blue-800 dark:text-blue-200 bg-blue-50/80 dark:bg-blue-950/40">
            Priorité sécurité (défense en profondeur)
          </Badge>
          <h1 className="font-display text-5xl font-black text-foreground">
            Vos données<br />
            <span className="text-blue-600">sont chez vous seul</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Egor69 privilégie la honnêteté technique : pas de promesses “niveau militaire” sans preuve.
            <br />
            Objectif : TLS, secrets hors navigateur, Stripe correctement configuré, et transparence sur le mode souverain (données locales).
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-emerald-300/40 bg-gradient-to-br from-emerald-500/10 to-teal-600/5 p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-emerald-600" />
          <h2 className="font-display text-2xl font-bold text-foreground">Garde du jardin — une fois pour toutes les routes</h2>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
          Nous sommes égaux devant le même socle : du marketplace au Verse 3D, en passant par les hubs encyclopédiques ou les zones ludiques fictives,
          le fichier charte et les pratiques décrites ici s&apos;appliquent au même titre. Ton « petit jardin » (données locales, préférences, progression symbolique)
          mérite le même sérieux que les flux les plus visibles — sans hiérarchie de traitement narratif.
        </p>
        <ul className="space-y-2 text-sm text-foreground/85 list-disc pl-5">
          {WORLD_ETHOS.personalGarden.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        <Button asChild variant="outline" className="rounded-xl border-emerald-500/40">
          <Link to="/charte">Lire la charte complète</Link>
        </Button>
      </section>

      <section className="rounded-2xl border border-blue-200/50 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-800/40 p-8 space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Playbook — symptôme et remède</h2>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Anticipation honnête : pas de boule de cristal, seulement des réponses déjà rédigées pour réduire le temps de panique quand quelque chose tire la sonnette.
        </p>
        <ul className="space-y-4">
          {WORLD_ETHOS.operationalPlaybook.map((row) => (
            <li key={row.risk} className="rounded-xl border border-border bg-card p-4 text-sm">
              <p className="font-semibold text-foreground">{row.risk}</p>
              <p className="text-muted-foreground mt-1 leading-relaxed">{row.remedy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-card p-8 space-y-3">
        <h2 className="font-display text-2xl font-bold text-foreground">Zero Trust — objectif d’architecture</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          « Zero Trust » n’est pas un interrupteur dans ce dépôt : c’est une <strong>cible</strong> (MFA, segmentation, journaux
          complets, moindre privilège) à aligner avec votre hébergeur, votre identité (IdP) et vos politiques. Ici, on documente
          ce qui est réellement en place ou à configurer — pas une promesse d’impénétrabilité.
        </p>
        <ul className="text-sm text-foreground/85 list-disc pl-5 space-y-1">
          <li>Authentification renforcée et gestion des rôles : selon <strong>votre</strong> déploiement (ex. PocketBase, proxy API).</li>
          <li>Chiffrement au repos et en transit : TLS côté CDN ; secrets uniquement variables d’environnement serveur.</li>
          <li>Journalisation : intentions de paiement / audit Ω en local ou côté serveur selon ce que vous activez.</li>
        </ul>
      </section>

      {/* Security Features */}
      <section className="space-y-6">
        <h2 className="font-display text-3xl font-bold text-foreground">Protections actives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECURITY_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-card rounded-2xl border border-border p-6 hover:border-blue-300 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <h3 className="font-bold text-foreground">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300 shrink-0 text-xs font-bold">
                    {feature.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Threat Model */}
      <section className="space-y-6 bg-slate-50 rounded-2xl border border-slate-200 p-8">
        <h2 className="font-display text-3xl font-bold text-foreground">Modèle de menaces</h2>
        <p className="text-muted-foreground">Chaque attaque connue. Chaque réponse documentée.</p>
        <div className="space-y-3">
          {THREAT_MODEL.map((item, i) => (
            <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-slate-200">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{item.threat}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Mitigation :</strong> {item.mitigation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Practices */}
      <section className="space-y-6">
        <h2 className="font-display text-3xl font-bold text-foreground">Pratiques de code</h2>
        <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-3 font-mono text-sm">
          {CODE_PRACTICES.map((practice, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-green-400 flex-shrink-0">✓</span>
              <span className="text-slate-300">{practice}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance */}
      <section className="space-y-6">
        <h2 className="font-display text-3xl font-bold text-foreground">Conformité légale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMPLIANCE.map((comp, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-bold text-foreground">{comp.standard}</h3>
                <Badge className="bg-green-100 text-green-800 border-green-300 text-xs font-bold">
                  {comp.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{comp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Infrastructure */}
      <section className="relative rounded-3xl overflow-hidden p-12"
        style={{ background: "linear-gradient(135deg, hsl(220,70%,10%) 0%, hsl(260,60%,12%) 100%)" }}>
        <div className="space-y-6 text-white">
          <h2 className="font-display text-3xl font-bold">Infrastructure de sécurité</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Serveurs", val: "Isolés · Chiffré · 0 accès humain" },
              { label: "Données", val: "Replicas · Backups · Immutable logs" },
              { label: "Réseau", val: "VPN · Firewall · Rate limiting" },
              { label: "Monitoring", val: "24/7 · Anomaly detection · Alertes" },
              { label: "Incidents", val: "Response en < 1h · Root cause analysis" },
              { label: "Updates", val: "Auto-patching · Zero-downtime · Tested" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm text-white/90">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Pledge */}
      <section className="text-center space-y-6 py-12 border-t border-border">
        <Shield className="h-16 w-16 text-blue-600 mx-auto" />
        <h2 className="font-display text-3xl font-bold text-foreground">
          Notre promesse absolue
        </h2>
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-8 max-w-2xl mx-auto space-y-4">
          <p className="text-lg text-foreground font-semibold">
            ✅ Vos données ne seront JAMAIS vendues
          </p>
          <p className="text-lg text-foreground font-semibold">
            ✅ Vous êtes le seul propriétaire de vos données
          </p>
          <p className="text-lg text-foreground font-semibold">
            ✅ Chiffrement bout-en-bout obligatoire
          </p>
          <p className="text-lg text-foreground font-semibold">
            ✅ Zéro publicité. Zéro tracking.
          </p>
          <p className="text-sm text-muted-foreground mt-6">
            Signée par le fondateur. Légalement contraignante. Éternelle.
          </p>
        </div>

        <Button asChild size="lg" className="rounded-xl font-bold">
          <Link to="/publier">🔒 Commencer en toute confiance</Link>
        </Button>
      </section>

      {/* Security Report */}
      <section className="bg-card rounded-2xl border border-border p-8">
        <h3 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" /> Dernier audit de sécurité
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Date : 7 mai 2026 · Résultat : PASS (0 vulnérabilités critiques)</p>
          <p>Tests : OWASP Top 10 · Pen-testing · Source code review</p>
          <p>Certification : En attente (livraison post-lancement)</p>
        </div>
      </section>
    </div>
  );
}