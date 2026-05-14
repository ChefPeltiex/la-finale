import { useEffect } from "react";

/**
 * Best-effort Screen Wake Lock during an active immersive WebGL session.
 * Acquires after a user gesture on `target` (pointer/key); releases when the document is hidden or on unmount.
 * No-ops when unsupported (e.g. Safari/iOS) or denied.
 */
export function useWakeLock(target) {
  useEffect(() => {
    if (!target || typeof navigator === "undefined") return;

    const wake = navigator.wakeLock;
    if (!wake?.request) return;

    let sentinel = null;

    const releaseLock = async () => {
      try {
        await sentinel?.release?.();
      } catch {
        /* ignore */
      }
      sentinel = null;
    };

    const acquire = async () => {
      try {
        if (document.hidden) return;
        if (sentinel) return;
        sentinel = await wake.request("screen");
        sentinel.addEventListener("release", () => {
          sentinel = null;
        });
      } catch {
        /* silent — permission / unsupported */
      }
    };

    const onGesture = () => {
      void acquire();
    };

    target.addEventListener("pointerdown", onGesture, { passive: true });
    target.addEventListener("keydown", onGesture);

    const onVisibility = () => {
      if (document.hidden) void releaseLock();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      target.removeEventListener("pointerdown", onGesture);
      target.removeEventListener("keydown", onGesture);
      document.removeEventListener("visibilitychange", onVisibility);
      void releaseLock();
    };
  }, [target]);
}
