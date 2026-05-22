import { useEffect, useState } from "react";

/** Détecte un appareil tactile (post-mount, safe pour SSR). */
export default function useTouchDevice() {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return touch;
}
