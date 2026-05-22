import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import { assignHilbertLayout, sortMaillageIds } from "@/lib/math/peanoBridge";

export default function EncyclopedieMaillageFiche() {
  const { ficheId } = useParams();
  const [md, setMd] = useState("");
  const [nav, setNav] = useState({ prev: null, next: null, index: 0, total: 0 });

  useEffect(() => {
    if (!ficheId) return;
    let cancelled = false;
    fetch(`/docs/encyclopedie/generated/maillage/${ficheId}.md`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((text) => {
        if (!cancelled) setMd(text);
      })
      .catch(() => {
        if (!cancelled) setMd("");
      });
    return () => {
      cancelled = true;
    };
  }, [ficheId]);

  useEffect(() => {
    let cancelled = false;
    fetch("/docs/encyclopedie/generated/ensemble-manifest.json")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const fiches = (data.spine || []).filter((x) => x.type === "fiche-maillage");
        const ids = sortMaillageIds(fiches.map((f) => f.id));
        const layout = assignHilbertLayout(ids);
        const i = layout.findIndex((x) => x.id === ficheId);
        setNav({
          index: i,
          total: layout.length,
          prev: i > 0 ? layout[i - 1] : null,
          next: i >= 0 && i < layout.length - 1 ? layout[i + 1] : null,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ficheId]);

  return (
    <article className="min-h-screen bg-black text-[#F5F0E6] px-4 py-10">
      <SEOMeta title={`Fiche ${ficheId} | Encyclopédie`} canonicalUrl={`/encyclopedie/maillage/${ficheId}`} />
      <div className="max-w-3xl mx-auto">
        <Link to="/encyclopedie/atlas-peano" className="inline-flex items-center gap-2 text-sm text-[#D4AF37] mb-6">
          <ArrowLeft className="h-4 w-4" />
          Atlas Peano
        </Link>
        {nav.total > 0 && (
          <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4">
            Parcours {nav.index + 1} / {nav.total}
          </p>
        )}
        {md ? (
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-[#FFD700] prose-a:text-[#D4AF37]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-amber-200/80 text-sm">
            Fiche introuvable. Lancez <code className="text-[#FFD700]">npm run encyclopedie:public</code>.
          </p>
        )}
        <nav className="flex justify-between gap-4 mt-10 pt-6 border-t border-[#D4AF37]/20">
          {nav.prev ? (
            <Link to={`/encyclopedie/maillage/${nav.prev.id}`} className="text-sm text-[#D4AF37] flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> {nav.prev.id}
            </Link>
          ) : (
            <span />
          )}
          {nav.next && (
            <Link
              to={`/encyclopedie/maillage/${nav.next.id}`}
              className="text-sm text-[#D4AF37] flex items-center gap-1 ml-auto"
            >
              {nav.next.id} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
