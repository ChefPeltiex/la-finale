import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function useProximityNotifications(userLocation, enabled = true) {
  useEffect(() => {
    if (!enabled || !userLocation || Notification.permission !== 'granted') return;

    // S'abonner aux nouvelles annonces en temps réel
    const unsubscribe = base44.entities.Listing.subscribe((event) => {
      // Seulement pour les nouveaux listings
      if (event.type !== 'create') return;

      const listing = event.data;
      
      // Filtrer: même ville/région OU annonce très récente (< 5 min)
      const isNearby = listing.location?.toLowerCase().includes(userLocation.toLowerCase());
      const isRecent = new Date(listing.created_date) > new Date(Date.now() - 5 * 60_000);
      
      if (!isNearby && !isRecent) return;

      // Mapper le type d'annonce
      const typeEmoji = {
        don: '🎁',
        vente: '💳',
        réparation: '🔧',
        échange: '🤝',
      }[listing.type] || '📦';

      const typeLabel = {
        don: 'Don gratuit',
        vente: 'Vente',
        réparation: 'Réparation',
        échange: 'Échange',
      }[listing.type] || 'Annonce';

      // Construire le message
      const title = `${typeEmoji} ${typeLabel} disponible!`;
      const body = `${listing.title} ${listing.location ? `à ${listing.location}` : ''}`;
      const options = {
        body,
        tag: `listing-${listing.id}`,
        icon: '🌱',
        badge: '🌱',
        data: {
          url: `/annonce/${listing.id}`,
          listing_id: listing.id,
          type: listing.type,
        },
      };

      // Envoyer la notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, options);
        
        // Au clic, naviguer vers l'annonce
        notification.onclick = () => {
          window.open(`/annonce/${listing.id}`, '_blank');
          notification.close();
        };
      }
    });

    return unsubscribe;
  }, [userLocation, enabled]);
}