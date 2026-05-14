import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { GitCommit, Shield, Zap, Clock, Code2, CheckCircle, Loader2 } from "lucide-react";
import { isSameDay } from "date-fns";
import { parseApiDate, formatRelativeFr } from "@/lib/dateUtils";

const COMMIT_EMOJIS = {
  feat: "✨", fix: "🔧", style: "🎨", refactor: "♻️", docs: "📝",
  test: "🧪", chore: "⚙️", perf: "⚡", build: "🏗️", ci: "🤖",
  default: "💻"
};

function getEmoji(msg) {
  const lower = (msg || "").toLowerCase();
  for (const [key, val] of Object.entries(COMMIT_EMOJIS)) {
    if (lower.startsWith(key) || lower.includes(key + ":")) return val;
  }
  return COMMIT_EMOJIS.default;
}

function CommitRow({ commit }) {
  const emoji = getEmoji(commit.commit?.message);
  const date = commit.commit?.committer?.date;
  const msg = commit.commit?.message?.split("\n")[0] || "amélioration";

  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-1">{msg}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" /> {formatRelativeFr(date, "récemment")}
          </span>
          <span className="text-[10px] font-mono text-emerald-400/70">#{commit.sha?.slice(0, 7)}</span>
        </div>
      </div>
      <CheckCircle className="h-4 w-4 text-emerald-400/50 flex-shrink-0 mt-1" />
    </div>
  );
}

export default function MurSincerite() {
  const { data, isLoading } = useQuery({
    queryKey: ["mur-sincerite"],
    queryFn: () => base44.functions.invoke("getGithubCommits", {}).then(r => r.data),
    staleTime: 5 * 60_000,
  });

  const commits = data?.commits || data || [];
  const recentCommits = Array.isArray(commits) ? commits.slice(0, 10) : [];
  const todayCount = recentCommits.filter(c => {
    const d = c.commit?.committer?.date;
    const parsed = d ? parseApiDate(d) : null;
    return Boolean(parsed && isSameDay(parsed, new Date()));
  }).length;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(16,185,129,0.04)" }}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">🧱 MUR DE LA SINCÉRITÉ</p>
            <p className="text-[10px] font-mono text-muted-foreground">Preuves de travail · Chaque ligne de code. Vérifiable. En direct.</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-primary">{todayCount}</p>
          <p className="text-[9px] font-mono text-muted-foreground">commits aujourd'hui</p>
        </div>
      </div>

      <div className="px-6 py-2 flex gap-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
        {[
          { icon: Code2,     label: `${recentCommits.length} commits`,       color: "text-blue-400" },
          { icon: Zap,       label: "Déploiements vérifiés",                  color: "text-amber-400" },
          { icon: GitCommit, label: "Egor69 · Open Build",              color: "text-emerald-400" },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] font-mono" style={{}}>
            <Icon className={`h-3 w-3 ${color}`} /> <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="px-6 py-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground font-mono">Chargement des preuves de travail…</span>
          </div>
        ) : recentCommits.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground text-sm">Aucun commit disponible. Connectez votre repo GitHub.</p>
        ) : (
          <div>
            {recentCommits.map((commit, i) => <CommitRow key={commit.sha || i} commit={commit} />)}
          </div>
        )}
      </div>

      <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
        <p className="text-[10px] font-mono text-muted-foreground">Chaque commit = une victoire pour Egor69 ⚡</p>
        <Link to="/commits" className="text-[10px] font-mono text-primary hover:underline">Voir tout →</Link>
      </div>
    </div>
  );
}