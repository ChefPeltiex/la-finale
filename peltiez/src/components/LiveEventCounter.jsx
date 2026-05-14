import { useState, useEffect } from 'react';
import { Users, Zap, Clock } from 'lucide-react';

export default function LiveEventCounter() {
  const [liveCount, setLiveCount] = useState(2847);
  const [timeToEvent, setTimeToEvent] = useState('');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0);
      
      if (now >= today) {
        today.setDate(today.getDate() + 1);
      }

      const diff = today - now;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (diff <= 0) {
        setIsLive(true);
        setTimeToEvent('🔴 EN DIRECT!');
      } else {
        setIsLive(false);
        setTimeToEvent(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    // Simulate live counter increase
    const counterInterval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 20) + 5);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(counterInterval);
    };
  }, []);

  return (
    <div className={`rounded-2xl p-6 text-center border-2 transition-all ${ 
      isLive 
        ? 'bg-red-50 border-red-400 shadow-lg shadow-red-200' 
        : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'
    }`}>
      <div className="flex items-center justify-center gap-2 mb-3">
        {isLive ? (
          <>
            <Zap className="h-5 w-5 text-red-500 animate-pulse" />
            <span className="text-sm font-bold text-red-600">EN DIRECT MAINTENANT</span>
            <Zap className="h-5 w-5 text-red-500 animate-pulse" />
          </>
        ) : (
          <>
            <Clock className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">PROCHAIN ÉVÉNEMENT</span>
          </>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className={`h-6 w-6 ${isLive ? 'text-red-500' : 'text-emerald-600'}`} />
            <p className={`text-4xl font-black ${isLive ? 'text-red-600' : 'text-emerald-700'}`}>
              {liveCount.toLocaleString('fr-FR')}
            </p>
          </div>
          <p className={`text-xs font-semibold ${isLive ? 'text-red-600' : 'text-emerald-600'}`}>
            {isLive ? 'Connectés maintenant' : 'Attendus à 19h'}
          </p>
        </div>

        <div className={`text-2xl font-bold ${isLive ? 'text-red-600' : 'text-emerald-700'}`}>
          {timeToEvent}
        </div>

        {!isLive && (
          <p className="text-xs text-muted-foreground">
            ⏰ Aujourd'hui à 19h00 (Toronto)
          </p>
        )}
      </div>

      {isLive && (
        <div className="mt-4 pt-4 border-t border-red-200">
          <p className="text-xs text-red-600 font-semibold animate-pulse">
            🎉 L'événement est en direct! Rejoins-nous maintenant!
          </p>
        </div>
      )}
    </div>
  );
}