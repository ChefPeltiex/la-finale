import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SEOMeta from "@/components/SEOMeta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listIncidents, reportIncident } from "@/lib/sentinelle";
import { Shield, Eye, AlertTriangle, Leaf, Scale } from "lucide-react";
import { isGrosCalinUnlocked } from "@/lib/grosCalin";
import GrosCalinGate from "@/components/GrosCalinGate";

const CATS = [
  { id: "fraud", label: "Fraude", icon: AlertTriangle },
  { id: "pollution", label: "Pollution", icon: Leaf },
  { id: "harassment", label: "Harcèlement", icon: AlertTriangle },
  { id: "spam", label: "Spam", icon: AlertTriangle },
  { id: "disinfo", label: "Désinformation", icon: Eye },
  { id: "other", label: "Autre", icon: Shield },
];

export default function Sentinelle() {
  const [unlocked, setUnlocked] = useState(() => isGrosCalinUnlocked());
  const [category, setCategory] = useState("fraud");
  const [impact, setImpact] = useState("medium");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: incidents = [], refetch } = useQuery({
    queryKey: ["sentinelle-incidents"],
    queryFn: () => listIncidents(200),
    staleTime: 2_000,
    refetchInterval: 3_000,
  });

  const stats = useMemo(() => {
    const by = new Map();
    for (const i of incidents) by.set(i.category, (by.get(i.category) || 0) + 1);
    return {
      total: incidents.length,
      pending: incidents.filter(i => i.status === "pending_review").length,
      confirmed: incidents.filter(i => i.status === "confirmed").length,
      by,
    };
  }, [incidents]);

  const submit = async () => {
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      const urls = evidence
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, 10);

      await reportIncident({ category, impact, description: description.trim(), evidence_urls: urls });
      setDescription("");
      setEvidence("");
      await refetch();
    } finally {
      setSubmitting(false);
    }
  };

  if (!unlocked) {
    return <GrosCalinGate onUnlocked={() => setUnlocked(true)} />;
  }

  return (
    <div className="pb-20 space-y-10 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Sentinelle — Transparence Éthique | Egor69"
        description="Journal public d’incidents (anonymisé) et signalement éthique. Souveraineté + justice, sans doxxing."
        canonicalUrl="https://egor69.ca/sentinelle"
      />

      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-200/20">
        <Shield className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
        <h1 className="font-display text-4xl font-black text-foreground">🛡️ Sentinelle</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Mur de la vérité <strong>éthique</strong>: transparence, preuves, justice — sans exposer des personnes.
        </p>
        <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-2">
          <Scale className="h-3.5 w-3.5" /> On publie des faits et des impacts, pas des “têtes”.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <p className="text-4xl font-black text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground mt-1 font-semibold">Incidents (anonymisés)</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <p className="text-4xl font-black text-amber-500">{stats.pending}</p>
          <p className="text-xs text-muted-foreground mt-1 font-semibold">En revue</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <p className="text-4xl font-black text-emerald-500">{stats.confirmed}</p>
          <p className="text-xs text-muted-foreground mt-1 font-semibold">Confirmés</p>
        </div>
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-semibold text-foreground text-lg">Signaler (SOIN)</h2>
            <p className="text-sm text-muted-foreground">
              Décris le problème et colle des liens de preuve. Pas de noms, pas de doxxing.
            </p>
          </div>
          <Button onClick={submit} disabled={submitting || !description.trim()}>
            {submitting ? "Envoi…" : "Envoyer"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Catégorie</p>
            <select
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Impact</p>
            <select
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
            >
              {["low", "medium", "high", "critical"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Preuves (URLs, une par ligne)</p>
            <Input value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="https://…" />
          </div>
        </div>

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décris le fait + le préjudice + la réparation attendue…"
          className="min-h-[120px]"
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" /> Mur public (anonymisé)
        </h2>
        {incidents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Aucun incident pour l’instant.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incidents.slice(0, 30).map((i) => (
              <div key={i.id} className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{i.category}</Badge>
                  <Badge className={i.status === "confirmed" ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}>
                    {i.status}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{i.description}</p>
                {i.evidence_urls?.length ? (
                  <div className="space-y-1 pt-2">
                    {i.evidence_urls.slice(0, 3).map((u, idx) => (
                      <a key={idx} className="text-xs text-cyan-600 hover:underline break-all" href={u} target="_blank" rel="noopener noreferrer">
                        {u}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

