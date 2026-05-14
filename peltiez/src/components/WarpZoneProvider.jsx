import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WARP_SHORTCUTS, matchShortcut } from "@/warp/shortcuts";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";

export default function WarpZoneProvider({ children }) {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const actions = useMemo(
    () => [
      { id: "atlas", label: "Warp → Atlas Vivant", go: () => nav("/atlas?section=fiches-vivantes"), shortcut: "Ctrl+Shift+A" },
      { id: "genome", label: "Warp → Génome", go: () => nav("/genome"), shortcut: "Ctrl+Shift+G" },
      { id: "dashboard", label: "Warp → Dashboard Royal", go: () => nav("/dashboard-royal"), shortcut: null },
    ],
    [nav]
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      for (const s of WARP_SHORTCUTS) {
        if (matchShortcut(e, s.keys)) {
          e.preventDefault();
          if (s.action === "commandPalette") setOpen((v) => !v);
          if (s.action === "atlas") nav("/atlas?section=fiches-vivantes");
          if (s.action === "genome") nav("/genome");
          if (s.action === "zeldaTower") nav("/dashboard-royal");
          return;
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nav]);

  return (
    <>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Warp Zone… (écris, puis Entrée)" />
        <CommandList>
          <CommandEmpty>Aucune cible.</CommandEmpty>
          <CommandGroup heading="Passages secrets">
            {actions.map((a) => (
              <CommandItem
                key={a.id}
                onSelect={() => {
                  setOpen(false);
                  a.go();
                }}
              >
                {a.label}
                {a.shortcut ? <CommandShortcut>{a.shortcut}</CommandShortcut> : null}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

