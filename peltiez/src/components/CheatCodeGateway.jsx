import { useEffect } from "react";
import { toast } from "sonner";
import { feedCheatKeystroke } from "@/lib/cheatCodes";

export default function CheatCodeGateway() {
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      const cheat = feedCheatKeystroke(e);
      if (cheat) {
        toast.success(`Passage découvert · ${cheat.label}`, {
          description: cheat.toastDescription || "Récompense XP versée — voir Mon univers.",
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
