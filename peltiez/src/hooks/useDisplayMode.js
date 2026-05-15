import { useState, useEffect } from "react";
import { loadDisplayMode } from "@/lib/displayMode";

export default function useDisplayMode() {
  const [mode, setMode] = useState(() => loadDisplayMode());

  useEffect(() => {
    const onMode = (ev) => setMode(ev.detail === "simple" ? "simple" : "deep");
    window.addEventListener("egor69-display-mode", onMode);
    return () => window.removeEventListener("egor69-display-mode", onMode);
  }, []);

  return { mode, simple: mode === "simple" };
}
