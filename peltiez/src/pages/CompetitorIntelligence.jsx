import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import {
  Loader2, AlertCircle, CheckCircle2,
  Target, Sparkles, RefreshCw, Bolt, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CompetitorIntelligence() {
  const queryClient = useQueryClient();
  const [scanning, setScanning] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity
  });

  const { data: trackings = [], isLoading } = useQuery({
    queryKey: ["competitor-tracking"],
    queryFn: () =>
      base44.entities.CompetitorTracking.filter({}, "-timestamp", 100),
    staleTime: 60_000,
    enabled: user?.role === "admin"
  });

  const { data: latestInsights = [] } = useQuery({
    queryKey: ["tracking-insights"],
    queryFn: () => {
      const recent = trackings.slice(0, 10);
      return recent.flatMap(t => t.insights || []);
    },
    enabled: trackings.length > 0
  });

  const scanMutation = useMutation({
    mutationFn: async () => {
      setScanning(true);
      const res = await base44.functions.invoke('competitorTracker', {});
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["competitor-tracking"]);
      setScanning(false);
    },
    onError: () => setScanning(false)
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }) =>
      base44.entities.CompetitorTracking.update(id, { status: newStatus }),
    onSuccess: () => queryClient.invalidateQueries(["competitor-tracking"])
  });

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">Admin access required</p>
      </div>
    );
  }

  const filteredTrackings = trackings.filter(t =>
    statusFilter === "all" || t.status === statusFilter
  );

  const groupedByTarget = {};
  filteredTrackings.forEach(t => {
    if (!groupedByTarget[t.target_name]) {
      groupedByTarget[t.target_name] = [];
    }
    groupedByTarget[t.target_name].push(t);
  });

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "Dashboard",
    "name": "Competitive Intelligence Tracker",
    "description": "Real-time monitoring of competitor technologies, features, and market trends"
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Competitive Intelligence — Tracker Ninja | CirculAI Hub"
        description="Monitor competitor technologies, features, and performance. Real-time insights on market trends and competitive advantages."
        keywords="competitive analysis, market intelligence, technology tracking, competitor monitoring"
        canonicalUrl="https://egor69.ca/competitor-intelligence"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-purple-200/20">
        <Target className="h-12 w-12 text-violet-500 mx-auto mb-3" />
        <h1 className="font-display text-4xl font-black text-foreground">🥷 Competitive Intelligence</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Track competitor technologies, features, and market trends in real-time. Gain strategic advantage.
        </p>
      </div>

      {/* Scan Control */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Bolt className="h-5 w-5 text-amber-500" /> Lancer un scan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Analyse les competitors pour détecter technologies, features et patterns
            </p>
          </div>
          <Button
            onClick={() => scanMutation.mutate()}
            disabled={scanning || scanMutation.isPending}
            className="rounded-xl font-bold gap-2 bg-violet-600 hover:bg-violet-700 text-white border-0">
            {scanning || scanMutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Scanning...</>
            ) : (
              <><RefreshCw className="h-4 w-4" /> Start Scan</>
            )}
          </Button>
        </div>
      </div>

      {/* Status Filter */}
      {trackings.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "new", "reviewed", "implemented", "archived"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all capitalize ${
                statusFilter === s
                  ? "bg-violet-600 text-white"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Key Insights */}
      {latestInsights.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" /> Key Insights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {latestInsights.slice(0, 4).map((insight, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4 space-y-2">
                <p className="font-semibold text-sm text-foreground">{insight.title}</p>
                <p className="text-xs text-muted-foreground">{insight.action}</p>
                <Badge variant="outline" className="text-[10px]">
                  {insight.type === 'tech_trend' ? '📊 Tech' : '🚀 Feature'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracking Results by Target */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : filteredTrackings.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <Eye className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No tracking data yet</p>
          <p className="text-sm text-muted-foreground mt-1">Run a scan to start monitoring competitors</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByTarget).map(([targetName, data]) => (
            <div key={targetName} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-4 border-b border-border">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  🎯 {targetName}
                  <Badge>{data.length} scans</Badge>
                </h3>
              </div>

              <div className="divide-y divide-border">
                {data.slice(0, 3).map(tracking => (
                  <div key={tracking.id} className="p-4 space-y-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          {new Date(tracking.timestamp).toLocaleDateString('en-CA')}
                        </p>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {tracking.metrics?.frameworks?.map(fw => (
                            <Badge key={fw} variant="outline" className="text-[10px]">
                              {fw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {tracking.accessible ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                        )}
                      </div>
                    </div>

                    {tracking.metrics?.recent_features?.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">New Features</p>
                        <div className="flex gap-1 flex-wrap">
                          {tracking.metrics.recent_features.map(f => (
                            <span key={f} className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700">
                              🚀 {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatusMutation.mutate({ id: tracking.id, newStatus: 'reviewed' })}
                        className="text-xs h-7">
                        Mark Reviewed
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {trackings.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-black text-violet-500">{trackings.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Scans</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-black text-emerald-500">
              {Object.keys(groupedByTarget).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Competitors</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-black text-amber-500">{latestInsights.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Insights</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-black text-cyan-500">
              {trackings.filter(t => t.status === 'new').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">New Findings</p>
          </div>
        </div>
      )}
    </div>
  );
}