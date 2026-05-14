import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ARENA_ARCHETYPES,
  CAMP_CHAOS,
  CAMP_ORDER,
  archetypesByCamp,
} from "@/data/virtualArenaArchetypes";
import {
  VIRTUAL_CAMPAIGN_SEASONS,
  VIRTUAL_TACTICS,
  HISTORICAL_MEMORY_ANCHORS,
} from "@/data/virtualWarCalendar";
import { LIFE_PATH_SIMULATION_SEEDS } from "@/data/lifePathSimulationSeeds";
import { DIVINE_COMBAT_HEROES } from "@/data/divineCombatHeroes";
import { SITE_ORIGIN } from "@/lib/site";
import { recordRealmVisit } from "@/lib/worldPersistence";
import {
  AlertTriangle,
  Calendar,
  Shield,
  Skull,
  Swords,
  Users,
  Sprout,
  BookOpen,
  Sparkles,
} from "lucide-react";

export default function VirtualCampaignArena() {
  const [showMemory, setShowMemory] = useState(false);

  useEffect(() => {
    recordRealmVisit("virtual_campaign");
  }, []);

  const order = archetypesByCamp(CAMP_ORDER);
  const chaos = archetypesByCamp(CAMP_CHAOS);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white pb-24">
      <SEOMeta
        title="Arène virtuelle — coop, tactiques abstraites & simulations de vie"
        description="Gameplay narratif uniquement : escouades, saisons fictives, archétypes originaux. Pas de franchise tierce. Mémoire historique sobre. Semences de vie alignées don, échange, réparation."
        keywords="igor arène virtuelle, coop narratif, tactiques jeu, simulation vie durable"
        canonicalUrl={`${SITE_ORIGIN}/arene-virtuelle`}
      />

      <div className="max-w-5xl mx-auto px-4 pt-10 space-y-12">
        <header className="space-y-4">
          <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/40">100 % virtuel · PG · fiction</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight">
            Arène des campagnes imaginaires
          </h1>
          <p className="text-white/65 leading-relaxed max-w-3xl">
            Ici on invente des équipes et des « armées » de copains pour rigoler : coordonnées abstraites, bots satiriques,
            personnages <strong className="text-white">originaux</strong>. Le fil conducteur, c&apos;est l&apos;amour du jeu
            et du bonheur partagé : entraide, défoulement sans blesser, et plaisir qui ne passe pas sur le dos des vivants.
            Aucune violence réelle, aucune incitation à la haine, aucune reproduction de franchise protégée — d&apos;où des
            archétypes maison plutôt qu&apos;un roster tiers.
          </p>
          <div
            className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-sm text-amber-100/90"
            role="note"
          >
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <p>
              Les « guerres » ci-dessous sont des <strong>métaphores de saison jeu</strong>. La timeline historique est un
              rappel de mémoire civique — pas un mode de simulation de massacre.
            </p>
          </div>
        </header>

        {/* Personnages maison */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-400" />
            <h2 className="font-display text-2xl font-bold">Archétypes Ordre vs Chaos (originaux)</h2>
          </div>
          <p className="text-sm text-white/55 max-w-2xl">
            Douze figures du camp protecteur et douze du camp farceur — miroir moral léger, sans importer des personnages
            tiers.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="flex items-center gap-2 text-emerald-300 font-semibold mb-3">
                <Shield className="h-5 w-5" /> Ordre ({order.length})
              </h3>
              <ul className="space-y-3">
                {order.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3 text-sm"
                  >
                    <p className="font-semibold text-emerald-100">{a.title}</p>
                    <p className="text-white/45 text-xs mt-1">{a.vibe}</p>
                    <p className="text-white/65 text-xs mt-1">{a.hook}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-fuchsia-300 font-semibold mb-3">
                <Skull className="h-5 w-5" /> Chaos ludique ({chaos.length})
              </h3>
              <ul className="space-y-3">
                {chaos.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-950/15 px-4 py-3 text-sm"
                  >
                    <p className="font-semibold text-fuchsia-100">{a.title}</p>
                    <p className="text-white/45 text-xs mt-1">{a.vibe}</p>
                    <p className="text-white/65 text-xs mt-1">{a.hook}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-white/35">
            Total archétypes indexés : {ARENA_ARCHETYPES.length} — extensible par JSON sans toucher au moteur.
          </p>
        </section>

        {/* Panthéon divin — fiction originale */}
        <section className="space-y-6 rounded-3xl border border-amber-400/25 bg-gradient-to-b from-amber-950/30 to-zinc-950/40 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-amber-300" />
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-amber-100">
              Panthéon du combat ultime (fiction)
            </h2>
          </div>
          <p className="text-sm text-white/60 max-w-3xl leading-relaxed">
            « Combat mortel » ici = <strong className="text-white/85">climax de jeu</strong>, rythme, finale cinématique —
            pas de violence réelle. Personnages <strong className="text-white/85">100 % originaux</strong>, créés pour Egor69 :
            tu peux les incarner en narration, cosplay symbolique ou deck de raid sans empiéter sur une marque tierce.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {DIVINE_COMBAT_HEROES.map((h) => (
              <article
                key={h.id}
                className="rounded-2xl border border-amber-500/20 bg-black/40 backdrop-blur-sm p-5 space-y-2 shadow-[inset_0_1px_0_rgba(251,191,36,0.08)]"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400/80">{h.domain}</p>
                <h3 className="font-display text-lg font-bold text-amber-50 leading-snug">{h.epithet}</h3>
                <p className="text-xs text-emerald-300/90">
                  <span className="text-white/40">Vertu · </span>
                  {h.virtue}
                </p>
                <p className="text-sm text-white/70 leading-relaxed">{h.style}</p>
                <p className="text-xs italic text-amber-200/70 border-t border-white/10 pt-3">
                  Serment : « {h.oath} »
                </p>
              </article>
            ))}
          </div>
          <p className="text-[11px] text-white/35">
            {DIVINE_COMBAT_HEROES.length} héros indexés · fichier{" "}
            <code className="text-amber-500/90">src/data/divineCombatHeroes.js</code>
          </p>
        </section>

        {/* Calendrier fictif + tactiques */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-sky-400" />
            <h2 className="font-display text-2xl font-bold">Saisons & tactiques abstraites</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {VIRTUAL_CAMPAIGN_SEASONS.map((s) => (
              <article
                key={s.id}
                className="rounded-2xl border border-sky-500/25 bg-sky-950/20 p-5 space-y-2"
              >
                <p className="text-xs uppercase tracking-wider text-sky-300/80">{s.window}</p>
                <h3 className="font-display text-lg font-bold text-white">{s.name}</h3>
                <p className="text-sm text-white/65">{s.pitch}</p>
                <p className="text-xs text-sky-200/90 border-t border-white/10 pt-3">
                  <span className="font-semibold">Objectif escouade :</span> {s.squadGoal}
                </p>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Swords className="h-5 w-5 text-orange-400" />
              <h3 className="font-display text-xl font-semibold">Tactiques (jargon jeu)</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {VIRTUAL_TACTICS.map((t) => (
                <div
                  key={t.id}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                >
                  <Badge variant="outline" className="mb-1 text-[10px] border-white/20">
                    {t.side}
                  </Badge>
                  <p className="font-medium text-white">{t.name}</p>
                  <p className="text-xs text-white/55">{t.effect}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowMemory((v) => !v)}
            className="text-sm text-white/50 underline underline-offset-4 hover:text-white/80"
          >
            {showMemory ? "Masquer" : "Afficher"} les repères historiques (mémoire, hors jeu)
          </button>
          {showMemory && (
            <ul className="space-y-3 rounded-xl border border-white/15 bg-zinc-900/80 p-5 text-sm">
              {HISTORICAL_MEMORY_ANCHORS.map((h) => (
                <li key={h.label}>
                  <strong className="text-white">{h.label}</strong>{" "}
                  <span className="text-white/45">({h.span})</span>
                  <p className="text-white/55 mt-1">{h.note}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Simulations de vie */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-lime-400" />
            <h2 className="font-display text-2xl font-bold">Semences de simulation de vie</h2>
          </div>
          <p className="text-sm text-white/60 max-w-3xl leading-relaxed flex gap-2">
            <BookOpen className="h-4 w-4 shrink-0 mt-0.5 text-lime-400" />
            Inspirations alignées sur des <strong className="text-white/90">thèmes publics</strong> (durabilité, entraide,
            littératie) — pas d&apos;extraction de bases de données propriétaires ; chaque grain est rédigé maison pour
            orienter vers don, échange et réparation dans un meilleur commun.
          </p>
          <div className="grid gap-4">
            {LIFE_PATH_SIMULATION_SEEDS.map((seed) => (
              <article
                key={seed.id}
                className="rounded-2xl border border-lime-500/20 bg-lime-950/10 p-5 space-y-2"
              >
                <div className="flex flex-wrap gap-2">
                  {seed.themes.map((th) => (
                    <Badge key={th} variant="secondary" className="text-[10px] bg-white/10">
                      {th}
                    </Badge>
                  ))}
                </div>
                <h3 className="font-display text-lg font-bold text-lime-100">{seed.title}</h3>
                <p className="text-sm text-white/70">{seed.prompt}</p>
                <p className="text-xs text-lime-200/80 border-t border-white/10 pt-3">
                  <span className="font-semibold text-lime-300">Vers l&apos;action :</span> {seed.outward}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer className="flex flex-wrap gap-3 pt-8 border-t border-white/10">
          <Button asChild className="rounded-xl bg-emerald-600 hover:bg-emerald-500">
            <Link to="/world">Verse 3D · hub</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-white/20">
            <Link to="/marketplace">Marketplace · don & échange</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-white/20">
            <Link to="/outworld">Outworld (fiction)</Link>
          </Button>
        </footer>
      </div>
    </div>
  );
}
