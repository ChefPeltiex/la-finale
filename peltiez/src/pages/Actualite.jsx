import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Globe, Music, DollarSign, Zap, AlertTriangle, RefreshCw,
  ArrowRight, TrendingDown, Fuel, ShoppingCart, Swords, Recycle,
  Leaf, BarChart3, Lightbulb, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  "Économie":       { icon: DollarSign, color: "bg-amber-100 text-amber-700 border-amber-200" },
  "Souveraineté":   { icon: Globe,      color: "bg-blue-100 text-blue-700 border-blue-200" },
  "Arts & Culture": { icon: Music,      color: "bg-purple-100 text-purple-700 border-purple-200" },
  "Géopolitique":   { icon: Swords,     color: "bg-red-100 text-red-700 border-red-200" },
  "Inflation":      { icon: TrendingDown, color: "bg-orange-100 text-orange-700 border-orange-200" },
  "Résistance":     { icon: Zap,        color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

const CIRCULAR_TAG_ICONS = {
  "Réglementation": { icon: Building2, color: "bg-blue-100 text-blue-700 border-blue-200" },
  "Innovation":     { icon: Lightbulb, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  "Marché":         { icon: BarChart3, color: "bg-violet-100 text-violet-700 border-violet-200" },
  "Politique":      { icon: Globe,     color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  "Impact":         { icon: Leaf,      color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  "Startup":        { icon: Zap,       color: "bg-pink-100 text-pink-700 border-pink-200" },
};

function CircularNewsCard({ item }) {
  const tagCfg = CIRCULAR_TAG_ICONS[item.tag] || CIRCULAR_TAG_ICONS["Impact"];
  const TagIcon = tagCfg.icon;
  return (
    <div className="bg-card rounded-2xl border border-emerald-200/50 p-5 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl">{item.emoji}</span>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${tagCfg.color}`}>
          <TagIcon className="h-3 w-3" /> {item.tag}
        </div>
      </div>
      <h3 className="font-display font-bold text-foreground text-base leading-snug">{item.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.summary}</p>
      <div className="flex items-center justify-between gap-2 pt-1">
        {item.stat && (
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <Recycle className="h-3 w-3" /> {item.stat}
          </div>
        )}
        {item.source_hint && (
          <span className="text-[10px] text-muted-foreground italic truncate">{item.source_hint}</span>
        )}
      </div>
      {item.source_region && (
        <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
          <Globe className="h-3 w-3" /> {item.source_region}
        </div>
      )}
    </div>
  );
}

const LIVE_STATS = [
  { icon: Fuel,         label: "Prix du gaz",         value: "2,14 $/L",   delta: "+18% vs 2023",  color: "text-red-600",    bg: "bg-red-50" },
  { icon: ShoppingCart, label: "Panier alimentaire",   value: "+23%",       delta: "vs 2021",       color: "text-orange-600", bg: "bg-orange-50" },
  { icon: DollarSign,   label: "Dette US",             value: "35 T $",     delta: "+4T en 2 ans",  color: "text-amber-700",  bg: "bg-amber-50" },
  { icon: Globe,        label: "Pays sous sanctions",  value: "40+",        delta: "par les USA",   color: "text-blue-700",   bg: "bg-blue-50" },
];

function ArticleCard({ article }) {
  const catCfg = CATEGORY_ICONS[article.category] || CATEGORY_ICONS["Économie"];
  const Icon = catCfg.icon;
  return (
    <div className={cn(
      "bg-card rounded-2xl border p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-3",
      article.is_urgent ? "border-red-200 ring-1 ring-red-100" : "border-border"
    )}>
      {article.is_urgent && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
          <AlertTriangle className="h-3.5 w-3.5" /> URGENT
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl">{article.emoji}</span>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${catCfg.color}`}>
          <Icon className="h-3 w-3" /> {article.category}
        </div>
      </div>
      <h3 className="font-display font-bold text-foreground text-base leading-snug">{article.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{article.summary}</p>
      {article.impact && (
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full w-fit">
          <Zap className="h-3 w-3" /> {article.impact}
        </div>
      )}
    </div>
  );
}

export default function Actualite() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["actualite", refreshKey],
    queryFn: () => base44.functions.invoke("getActualite", {}).then(r => r.data),
    staleTime: 10 * 60_000,
  });

  const articles = data?.articles || [];
  const circularNews = data?.circular_news || [];

  return (
    <div className="pb-20 space-y-10">

      {/* ── HEADER ── */}
      <section className="relative rounded-3xl overflow-hidden" style={{background: "linear-gradient(135deg, hsl(0,70%,15%) 0%, hsl(220,60%,12%) 50%, hsl(158,60%,12%) 100%)"}}>
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <Globe className="h-80 w-80 text-white" />
        </div>
        <div className="relative z-10 p-8 sm:p-12">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-1.5 mb-5">
            <div className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs font-bold text-red-300 tracking-wide uppercase">Actualité indépendante — Non censurée</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Le monde tel qu'il est.<br />
            <span className="text-emerald-400">Pas tel qu'on vous le vend.</span>
          </h1>
          <p className="text-white/65 text-lg max-w-2xl leading-relaxed mb-6">
            Inflation, géopolitique, souveraineté des peuples, arts de résistance. Ici, les faits parlent. L'argent du peuple appartient au peuple.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => { setRefreshKey(k => k + 1); refetch(); }} variant="outline" size="sm"
              className="rounded-xl border-white/25 text-white hover:bg-white/10 gap-2" disabled={isFetching}>
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
              {isFetching ? "Actualisation…" : "Actualiser"}
            </Button>
            <Button asChild size="sm" className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold gap-2">
              <Link to="/abonnement">Soutenir la plateforme <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section>
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-4">📊 Réalité économique mondiale — Mai 2026</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LIVE_STATS.map(({ icon: Icon, label, value, delta, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 border border-border text-center`}>
              <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-foreground font-medium mt-0.5">{label}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{delta}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">À la une</h2>
            <p className="text-sm text-muted-foreground">Analyse indépendante · IA + sources vérifiées</p>
          </div>
          {data?.editorial_note && (
            <Badge variant="outline" className="text-xs max-w-xs truncate">{data.editorial_note}</Badge>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-5 animate-pulse space-y-3">
                <div className="h-5 bg-muted rounded w-1/3" />
                <div className="h-6 bg-muted rounded w-full" />
                <div className="h-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article, i) => <ArticleCard key={article.id ?? i} article={article} />)}
          </div>
        )}
      </section>

      {/* ── ÉCONOMIE CIRCULAIRE — LIVE FEED ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <Recycle className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold text-foreground">Économie Circulaire</h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Live</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{data?.circular_headline || "Actualités mondiales · Réglementation · Innovation · Impact"}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-emerald-200/30 p-5 animate-pulse space-y-3">
                <div className="h-5 bg-muted rounded w-1/3" />
                <div className="h-6 bg-muted rounded w-full" />
                <div className="h-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : circularNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {circularNews.map((item, i) => <CircularNewsCard key={i} item={item} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-emerald-200">
            <Recycle className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
            <p className="text-muted-foreground">Actualisation du fil circulaire en cours…</p>
          </div>
        )}
      </section>

      {/* ── CTA SOUVERAINETE ── */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-12 text-center border border-slate-700">
        <div className="text-4xl mb-4">✊</div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
          L'argent du peuple doit servir le peuple.
        </h2>
        <p className="text-white/60 max-w-xl mx-auto mb-8 text-base leading-relaxed">
          Chaque centime dépensé ici reste dans la communauté. Pas dans les poches des actionnaires de Wall Street. Soutenez une plateforme qui vous appartient vraiment.
        </p>
        <Button asChild size="lg" className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-xl px-8">
          <Link to="/abonnement">Rejoindre le mouvement →</Link>
        </Button>
      </section>

      {/* ── ARTS & CULTURE ── */}
      <section>
        <div className="text-center mb-6">
          <Badge className="mb-3 bg-purple-100 text-purple-700 border-purple-200">🎨 Arts & Culture</Badge>
          <h2 className="font-display text-2xl font-bold text-foreground">La culture, c'est la résistance</h2>
          <p className="text-muted-foreground mt-1 text-sm">Musique, peinture, littérature, cinéma — les arts qui disent ce que les médias taisent.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { emoji: "🎵", title: "Musique engagée", desc: "Des artistes du monde entier utilisent leur voix pour dénoncer l'injustice économique et sociale. Ces chansons ne passent pas à la radio.", tag: "Musique" },
            { emoji: "🎨", title: "Art de rue & murales", desc: "Dans les quartiers démunis de Montréal à Lagos, les murs parlent. Les fresques murales documentent ce que les livres d'histoire effacent.", tag: "Art visuel" },
            { emoji: "📚", title: "Littérature décoloniale", desc: "Une nouvelle génération d'auteurs africains, caribéens et autochtones réécrit l'histoire depuis leur propre regard. Lisez-les.", tag: "Littérature" },
          ].map((a) => (
            <div key={a.title} className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all hover:border-purple-200">
              <div className="text-3xl mb-3">{a.emoji}</div>
              <Badge className="mb-3 bg-purple-50 text-purple-700 border-purple-200 text-xs">{a.tag}</Badge>
              <h3 className="font-semibold text-foreground mb-2">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}