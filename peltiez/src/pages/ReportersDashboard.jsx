import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import {
  Radar, AlertCircle, Users, Zap, Bell,
  Plus, Loader2, X, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function ReportersDashboard() {
  const queryClient = useQueryClient();
  const [showAddReporter, setShowAddReporter] = useState(false);
  const [newReporter, setNewReporter] = useState({
    full_name: "",
    email: "",
    region: "",
    specialties: [],
    notification_frequency: "realtime"
  });

  // All hooks MUST be called before any conditional logic
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity
  });

  const { data: reporters = [], isLoading: loadingReporters } = useQuery({
    queryKey: ["reporters"],
    queryFn: () => base44.entities.Reporter.filter({ is_active: true }, "-created_date", 100),
    staleTime: 30_000
  });

  const { data: alerts = [], isLoading: _loadingAlerts } = useQuery({
    queryKey: ["reporter-alerts"],
    queryFn: () => base44.entities.ReporterAlert.filter({}, "-detected_at", 50),
    staleTime: 30_000
  });

  const addReporterMutation = useMutation({
    mutationFn: async () => {
      if (!newReporter.full_name || !newReporter.email || !newReporter.region) {
        throw new Error("Missing required fields");
      }
      return base44.entities.Reporter.create(newReporter);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reporters"]);
      setNewReporter({
        full_name: "",
        email: "",
        region: "",
        specialties: [],
        notification_frequency: "realtime"
      });
      setShowAddReporter(false);
    }
  });

  const triggerScanMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke("detectReporterNews", {});
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reporter-alerts"]);
    }
  });

  const recentAlerts = useMemo(
    () => alerts.filter(a => a.status === "new_alert"),
    [alerts]
  );

  const totalRelevance = useMemo(
    () => Math.round(alerts.reduce((sum, a) => sum + (a.relevance_score || 0), 0) / alerts.length || 0),
    [alerts]
  );

  // Admin check (after all hooks)
  if (user && user.role !== 'admin') {
    return (
      <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">Admin access required to manage reporters</p>
      </div>
    );
  }

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "Dashboard",
    "name": "Reporters Network — Real-time News Detection",
    "description": "Manage ecological & mystical reporters. Get exclusive alerts on breakthroughs."
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Reporters Dashboard — Ecological & Mystical News Detection | CirculAI"
        description="Manage network of reporters monitoring exclusive ecological, mystical, and spiritual breakthroughs worldwide."
        keywords="reporters, news detection, ecological, mystical, alerts, real-time"
        canonicalUrl="https://egor69.ca/reporters"
        schemaData={seoSchema}
      />

      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-200/20">
        <Radar className="h-12 w-12 text-cyan-600 mx-auto mb-3" />
        <h1 className="font-display text-4xl font-black text-foreground">
          World Reporters Network
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Real-time monitoring of ecological, mystical and community breakthroughs worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-2xl border-2 border-blue-300 p-4 text-center">
          <p className="text-3xl font-black text-blue-600">{reporters.length}</p>
          <p className="text-xs text-blue-700 mt-1 font-bold">Active Reporters</p>
        </div>
        <div className="bg-cyan-50 rounded-2xl border-2 border-cyan-300 p-4 text-center">
          <p className="text-3xl font-black text-cyan-600">{recentAlerts.length}</p>
          <p className="text-xs text-cyan-700 mt-1 font-bold">New Alerts</p>
        </div>
        <div className="bg-purple-50 rounded-2xl border-2 border-purple-300 p-4 text-center">
          <p className="text-3xl font-black text-purple-600">{totalRelevance}%</p>
          <p className="text-xs text-purple-700 mt-1 font-bold">Avg Relevance</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-300 p-4 text-center">
          <p className="text-3xl font-black text-emerald-600">{alerts.length}</p>
          <p className="text-xs text-emerald-700 mt-1 font-bold">Total Detected</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-300 p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-blue-900">Manual Detection Scan</h3>
          <p className="text-sm text-blue-700 mt-1">Trigger immediate scan of all sources</p>
        </div>
        <Button
          onClick={() => triggerScanMutation.mutate()}
          disabled={triggerScanMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 border-0">
          {triggerScanMutation.isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Scanning...</>
          ) : (
            <><Zap className="h-4 w-4" /> Trigger Scan</>
          )}
        </Button>
      </div>

      {showAddReporter && (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-foreground">Add Reporter</h2>
            <button onClick={() => setShowAddReporter(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <Input
            placeholder="Full Name"
            value={newReporter.full_name}
            onChange={(e) => setNewReporter({ ...newReporter, full_name: e.target.value })}
            className="rounded-lg"
          />

          <Input
            placeholder="Email"
            type="email"
            value={newReporter.email}
            onChange={(e) => setNewReporter({ ...newReporter, email: e.target.value })}
            className="rounded-lg"
          />

          <Input
            placeholder="Region (ex: Quebec, Africa, Asia)"
            value={newReporter.region}
            onChange={(e) => setNewReporter({ ...newReporter, region: e.target.value })}
            className="rounded-lg"
          />

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Specialties</label>
            <div className="flex flex-wrap gap-2">
              {["ecology", "mystical", "spirituality", "paranormal", "wellness", "community"].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    const specs = newReporter.specialties.includes(s)
                      ? newReporter.specialties.filter(x => x !== s)
                      : [...newReporter.specialties, s];
                    setNewReporter({ ...newReporter, specialties: specs });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    newReporter.specialties.includes(s)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-card border-border text-muted-foreground hover:bg-accent"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => addReporterMutation.mutate()}
            disabled={addReporterMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold border-0 py-2">
            {addReporterMutation.isPending ? "Creating..." : "Create Reporter"}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-600" /> Active Reporters
          </h2>
          <Button
            onClick={() => setShowAddReporter(!showAddReporter)}
            variant="outline"
            className="gap-2">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        {loadingReporters ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-cyan-500" /></div>
        ) : reporters.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
            <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">No active reporters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reporters.map(reporter => (
              <div key={reporter.id} className="bg-card rounded-xl border border-border p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-foreground">{reporter.full_name}</h3>
                  <Badge className="bg-blue-100 text-blue-800 border-0">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {reporter.region}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Bell className="h-3 w-3" /> {reporter.notification_frequency}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {(reporter.specialties || []).map(s => (
                    <Badge key={s} variant="outline" className="text-[10px] capitalize">{s}</Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  {reporter.alerts_sent || 0} alerts sent
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {recentAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" /> Recent Alerts
          </h2>
          <div className="space-y-3">
            {recentAlerts.slice(0, 10).map(alert => (
              <div key={alert.id} className="bg-amber-50 rounded-xl border-2 border-amber-300 p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{alert.headline}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description?.substring(0, 100)}...</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 border-0 whitespace-nowrap">
                    {alert.relevance_score}%
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex gap-2">
                  <span>📍 {alert.region}</span>
                  <span>🏷️ {alert.alert_type.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}