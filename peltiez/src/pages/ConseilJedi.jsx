import { useState } from "react";
import { Vote, CheckCircle, Clock, Crown, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import { formatRelativeFr } from "@/lib/dateUtils";

const INITIAL_PROPOSALS = [
  { id: "p1", title: "Ajouter un module de troc intégré au marketplace", desc: "Permettre l'échange direct entre membres sans monnaie, avec un système de valorisation équitable basé sur le temps et les compétences.", votes_for: 3421, votes_against: 187, status: "active",   category: "Marketplace",  ends: "2026-05-15" },
  { id: "p2", title: "Créer une monnaie locale 'Étincelles' convertible en biens réels", desc: "Les Étincelles gagnées par les contributions pourraient être échangées contre des objets, services ou formations sur la plateforme.", votes_for: 5102, votes_against: 432, status: "active",   category: "Économie",     ends: "2026-05-20" },
  { id: "p3", title: "Ouvrir le code source à la communauté (Open Source complet)", desc: "Publier l'intégralité du code sous licence AGPL pour que n'importe quel pays puisse déployer son propre Hub circulaire.", votes_for: 7891, votes_against: 201, status: "active",   category: "Gouvernance",  ends: "2026-05-18" },
  { id: "p4", title: "Imposer un plafond de revenus pour les vendeurs professionnels", desc: "Les entreprises vendant plus de 10 000$/mois doivent partager 5% de leurs revenus avec le Fonds Communautaire CirculAI.", votes_for: 2344, votes_against: 1876, status: "active",  category: "Éthique",      ends: "2026-05-25" },
  { id: "p5", title: "Intégrer un système de médiation par pairs pour les conflits", desc: "Former des 'Médiateurs Certifiés' au sein de la communauté pour résoudre les litiges sans recourir à la justice conventionnelle.", votes_for: 4123, votes_against: 567, status: "passed",  category: "Gouvernance",  ends: "2026-04-30" },
  { id: "p6", title: "Créer une Académie CirculAI avec des formations certifiantes gratuites", desc: "Modules de formation sur l'économie circulaire, l'IA, la permaculture, la réparation et l'entrepreneuriat social.", votes_for: 9234, votes_against: 121, status: "passed",  category: "Éducation",    ends: "2026-04-15" },
];

const STATUS_COLORS = {
  active: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", text: "#10b981", label: "⚡ EN VOTE" },
  passed: { bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.3)",  text: "#818cf8", label: "✅ ADOPTÉ" },
  failed: { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   text: "#f87171", label: "❌ REJETÉ" },
};

const CAT_COLORS = { Marketplace: "bg-blue-100 text-blue-700", Économie: "bg-amber-100 text-amber-700", Gouvernance: "bg-violet-100 text-violet-700", Éthique: "bg-rose-100 text-rose-700", Éducation: "bg-emerald-100 text-emerald-700" };

export default function ConseilJedi() {
  const [myVotes, setMyVotes] = useState(() => { try { return JSON.parse(localStorage.getItem("jedi_votes") || "{}"); } catch { return {}; } });
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("active");

  const vote = (id, type) => {
    if (myVotes[id]) { toast.error("Vous avez déjà voté sur cette proposition."); return; }
    const updated = { ...myVotes, [id]: type };
    setMyVotes(updated);
    localStorage.setItem("jedi_votes", JSON.stringify(updated));
    setProposals(prev => prev.map(p => p.id === id
      ? { ...p, votes_for: type === "for" ? p.votes_for + 1 : p.votes_for, votes_against: type === "against" ? p.votes_against + 1 : p.votes_against }
      : p
    ));
    toast.success(type === "for" ? "Vote POUR enregistré ! +10 XP ⚡" : "Vote CONTRE enregistré.", { icon: type === "for" ? "✅" : "❌" });
  };

  const submitProposal = async () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    const id = `p${Date.now()}`;
    setProposals(prev => [{
      id, title: newTitle, desc: newDesc,
      votes_for: 1, votes_against: 0,
      status: "active", category: "Gouvernance",
      ends: format(addDays(new Date(), 14), "yyyy-MM-dd"),
    }, ...prev]);
    setNewTitle(""); setNewDesc("");
    setSubmitting(false);
    toast.success("Proposition soumise au Conseil des Jedi ! 🗡️");
  };

  const filtered = proposals.filter(p => filter === "all" || p.status === filter);
  const totalVoters = 144000;
  const participation = Math.round(proposals.filter(p=>p.status==="active").reduce((s,p) => s + p.votes_for + p.votes_against, 0) / totalVoters * 100);

  return (
    <div className="pb-20 space-y-10 max-w-4xl mx-auto px-4 pt-8">
      {/* Hero */}
      <div className="rounded-3xl p-8 text-center space-y-4"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.1))", border: "2px solid rgba(99,102,241,0.3)" }}>
        <Crown className="h-10 w-10 mx-auto text-amber-400" />
        <h1 className="font-display text-4xl font-black text-foreground">⚖️ Conseil des Jedi</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">La démocratie directe des 144 000. Chaque membre vote. Le code évolue selon la volonté collective.</p>
        <div className="flex justify-center gap-8 pt-2 text-sm font-mono">
          <div className="text-center"><p className="text-2xl font-black text-primary">{participation}%</p><p className="text-muted-foreground text-xs">Participation</p></div>
          <div className="text-center"><p className="text-2xl font-black text-violet-400">{proposals.filter(p=>p.status==="active").length}</p><p className="text-muted-foreground text-xs">Votes actifs</p></div>
          <div className="text-center"><p className="text-2xl font-black text-emerald-400">{proposals.filter(p=>p.status==="passed").length}</p><p className="text-muted-foreground text-xs">Adoptés</p></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[["active","⚡ En vote"],["passed","✅ Adoptés"],["all","Tous"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background: filter === v ? "hsl(var(--primary))" : "hsl(var(--muted))", color: filter === v ? "white" : "hsl(var(--muted-foreground))" }}>
            {l}
          </button>
        ))}
      </div>

      {/* Proposals */}
      <div className="space-y-4">
        {filtered.map(p => {
          const total = p.votes_for + p.votes_against;
          const pct = total ? Math.round((p.votes_for / total) * 100) : 50;
          const cfg = STATUS_COLORS[p.status] || STATUS_COLORS.active;
          const myVote = myVotes[p.id];
          return (
            <div key={p.id} className="rounded-2xl overflow-hidden border border-border bg-card">
              <div className="px-6 py-4 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[p.category] || ""}`}>{p.category}</span>
                    {p.status === "active" && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {formatRelativeFr(p.ends)}</span>}
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
              <div className="px-6 pb-5 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-emerald-500 font-bold">POUR {pct}%</span>
                    <span className="text-red-400 font-bold">CONTRE {100-pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden bg-muted flex">
                    <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                    <div className="h-full bg-red-400 flex-1" />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>{p.votes_for.toLocaleString("fr-CA")} votes</span>
                    <span>{p.votes_against.toLocaleString("fr-CA")} votes</span>
                  </div>
                </div>
                {p.status === "active" && (
                  <div className="flex gap-3">
                    <button disabled={!!myVote} onClick={() => vote(p.id, "for")}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                      style={{ background: myVote === "for" ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>
                      <CheckCircle className="h-4 w-4" /> {myVote === "for" ? "Voté POUR ✓" : "Voter POUR"}
                    </button>
                    <button disabled={!!myVote} onClick={() => vote(p.id, "against")}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                      style={{ background: myVote === "against" ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                      ✕ {myVote === "against" ? "Voté CONTRE ✓" : "Voter CONTRE"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit proposal */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-bold text-foreground flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Soumettre une proposition</h2>
        <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
          placeholder="Titre de votre proposition…"
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary/50" />
        <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3}
          placeholder="Description détaillée — Pourquoi cette évolution est nécessaire pour la communauté…"
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary/50 resize-none" />
        <button onClick={submitProposal} disabled={submitting || !newTitle.trim()}
          className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.01]"
          style={{ background: "hsl(var(--primary))" }}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Vote className="h-4 w-4" />}
          {submitting ? "Soumission…" : "Soumettre au vote des 144 000"}
        </button>
        <p className="text-[10px] text-muted-foreground text-center">Les propositions ayant +500 votes POUR en 14 jours sont transmises à l'équipe de développement.</p>
      </div>
    </div>
  );
}