import { X } from 'lucide-react';
import { useState } from 'react';

export default function SovereigntyBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-[105] bg-gradient-to-r from-emerald-600 to-teal-700 border-b border-emerald-400/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between gap-4">
          <p className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            🚀 LANCEMENT OFFICIEL : DEVIENS UN PILIER DE LA SOUVERAINETÉ QUÉBÉCOISE
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}