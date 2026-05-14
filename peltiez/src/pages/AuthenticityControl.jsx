import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import {
  Loader2, AlertCircle, CheckCircle2, XCircle, Shield, Lock, Eye, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { isGrosCalinUnlocked } from "@/lib/grosCalin";
import GrosCalinGate from "@/components/GrosCalinGate";

export default function AuthenticityControl() {
  const [unlocked, setUnlocked] = useState(() => isGrosCalinUnlocked());
  const queryClient = useQueryClient();
  const [selectedScoop, setSelectedScoop] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [verifying, setVerifying] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity
  });

  const { data: unverifiedScoops = [] } = useQuery({
    queryKey: ["unverified-scoops"],
    queryFn: () =>
      base44.entities.CompetitiveScoops.filter(
        { authenticity_verified: false },
        "-discovered_at",
        50
      ),
    staleTime: 30_000
  });

  const { data: verifiedScoops = [] } = useQuery({
    queryKey: ["verified-scoops"],
    queryFn: () =>
      base44.entities.CompetitiveScoops.filter(
        { is_authentic: true },
        "-discovered_at",
        50
      ),
    staleTime: 30_000
  });

  const { data: rejectedScoops = [] } = useQuery({
    queryKey: ["rejected-scoops"],
    queryFn: () =>
      base44.entities.AuthenticityVerification.filter(
        { status: "rejected_ai_generated" },
        "-verified_timestamp",
        50
      ),
    staleTime: 30_000
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!selectedScoop || !sourceUrl) {
        throw new Error("Scoop and source URL required");
      }

      setVerifying(true);
      const res = await base44.functions.invoke("verifyAuthenticity", {
        scoop_id: selectedScoop.id,
        source_url: sourceUrl
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["unverified-scoops"]);
      queryClient.invalidateQueries(["verified-scoops"]);
      queryClient.invalidateQueries(["rejected-scoops"]);
      setSelectedScoop(null);
      setSourceUrl("");
      setVerifying(false);
    },
    onError: () => setVerifying(false)
  });

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">Admin access required</p>
      </div>
    );
  }

  if (!unlocked) {
    return <GrosCalinGate onUnlocked={() => setUnlocked(true)} />;
  }

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "Dashboard",
    "name": "Authenticity Control — Truth Verification",
    "description": "Verify scoop authenticity. Reject AI-generated content. Ensure only real news."
  };

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Authenticity Control — Truth Verification | Egor69"
        description="Verify scoop authenticity. Reject AI-generated fake news. Only real sources allowed."
        keywords="authenticity, verification, truth, fact-check, anti-ai-generation"
        canonicalUrl="https://egor69.ca/authenticity"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-200/20">
        <Shield className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
        <h1 className="font-display text-4xl font-black text-foreground">
          🔐 Authenticity Control
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Verify all scoops against real sources. Zero AI-generated content. Only truth.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-300 p-6 text-center">
          <p className="text-3xl font-black text-emerald-600">{verifiedScoops.length}</p>
          <p className="text-sm text-emerald-700 mt-2 font-bold">✅ Verified Authentic</p>
        </div>
        <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-6 text-center">
          <p className="text-3xl font-black text-amber-600">{unverifiedScoops.length}</p>
          <p className="text-sm text-amber-700 mt-2 font-bold">⏳ Pending Review</p>
        </div>
        <div className="bg-red-50 rounded-2xl border-2 border-red-300 p-6 text-center">
          <p className="text-3xl font-black text-red-600">{rejectedScoops.length}</p>
          <p className="text-sm text-red-700 mt-2 font-bold">❌ Rejected (AI/Fake)</p>
        </div>
      </div>

      {/* Verification Panel */}
      {unverifiedScoops.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-300 p-6 space-y-4">
          <h2 className="font-bold text-lg text-blue-900 flex items-center gap-2">
            <Eye className="h-5 w-5" /> Manual Verification
          </h2>

          {/* Select Scoop */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">Select Scoop to Verify</label>
            <select
              value={selectedScoop?.id || ""}
              onChange={(e) => {
                const scoop = unverifiedScoops.find(s => s.id === e.target.value);
                setSelectedScoop(scoop || null);
              }}
              className="w-full p-2.5 rounded-lg border border-blue-200 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-blue-400/30">
              <option value="">Choose a scoop...</option>
              {unverifiedScoops.map(s => (
                <option key={s.id} value={s.id}>
                  {s.headline.substring(0, 50)}... ({s.competitor})
                </option>
              ))}
            </select>
          </div>

          {selectedScoop && (
            <div className="bg-white rounded-lg border-2 border-blue-200 p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Scoop Details</p>
                <p className="font-semibold text-foreground mt-1">{selectedScoop.headline}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedScoop.competitor} · {selectedScoop.scoop_type}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-900">Source URL (Direct Link)</label>
                <Input
                  placeholder="https://notion.so/... or https://figma.com/..."
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="rounded-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Must be from legitimate source (Notion, Figma, Discord, GitHub, etc)
                </p>
              </div>

              <Button
                onClick={() => verifyMutation.mutate()}
                disabled={verifying || !sourceUrl}
                className="w-full rounded-xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0 py-3">
                {verifying ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
                ) : (
                  <><Shield className="h-4 w-4" /> Verify Authenticity</>
                )}
              </Button>

              {verifyMutation.data && (
                <div className={`rounded-lg p-3 flex gap-3 ${
                  verifyMutation.data.status === 'verified_authentic'
                    ? 'bg-emerald-50 border border-emerald-300'
                    : 'bg-red-50 border border-red-300'
                }`}>
                  {verifyMutation.data.status === 'verified_authentic' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold text-sm">
                      {verifyMutation.data.message}
                    </p>
                    {verifyMutation.data.red_flags && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Flags: {verifyMutation.data.red_flags.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Verified Section */}
      {verifiedScoops.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Verified Authentic Scoops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedScoops.slice(0, 6).map(scoop => (
              <div key={scoop.id} className="bg-emerald-50 rounded-xl border-2 border-emerald-300 p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-foreground">{scoop.headline}</p>
                    <p className="text-xs text-muted-foreground mt-1">{scoop.competitor}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-0 w-fit">
                  ✅ Real Source
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected Section */}
      {rejectedScoops.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" /> Rejected (AI-Generated / Fake)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rejectedScoops.slice(0, 6).map(verification => (
              <div key={verification.id} className="bg-red-50 rounded-xl border-2 border-red-300 p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-red-900">
                      Rejected: {verification.status.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p className="text-xs text-red-700 mt-1">{verification.rejection_reason}</p>
                  </div>
                </div>
                {verification.red_flags?.length > 0 && (
                  <div className="text-xs text-red-700 space-y-1">
                    {verification.red_flags.map((flag, i) => (
                      <p key={i}>🚩 {flag}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {unverifiedScoops.length === 0 && verifiedScoops.length === 0 && (
        <div className="text-center py-16 bg-card rounded-2xl border-2 border-dashed border-border">
          <Lock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-bold">No scoops to verify</p>
        </div>
      )}
    </div>
  );
}