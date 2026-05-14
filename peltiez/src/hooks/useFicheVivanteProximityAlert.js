import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { sovereignApiAbsolute, atlasFichesCountRefetchInterval } from "@/lib/sovereignAtlasApi";

const STORAGE_LAST = "igor-fiches-vivantes-last-count";

/**
 * Alerte « proximité » quand le compteur serveur de fiches vivantes augmente (ex. après POST convert batch).
 * Toast + événement `igor:fiches-vivantes-proximite` pour que PushNotifications affiche l’alerte système si la permission est accordée.
 * TODO: push serveur par utilisateur quand les scans seront liés à un compte / device.
 */
export default function useFicheVivanteProximityAlert() {
  const { data } = useQuery({
    queryKey: ["atlas-fiches-vivantes-count"],
    queryFn: async () => {
      const r = await fetch(sovereignApiAbsolute("/api/atlas/fiches-vivantes-count"), {
        credentials: "omit",
      });
      if (!r.ok) throw new Error("atlas api");
      return r.json();
    },
    staleTime: 0,
    refetchInterval: atlasFichesCountRefetchInterval,
    retry: 0,
  });

  useEffect(() => {
    const count = data?.fiches_vivantes_count;
    if (typeof count !== "number") return;

    const raw = sessionStorage.getItem(STORAGE_LAST);
    if (raw == null) {
      sessionStorage.setItem(STORAGE_LAST, String(count));
      return;
    }

    const prev = Number(raw);
    if (Number.isNaN(prev)) {
      sessionStorage.setItem(STORAGE_LAST, String(count));
      return;
    }

    if (count > prev) {
      const delta = count - prev;
      toast.success("Nouvelle fiche vivante près de ton radar", {
        description:
          delta === 1
            ? "Une fiche a été matérialisée dans l’Atlas vivant — ouvre Fiches vivantes pour la parcourir."
            : `${delta} fiches matérialisées — l’Atlas vivant s’est enrichi depuis ton dernier passage.`,
        action: {
          label: "Vers l’Atlas",
          onClick: () => {
            window.location.assign("/atlas?section=fiches-vivantes");
          },
        },
      });

      try {
        window.dispatchEvent(
          new CustomEvent("igor:fiches-vivantes-proximite", {
            detail: { count, prev, delta, at: new Date().toISOString() },
          }),
        );
      } catch {
        /* ignore */
      }

      sessionStorage.setItem(STORAGE_LAST, String(count));
    } else if (count < prev) {
      sessionStorage.setItem(STORAGE_LAST, String(count));
    }
  }, [data?.fiches_vivantes_count]);
}
