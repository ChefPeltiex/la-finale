import { useState, useEffect, useCallback } from "react";
import { loadPilotMode, savePilotMode } from "@/lib/pilotMode";

export default function usePilotMode() {
  const [enabled, setEnabled] = useState(() => loadPilotMode());

  useEffect(() => {
    const onPilot = (ev) => setEnabled(ev.detail !== false);
    window.addEventListener("egor69-pilot-mode", onPilot);
    return () => window.removeEventListener("egor69-pilot-mode", onPilot);
  }, []);

  const setPilotMode = useCallback((next) => {
    savePilotMode(next);
    setEnabled(next);
  }, []);

  return { pilotMode: enabled, setPilotMode };
}
