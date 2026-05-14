import useOnlineStatus from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b-2 border-amber-300 px-4 py-3 flex items-center gap-3 justify-center">
      <WifiOff className="h-4 w-4 text-amber-600 flex-shrink-0" />
      <p className="text-sm font-medium text-amber-900">
        Vous êtes hors ligne · Les données en cache sont affichées
      </p>
    </div>
  );
}