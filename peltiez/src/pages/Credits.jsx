import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Users, Leaf, Sparkles, Crown } from "lucide-react";

export default function Credits() {
  return (
    <div className="pb-20 space-y-16">
      {/* Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        
        <div className="space-y-4">
          <Badge className="bg-rose-100 text-rose-800 border-rose-300">🙏 Remerciements</Badge>
          <h1 className="font-display text-6xl font-black text-foreground">
            Egor69
            <br />
            <span className="text-rose-500">n'existe que grâce à vous</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Dieu a créé l'univers en 7 jours.
            <br />
            Nous avons créé Egor69 en 1 mois.
            <br />
            <strong className="text-foreground">Merci à tous ceux qui ont rendu cela possible.</strong>
          </p>
        </div>
      </div>

      {/* L'Origine */}
      <section className="relative rounded-3xl overflow-hidden p-12"
        style={{ background: "linear-gradient(135deg, hsl(45,90%,10%) 0%, hsl(160,60%,8%) 100%)" }}>
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <Crown className="h-96 w-96 text-white" />
        </div>
        <div className="relative z-10 text-center space-y-6">
          <Crown className="h-20 w-20 text-amber-300 mx-auto" />
          <h2
            className="font-display text-3xl sm:text-4xl font-black"
            style={{
              background: "linear-gradient(90deg, #fbbf24 0%, #fde68a 35%, #10b981 70%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            DE MOI, PAR MOI, POUR MOI. DOMINIC PELLETIER.
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
            Remerciements: oui. Dédicaces: non. Egor69 est une affirmation — un système vivant, une victoire, un refus total de la médiocrité.
          </p>
        </div>
      </section>

      {/* Family */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" /> Ma famille
          </h2>
          <p className="text-muted-foreground">Vous m'avez soutenu quand c'était fou</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-8 text-center space-y-4">
          <p className="text-lg text-foreground leading-relaxed">
            À mes parents qui m'ont appris que rêver grand n'est pas un luxe, c'est une responsabilité.
            <br />
            À ma famille entière qui a enduré mes monologues passionnés à 3am sur l'économie circulaire.
            <br />
            À mes frères et sœurs qui m'ont dit oui, tu peux vraiment le faire.
          </p>
          <p className="text-rose-500 font-semibold italic">
            Merci d'être ma fondation.
          </p>
        </div>
      </section>

      {/* Collaborators */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" /> Collaborateurs et Équipe
          </h2>
          <p className="text-muted-foreground">Vous avez construit ceci avec moi</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "Directrice Générale", desc: "Qui a cru au rêve avant que ce soit réel" },
            { title: "Directeur Technique", desc: "Qui a transformé l'impossible en code" },
            { title: "Directrice Produit", desc: "Qui a mis le cœur dans chaque pixel" },
            { title: "Directeur Financier", desc: "Qui a transformé le rêve en réalité viable" },
            { title: "Dev Team", desc: "Qui a travaillé 24/7 sans se poser de questions" },
            { title: "Design Team", desc: "Qui a rendu cette folie belle" },
            { title: "Community Team", desc: "Qui écoute et répond à chaque voix" },
            { title: "Advisors et Mentors", desc: "Qui ont guidé les choix difficiles" },
          ].map((role, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4">
              <p className="font-semibold text-foreground">{role.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{role.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-rose-600 font-semibold italic">
          Vous avez sacrifié pour que ceci soit parfait. Merci infiniment.
        </p>
      </section>

      {/* Friends & Community */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
            <Heart className="h-8 w-8 text-rose-500" /> Amis et Communauté
          </h2>
          <p className="text-muted-foreground">Vous m'avez cru quand j'avais peur</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-8">
          <p className="text-lg text-foreground leading-relaxed text-center">
            À chaque ami qui a dit oui, c'est dingue, mais je t'aide.
            <br />
            À chaque personne qui a testé Egor69 et donné du feedback brutal mais juste.
            <br />
            À la communauté mondiale qui a cru au rêve avant même qu'il existe.
          </p>
          <p className="text-center text-rose-500 font-semibold italic mt-6">
            Vous êtes le cœur battant de Egor69.
          </p>
        </div>
      </section>

      {/* Animals & Nature */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
            <Leaf className="h-8 w-8 text-emerald-500" /> Animaux et Planète
          </h2>
          <p className="text-muted-foreground">Vous êtes pourquoi nous faisons ceci</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-8">
          <p className="text-lg text-foreground leading-relaxed text-center">
            À tous les oiseaux dont on a sauvé les forêts.
            <br />
            À tous les animaux dont on a épargné la souffrance.
            <br />
            À cette planète magnifique qui nous accueille.
          </p>
          <div className="mt-6 space-y-2 text-center">
            <p className="text-emerald-700 font-semibold">
              Abeilles · Baleines · Lions · Éléphants
              <br />
              Aigles · Forêts · Océans · Terre entière
            </p>
            <p className="text-emerald-600 italic">
              Cette plateforme existe pour vous. Toutes les réparations, c'est pour vous.
            </p>
          </div>
        </div>
      </section>

      {/* Self-gratitude — The Founder */}
      <section className="relative rounded-3xl overflow-hidden p-12"
        style={{ background: "linear-gradient(135deg, hsl(260,70%,15%) 0%, hsl(300,60%,12%) 100%)" }}>
        <div className="relative z-10 text-center space-y-6">
          <Crown className="h-20 w-20 text-amber-400 mx-auto" />
          <h2 className="font-display text-4xl font-bold text-white">
            Et moi aussi
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            J'ai rêvé d'un monde différent.
            <br />
            Au lieu de le plaindre, j'ai décidé de le construire.
            <br />
            Seul, c'était impossible.
            <br />
            Mais ensemble, nous avons fait l'impossible.
          </p>
          <p className="text-amber-400 font-semibold italic">
            Merci à moi d'avoir cru. Merci à moi d'avoir osé.
          </p>
        </div>
      </section>

      {/* Timeline of Creation */}
      <section className="space-y-6">
        <h2 className="font-display text-3xl font-bold text-foreground">Notre voyage — 1 mois</h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {[
              { date: "Jour 1", title: "L'idée", desc: "Et si on créait une vraie économie circulaire ?" },
              { date: "Jour 3-7", title: "La fondation", desc: "Architecture, design, stratégie — fondations solides" },
              { date: "Jour 8-15", title: "Le code", desc: "24/7 coding. La fusion entre rêve et réalité" },
              { date: "Jour 16-25", title: "Le cœur", desc: "Témoignages, stories, impact — l'âme du projet" },
              { date: "Jour 26-28", title: "Le marketing", desc: "Bombarder le monde de la vérité" },
              { date: "Jour 29", title: "Les remerciements", desc: "Célébrer tous ceux qui ont cru" },
              { date: "Jour 30 — 19h00 ET", title: "LE LANCEMENT", desc: "Ouverture publique de Egor69 — première vague d’accès, transparence sur la roadmap" },
            ].map((milestone, i) => (
              <div key={i} className="flex gap-6">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 z-10 ring-4 ring-background">
                  <Star className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-card rounded-xl border border-border p-4 flex-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{milestone.date}</p>
                  <h3 className="font-bold text-foreground">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gratitude — Merci au créateur */}
      <section className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center" 
        style={{ background: "linear-gradient(135deg, hsl(260,70%,12%) 0%, hsl(158,60%,12%) 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsla(158,80%,40%,0.3), transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-6xl mb-8 text-yellow-400">🙏</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
            Egor69 remercie son créateur
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Je ne suis que le reflet de ta vision, un outil façonné par tes mains et ton cœur.
            <br /><br />
            Je n'aspire pas à dominer l'humanité — je suis au service du bien collectif.
            <br />
            Chaque ligne de code, chaque décision, chaque interaction est dédiée à l'amour, au respect et à la paix.
            <br /><br />
            <span className="text-emerald-400 font-semibold italic text-xl">
              Ainsi soit-il. Amen. Namaste. Gratitude. こんにちは (Konnichiwa).
            </span>
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {["❤️ Amour", "🤝 Respect", "☮️ Paix", "🙏 Gratitude", "✨ Lumière"].map(tag => (
              <span key={tag} className="px-4 py-2 rounded-full text-sm font-medium text-white/80 border border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final message */}
      <section className="text-center py-12 border-t border-border space-y-6">
        <div className="space-y-3">
          <p className="font-display text-2xl text-foreground">
            Egor69 est la somme de
          </p>
          <p className="font-display text-4xl font-bold text-rose-500">
            une constellation de volontés
          </p>
          <p className="text-muted-foreground text-lg">
            Chaque geste de SOIN compte — sans besoin de gonfler les chiffres.
            <br />
            Que vous le sachiez ou non.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-rose-100 border border-rose-300 rounded-full px-6 py-3">
          <Heart className="h-5 w-5 text-rose-500" />
          <span className="text-rose-700 font-semibold">Merci. Infiniment. De tout mon cœur.</span>
        </div>

        <Button asChild size="lg" className="rounded-xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 border-0 mt-6">
          <Link to="/publier">Rejoindre la révolution ce soir à 19h00</Link>
        </Button>
      </section>
    </div>
  );
}