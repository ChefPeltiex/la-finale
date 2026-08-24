import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AppShell from './components/shell/AppShell'
import { FournisseurJeu } from './state/JeuProvider'
import Seuil from './routes/Seuil'
import Aujourdhui from './routes/Aujourdhui'
import Terrain from './routes/Terrain'
import Missions from './routes/Missions'
import Parcours from './routes/Parcours'
import Decouvrir from './routes/Decouvrir'
import Moi from './routes/Moi'
import OperationEnCours from './routes/OperationEnCours'

function AvecShell({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}

/**
 * Table de routes isolée du routeur : l'application la monte dans un
 * BrowserRouter, les tests de rendu dans un MemoryRouter.
 */
export function RoutesHoraisme() {
  return (
    <Routes>
      <Route path="/" element={<Seuil />} />
      <Route path="/operation/:id" element={<OperationEnCours />} />
      <Route
        path="/aujourdhui"
        element={
          <AvecShell>
            <Aujourdhui />
          </AvecShell>
        }
      />
      <Route
        path="/terrain"
        element={
          <AvecShell>
            <Terrain />
          </AvecShell>
        }
      />
      <Route
        path="/missions"
        element={
          <AvecShell>
            <Missions />
          </AvecShell>
        }
      />
      <Route
        path="/parcours"
        element={
          <AvecShell>
            <Parcours />
          </AvecShell>
        }
      />
      <Route
        path="/decouvrir"
        element={
          <AvecShell>
            <Decouvrir />
          </AvecShell>
        }
      />
      <Route
        path="/moi"
        element={
          <AvecShell>
            <Moi />
          </AvecShell>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <FournisseurJeu>
      <BrowserRouter>
        <RoutesHoraisme />
      </BrowserRouter>
    </FournisseurJeu>
  )
}
