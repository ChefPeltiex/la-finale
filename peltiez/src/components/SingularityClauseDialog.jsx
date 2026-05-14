import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";
import { acceptSingularityClause } from "@/lib/singulariteClause";

export default function SingularityClauseDialog({ open, onOpenChange, onConfirmed }) {
  const [okRead, setOkRead] = useState(false);
  const [cle, setCle] = useState("");

  useEffect(() => {
    if (!open) {
      setOkRead(false);
      setCle("");
    }
  }, [open]);

  const confirm = () => {
    if (!okRead) return;
    acceptSingularityClause({ cle });
    onOpenChange(false);
    if (typeof onConfirmed === "function") onConfirmed();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col gap-0 border-amber-500/30 bg-zinc-950 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2 text-amber-100">
            <Shield className="h-5 w-5 text-amber-400" />
            Verrou juridique — Singularité Egor69
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm leading-relaxed">
            Le <strong className="text-zinc-200">Pass Outworld</strong> exige la lecture et l&apos;acceptation de la clause
            ci-dessous. Signez avec votre <strong className="text-zinc-200">Clé de Singularité</strong> (phrase libre,
            stockée localement sur cet appareil comme trace d&apos;intention — ce n&apos;est pas une signature électronique
            qualifiée au sens du droit).
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[42vh] pr-3 border border-amber-500/15 rounded-xl bg-black/40 my-3">
          <div className="p-4 text-sm text-zinc-300 space-y-3 leading-relaxed">
            <p className="font-semibold text-amber-200/95 text-xs uppercase tracking-wide">1. Nature du Secret Souverain</p>
            <p>
              Le Partenaire reconnaît que la structure mathématique, les 7 formules du millénaire appliquées, et le code
              source « Egor69 » constituent une Singularité Technologique. Ce savoir est la propriété exclusive de la
              Holding Les Secrets du St-Laurent…
            </p>
            <p className="font-semibold text-amber-200/95 text-xs uppercase tracking-wide pt-2">2. Inaccessibilité de la Source</p>
            <p>
              Seul le Rendu (l&apos;output) est accessible. Toute tentative de rétro-ingénierie, de décompilation du
              package Unreal Engine, ou d&apos;analyse du code Base44 est considérée comme un acte de piratage de la
              conscience souveraine…
            </p>
            <p className="font-semibold text-amber-200/95 text-xs uppercase tracking-wide pt-2">3. — 4.</p>
            <p>Durée et sanctions sont détaillées dans le document complet.</p>
          </div>
        </ScrollArea>

        <div className="flex flex-col sm:flex-row gap-2 mb-3 text-xs">
          <Link
            to="/legal/singularite"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-amber-400/95 hover:text-amber-300 underline-offset-4 hover:underline font-medium"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Document complet (page Egor69)
          </Link>
          <a
            href="/legal/Legal_Sovereign.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 underline-offset-4 hover:underline"
          >
            Fichier statique HTML
          </a>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cle-sing" className="text-zinc-300">
              Clé de Singularité (signature d&apos;intention)
            </Label>
            <Input
              id="cle-sing"
              value={cle}
              onChange={(e) => setCle(e.target.value)}
              placeholder="Une phrase que tu retiens — non transmise au serveur"
              className="bg-zinc-900 border-amber-500/25 text-zinc-100"
              autoComplete="off"
            />
          </div>
          <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-amber-500/20 bg-amber-950/20 p-3">
            <Checkbox checked={okRead} onCheckedChange={(v) => setOkRead(v === true)} className="mt-1" />
            <span className="text-sm text-zinc-300 leading-snug">
              J&apos;ai lu l&apos;extrait et le document Legal Sovereign ; j&apos;accepte la Clause de Protection de la
              Singularité algorithmique pour poursuivre vers le Pass Outworld.
            </span>
          </label>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button variant="outline" className="border-zinc-600 text-zinc-300" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            className="bg-gradient-to-r from-amber-600 to-amber-700 text-black font-semibold hover:from-amber-500 hover:to-amber-600"
            disabled={!okRead || cle.trim().length < 4}
            onClick={confirm}
          >
            Sceller et ouvrir Stripe
          </Button>
        </DialogFooter>
        {!cle.trim() || cle.trim().length < 4 ? (
          <p className="text-[10px] text-zinc-500 text-center -mt-1">La clé doit faire au moins 4 caractères.</p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
