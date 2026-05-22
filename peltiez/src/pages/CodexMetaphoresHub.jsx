import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, MapPin, Recycle } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import CodexCopyBlock from "@/components/codex/CodexCopyBlock";
import CodexMetaphoreCard from "@/components/codex/CodexMetaphoreCard";
import {
  CODEX_GALERIE,
  CODEX_HEADER,
  CODEX_MEMO,
  CODEX_PANNEAUX,
  CODEX_PLANCHES_HERO,
  CODEX_RESONANCES_MATH,
  codexPlancheUrl,
} from "@/data/codexMetaphores";
import { CODEX_RESONANCES_ETENDUES } from "@/data/codexResonancesEtendues";
import { COPY_BLOCKS, LINK_PLAYBOOK } from "@/data/codexValorisation";
import { INTEGRITY_PLEDGE, STRETCH_ALLOWED, TEAM_SLOGAN } from "@/lib/codexIntegrity";
import {
  BINARY_CHOICE,
  GOLDEN_BALANCE,
  NOUVEAU_CHIC,
  SOLIDITE_COLLECTIVE,
  TREASURE_HUNT,
} from "@/lib/math/consumerEquations";
import { CIRCULAI_BRAND, SITE_ORIGIN } from "@/lib/site";
import { Button } from "@/components/ui/button";

export default function CodexMetaphoresHub() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950/30 via-zinc-950 to-black text-white">
      <SEOMeta
        title="Codex · images métaphoriques"
        description="Jumeaux CirculAI & Egor69, œil, pont, algoRYTHME — chasse au trésor responsable au Québec."
        canonicalUrl={`${SITE_ORIGIN}/codex-metaphores`}
      />

      <header className="border-b border-amber-500/20">
        <div className="container max-w-4xl py-10 px-4">
          <Link to="/seconde-main" className="inline-flex items-center gap-2 text-sm text-amber-300/80 hover:text-amber-200 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Seconde main Québec
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-400">Or & noir · Larousse vivant</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Codex · images métaphoriques</h1>
          <p className="mt-4 text-white/70 max-w-2xl leading-relaxed">
            Synthèse de ce que vous avez exploré hier : pas un PDF de 60 Mo, mais des <strong className="text-amber-200">symboles qui restent</strong>{" "}
            — reliés au marché local et à l&apos;encyclopédie, sans mélanger les rôles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            {Object.values(CODEX_HEADER).map((h) => (
              <span
                key={h.label}
                className="rounded-full border border-amber-500/30 bg-black/50 px-3 py-1.5 text-amber-100/90"
              >
                <span className="font-semibold text-amber-300">{h.label}</span>
                <span className="text-white/50"> · {h.tag}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="container max-w-4xl px-4 py-12 space-y-16">
        <section>
          <h2 className="text-xl font-bold text-[#FFD700]">Planches illustrées</h2>
          <p className="mt-2 text-sm text-white/60">Tes visuels Codex — style Larousse, or et noir.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CODEX_PLANCHES_HERO.map((p) => (
              <figure
                key={p.id}
                className="rounded-xl overflow-hidden border border-[#D4AF37]/35 bg-black group"
              >
                <img
                  src={codexPlancheUrl(p.file)}
                  alt=""
                  className="w-full h-auto object-cover max-h-[420px]"
                  loading="lazy"
                />
                <figcaption className="p-3 border-t border-[#D4AF37]/20">
                  <p className="font-semibold text-[#FFD700] text-sm">{p.title}</p>
                  <p className="text-xs text-white/55 mt-1">{p.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-amber-200/90">Panneaux du Codex</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
            {CODEX_PANNEAUX.map((p) => (
              <li key={p.id} className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-3">
                <p className="font-semibold text-amber-100">{p.title}</p>
                <p className="mt-1 text-white/65">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-amber-200">Galerie symbolique</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {CODEX_GALERIE.map((item) => (
              <CodexMetaphoreCard key={item.id} item={item} />
            ))}
          </div>
          <p className="mt-6 text-sm text-white/50 italic text-center max-w-xl mx-auto">{CODEX_MEMO}</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-sky-200">Équations utiles (sans prétention)</h2>
          <div className="font-mono text-center text-lg sm:text-xl text-emerald-300/95">{NOUVEAU_CHIC.plain}</div>
          <div className="font-mono text-center text-base text-amber-200/90">{GOLDEN_BALANCE.plain}</div>
          <p className="text-sm text-white/55 text-center max-w-lg mx-auto">{GOLDEN_BALANCE.hint}</p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-white/10 p-4">
              <p className="font-semibold text-white">{BINARY_CHOICE.plain}</p>
              <p className="mt-2 text-white/55">{BINARY_CHOICE.hint}</p>
            </div>
            <div className="rounded-xl border border-white/10 p-4">
              <p className="font-semibold text-white">{SOLIDITE_COLLECTIVE.plain}</p>
              <p className="mt-2 text-white/55">{SOLIDITE_COLLECTIVE.hint}</p>
            </div>
          </div>
          <p className="text-center text-amber-100/80 font-medium">{TREASURE_HUNT.title}</p>
          <p className="text-sm text-white/55 text-center">{TREASURE_HUNT.hint}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-violet-200">Résonances (grilles maths d&apos;hier)</h2>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3">
            {CODEX_RESONANCES_MATH.map((r) => (
              <li key={r.id} className="rounded-xl border border-violet-500/20 bg-violet-950/10 p-4">
                <h3 className="font-semibold text-violet-100">{r.title}</h3>
                <p className="mt-2 text-sm text-white/65 leading-relaxed">{r.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-sky-200">Résonances étendues → routes produit</h2>
          <ul className="mt-6 space-y-2">
            {CODEX_RESONANCES_ETENDUES.map((r) => (
              <li key={r.id} className="rounded-xl border border-sky-500/20 bg-sky-950/10 px-4 py-3 flex flex-wrap gap-2 items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-sky-400 uppercase tracking-wide">{r.tag}</span>
                  <h3 className="font-semibold text-white text-sm">{r.title}</h3>
                  <p className="text-xs text-white/60 mt-1 max-w-xl">{r.body}</p>
                </div>
                {r.route && (
                  <Link to={r.route} className="text-xs text-sky-300 hover:underline shrink-0">
                    Ouvrir →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="valoriser" className="rounded-2xl border border-emerald-500/25 bg-emerald-950/15 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-emerald-200">Valoriser — sans trahir l&apos;essence</h2>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            Passer un peu par-dessus le discours pour convaincre, oui — mais la ligne rouge tient. Slogan équipe :{" "}
            <em className="text-amber-200/90">{TEAM_SLOGAN}</em>
          </p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-3">
            {STRETCH_ALLOWED.items.map((s) => (
              <li key={s.id} className="rounded-lg border border-white/10 p-3 text-sm">
                <p className="font-semibold text-emerald-200">{s.bold}</p>
                <p className="mt-1 text-white/60">{s.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-3">
            {COPY_BLOCKS.map((b) => (
              <CodexCopyBlock key={b.id} title={b.title} audience={b.audience} body={b.body} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6">
          <h2 className="text-lg font-bold text-red-200/90">{INTEGRITY_PLEDGE.title}</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/65 space-y-1">
            {INTEGRITY_PLEDGE.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-sky-500/25 bg-sky-950/15 p-6">
          <h2 className="text-lg font-bold text-sky-200">Prompts IA (articles du web → ton projet)</h2>
          <p className="mt-2 text-sm text-white/65">
            Méta-prompt « écouter d&apos;abord », challenger, pilote mairie, Facebook seconde main, data pilote — avec garde-fou intégré.
          </p>
          <Button asChild className="mt-4 bg-sky-600 hover:bg-sky-500 rounded-xl">
            <Link to="/circulai/prompts-ia">Ouvrir les prompts à copier</Link>
          </Button>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">1 lien selon le public</h2>
          <ul className="mt-3 text-sm space-y-2">
            {LINK_PLAYBOOK.map((l) => (
              <li key={l.path}>
                <span className="text-white/45">{l.context} · </span>
                <Link to={l.path} className="text-amber-300 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-wrap gap-3 justify-center pb-8">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-500 rounded-xl">
            <Link to="/seconde-main#inscription">Rejoindre la boucle</Link>
          </Button>
          <Button asChild variant="outline" className="border-amber-500/40 rounded-xl">
            <Link to="/circulai/equation-pilote">Pilote 90 j (mairie)</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 rounded-xl">
            <Link to="/encyclopedie">
              <BookOpen className="h-4 w-4 mr-2" />
              Encyclopédie
            </Link>
          </Button>
        </section>

        <footer className="text-center text-xs text-white/40 pb-10 flex items-center justify-center gap-2">
          <Recycle className="h-3.5 w-3.5" aria-hidden />
          {CIRCULAI_BRAND} · terrain
          <span className="text-white/25">|</span>
          Egor69 · culture
          <MapPin className="h-3.5 w-3.5 ml-1" aria-hidden />
          Québec
        </footer>
      </div>
    </div>
  );
}
