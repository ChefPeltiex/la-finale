import type { ReactNode } from 'react'
import type { Datum, StatutProvenance } from '../../engine/types'
import {
  COULEUR_STATUT,
  EXPLICATION_STATUT,
  LIBELLE_STATUT,
  estAffichable,
} from '../../engine/provenance'
import { HORA } from '../../content/hora'

/* ------------------------------------------------------------------ */
/* Typographie                                                         */
/* ------------------------------------------------------------------ */

export function Kicker({
  children,
  className = '',
  as: Balise = 'p',
}: {
  children: ReactNode
  className?: string
  /* Un kicker sert parfois de titre de page — les étapes d'une opération n'ont
     pas d'autre en-tête. Il doit alors être annoncé comme tel. */
  as?: 'p' | 'h1' | 'h2'
}) {
  return <Balise className={`kicker text-parchment/45 ${className}`}>{children}</Balise>
}

export function TitreSection({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2 className={`font-display text-[clamp(1.6rem,3.4vw,2.5rem)] leading-tight ${className}`}>
      {children}
    </h2>
  )
}

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Panneau({
  children,
  ton = 'ink',
  className = '',
}: {
  children: ReactNode
  ton?: 'ink' | 'cream' | 'forest'
  className?: string
}) {
  const tons = {
    ink: 'bg-ink-soft/70 hairline text-parchment',
    cream: 'bg-cream hairline-ink text-ink',
    forest: 'bg-forest-deep/80 hairline text-parchment',
  }
  return <div className={`rounded-lg ${tons[ton]} ${className}`}>{children}</div>
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

type ProprietesBouton = {
  children: ReactNode
  onClick?: () => void
  variante?: 'or' | 'contour' | 'discret' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export function Bouton({
  children,
  onClick,
  variante = 'or',
  disabled = false,
  type = 'button',
  className = '',
}: ProprietesBouton) {
  const variantes = {
    or: 'bg-gold text-ink hover:bg-[#e6ce85] disabled:bg-gold/25 disabled:text-ink/40',
    contour:
      'hairline-strong text-parchment hover:bg-gold/10 disabled:text-parchment/30 disabled:hover:bg-transparent',
    discret: 'text-parchment/55 hover:text-parchment underline underline-offset-4 decoration-gold/40',
    danger: 'border border-terre/60 text-terre hover:bg-terre/10',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2.5 rounded-[3px] px-6 py-3 font-display text-[0.98rem] font-semibold transition duration-300 disabled:cursor-not-allowed ${variantes[variante]} ${className}`}
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Registre — les quatre statuts                                       */
/* ------------------------------------------------------------------ */

export function Marque({ statut, titre }: { statut: StatutProvenance; titre?: string }) {
  return (
    <span
      title={titre ?? EXPLICATION_STATUT[statut]}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 data-line"
      style={{
        color: COULEUR_STATUT[statut],
        borderColor: `color-mix(in srgb, ${COULEUR_STATUT[statut]} 40%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${COULEUR_STATUT[statut]} 9%, transparent)`,
      }}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full"
        style={{ backgroundColor: COULEUR_STATUT[statut] }}
      />
      {LIBELLE_STATUT[statut]}
    </span>
  )
}

/**
 * Affiche une donnée avec sa provenance. Un datum `inconnu` n'affiche aucune
 * valeur de remplacement : HORA dit qu'il ne sait pas, et c'est tout.
 */
export function Donnee<T>({
  etiquette,
  datum,
  format,
}: {
  etiquette: string
  datum: Datum<T>
  format?: (v: T) => string
}) {
  const affichable = estAffichable(datum)
  return (
    <div className="flex flex-col gap-1.5 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="data-line text-parchment/40">{etiquette}</span>
        <Marque statut={datum.statut} />
      </div>
      {affichable ? (
        <span className="font-display text-lg text-parchment">
          {format ? format(datum.valeur as T) : String(datum.valeur)}
        </span>
      ) : (
        <span className="font-display text-lg italic text-parchment/35">Je ne sais pas.</span>
      )}
      <span className="text-[0.76rem] leading-relaxed text-parchment/40">
        {affichable ? datum.justification : HORA.jeNeSaisPas}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Divers                                                              */
/* ------------------------------------------------------------------ */

export function Vide({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-lg italic leading-relaxed text-parchment/40">{children}</p>
  )
}

export function ParoleHora({ children }: { children: ReactNode }) {
  return (
    <p className="border-l border-oeil/40 pl-4 font-display text-[1.02rem] italic leading-relaxed text-parchment/80">
      {children}
    </p>
  )
}

/** Fin de page explicite : le document a une fin, il ne se recharge jamais. */
export function FinDePage({ children }: { children?: ReactNode }) {
  return (
    <div className="mt-16 flex flex-col items-center gap-3 border-t border-gold-dim/12 pt-8 pb-4">
      <span className="data-line text-parchment/25">Fin</span>
      {children ? (
        <span className="max-w-sm text-center text-[0.78rem] leading-relaxed text-parchment/35">
          {children}
        </span>
      ) : null}
    </div>
  )
}
