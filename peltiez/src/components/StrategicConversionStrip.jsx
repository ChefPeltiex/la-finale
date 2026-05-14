import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { submitCrmLead } from "@/lib/submitCrmLead";

export default function StrategicConversionStrip() {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const onNotify = async () => {
    const e = email.trim();
    if (!e) {
      toast.error("Indique ton courriel pour recevoir la relance.", { icon: "⚠️" });
      return;
    }
    setSending(true);
    try {
      await submitCrmLead({
        email: e,
        source: "strategic_strip:notify_launch",
        intent: "notify_updates",
        message: "Inscription alerte lancement / relance (strip global).",
      });
      toast.success("Merci — tu recevras les prochaines étapes.", { icon: "✅" });
      setEmail("");
      setOpen(false);
    } catch (err) {
      toast.error(err?.message || "Envoi impossible pour le moment.", { icon: "⚠️" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="pointer-events-none fixed bottom-[4.75rem] left-0 right-0 z-[35] px-2 sm:px-4 lg:left-64 lg:bottom-6"
      aria-label="Actions rapides Egor69"
    >
      <div
        className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-emerald-500/35 bg-zinc-950/92 px-3 py-2.5 shadow-2xl backdrop-blur-md sm:flex sm:items-center sm:justify-between sm:gap-3"
        style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
            <Zap className="h-3 w-3" />
            Passer à l’action
          </span>
          <div className="flex flex-wrap gap-1.5">
            <Button asChild size="sm" className="h-8 rounded-full bg-emerald-600 px-3 text-xs font-semibold hover:bg-emerald-500">
              <Link to="/pricing">Abonnements</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-white/20 bg-white/5 px-3 text-xs text-white hover:bg-white/10">
              <Link to="/soutien">Soutien</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-white/15 bg-transparent px-3 text-xs text-white/85 hover:bg-white/10">
              <Link to="/world">Verse 3D</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-white/15 bg-transparent px-3 text-xs text-white/85 hover:bg-white/10">
              <Link to="/outils-integration">Outils & IA</Link>
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 sm:mt-0 sm:shrink-0">
          {!open ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 gap-1 rounded-full px-2 text-xs text-emerald-200/90 hover:bg-emerald-500/10 hover:text-emerald-100"
              onClick={() => setOpen(true)}
            >
              <Mail className="h-3.5 w-3.5" />
              Alerte courriel
            </Button>
          ) : (
            <div className="flex w-full min-w-0 flex-1 items-center gap-1 sm:w-auto sm:max-w-[260px]">
              <Input
                type="email"
                autoComplete="email"
                placeholder="courriel…"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className="h-8 flex-1 border-white/15 bg-black/40 text-xs text-white placeholder:text-white/35"
              />
              <Button
                type="button"
                size="sm"
                disabled={sending}
                className="h-8 shrink-0 rounded-full bg-emerald-600 px-3 text-xs font-semibold hover:bg-emerald-500"
                onClick={onNotify}
              >
                {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "OK"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
