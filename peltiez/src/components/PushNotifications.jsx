import { useEffect, useState } from 'react';
import { Bell, CheckCircle, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function PushNotifications() {
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [supported, setSupported] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [proximityEnabled, setProximityEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setSupported(false);
    }
    
    // Get user location for proximity notifications
    if (navigator.geolocation && permissionStatus === 'granted') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setProximityEnabled(true);
        },
        (error) => {
          if (import.meta.env.DEV) console.warn("Géolocalisation non disponible:", error);
        }
      );
    }
  }, [permissionStatus]);
  
  // Listen for new listings and check proximity
  useEffect(() => {
    if (!proximityEnabled || !userLocation) return;
    
    const unsubscribe = base44.entities.Listing.subscribe((event) => {
      if (event.type === 'create' && event.data?.location) {
        // Simple proximity check (same city/region)
        const isNearby = event.data.location?.toLowerCase().includes(
          userLocation.city?.toLowerCase() || ''
        );
        
        if (isNearby) {
          sendNotification(
            `📍 ${event.data.title}`,
            {
              body: `Nouvel objet près de chez vous! ${event.data.location}`,
              tag: `listing-${event.data.id}`,
              requireInteraction: true,
            }
          );
        }
      }
    });
    
    return unsubscribe;
  }, [proximityEnabled, userLocation]);

  // Fiches vivantes (Atlas) : même pipeline « proximité » que le radar — déclenché quand le compteur serveur augmente.
  useEffect(() => {
    if (permissionStatus !== 'granted' || !supported) return;
    const onFicheProx = (ev) => {
      const d = ev.detail;
      if (!d || typeof d.delta !== 'number') return;
      try {
        new Notification('📡 Fiche vivante · Atlas', {
          icon: '🌱',
          body:
            d.delta === 1
              ? 'Une nouvelle fiche vivante — ouvre Fiches vivantes dans l’Atlas.'
              : `${d.delta} nouvelles fiches — ouvre l’Atlas vivant.`,
          tag: `igor-fiche-vivante-${d.count ?? 'x'}`,
        });
      } catch (e) {
        if (import.meta.env.DEV) console.warn("Notification fiche vivante:", e);
      }
    };
    window.addEventListener('igor:fiches-vivantes-proximite', onFicheProx);
    return () => window.removeEventListener('igor:fiches-vivantes-proximite', onFicheProx);
  }, [permissionStatus, supported]);

  const requestPermission = async () => {
    if (!supported) return;
    
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        // Test notification
        try {
          new Notification('Egor69 — notifications activées', {
            icon: '🌱',
            body: 'Tu recevras des alertes liées à la plateforme lorsque le navigateur les autorise.',
            tag: 'launch-notification',
          });
        } catch (notifError) {
          if (import.meta.env.DEV) console.warn('Notification test échouée (peut être normal):', notifError);
        }
      }
    } catch (error) {
      console.error('Erreur permission notifications:', error);
    }
  };

  const sendNotification = (title, options = {}) => {
    if (permissionStatus === 'granted' && supported) {
      try {
        new Notification(title, {
          icon: '🌱',
          ...options,
          tag: options.tag || 'circul-ai',
        });
      } catch (error) {
        if (import.meta.env.DEV) console.warn('Erreur notification:', error);
      }
    }
  };
  
  const sendImpactReport = async () => {
    const user = await base44.auth.me();
    if (!user) return;
    
    const ecoProfile = await base44.entities.EcoProfile.filter(
      { user_email: user.email },
      '-created_date',
      1
    ).then(r => r[0]);
    
    if (ecoProfile) {
      sendNotification('📊 Rapport d\'impact', {
        body: `${ecoProfile.total_co2_saved}kg CO₂ économisé · ${ecoProfile.total_objects_saved} objets sauvés`,
        tag: 'impact-report',
      });
    }
  };

  // Export functions for external use
  window.sendCirculAINotification = sendNotification;
  window.requestCirculAINotifications = requestPermission;
  window.sendImpactReport = sendImpactReport;
  window.getProximityNotificationsStatus = () => proximityEnabled;

  if (!supported) return null;

  return (
    <>
      {permissionStatus !== 'granted' && (
       <div className="fixed bottom-6 right-6 z-40 max-w-sm">
         <div className="bg-card rounded-2xl border border-border p-4 shadow-lg flex items-start gap-3">
           <Bell className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
           <div className="flex-1">
             <p className="text-sm font-semibold text-foreground">Notifications en temps réel</p>
             <p className="text-xs text-muted-foreground mt-1">
               📍 Alertes proximité · 📊 Rapport impact · 🎁 Calendrier dons
             </p>
             <Button
               onClick={requestPermission}
               size="sm"
               className="mt-3 rounded-lg h-8 text-xs w-full"
             >
               Activer les notifications
             </Button>
           </div>
            <button
              onClick={() => setPermissionStatus('denied')}
              className="text-muted-foreground hover:text-foreground p-1 flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {permissionStatus === 'granted' && (
       <div className="fixed bottom-6 right-6 z-40 space-y-2">
         <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 text-xs font-medium text-emerald-700">
           <CheckCircle className="h-3.5 w-3.5" />
           Notifications actives
           {proximityEnabled && <MapPin className="h-3 w-3 ml-1" />}
         </div>
         <div className="flex gap-2 text-[10px]">
           <Button
             onClick={sendImpactReport}
             size="sm"
             variant="outline"
             className="rounded-lg h-7 px-2 gap-1"
           >
             <TrendingUp className="h-3 w-3" /> Impact
           </Button>
         </div>
       </div>
      )}
    </>
  );
}