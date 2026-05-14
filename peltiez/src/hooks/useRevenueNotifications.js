import { useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function useRevenueNotifications(userEmail, enabled = true) {
  const lastNotifiedRef = useRef(new Set());

  useEffect(() => {
    if (!enabled || !userEmail) return;

    const unsubscribe = base44.entities.Listing.subscribe((event) => {
      // Ne notifier que les ventes vendues créées par l'utilisateur
      if (event.data?.created_by === userEmail && event.data?.type === "vente") {
        const listingId = event.data.id;

        // Éviter les doublons
        if (lastNotifiedRef.current.has(listingId)) return;

        // Déterminer si c'est une nouvelle vente
        if (event.type === "create") {
          // Nouvelle création (optionnel - si on veut aussi notifier les nouvelles annonces)
        } else if (event.type === "update" && event.data?.status === "vendu") {
          // Une vente vient d'être marquée comme vendue
          const price = event.data.price || 0;
          const title = event.data.title || "Vente";

          lastNotifiedRef.current.add(listingId);

          // Notification discrète
          toast.success(`💚 +$${price} — ${title}`, {
            duration: 4000,
            position: "bottom-right",
            style: {
              background: "linear-gradient(135deg, #10b981, #059669)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "white",
            },
          });
        }
      }
    });

    return () => unsubscribe();
  }, [userEmail, enabled]);
}