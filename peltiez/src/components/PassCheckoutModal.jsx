import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stripePublishable = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

const stripePromise = stripePublishable ? loadStripe(stripePublishable) : null;

function PaymentForm({ tier, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setMessage("");
    const base = `${window.location.origin}/pricing`;
    const returnUrl = `${base}?success=1&pass=${encodeURIComponent(tier)}`;
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });
    if (error) {
      setMessage(error.message || "Paiement interrompu.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
          Annuler
        </Button>
        <Button type="submit" disabled={busy || !stripe} className="bg-amber-500 text-black hover:bg-amber-400">
          {busy ? "Confirmation…" : "Payer"}
        </Button>
      </div>
    </form>
  );
}

/**
 * @param {{
 *   open: boolean;
 *   onOpenChange: (v: boolean) => void;
 *   tier: string;
 *   priceId: string;
 *   mode: "payment" | "subscription";
 * }} props
 */
export default function PassCheckoutModal({ open, onOpenChange, tier, priceId, mode }) {
  const [clientSecret, setClientSecret] = useState("");
  const [loadError, setLoadError] = useState("");

  const endpoint =
    import.meta.env.VITE_STRIPE_PAYMENT_INTENT_ENDPOINT || "/api/stripe/payment-intent";

  useEffect(() => {
    if (!open) {
      setClientSecret("");
      setLoadError("");
      return;
    }
    if (!priceId) {
      setLoadError("Identifiant de prix Stripe manquant (variable VITE_…).");
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadError("");
      setClientSecret("");
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, tier, mode }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok) {
          if (!cancelled) setLoadError(json?.error || "Impossible de préparer le paiement.");
          return;
        }
        if (!cancelled && json?.clientSecret) setClientSecret(json.clientSecret);
        else if (!cancelled) setLoadError("Réponse serveur invalide.");
      } catch {
        if (!cancelled) setLoadError("Réseau indisponible.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, priceId, tier, mode, endpoint]);

  const title =
    tier === "netherealm"
      ? "Pass Netherealm"
      : tier === "etherealm"
        ? "Pass Etherealm"
        : tier === "outworld"
          ? "Pass Outworld"
          : "Paiement";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-md border border-amber-500/40 bg-zinc-950 text-zinc-100",
          "sm:rounded-2xl",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-amber-100">{title}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Paiement sécurisé par Stripe (Payment Element). Les fonds vont au compte lié à votre clé secrète ;
            métadonnées holding : Les Secrets du St-Laurent.
          </DialogDescription>
        </DialogHeader>
        {!stripePublishable || !stripePromise ? (
          <p className="text-sm text-amber-200">
            Définissez <code className="text-xs">VITE_STRIPE_PUBLISHABLE_KEY</code> pour activer Stripe.js.
          </p>
        ) : loadError ? (
          <p className="text-sm text-destructive">{loadError}</p>
        ) : !clientSecret ? (
          <p className="text-sm text-zinc-400">Préparation du formulaire…</p>
        ) : (
          <Elements
            key={clientSecret}
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "night",
                variables: {
                  colorPrimary: "#f59e0b",
                  colorBackground: "#09090b",
                  colorText: "#fafafa",
                  borderRadius: "10px",
                },
              },
            }}
          >
            <PaymentForm tier={tier} onClose={() => onOpenChange(false)} />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}
