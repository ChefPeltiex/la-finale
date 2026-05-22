import { useState } from "react";
import { Link } from "react-router-dom";
import { plancheImageUrl } from "@/data/encyclopedieGrandsArticles";
import EncyclopediePlancheFallback from "@/components/encyclopedie/EncyclopediePlancheFallback";

export default function PlancheHeroCard({ article }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <Link
      to={`/encyclopedie/lire/${article.id}`}
      className="group block rounded-xl overflow-hidden border border-[#D4AF37]/35 bg-black hover:border-[#FFD700]/70 transition-all"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
        {imgOk ? (
          <img
            src={plancheImageUrl(article.planche)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <EncyclopediePlancheFallback num={article.num} title={article.title} compact />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-3 border border-[#D4AF37]/50 rounded-lg pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
          <p className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase mb-1">{article.num}.</p>
          <h3 className="font-display text-sm font-bold text-[#FFD700] uppercase leading-snug">{article.title}</h3>
          <p className="mt-2 text-[10px] text-[#F5F0E6]/70">{article.keywords.join(" · ")}</p>
        </div>
      </div>
    </Link>
  );
}
