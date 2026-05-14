import { useEffect } from "react";
import { applyUniversePreferencesToDocument, loadUniversePreferences } from "@/lib/universePreferences";

/** Monte une fois au boot et réagit aux changements cross-tab / événements internes. */
export default function UniversePreferencesSync() {
  useEffect(() => {
    applyUniversePreferencesToDocument(loadUniversePreferences());

    const onStorage = (ev) => {
      if (ev.key === "igor:universe:v2" && ev.newValue) {
        try {
          applyUniversePreferencesToDocument(JSON.parse(ev.newValue));
        } catch {
          /* ignore */
        }
      }
    };

    const onCustom = (ev) => {
      if (ev.detail) applyUniversePreferencesToDocument(ev.detail);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("igor-universe-change", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("igor-universe-change", onCustom);
    };
  }, []);
  return null;
}
