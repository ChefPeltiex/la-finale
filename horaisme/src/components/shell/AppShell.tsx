import { NavLink, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { FORMULES, NAVIGATION } from '../../content/hora'
import { niveauPour } from '../../engine/progression'
import { useJeu } from '../../state/JeuProvider'

function Monogramme({ taille = 'size-9' }: { taille?: string }) {
  return (
    <span
      className={`flex ${taille} items-center justify-center rounded-full border border-gold-dim/50 font-display text-[0.95rem] text-gold`}
    >
      H
    </span>
  )
}

function Rail() {
  return (
    <nav
      aria-label="Navigation principale"
      className="hidden w-56 shrink-0 flex-col justify-between border-r border-gold-dim/15 bg-ink-deep px-6 py-7 lg:flex"
    >
      <div>
        <NavLink to="/" className="flex items-center gap-3">
          <Monogramme />
          <span className="font-display text-[0.82rem] tracking-[0.24em] text-parchment/80">
            HORAÏSME
          </span>
        </NavLink>

        <ul className="mt-11 flex flex-col gap-0.5">
          {NAVIGATION.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.chemin}
                className={({ isActive }) =>
                  `group flex items-center gap-3 py-2.5 kicker transition-colors ${
                    isActive ? 'text-gold' : 'text-parchment/45 hover:text-parchment/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden="true"
                      className={`h-px transition-all duration-300 ${
                        isActive ? 'w-5 bg-gold' : 'w-2 bg-parchment/25 group-hover:w-4'
                      }`}
                    />
                    {item.libelle}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <p className="font-display text-[0.82rem] italic leading-relaxed text-parchment/28">
        {FORMULES.arbitrage}
      </p>
    </nav>
  )
}

function BarreMobile() {
  return (
    <nav
      aria-label="Navigation principale"
      className="sticky bottom-0 z-20 flex shrink-0 border-t border-gold-dim/15 bg-ink-deep/95 px-1 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
    >
      {NAVIGATION.map((item) => (
        <NavLink
          key={item.id}
          to={item.chemin}
          className={({ isActive }) =>
            /* Cible tactile de 44 px minimum, libellé lisible : la barre est
               utilisée en marchant, pas assis devant un écran. */
            `flex min-h-11 flex-1 flex-col items-center justify-center gap-1.5 rounded px-0.5 text-[0.68rem] leading-none tracking-[0.005em] transition-colors ${
              isActive ? 'text-gold' : 'text-parchment/50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                aria-hidden="true"
                className={`h-px w-5 transition-colors ${isActive ? 'bg-gold' : 'bg-transparent'}`}
              />
              {item.libelle}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function BarreHaute() {
  const { memoire, contexte } = useJeu()
  const niveau = niveauPour(memoire.xpTotal)
  const heure = contexte.heureLocale

  return (
    <header className="flex items-center justify-between gap-4 border-b border-gold-dim/12 px-6 py-4 md:px-10">
      <div className="flex items-center gap-3 lg:hidden">
        <Monogramme taille="size-8" />
        <span className="font-display text-[0.72rem] tracking-[0.22em] text-parchment/70">
          HORAÏSME
        </span>
      </div>

      <p className="hidden data-line text-parchment/30 lg:block">
        {heure.statut === 'inconnu' ? 'Heure masquée' : `Québec · ${heure.valeur}`}
      </p>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="data-line text-parchment/35">
            Niveau {niveau.rang} · {niveau.titre}
          </p>
          <p className="data-line text-gold/70">{memoire.xpTotal} XP vécu</p>
        </div>
        <NavLink
          to="/moi"
          aria-label="Moi"
          className="flex size-11 items-center justify-center rounded-full border border-gold-dim/35 text-[0.72rem] text-parchment/60 transition-colors hover:border-gold/60 hover:text-gold md:size-9"
        >
          {niveau.rang}
        </NavLink>
      </div>
    </header>
  )
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-svh bg-ink">
      <Rail />
      <div className="flex min-w-0 flex-1 flex-col">
        <BarreHaute />
        <main key={pathname} className="flex-1 px-6 py-9 md:px-10 md:py-12">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
        <BarreMobile />
      </div>
    </div>
  )
}
