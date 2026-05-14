import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

export default function MaintenanceBanner({ isActive = false, message = "Maintenance en cours. Quelques ajustements techniques pour vous offrir la meilleure expérience." }) {
  const [dismissed, setDismissed] = useState(false);

  if (!isActive || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-md border-b border-amber-400/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlertCircle className="h-5 w-5 text-white flex-shrink-0 animate-pulse" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{message}</p>
            <p className="text-xs text-white/70 mt-0.5">Nous serons de retour très bientôt. Merci de votre patience! ⚡</p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}