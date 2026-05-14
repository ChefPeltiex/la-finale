import { Link } from "react-router-dom";
import { ACCUEIL_SECTION_LINKS, linkToHomeSection } from "@/lib/accueilSections";
import { SITE_TAGLINE } from "@/lib/site";
import { Shield, Copyright, AlertTriangle } from "lucide-react";
import { DISCLAIMER } from "@/data/cathedralOfMind";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-20">
      <div className="border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-zinc-950/50 to-violet-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm font-semibold text-white/90">
            Prêt à rejoindre le réseau vivant ? Passe à l’abonnement ou au soutien — même cadre souverain partout.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 shadow hover:bg-emerald-400"
            >
              Voir les abonnements
            </Link>
            <Link
              to="/soutien"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
            >
              Soutenir Egor69
            </Link>
            <Link
              to="/world"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-xs text-white/85 hover:bg-white/5"
            >
              Entrer dans le Verse 3D
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">IG</span>
              </div>
              <span className="font-display font-bold text-foreground">Egor69</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {SITE_TAGLINE}. Sanctuaire numérique pour l’échange conscient : encyclopédies vivantes, monde WebGL comme vestibule vers les fonctions réelles — sans inflation marketing ni métriques fictives.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">Navigation</p>
            <ul className="space-y-1 text-xs">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition">Accueil</Link></li>
              <li><Link to="/world" className="text-muted-foreground hover:text-foreground transition">Verse 3D · open world</Link></li>
              <li><Link to="/arene-virtuelle" className="text-muted-foreground hover:text-foreground transition">Arène virtuelle · coop</Link></li>
              <li><Link to="/hub-fondations" className="text-muted-foreground hover:text-foreground transition">Fondations · entreprises & éducation</Link></li>
              <li><Link to="/hub-souverain" className="text-muted-foreground hover:text-foreground transition">Hub souverain · noyau & éco-UI</Link></li>
              <li><Link to="/avatar-creator" className="text-muted-foreground hover:text-foreground transition">Studio Avatar · forge locale & cloud</Link></li>
              <li><Link to="/mon-univers" className="text-muted-foreground hover:text-foreground transition">Mon univers · personnalisation</Link></li>
              <li><Link to="/atlas" className="text-muted-foreground hover:text-foreground transition">Atlas vivant</Link></li>
              <li><Link to="/encyclopedie-biblique" className="text-muted-foreground hover:text-foreground transition">Encyclopédie biblique</Link></li>
              <li><Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition">Marketplace</Link></li>
              <li><Link to="/manuel" className="text-muted-foreground hover:text-foreground transition">Manuel</Link></li>
              <li><Link to="/outils-integration" className="text-muted-foreground hover:text-foreground transition">Outils, IA & Unreal (cadre réel)</Link></li>
              <li><Link to="/carte-site" className="text-muted-foreground hover:text-foreground transition">Carte du site, parcours & glossaire</Link></li>
              <li><Link to="/vision" className="text-muted-foreground hover:text-foreground transition">Vision</Link></li>
              <li><Link to="/soutien" className="text-muted-foreground hover:text-foreground transition">Soutien le projet</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition">À propos</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition">Contact</Link></li>
            </ul>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-foreground/80">Accueil — ancres</p>
            <ul className="mt-1.5 space-y-1 text-xs">
              {ACCUEIL_SECTION_LINKS.map(({ id, label }) => (
                <li key={id}>
                  <Link
                    to={linkToHomeSection(id)}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">Légal</p>
            <ul className="space-y-1 text-xs">
              <li><Link to="/legal" className="text-muted-foreground hover:text-foreground transition">Propriété Intellectuelle</Link></li>
              <li><Link to="/security" className="text-muted-foreground hover:text-foreground transition">Sécurité</Link></li>
              <li><Link to="/credits" className="text-muted-foreground hover:text-foreground transition">Remerciements</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">Nous</p>
            <p className="text-xs text-muted-foreground">
              Egor69 © {currentYear}<br />
              <strong className="text-foreground">Propriété exclusive protégée</strong>
            </p>
          </div>
        </div>

        {/* Intellectual Property Notice */}
        <div className="relative rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-purple-500/5 p-6 mb-8 overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Shield className="absolute top-0 right-0 h-32 w-32 text-primary" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-start gap-3">
              <Copyright className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-sm mb-2">
                  ⚖️ AVIS DE PROPRIÉTÉ INTELLECTUELLE
                </h3>
                <p className="text-xs text-foreground/80 leading-relaxed mb-3">
                  <strong>Egor69</strong> est une création originale protégée par le droit d'auteur international.
                  Tous les éléments — code, design, contenus, données, stratégies commerciales — appartiennent
                  <strong className="text-primary"> exclusivement à son créateur et fondateur, Dominic Pelletier</strong>. Aucune cession,
                  licence, ou autorisation n'a été accordée à tiers.
                </p>
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive/80">
                    <strong>Toute copie, reproduction, modification, ou utilisation non autorisée est formellement interdite.</strong>
                    Les violations entraîneront des poursuites judiciaires civiles et criminelles sans avertissement préalable.
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Framework */}
            <div className="pt-3 border-t border-primary/20">
              <p className="text-[11px] text-muted-foreground font-medium mb-2">Protégé par:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Loi Droit d'Auteur Canada",
                  "ADPIC (OMC)",
                  "Convention de Berne",
                  "WIPO",
                  "Loi Québec"
                ].map((law) => (
                  <span key={law} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary/80 font-medium">
                    ✓ {law}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {currentYear} <strong>Egor69</strong> — Propriété Intellectuelle Exclusive • 
            <Link to="/legal" className="text-primary hover:underline ml-1">Mentions légales complètes</Link>
            <span className="hidden sm:inline text-muted-foreground/70"> · </span>
            <span className="block sm:inline mt-1 sm:mt-0 text-[10px] opacity-90">{DISCLAIMER}</span>
          </p>
          <p className="text-xs text-muted-foreground font-semibold text-center">
            DE MOI, PAR MOI, POUR MOI. <strong className="text-foreground">DOMINIC PELLETIER.</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}