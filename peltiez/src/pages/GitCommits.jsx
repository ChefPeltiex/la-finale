import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import {
  GitCommit, ExternalLink, RefreshCw, GitBranch, User, Calendar,
  Zap, AlertTriangle, CheckCircle, Info, Sparkles, TrendingUp, Tag, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeFr } from "@/lib/dateUtils";

const fetchCommits = (branch) =>
  base44.functions.invoke("getGithubCommits", { branch, per_page: 30 }).then((r) => r.data);

const fetchAnalysis = () =>
  base44.functions.invoke("analyzeCommits", {}).then((r) => r.data);

const IMPACT_CONFIG = {
  critique: { color: "bg-red-100 text-red-700 border-red-200", icon: AlertTriangle },
  haute:    { color: "bg-orange-100 text-orange-700 border-orange-200", icon: Zap },
  moyenne:  { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Info },
  faible:   { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
};

function FreshnessGauge({ score, label }) {
  const color = score >= 75 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-600";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="10"
            className="text-muted/30" fill="none" />
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="10"
            className={color} fill="none"
            strokeDasharray={`${(score / 100) * 264} 264`}
            strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{score}</span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground text-center">{label}</span>
    </div>
  );
}

function CategoryBar({ label, count, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 text-muted-foreground capitalize shrink-0">{label}</span>
      <div className="flex-1 bg-muted rounded-full h-1.5">
        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right font-medium text-foreground">{count}</span>
    </div>
  );
}

export default function GitCommits() {
  const [branch, setBranch] = useState("main");
  const [tab, setTab] = useState("analyse");

  const { data: commits, isLoading: loadingCommits, refetch: refetchCommits, isFetching: fetchingCommits } = useQuery({
    queryKey: ["github-commits", branch],
    queryFn: () => fetchCommits(branch),
    staleTime: 60_000,
  });

  const { data: analysis, isLoading: loadingAnalysis, refetch: refetchAnalysis, isFetching: fetchingAnalysis } = useQuery({
    queryKey: ["github-analysis"],
    queryFn: fetchAnalysis,
    staleTime: 5 * 60_000,
    enabled: tab === "analyse",
  });

  const isFetching = fetchingCommits || fetchingAnalysis;

  const handleRefresh = () => {
    refetchCommits();
    if (tab === "analyse") refetchAnalysis();
  };

  const catTotal = analysis?.categories
    ? Object.values(analysis.categories).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="pb-20 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <GitCommit className="h-6 w-6 text-primary" />
            Suivi GitHub
          </h1>
          {commits?.repo && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5" />
              {commits.repo}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={handleRefresh} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {[{ key: "analyse", label: "Analyse IA" }, { key: "commits", label: "Commits" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ANALYSE TAB ── */}
      {tab === "analyse" && (
        <>
          {loadingAnalysis && (
            <div className="bg-card rounded-2xl border border-border p-8 text-center space-y-3">
              <Sparkles className="h-8 w-8 text-primary mx-auto animate-pulse" />
              <p className="text-sm font-medium text-foreground">Analyse des commits en cours…</p>
              <p className="text-xs text-muted-foreground">L'IA parcourt les modifications récentes</p>
            </div>
          )}

          {analysis && !loadingAnalysis && (
            <div className="space-y-4">
              {/* Score + summary */}
              <div className="bg-card rounded-2xl border border-border p-6 flex flex-col sm:flex-row gap-6">
                <FreshnessGauge score={analysis.freshness_score} label={analysis.freshness_label} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h2 className="font-semibold text-foreground text-sm">Résumé de l'état du développement</h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Analysé {formatRelativeFr(analysis.last_analyzed, "récemment")} · {analysis.total_commits} commits examinés
                  </p>
                </div>
              </div>

              {/* Category breakdown */}
              {analysis.categories && catTotal > 0 && (
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" /> Répartition des changements
                  </h3>
                  <div className="space-y-2.5">
                    {Object.entries(analysis.categories).map(([k, v]) =>
                      v > 0 ? <CategoryBar key={k} label={k} count={v} total={catTotal} /> : null
                    )}
                  </div>
                </div>
              )}

              {/* Priority changes */}
              {analysis.priority_changes?.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" /> Modifications prioritaires à synchroniser
                  </h3>
                  <div className="space-y-3">
                    {analysis.priority_changes.map((change, i) => {
                      const cfg = IMPACT_CONFIG[change.impact] || IMPACT_CONFIG.faible;
                      const Icon = cfg.icon;
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                          <div className={`p-1.5 rounded-lg border ${cfg.color} shrink-0`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-foreground">{change.title}</span>
                              <Badge variant="outline" className="text-[10px] font-mono">{change.sha}</Badge>
                              {change.category && (
                                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                  {change.category}
                                </span>
                              )}
                            </div>
                            {change.action && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <ChevronRight className="h-3 w-3 text-primary" /> {change.action}
                              </p>
                            )}
                          </div>
                          <Badge className={`shrink-0 text-[10px] border ${cfg.color} bg-transparent`}>
                            {change.impact}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations?.length > 0 && (
                <div className="bg-accent rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-accent-foreground mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Recommandations immédiates
                  </h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((r, i) => (
                      <li key={i} className="text-sm text-accent-foreground/80 flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">→</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── COMMITS TAB ── */}
      {tab === "commits" && (
        <>
          {/* Branch selector */}
          <div className="flex gap-2">
            {["main", "master", "develop"].map((b) => (
              <button
                key={b}
                onClick={() => setBranch(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  branch === b
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-foreground hover:bg-accent"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {loadingCommits && (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {commits?.commits && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{commits.commits.length} commits · branche <span className="font-medium text-foreground">{commits.branch}</span></p>
              {commits.commits.map((commit) => (
                <div key={commit.sha} className="bg-card rounded-2xl border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
                  <div className="flex items-start gap-3">
                    {commit.avatar ? (
                      <img src={commit.avatar} alt={commit.author} className="h-9 w-9 rounded-full flex-shrink-0 ring-2 ring-border" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {commit.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {commit.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatRelativeFr(commit.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="font-mono text-xs">{commit.sha}</Badge>
                      <a href={commit.url} target="_blank" rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}