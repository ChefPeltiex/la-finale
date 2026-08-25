// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { RoutesHoraisme } from '../App'
import { FournisseurJeu } from '../state/JeuProvider'
import { angleMort } from '../content/operations/angle-mort'

/**
 * Vérification de rendu réelle.
 *
 * Le pont navigateur n'étant pas disponible, ces tests montent l'application
 * dans un DOM complet et jouent « L'angle mort » du fragment à l'ancrage.
 * Ils vérifient que l'interface se construit vraiment, pas seulement que la
 * logique du moteur est juste.
 *
 * L'horloge est fixée : depuis que les opérations portent des déclencheurs
 * contextuels, une suite qui lit l'heure réelle passerait le jour et
 * échouerait la nuit. Seul `Date` est simulé, pour que les minuteries de
 * `userEvent` continuent de fonctionner normalement.
 */

const MIDI_DE_MAI = new Date('2026-05-20T13:00:00')

function monter(route: string) {
  return render(
    <FournisseurJeu>
      <MemoryRouter initialEntries={[route]}>
        <RoutesHoraisme />
      </MemoryRouter>
    </FournisseurJeu>,
  )
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(MIDI_DE_MAI)
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('shell et navigation', () => {
  it('monte le seuil sans erreur', () => {
    monter('/')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('monte les six sections de navigation', () => {
    for (const route of ['/aujourdhui', '/terrain', '/missions', '/parcours', '/decouvrir', '/moi']) {
      const { unmount } = monter(route)
      /* Deux barres : latérale sur grand écran, ancrée en bas sur mobile. */
      const navs = screen.getAllByRole('navigation')
      expect(navs.length).toBe(2)
      for (const nav of navs) {
        for (const libelle of [
          'Aujourd’hui',
          'Terrain',
          'Missions',
          'Parcours',
          'Découvrir',
          'Moi',
        ]) {
          expect(within(nav).getByText(libelle)).toBeInTheDocument()
        }
      }
      unmount()
    }
  })

  it('propose « L’angle mort » et expose pourquoi', async () => {
    const u = userEvent.setup()
    monter('/aujourdhui')

    expect(screen.getByRole('heading', { name: 'L’angle mort' })).toBeInTheDocument()
    expect(screen.queryByText(angleMort.dixSecondes)).not.toBeInTheDocument()

    await u.click(screen.getByRole('button', { name: /Pourquoi cette opération/ }))
    expect(screen.getByText(angleMort.dixSecondes)).toBeInTheDocument()
    expect(screen.getByText('Test des dix secondes')).toBeInTheDocument()
  })

  it('écarter une opération ne produit aucune pénalité affichée', async () => {
    const u = userEvent.setup()
    monter('/aujourdhui')

    /*
     * Le corpus propose plusieurs opérations le même jour depuis que les
     * déclencheurs de saison en laissent passer plus d'une. On écarte la
     * première : la règle testée porte sur l'absence de sanction, pas sur
     * l'identité de la carte écartée.
     */
    await u.click(screen.getAllByRole('button', { name: 'Écarter' })[0]!)

    expect(screen.getByText('Écartées')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Remettre en jeu' }).length).toBeGreaterThan(0)
    const corps = document.body.textContent ?? ''
    expect(corps).not.toMatch(/pénalit|série brisée|tu perds/i)
  })
})

describe('« L’angle mort » de bout en bout', () => {
  it('joue le fragment, l’inventaire, la sortie, le constat et l’ancrage', async () => {
    const u = userEvent.setup()
    monter('/operation/angle-mort')

    /* Fragment : rien ne bloque, le compte à rebours est une suggestion. */
    expect(screen.getByText('Le fragment')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'J’en ai assez vu' }))

    /* Inventaire : une seule lecture ne passe pas. */
    expect(screen.getByText('L’inventaire')).toBeInTheDocument()
    const emporter = screen.getByRole('button', { name: 'Emporter l’inventaire' })
    expect(emporter).toBeDisabled()

    await u.type(screen.getByLabelText(/Hypothèse/), 'Sur la façade de l’église du coin')
    await u.click(screen.getByRole('button', { name: 'Poser' }))
    expect(screen.getByRole('button', { name: 'Emporter l’inventaire' })).toBeDisabled()

    await u.type(screen.getByLabelText(/Hypothèse/), 'Sur le mur arrière du marché')
    await u.click(screen.getByRole('button', { name: 'Poser' }))

    const emporter2 = screen.getByRole('button', { name: 'Emporter l’inventaire' })
    expect(emporter2).toBeEnabled()

    /* Retenir n'est pas confirmer. */
    await u.click(screen.getAllByRole('button', { name: '○ Retenir' })[0])
    expect(screen.getByRole('button', { name: '● Retenue' })).toBeInTheDocument()
    expect(screen.getByText(/Aucune n’est confirmée|reste une hypothèse/i)).toBeInTheDocument()

    await u.click(screen.getByRole('button', { name: 'Emporter l’inventaire' }))

    /* Sortie : mode poche, puis retour. */
    expect(screen.getByText('La sortie')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Mettre en poche' }))
    expect(screen.getByRole('button', { name: 'Je suis revenu' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Je suis revenu' }))

    /* Constat : les quatre issues, dont l'échec sincère, ont le même poids. */
    expect(screen.getByText('Le constat')).toBeInTheDocument()
    for (const b of angleMort.bifurcations) {
      expect(screen.getByRole('button', { name: b.constat })).toBeInTheDocument()
    }

    const ancrer = screen.getByRole('button', { name: 'Ancrer le résultat' })
    expect(ancrer).toBeDisabled()

    await u.click(screen.getByRole('button', { name: 'Il est là, mais quelque chose a changé.' }))
    expect(screen.getByRole('button', { name: 'Ancrer le résultat' })).toBeDisabled()

    await u.type(
      screen.getByLabelText('Ce que tu as vu, en une phrase'),
      'La pierre sculptée est là mais la peinture bleue a disparu.',
    )
    await u.click(screen.getByRole('button', { name: 'Ancrer le résultat' }))

    /* Ancrage : le Registre affiche les statuts, le réel peut corriger HORA. */
    expect(screen.getByText('L’ancrage')).toBeInTheDocument()
    expect(screen.getByText('Le Registre — ce que je supposais')).toBeInTheDocument()
    expect(screen.getAllByText('Plausible').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Simulé').length).toBeGreaterThan(0)
    expect(
      screen.getByText('La pierre sculptée est là mais la peinture bleue a disparu.'),
    ).toBeInTheDocument()

    const champsRegistre = screen.getAllByPlaceholderText('Ce que le réel a répondu')
    expect(champsRegistre.length).toBe(angleMort.suppositions.length)
    await u.type(champsRegistre[0], 'Encore en place, mais repeint.')

    await u.type(
      screen.getByLabelText('Ce que tu ajustes'),
      'Je regarderai les façades au niveau des yeux, pas juste les enseignes.',
    )
    await u.click(screen.getByRole('button', { name: 'Clore l’opération' }))

    /* Clôture : XP rattaché à un événement réel. */
    expect(screen.getByText('Opération close')).toBeInTheDocument()
    expect(screen.getByText('+110 XP vécu')).toBeInTheDocument()
  }, 30_000)

  it('un échec sincère est récompensé et ne dévoile pas le lieu', async () => {
    const u = userEvent.setup()
    monter('/operation/angle-mort')

    await u.click(screen.getByRole('button', { name: 'J’en ai assez vu' }))

    await u.type(screen.getByLabelText(/Hypothèse/), 'Rue Saint-Jean, côté nord')
    await u.click(screen.getByRole('button', { name: 'Poser' }))
    await u.type(screen.getByLabelText(/Hypothèse/), 'Derrière la gare')
    await u.click(screen.getByRole('button', { name: 'Poser' }))
    await u.click(screen.getByRole('button', { name: 'Emporter l’inventaire' }))

    await u.click(screen.getByRole('button', { name: 'Je suis déjà revenu' }))

    await u.click(screen.getByRole('button', { name: 'Je n’ai pas trouvé.' }))
    await u.type(
      screen.getByLabelText('Ce que tu as vu, en une phrase'),
      'J’ai fait les deux rues, rien qui corresponde.',
    )
    await u.click(screen.getByRole('button', { name: 'Ancrer le résultat' }))

    expect(screen.getByText(/Je ne te donne pas la réponse/)).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /Québec|rue|façade/i })).not.toBeInTheDocument()

    await u.click(screen.getByRole('button', { name: 'Clore l’opération' }))

    expect(screen.getByText('Opération close')).toBeInTheDocument()
    expect(screen.getByText('+60 XP vécu')).toBeInTheDocument()
  }, 30_000)

  it('démentir HORA avec une preuve rapporte davantage que lui donner raison', async () => {
    const u = userEvent.setup()
    monter('/operation/angle-mort')

    await u.click(screen.getByRole('button', { name: 'J’en ai assez vu' }))
    await u.type(screen.getByLabelText(/Hypothèse/), 'Sur la façade de l’église du coin')
    await u.click(screen.getByRole('button', { name: 'Poser' }))
    await u.type(screen.getByLabelText(/Hypothèse/), 'Sur le mur arrière du marché')
    await u.click(screen.getByRole('button', { name: 'Poser' }))
    await u.click(screen.getByRole('button', { name: 'Emporter l’inventaire' }))
    await u.click(screen.getByRole('button', { name: 'Je suis déjà revenu' }))

    await u.click(screen.getByRole('button', { name: 'Il est là, mais quelque chose a changé.' }))
    await u.type(
      screen.getByLabelText('Ce que tu as vu, en une phrase'),
      'Le motif a été recouvert.',
    )
    await u.click(screen.getByRole('button', { name: 'Ancrer le résultat' }))

    /* Le Contrechamp est distinct du Registre : provenance d'un côté, justesse de l'autre. */
    expect(screen.getByText('Le Contrechamp — ce que j’avais avancé')).toBeInTheDocument()

    const dementir = screen.getAllByRole('button', { name: 'Non, j’ai vu autre chose' })
    expect(dementir).toHaveLength(angleMort.propositions.length)

    /* Sans constat écrit, rien ne peut être inscrit comme démenti. */
    await u.click(dementir[0])
    const constat = screen.getAllByPlaceholderText('Ce que tu as constaté, en une phrase')
    expect(constat).toHaveLength(1)
    await u.type(constat[0], 'La façade a été ravalée, le motif n’existe plus.')

    await u.click(screen.getByRole('button', { name: 'Clore l’opération' }))

    expect(screen.getByText('Opération close')).toBeInTheDocument()
    expect(screen.getByText('+150 XP vécu')).toBeInTheDocument()
    expect(screen.getByText(/Tu m’as contredite une fois/)).toBeInTheDocument()
  }, 30_000)

  it('un démenti sans constat écrit n’est pas inscrit comme démenti', async () => {
    const u = userEvent.setup()
    monter('/operation/angle-mort')

    await u.click(screen.getByRole('button', { name: 'J’en ai assez vu' }))
    await u.type(screen.getByLabelText(/Hypothèse/), 'Première piste')
    await u.click(screen.getByRole('button', { name: 'Poser' }))
    await u.type(screen.getByLabelText(/Hypothèse/), 'Deuxième piste')
    await u.click(screen.getByRole('button', { name: 'Poser' }))
    await u.click(screen.getByRole('button', { name: 'Emporter l’inventaire' }))
    await u.click(screen.getByRole('button', { name: 'Je suis déjà revenu' }))

    await u.click(screen.getByRole('button', { name: 'Il est là, mais quelque chose a changé.' }))
    await u.type(screen.getByLabelText('Ce que tu as vu, en une phrase'), 'Quelque chose a bougé.')
    await u.click(screen.getByRole('button', { name: 'Ancrer le résultat' }))

    /* Choisir « contredite » sans rien écrire ne suffit pas. */
    await u.click(screen.getAllByRole('button', { name: 'Non, j’ai vu autre chose' })[0])
    await u.click(screen.getByRole('button', { name: 'Clore l’opération' }))

    expect(screen.getByText('+110 XP vécu')).toBeInTheDocument()
    expect(screen.queryByText(/Tu m’as contredite/)).not.toBeInTheDocument()
  }, 30_000)
})

describe('souveraineté visible dans l’interface', () => {
  it('Moi permet de couper une source, corriger et effacer les traces', async () => {
    const u = userEvent.setup()
    monter('/moi')

    const interrupteurs = screen.getAllByRole('switch')
    expect(interrupteurs.length).toBeGreaterThan(0)
    expect(interrupteurs[0]).toHaveAttribute('aria-checked', 'true')
    await u.click(interrupteurs[0])
    expect(screen.getAllByRole('switch')[0]).toHaveAttribute('aria-checked', 'false')

    expect(screen.getByText('Corriger mes suppositions')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Effacer le Registre' })).toBeInTheDocument()

    await u.click(screen.getByRole('button', { name: 'Tout effacer' }))
    expect(screen.getByRole('button', { name: 'Confirmer l’effacement total' })).toBeInTheDocument()
  })

  it('Découvrir est un atlas fermé : il se termine et ne charge rien de plus', () => {
    monter('/decouvrir')

    expect(screen.getByText(/L’invisible se reconnaît par sa portée visible/)).toBeInTheDocument()
    expect(screen.getByText(/C’est la fin de l’atlas/)).toBeInTheDocument()

    /* Aucun affordance de flux : ni pagination, ni chargement, ni mise en avant. */
    for (const b of screen.queryAllByRole('button')) {
      expect(b.textContent ?? '').not.toMatch(/charger|voir plus|suivant|plus de/i)
    }
  })
})
