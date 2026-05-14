import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap, Flame, Eye, Copy, Share2, Sparkles } from "lucide-react";

const CAMPAIGNS = [
  {
    title: "Le Défi Viral — TikTok/Reels",
    hook: "J'ai reçu 10 objets de designer GRATUITEMENT",
    format: "15s video",
    angle: "Unboxing + transformation story",
    vibe: "FOMO energy · Gold aesthetics · Text-to-speech hook",
    cta: "#CirculAIHub #EconomieCirculaire #Luxepourtous",
    color: "from-yellow-400 to-orange-500"
  },
  {
    title: "Le Manifeste — Instagram Stories",
    hook: "Pendant que vous scrollez, 8 milliards vivent sans luxe",
    format: "Story series (8 slides)",
    angle: "Social consciousness + aspirational visuals",
    vibe: "Aesthetic doom-scrolling · Inspiring fade-to-action",
    cta: "Swipe up: Rejoindre la révolution",
    color: "from-pink-500 to-rose-600"
  },
  {
    title: "Le Contraste Brutal — YouTube Pre-Roll",
    hook: "Meta gagne 50€ de vos données · CirculAI Hub vous rend riche",
    format: "6s unskippable",
    angle: "Platform criticism without naming them",
    vibe: "Clean white text · Dark background · Direct confrontation",
    cta: "Découvrir la plateforme zéro-vol",
    color: "from-red-600 to-crimson-700"
  },
  {
    title: "Le Testimony Effect — LinkedIn",
    hook: "Chômeur → Réparation artisan → 2000€/mois",
    format: "Article + video",
    angle: "B2B confidence · Real human impact",
    vibe: "Professional but heart-felt · Stats + emotion",
    cta: "Lire l'histoire complète",
    color: "from-blue-600 to-cyan-500"
  },
  {
    title: "L'Absurde Viral — Twitter/X",
    hook: "Google: tracks 10,000 data points/day\nCirculAI Hub: actually gives a f***",
    format: "Tweet + thread",
    angle: "Humor meets real critique",
    vibe: "Chaotic good · Raw language · Amplify with retweets",
    cta: "This is not a joke. Join the movement.",
    color: "from-slate-700 to-slate-900"
  },
  {
    title: "L'Épée Visuelle — Pinterest",
    hook: "Sustainable living, luxury edition",
    format: "Vertical pins (1000x1500px)",
    angle: "Aesthetic aspirational",
    vibe: "Mood board meets marketplace · Dream + action",
    cta: "Save + Shop responsibly",
    color: "from-emerald-400 to-teal-600"
  },
  {
    title: "La Transparence Radicale — Reddit",
    hook: "We're not perfect. Here's what we're fixing.",
    format: "AMA (Ask Me Anything)",
    angle: "Anti-marketing marketing · Honesty as strategy",
    vibe: "Raw conversation · No corporate BS",
    cta: "Ask anything. We'll answer.",
    color: "from-orange-500 to-red-600"
  },
  {
    title: "Le Défi Émotionnel — Everywhere",
    hook: "Tag someone whose life needs CirculAI Hub",
    format: "Organic shares + challenges",
    angle: "Word-of-mouth amplification",
    vibe: "Community-driven · Viral ripple effect",
    cta: "@username tu dois voir ça",
    color: "from-purple-500 to-pink-600"
  },
];

export default function Campaigns() {
  return (
    <div className="pb-20 space-y-12">
      {/* Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        
        <div className="space-y-4">
          <Badge className="bg-orange-100 text-orange-800 border-orange-300">🔥 Stratégie Marketing</Badge>
          <h1 className="font-display text-5xl font-black text-foreground">
            On joue leur jeu.<br />
            <span className="text-orange-500">Mais notre terrain.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Bombarder les autres plateformes avec la vérité simple : 
            <strong className="text-foreground"> sur CirculAI Hub, zéro pub, zéro vol de données.</strong>
            <br />
            Viral. Authentique. Irrésistible.
          </p>
        </div>
      </div>

      {/* Campaign cards */}
      <div className="space-y-4">
        {CAMPAIGNS.map((campaign, i) => (
          <div key={i} className={`bg-gradient-to-r ${campaign.color} rounded-2xl p-6 text-white overflow-hidden group hover:shadow-2xl transition-all`}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold mb-1">{campaign.title}</h3>
                <p className="text-white/90 text-lg font-semibold italic">"{campaign.hook}"</p>
              </div>
              <Sparkles className="h-6 w-6 text-white/50 flex-shrink-0" />
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20 space-y-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Format</p>
                <p className="text-sm font-medium text-white">{campaign.format}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Angle</p>
                <p className="text-sm text-white/90">{campaign.angle}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Vibe</p>
                <p className="text-sm text-white/90">{campaign.vibe}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">CTA</p>
                <p className="text-sm font-medium text-white">{campaign.cta}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="rounded-lg bg-white/20 hover:bg-white/30 text-white border border-white/30 gap-2">
                <Copy className="h-3.5 w-3.5" /> Copier le brief
              </Button>
              <Button size="sm" className="rounded-lg bg-white/20 hover:bg-white/30 text-white border border-white/30 gap-2">
                <Share2 className="h-3.5 w-3.5" /> Partager
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* The contrast message */}
      <section className="relative rounded-3xl overflow-hidden p-12 text-center border-4 border-primary"
        style={{ background: "linear-gradient(135deg, hsl(158,60%,8%) 0%, hsl(220,40%,5%) 100%)" }}>
        <div className="space-y-6">
          <Eye className="h-16 w-16 text-primary mx-auto animate-pulse" />
          <div>
            <p className="font-display text-2xl font-bold text-white mb-3">
              Eux : publicités ciblées basées sur vos données
            </p>
            <p className="font-display text-2xl font-bold text-primary">
              Nous : AUCUNE publicité. AUCUN vol. Juste la plateforme.
            </p>
          </div>
          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
            Pendant que Facebook/Google/TikTok créent des microtargets pour vendre vos pensées,
            <br />
            CirculAI Hub crée une économie où tu restes libre et ton data reste tienne.
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-5 py-2">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">C'est pas un slogan. C'est notre code.</span>
          </div>
        </div>
      </section>

      {/* Deployment checklist */}
      <section className="bg-card rounded-2xl border border-border p-8">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" /> Plan de déploiement — 19h00 ET
        </h2>
        <div className="space-y-3">
          {[
            "19:00 — Post simultanés sur TikTok, Reels, Shorts (viral hooks)",
            "19:15 — LinkedIn article + Twitter thread (credibility + reach)",
            "19:30 — Reddit AMA goes live (community engagement)",
            "19:45 — YouTube pre-roll activation (forced awareness)",
            "20:00 — Instagram story series + Pinterest pins flood (sustained impressions)",
            "Ongoing — Organic sharing + influencer tags (exponential growth)",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="h-6 w-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                {i + 1}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center space-y-6 py-10">
        <h2 className="font-display text-3xl font-bold text-foreground">
          La révolution commença ce soir.<br />
          <span className="text-orange-500">Partout en même temps.</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          8 milliards de personnes vont voir que c'est possible de vivre mieux,
          <br />
          sans donner leurs âmes aux GAFAM.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-6">
          <Button asChild size="lg" className="rounded-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 border-0">
            <Link to="/publier">🔥 Déballer mon cadeau ce soir</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl font-bold">
            <Link to="/">← Retour à l'empire</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}