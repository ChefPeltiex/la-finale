import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import EncyclopediePlancheFallback from "@/components/encyclopedie/EncyclopediePlancheFallback";
import PlancheOrFrame from "@/components/encyclopedie/PlancheOrFrame";
import {
  ENCYCLOPEDIE_GRANDS_ARTICLES,
  plancheImageUrl,
} from "@/data/encyclopedieGrandsArticles";
import { getPlancheTexte } from "@/lib/encyclopediePlanches";

export default function EncyclopedieArticle() {
  const { id } = useParams();
  const article = useMemo(
    () => ENCYCLOPEDIE_GRANDS_ARTICLES.find((a) => a.id === id),
    [id],
  );
  const planche = article ? getPlancheTexte(article.planche) : null;
  const index = article ? ENCYCLOPEDIE_GRANDS_ARTICLES.findIndex((a) => a.id === id) : -1;
  const prev = index > 0 ? ENCYCLOPEDIE_GRANDS_ARTICLES[index - 1] : null;
  const next = index >= 0 && index < ENCYCLOPEDIE_GRANDS_ARTICLES.length - 1
    ? ENCYCLOPEDIE_GRANDS_ARTICLES[index + 1]
    : null;

  const [md, setMd] = useState("");
  const [mdError, setMdError] = useState(null);
  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    if (!article?.volumeMd) return;
    let cancelled = false;
    setMdError(null);
    fetch(article.volumeMd)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        if (!cancelled) setMd(text);
      })
      .catch((e) => {
        if (!cancelled) setMdError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-[#F5F0E6] px-4 py-20 text-center">
        <p className="text-[#FFD700] mb-4">Chapitre introuvable.</p>
        <Link to="/encyclopedie" className="text-[#D4AF37] hover:underline">
          Retour à l&apos;encyclopédie
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-black text-[#F5F0E6]">
      <SEOMeta
        title={`${article.num}. ${article.title} | Encyclopédie`}
        description={planche?.body?.slice(0, 160) ?? article.title}
        canonicalUrl={`/encyclopedie/lire/${article.id}`}
      />

      <section className="relative min-h-[72vh] flex flex-col justify-end overflow-hidden">
        {imgOk ? (
          <img
            src={plancheImageUrl(article.planche)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImgOk(false)}
          />
        ) : (
          <EncyclopediePlancheFallback num={article.num} title={article.title} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        <div className="absolute inset-4 md:inset-8 border border-[#D4AF37]/45 rounded-lg pointer-events-none" />

        <div className="relative z-10 px-4 pb-10 pt-24 max-w-3xl mx-auto text-center">
          <Sparkles className="h-5 w-5 text-[#FFD700] mx-auto mb-3 opacity-80" aria-hidden />
          <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-2">{article.num}.</p>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-[#FFD700] uppercase tracking-wide">
            {article.title}
          </h1>
          <div className="my-4 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#D4AF37]/50" />
            <span className="text-[#D4AF37] text-xs">◆</span>
            <span className="h-px w-16 bg-[#D4AF37]/50" />
          </div>
          <p className="text-xs md:text-sm tracking-widest text-[#F5F0E6]/80 uppercase">
            {article.keywords.join(" · ")}
          </p>
        </div>
      </section>

      <div className="px-4 py-10 max-w-3xl mx-auto space-y-10">
        <Link
          to="/encyclopedie"
          className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#FFD700] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Toutes les planches
        </Link>

        {planche && (
          <PlancheOrFrame className="p-6 md:p-8 bg-zinc-950/90">
            <h2 className="font-display text-lg text-[#FFD700] mb-4">{planche.title}</h2>
            <p className="text-[#F5F0E6]/90 leading-relaxed text-base md:text-lg">{planche.body}</p>
            {planche.legend && (
              <blockquote className="mt-6 border-l-2 border-[#FFD700]/60 pl-4 text-[#D4AF37] italic text-sm md:text-base">
                {planche.legend}
              </blockquote>
            )}
          </PlancheOrFrame>
        )}

        {md && (
          <section className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-[#FFD700] prose-headings:tracking-wide prose-p:text-[#F5F0E6]/90 prose-strong:text-[#FFD700] prose-blockquote:border-[#D4AF37] prose-blockquote:text-[#F5F0E6]/80 prose-a:text-[#D4AF37]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
          </section>
        )}
        {mdError && (
          <p className="text-sm text-amber-400/90">
            Chapitre markdown en préparation ({mdError}). Lancez{" "}
            <code className="text-[#FFD700]">npm run encyclopedie:public</code>.
          </p>
        )}

        {article.maillage?.length > 0 && (
          <PlancheOrFrame className="p-5">
            <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-3">Maillage</h3>
            <p className="text-sm text-[#F5F0E6]/70 font-mono">{article.maillage.join(" · ")}</p>
          </PlancheOrFrame>
        )}

        <nav className="flex flex-wrap justify-between gap-4 pt-6 border-t border-[#D4AF37]/20">
          {prev ? (
            <Link
              to={`/encyclopedie/lire/${prev.id}`}
              className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#FFD700]"
            >
              <ArrowLeft className="h-4 w-4" />
              {prev.num}. {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/encyclopedie/lire/${next.id}`}
              className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#FFD700] ml-auto text-right"
            >
              {next.num}. {next.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
