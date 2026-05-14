import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Globe, Heart, Shield,
  ArrowRight, Crown, Infinity, Sun, Flame, Eye
} from "lucide-react";

const ALLIES = [
  {
    name: "Google / Alphabet",
    logo: "🔵",
    positive: "Accès universel au savoir, recherche médicale de pointe, IA au service du climat",
    contribution: "Moteur de référencement éthique · Google.org · DeepMind santé",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Meta",
    logo: "🟣",
    positive: "Connexion humaine, réalité augmentée accessible, Llama IA open-source",
    contribution: "Infrastructures communautaires · IA ouverte · Connectivité rurale",
    color: "from-purple-500 to-blue-600",
  },
  {
    name: "Microsoft",
    logo: "🟦",
    positive: "Technologie accessible, cloud humanitaire, accessibilité numérique universelle",
    contribution: "Azure pour les ONG · LinkedIn pour l'emploi · Philanthropies",
    color: "from-sky-500 to-blue-700",
  },
  {
    name: "Apple",
    logo: "⬛",
    positive: "Design inclusif, protection de la vie privée, accessibilité universelle",
    contribution: "Santé & bien-être · Éducation gratuite · Sécurité by design",
    color: "from-slate-600 to-slate-800",
  },
  {
    name: "Amazon / AWS",
    logo: "🟠",
    positive: "Logistique humanitaire, cloud pour les associations, livraison médicale par drone",
    contribution: "AWS pour les causes · Amazon Smile · Drone médical en zones reculées",
    color: "from-orange-500 to-amber-600",
  },
  {
    name: "OpenAI",
    logo: "⚡",
    positive: "IA démocratisée, recherche ouverte, outils éducatifs pour tous",
    contribution: "GPT pour l'éducation · Accès gratuit mondial · Recherche IA alignée",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Anthropic",
    logo: "🤖",
    positive: "IA éthique et sécurisée, recherche sur l'alignement des valeurs humaines",
    contribution: "Claude pour la bienveillance · Safety research · IA constitutionnelle",
    color: "from-violet-500 to-purple-700",
  },
  {
    name: "Mistral AI",
    logo: "🇫🇷",
    positive: "IA souveraine européenne, modèles open-source, diversité linguistique mondiale",
    contribution: "Langue française & diversité culturelle · Open-source · Souveraineté",
    color: "from-blue-600 to-indigo-700",
  },
  {
    name: "Tesla / SpaceX",
    logo: "🚀",
    positive: "Énergie solaire accessible, mobilité propre, connectivité Starlink en zones isolées",
    contribution: "Énergie renouvelable · Starlink humanitaire · Tesla Energy communautaire",
    color: "from-red-500 to-rose-700",
  },
  {
    name: "Hugging Face",
    logo: "🤗",
    positive: "IA 100% open-source, démocratisation de la recherche, communauté mondiale",
    contribution: "Modèles libres · Éducation IA · Collaboration scientifique ouverte",
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "ONU / UNESCO",
    logo: "🌐",
    positive: "Droits universels, éducation mondiale, culture et patrimoine de l'humanité",
    contribution: "Objectifs de développement durable · Alphabétisation · Paix",
    color: "from-sky-600 to-blue-800",
  },
  {
    name: "Wikipedia / Wikimedia",
    logo: "📚",
    positive: "Connaissance libre, sans publicité, sans actionnaires — pour toute l'humanité",
    contribution: "Savoir universel · 60 millions d'articles · Zéro profit · Zéro pub",
    color: "from-gray-600 to-gray-800",
  },
];

const MANIFESTO_POINTS = [
  {
    icon: Infinity,
    title: "L'abondance est un droit, pas un privilège",
    desc: "Chaque être humain mérite de vivre dans le plaisir, la santé et la dignité — pas de survivre. L'humanité produit assez pour nourrir, loger et éduquer 10 milliards de personnes. Le problème n'est pas la pénurie, c'est la distribution.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Shield,
    title: "Zéro publicité. Zéro manipulation.",
    desc: "CirculAI Hub ne vend aucun espace publicitaire. Jamais. Notre seul moteur de visibilité : le référencement naturel et éthique. Les algorithmes ici travaillent POUR vous, pas contre vous.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Heart,
    title: "Toutes les croyances sont les bienvenues",
    desc: "Chrétien, musulman, bouddhiste, athée, spirituel, animiste, scientifique — toutes les visions du monde ont leur place ici. Nous croyons que la diversité des croyances enrichit l'humanité. La seule règle : le respect.",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    icon: Crown,
    title: "Le luxe pour chaque citoyen",
    desc: "Le luxe ne devrait pas être réservé aux 1%. Santé mentale, alimentation saine, logement digne, accès à la culture, au repos, à la joie — voilà le vrai luxe. CirculAI Hub redistribue cette richesse à travers l'économie circulaire.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Eye,
    title: "Transparence absolue",
    desc: "Nos revenus, notre code, notre gouvernance — tout est visible. Pas d'actionnaires anonymes, pas de paradis fiscal, pas de lobbying. Chaque dollar généré est tracé et redistribué selon la Charte Robin Hood.",
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    icon: Flame,
    title: "La collaboration, pas la domination",
    desc: "Nous n'utilisons que le côté lumineux de ces géants. Leurs ingénieurs, leurs infrastructures, leur recherche — au service du bien commun. Finis les abus de position dominante. Bienvenue dans l'ère de la co-création.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

export default function Alliance() {
  return (
    <div className="space-y-20 pb-20">

      {/* ── HERO ── */}
      <section className="relative rounded-3xl overflow-hidden text-center"
        style={{ background: "linear-gradient(135deg, hsl(260,60%,12%) 0%, hsl(220,50%,10%) 40%, hsl(158,50%,10%) 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <Globe className="h-96 w-96 text-white" />
        </div>
        <div className="relative z-10 px-8 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs text-white/80 font-medium tracking-wide">Alliance Mondiale — Côté Lumière Uniquement</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            L'Alliance des<br />
            <span className="text-yellow-400">Géants du Bien</span>
          </h1>
          <p className="text-white/65 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Google, Meta, Microsoft, OpenAI, Apple… Leurs technologies au service de l'humanité entière. 
            Pas de publicité. Pas de manipulation. Juste le meilleur de chacun, 
            pour que chaque citoyen vive dans l'abondance et le plaisir.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold shadow-xl px-8">
              <Link to="/charte">📜 Voir la Charte Robin Hood <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl border-white/25 text-white hover:bg-white/10">
              <Link to="/abonnement">Rejoindre le mouvement</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── MANIFESTE ── */}
      <section>
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Notre Manifeste</Badge>
          <h2 className="font-display text-3xl font-bold text-foreground">On a fini de se faire avoir.</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Un monde où les plus riches s'enrichissent sur le dos de milliards de personnes — c'est terminé. 
            Voici les piliers de notre révolution douce mais radicale.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {MANIFESTO_POINTS.map((p) => (
            <div key={p.title} className={`${p.bg} rounded-2xl p-6 border border-transparent hover:shadow-md transition-all flex gap-4`}>
              <div className="shrink-0">
                <p.icon className={`h-7 w-7 ${p.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ALLIES ── */}
      <section>
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-yellow-100 text-yellow-800 border-yellow-200">Partenaires Alliance</Badge>
          <h2 className="font-display text-3xl font-bold text-foreground">Les Géants — Côté Lumière</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Chaque organisation a un côté sombre et un côté lumineux. CirculAI Hub ne collabore 
            qu'avec le meilleur d'eux-mêmes — leurs ingénieurs, leurs chercheurs, leurs initiatives positives.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ALLIES.map((ally) => (
            <div key={ally.name}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all hover:border-primary/20 group">
              <div className="flex items-center gap-4 mb-4">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${ally.color} flex items-center justify-center text-2xl shadow-md`}>
                  {ally.logo}
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">{ally.name}</h3>
                  <p className="text-xs text-muted-foreground">{ally.contribution}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{ally.positive}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NO ADS PLEDGE ── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-center">
        <Shield className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
        <h2 className="font-display text-3xl font-bold text-white mb-4">
          Zéro Publicité. Pour Toujours.
        </h2>
        <p className="text-white/65 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
          CirculAI Hub ne vendra jamais d'espace publicitaire. Jamais de bannières, 
          jamais de ciblage comportemental, jamais de vente de vos données à des annonceurs. 
          Notre seule source de visibilité : un <strong className="text-white">référencement éthique et transparent</strong>. 
          Ce qui mérite d'être trouvé sera trouvé — point final.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { emoji: "🚫", label: "Zéro bannière publicitaire" },
            { emoji: "🔒", label: "Zéro vente de données" },
            { emoji: "✅", label: "Référencement 100% éthique" },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white/80">
              {item.emoji} {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── ABUNDANCE VISION ── */}
      <section className="relative rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(42,90%,50%) 0%, hsl(35,95%,55%) 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <Sun className="h-96 w-96 text-white" />
        </div>
        <div className="relative z-10 px-8 py-14 sm:py-20 text-center">
          <Crown className="h-12 w-12 text-white mx-auto mb-4 opacity-90" />
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Le luxe, pour chaque être humain.
          </h2>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-4">
            On ne parle pas de jets privés et de châteaux. On parle du vrai luxe : 
            dormir sans angoisse, manger à sa faim, avoir accès aux soins, 
            à la culture, à la joie, à la nature, au repos. 
            <strong className="text-white"> Tout le monde mérite ça.</strong> Sans exception.
          </p>
          <p className="text-white/60 text-sm max-w-xl mx-auto leading-relaxed">
            Toutes les croyances sont les bienvenues ici — scientifiques, spirituelles, religieuses, philosophiques. 
            Car au fond, peu importe comment on appelle la source de la vie, 
            nous partageons tous la même humanité. 🙏
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center bg-card rounded-3xl border border-border p-10">
        <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">
          Rejoignez l'Alliance. Changez le monde.
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Chaque membre de CirculAI Hub est un ambassadeur de ce nouveau contrat social. 
          Ensemble, on est plus forts que n'importe quel géant.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg" className="rounded-xl font-bold shadow-md">
            <Link to="/publier">✨ Commencer gratuitement</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link to="/jeu">🎮 Jouer pour le bien</Link>
          </Button>
        </div>
      </section>

    </div>
  );
}