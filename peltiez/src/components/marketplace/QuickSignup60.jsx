import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "circulai_inscription_rapide";

export function getQuickSignup() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function QuickSignup60({ className = "" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(() => !!getQuickSignup());

  const submit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        email: trimmed,
        name: name.trim() || "Membre CirculAI",
        createdAt: new Date().toISOString(),
      }),
    );
    setDone(true);
    navigate("/publier");
  };

  if (done) {
    return (
      <div className={`rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-6 ${className}`}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-white">Vous êtes dans la boucle.</p>
            <p className="text-sm text-white/70 mt-1">Publiez votre première annonce ou parcourez le marché.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500">
                <Link to="/publier">Publier maintenant</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20">
                <Link to="/marketplace">Voir les annonces</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-2xl border border-sky-500/35 bg-sky-950/40 p-6 space-y-4 shadow-lg shadow-sky-900/20 ${className}`}
    >
      <p className="text-sm font-semibold text-sky-200">Inscription express — moins de 60 secondes</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="qs-email" className="text-white/80">
            Courriel
          </Label>
          <Input
            id="qs-email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.ca"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl bg-black/40 border-white/15"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="qs-name" className="text-white/80">
            Prénom (optionnel)
          </Label>
          <Input
            id="qs-name"
            type="text"
            autoComplete="given-name"
            placeholder="Dominic"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-xl bg-black/40 border-white/15"
          />
        </div>
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold min-h-[48px] gap-2"
      >
        Je rejoins la boucle — gratuit
        <ArrowRight className="h-5 w-5" />
      </Button>
      <p className="text-[11px] text-white/45 text-center leading-snug">
        Gratuit pour parcourir. Pas de carte bancaire. Plateforme en croissance — terrain québécois, pas de faux chiffres.
      </p>
    </form>
  );
}
