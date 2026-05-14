import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { summarizeEcoProfiles } from "@/lib/platformMetrics";

const POLL_MS = 4000;
const HISTORY_CAP = 96;

function formatClock(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return iso;
  }
}

function metricsUrl() {
  const origin = import.meta.env.VITE_SOVEREIGN_API_ORIGIN || "";
  const path = "/api/platform/metrics-live";
  if (!origin) return path;
  return `${String(origin).replace(/\/$/, "")}${path}`;
}

/** Séries temporelles adhésions vs abonnements — polling EcoProfile + agrégat Stripe (serveur) si disponible. */
export default function LiveMembershipSubscriptionsChart({ className = "" }) {
  const queryClient = useQueryClient();
  const [series, setSeries] = useState([]);

  const { data: profiles = [], dataUpdatedAt } = useQuery({
    queryKey: ["eco-profiles-live-metrics"],
    queryFn: () => base44.entities.EcoProfile.list("-created_date", 50000),
    staleTime: 0,
    refetchInterval: POLL_MS,
  });

  const { data: stripeLive, isSuccess: stripeOk } = useQuery({
    queryKey: ["stripe-metrics-live"],
    queryFn: async () => {
      const r = await fetch(metricsUrl(), { credentials: "omit" });
      if (!r.ok) throw new Error("metrics_unavailable");
      return r.json();
    },
    staleTime: 0,
    refetchInterval: 8000,
    retry: 1,
  });

  useEffect(() => {
    const unsub = base44.entities.EcoProfile.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["eco-profiles-live-metrics"] });
    });
    return unsub;
  }, [queryClient]);

  const totals = useMemo(() => summarizeEcoProfiles(profiles), [profiles]);

  const subscriptionDisplay = useMemo(() => {
    if (
      stripeOk &&
      stripeLive &&
      typeof stripeLive.stripeSubscriptionsActive === "number" &&
      stripeLive.source === "stripe"
    ) {
      return stripeLive.stripeSubscriptionsActive;
    }
    return totals.subscriptions;
  }, [stripeOk, stripeLive, totals.subscriptions]);

  const subscriptionSource = stripeOk && !stripeErr ? "stripe" : "local";

  useEffect(() => {
    const t = new Date().toISOString();
    const point = {
      t,
      label: formatClock(t),
      adhésions: totals.memberships,
      abonnements: subscriptionDisplay,
    };

    setSeries((prev) => {
      const next = [...prev, point];
      const trimmed = next.length > HISTORY_CAP ? next.slice(-HISTORY_CAP) : next;
      return trimmed;
    });
  }, [totals.memberships, subscriptionDisplay, dataUpdatedAt, stripeLive?.ledgerUpdatedAt]);

  const chartData = series.length ? series : [{ t: new Date().toISOString(), label: "—", adhésions: 0, abonnements: 0 }];

  return (
    <div className={`rounded-xl border border-border bg-card p-4 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Adhésions & abonnements (temps réel)
        </h2>
        <p className="text-xs text-muted-foreground text-right max-w-[18rem]">
          EcoProfile ~{POLL_MS / 1000}s · abonnements :{" "}
          <span className="text-foreground/90">{subscriptionSource === "stripe" ? "Stripe (API)" : "profils locaux"}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-muted/50 border border-border px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Adhésions</p>
          <p className="text-2xl font-bold text-foreground tabular-nums">{totals.memberships}</p>
        </div>
        <div className="rounded-lg bg-muted/50 border border-border px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            Abonnements
            {subscriptionSource === "stripe" ? (
              <span className="text-[10px] px-1.5 py-0 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">Stripe</span>
            ) : null}
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{subscriptionDisplay}</p>
        </div>
      </div>

      <div className="h-64 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" minTickGap={24} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={36} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
              labelFormatter={() => "Échantillon"}
            />
            <Legend />
            <Line type="monotone" dataKey="adhésions" name="Adhésions" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="abonnements" name="Abonnements" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-muted-foreground mt-3">
        Les abonnements affichés suivent l’API <code className="text-[10px]">/api/platform/metrics-live</code> lorsque le serveur Egor69 et le webhook Stripe sont actifs ; sinon calcul depuis les{" "}
        <code className="text-[10px]">EcoProfile</code> locaux (<code className="text-[10px]">subscription_tier</code>, etc.).
      </p>
    </div>
  );
}
