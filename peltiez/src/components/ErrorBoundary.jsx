import { Component } from 'react';
import { AlertCircle } from 'lucide-react';
import { captureException } from '@/lib/monitoring.js';

function isReactDispatcherError(message) {
  if (!message || typeof message !== 'string') return false;
  return (
    message.includes("reading 'useState'") ||
    message.includes('reading "useState"') ||
    message.includes("reading 'useEffect'") ||
    message.includes("reading 'useRef'") ||
    message.includes('Invalid hook call')
  );
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    captureException(error, { errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || 'Une erreur inattendue';
      const dispatcherHint = isReactDispatcherError(msg);
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="font-display text-xl font-bold text-foreground mb-2">Oups, une erreur s'est produite</h1>
            <p className="text-sm text-muted-foreground mb-4">{msg}</p>
            {dispatcherHint ? (
              <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-left text-xs text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground mb-1">Diagnostic rapide</p>
                <p>
                  Ce message indique souvent un problème de <strong>runtime React</strong> (hooks appelés hors d’un composant,
                  ou cache de modules incohérent après une mise à jour), pas un simple <code className="rounded bg-muted px-1">data === null</code>.
                </p>
                <ul className="mt-2 list-disc pl-4 space-y-1">
                  <li>Rechargement forcé : Ctrl+Shift+R (vidage cache léger).</li>
                  <li>En dev : arrêter Vite, supprimer <code className="rounded bg-muted px-1">node_modules/.vite</code>, relancer <code className="rounded bg-muted px-1">npm run dev</code>.</li>
                  <li>À la racine du projet : <code className="rounded bg-muted px-1">npm ci</code> pour une seule copie de React (déjà forcée par Vite : alias + dedupe).</li>
                </ul>
              </div>
            ) : null}
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}