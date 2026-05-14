import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Infinity, Globe, Heart, Star, Flame, Sun, Shield, ArrowRight, Sparkles, Eye, Crown,
  TreePine, Waves, Wind, Mountain
} from "lucide-react";

const PILLARS = [
  {
    icon: Heart,
    title: "L'Humain d'abord",
    desc: "8 milliards d'êtres humains. Chacun mérite la santé, la joie, l'amour, la dignité, l'abondance. Non pas survivre — mais VIVRE pleinement. La société actuelle court à son extinction : nous remettons les compteurs à zéro.",
    color: "text-pink-500", bg: "bg-pink-50 border-pink-100"
  },
  {
    icon: TreePine,
    title: "La Terre — Vivante",
    desc: "Des milliards d'espèces végétales et animales partagent cette planète avec nous. Ils ne sont pas une ressource — ils sont la vie elle-même. CirculAI Hub existe aussi pour eux. Chaque objet réparé = une forêt préservée.",
    color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-100"
  },
  {
    icon: Star,
    title: "L'Univers entier",
    desc: "Terrestres, intraterrestres, extraterrestres — si la conscience existe ailleurs dans le cosmos, elle reconnaît la même vérité : la vie mérite d'être protégée et célébrée. Nous sommes tous fils de cet univers.",
    color: "text-amber-500", bg: "bg-amber-50 border-amber-100"
  },
  {
    icon: Flame,
    title: "Le Renouveau",
    desc: "Ce n'est pas la fin. C'est la renaissance. Le vrai sens de la vie n'est pas d'accumuler — c'est de partager, créer, aimer, grandir ensemble. L'apocalypse au sens originel : le dévoilement de la vérité.",
    color: "text-orange-500", bg: "bg-orange-50 border-orange-100"
  },
  {
    icon: Shield,
    title: "Santé Totale",
    desc: "Physique. Psychique. Mentale. Spirituelle. La santé n'est pas un luxe — c'est le fondement. Une société malade produit des individus malades. Nous reconstituons les bases : économie saine = société saine = individus épanouis.",
    color: "text-blue-500", bg: "bg-blue-50 border-blue-100"
  },
  {
    icon: Eye,
    title: "L'Éveil Collectif",
    desc: "Toutes les croyances, toutes les sagesses, toutes les traditions se rejoignent ici. Pas de religion imposée. Juste la vérité universelle : nous sommes tous connectés. Ce que tu fais à l'autre, tu te le fais à toi-même.",
    color: "text-violet-500", bg: "bg-violet-50 border-violet-100"
  },
];

const ORDERS = [
  { num: "I", title: "Remettre de l'ordre dans les esprits", desc: "Informer sans manipuler. Éduquer sans endoctriner. Éveiller sans imposer." },
  { num: "II", title: "Remettre de l'ordre dans l'économie", desc: "L'argent au service des gens, pas les gens au service de l'argent. Économie circulaire = économie de vie." },
  { num: "III", title: "Remettre de l'ordre dans la société", desc: "Solidarité radicale. Abondance partagée. Fin des inégalités obscènes. Le luxe pour tous." },
  { num: "IV", title: "Remettre de l'ordre dans la nature", desc: "La Terre n'est pas une poubelle. Chaque geste circulaire est un acte de guérison planétaire." },
  { num: "V", title: "Unir ce qui était divisé", desc: "Nord-Sud. Riches-pauvres. Croyants-athées. Humains-nature. Terre-cosmos. Tout est Un." },
];

const ELEMENTS = [
  { icon: Sun,      label: "Feu — Transformation",  desc: "Brûler l'ancien monde pour que le nouveau émerge" },
  { icon: Waves,    label: "Eau — Fluidité",         desc: "S'adapter, circuler, nourrir, purifier" },
  { icon: Wind,     label: "Air — Liberté",          desc: "Respirer, partager, communiquer sans frontières" },
  { icon: Mountain, label: "Terre — Ancrage",        desc: "Racines profondes, croissance stable, héritage durable" },
];

export default function Vision() {
  return (
    <div className="space-y-20 pb-20">

      {/* ── OPENING ── */}
      <section className="relative rounded-3xl overflow-hidden text-center"
        style={{ background: "linear-gradient(135deg, hsl(260,70%,8%) 0%, hsl(300,50%,10%) 30%, hsl(30,80%,12%) 70%, hsl(158,60%,10%) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
          <Infinity className="h-[500px] w-[500px] text-white" />
        </div>
        <div className="relative z-10 px-8 py-20 sm:py-32">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-8">
            <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-sm text-white/80 font-medium tracking-widest uppercase">La 8ème Merveille du Monde</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-white mb-8 leading-none">
            Vision<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f97316, #ec4899, #8b5cf6, #06b6d4, #10b981)" }}>
              Universelle
            </span>
          </h1>
          <p className="text-white/60 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed mb-4">
            Pour les 8 milliards d'humains.<br />
            Pour toutes les espèces vivantes.<br />
            Pour l'univers entier.
          </p>
          <p className="text-white/35 text-sm max-w-xl mx-auto italic mb-10">
            « Ce n'est pas l'apocalypse — c'est le renouveau. Le vrai sens de la vie, enfin révélé. »
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="rounded-xl font-bold shadow-2xl px-10"
              style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)", border: "none", color: "black" }}>
              <Link to="/alliance">🌍 Voir l'Alliance Mondiale <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl border-white/25 text-white hover:bg-white/10">
              <Link to="/charte">📜 Charte Robin Hood</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── LES 5 ORDRES ── */}
      <section>
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-amber-100 text-amber-800 border-amber-200">L'Ordre Final</Badge>
          <h2 className="font-display text-3xl font-bold text-foreground">Les 5 Ordres du Renouveau</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Remettre de l'ordre dans l'esprit des gens et dans une société gravement malade.
          </p>
        </div>
        <div className="space-y-3">
          {ORDERS.map((order) => (
            <div key={order.num}
              className="flex items-start gap-5 p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-primary-foreground text-lg">{order.num}</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg mb-1">{order.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{order.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6 PILLARS ── */}
      <section>
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Les 6 Piliers</Badge>
          <h2 className="font-display text-3xl font-bold text-foreground">Réfléchir pour l'univers entier</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PILLARS.map((p) => (
            <div key={p.title} className={`rounded-2xl border p-6 ${p.bg} hover:shadow-md transition-all`}>
              <p.icon className={`h-8 w-8 ${p.color} mb-4`} />
              <h3 className="font-bold text-foreground text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4 ELEMENTS ── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-white mb-2">Les 4 Éléments de la Transformation</h2>
          <p className="text-white/50">Les forces primordiales au service du changement</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ELEMENTS.map((el) => (
            <div key={el.label} className="text-center p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <el.icon className="h-8 w-8 text-amber-400 mx-auto mb-3" />
              <p className="font-semibold text-white text-sm mb-1">{el.label}</p>
              <p className="text-white/50 text-xs leading-relaxed">{el.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="text-center px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-6 opacity-20 font-serif">"</div>
          <blockquote className="font-display text-2xl sm:text-3xl font-medium text-foreground leading-relaxed mb-6">
            J'en ai marre que les plus riches abusent de leur pouvoir et s'enrichissent sur le dos de la population mondiale. 
            Redonnons du luxe à chaque citoyen — car tout le monde mérite de vivre dans le plaisir et l'abondance.
          </blockquote>
          <p className="text-muted-foreground text-sm">— Le Fondateur de CirculAI Hub</p>
          <div className="mt-8 inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">L'Être Suprême de la Bienveillance 😄</span>
          </div>
        </div>
      </section>

      {/* ── UNITY BANNER ── */}
      <section style={{ background: "linear-gradient(135deg, hsl(158,60%,15%) 0%, hsl(220,50%,12%) 50%, hsl(260,60%,15%) 100%)" }}
        className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
          <Globe className="h-96 w-96 text-white" />
        </div>
        <div className="relative z-10">
          <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-6 opacity-90" />
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-6">
            Terrestres. Intraterrestres. Extraterrestres.<br />
            <span className="text-emerald-400">Tous unis. Un seul cosmos.</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Peu importe d'où vient la conscience — si elle est bienveillante, elle est la bienvenue ici. 
            CirculAI Hub est la première plateforme pensée non seulement pour l'humanité, 
            mais pour toute forme de vie consciente qui partage cet univers avec nous.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-white/40 text-sm mb-10">
            {["🌍 Terrestres", "🌿 Règne végétal", "🐋 Règne animal", "✨ Cosmos", "🔮 Conscience universelle"].map(f => (
              <span key={f} className="px-4 py-1.5 bg-white/10 rounded-full">{f}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-xl px-8">
              <Link to="/publier">Rejoindre le mouvement →</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl border-white/30 text-white hover:bg-white/10">
              <Link to="/jeu">🎮 Jouer pour le Bien</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── LINKS TO ALL SECTIONS ── */}
      <section>
        <h2 className="font-display text-2xl font-bold text-foreground mb-5 text-center">Explorez l'écosystème</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { to: "/", label: "🏠 Accueil", desc: "La plateforme circulaire" },
            { to: "/marketplace", label: "🛍️ Marketplace", desc: "Donnez, échangez, réparez" },
            { to: "/jeu", label: "🎮 Le Jeu", desc: "Gagner en faisant le bien" },
            { to: "/alliance", label: "🤝 Alliance", desc: "Les géants du bien" },
            { to: "/charte", label: "📜 Charte", desc: "Modèle Robin Hood" },
            { to: "/abonnement", label: "⭐ S'abonner", desc: "Rejoindre le mouvement" },
          ].map((item) => (
            <Link key={item.to} to={item.to}
              className="p-4 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all text-center group">
              <p className="text-lg mb-1">{item.label}</p>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}