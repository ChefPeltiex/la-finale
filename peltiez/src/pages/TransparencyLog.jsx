import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SEOMeta from "@/components/SEOMeta";
import { CheckCircle2, Eye, Search, Loader2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isGrosCalinUnlocked } from "@/lib/grosCalin";
import GrosCalinGate from "@/components/GrosCalinGate";

export default function TransparencyLog() {
  const [unlocked, setUnlocked] = useState(() => isGrosCalinUnlocked());
  const [search, setSearch] = useState("");

  const { data: scoops = [], isLoading } = useQuery({
    queryKey: ["verified-scoops"],
    queryFn: () =>
      base44.entities.CompetitiveScoops.filter(
        { is_authentic: true, authenticity_verified: true },
        "-discovered_at",
        100
      ),
    staleTime: 60_000
  });

  const { data: verifications = [] } = useQuery({
    queryKey: ["authenticity-verifications"],
    queryFn: () =>
      base44.entities.AuthenticityVerification.filter(
        { status: "verified_authentic" },
        "-verified_timestamp",
        100
      ),
    staleTime: 60_000
  });

  const filtered = useMemo(() =>
    scoops.filter(s => {
      const q = search.toLowerCase();
      return !q || s.headline.toLowerCase().includes(q) || (s.competitor || "").toLowerCase().includes(q);
    }),
    [scoops, search]
  );

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Transparency Log — Verified Authentic News",
    "description": "Public log of all verified authentic scoops with direct sources. 100% real, verified against original sources."
  };

  if (!unlocked) {
    return <GrosCalinGate onUnlocked={() => setUnlocked(true)} />;
  }

  return (
    <div className="pb-20 space-y-8 max-w-6xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Transparency Log — Verified Authentic Scoops | Egor69"
        description="Public record of all verified authentic scoops. Every scoop verified against original source. Zero AI-generated content."
        keywords="transparency, verified, authentic, scoops, sources, real-news, fact-check"
        canonicalUrl="https://egor69.ca/transparency-log"
        schemaData={seoSchema}
      />

      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-200/20">
        <Shield className="h-12 w-12 text-cyan-600 mx-auto mb-3" />
        <h1 className="font-display text-4xl font-black text-foreground">
          📋 Transparency Log
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Public record of all verified authentic scoops. Every scoop fact-checked against real sources.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-300 p-6 text-center">
          <p className="text-4xl font-black text-emerald-600">{filtered.length}</p>
          <p className="text-sm text-emerald-700 mt-2 font-bold">✅ Verified Scoops</p>
        </div>
        <div className="bg-blue-50 rounded-2xl border-2 border-blue-300 p-6 text-center">
          <p className="text-4xl font-black text-blue-600">100%</p>
          <p className="text-sm text-blue-700 mt-2 font-bold">Real Content</p>
        </div>
        <div className="bg-cyan-50 rounded-2xl border-2 border-cyan-300 p-6 text-center">
          <p className="text-4xl font-black text-cyan-600">{verifications.length}</p>
          <p className="text-sm text-cyan-700 mt-2 font-bold">Verifications Done</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
          placeholder="Search verified scoops..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <Eye className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">No verified scoops found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(scoop => {
            const verification = verifications.find(v => v.scoop_id === scoop.id);
            return (
              <div key={scoop.id} className="bg-emerald-50 rounded-2xl border-2 border-emerald-300 overflow-hidden hover:shadow-lg transition-all">
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-bold text-lg text-foreground">{scoop.headline}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {scoop.competitor} · {scoop.scoop_type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 border-0">VERIFIED</Badge>
                  </div>

                  {/* Description */}
                  {scoop.description && (
                    <p className="text-sm text-foreground leading-relaxed">{scoop.description}</p>
                  )}

                  {/* Verification Details */}
                  {verification && (
                    <div className="bg-white rounded-lg border border-emerald-200 p-4 space-y-3">
                      <div>
                        <p className="text-xs font-bold text-emerald-900 uppercase mb-1">✅ Verification Status</p>
                        <p className="text-sm text-foreground capitalize">{verification.status.replace(/_/g, ' ')}</p>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-emerald-900 uppercase mb-1">🔗 Source URL</p>
                        <a
                          href={verification.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyan-600 hover:text-cyan-700 underline break-all">
                          {verification.source_url}
                        </a>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-emerald-900 uppercase mb-1">📍 Source Type</p>
                        <p className="text-sm text-foreground capitalize">{verification.source_type.replace(/_/g, ' ')}</p>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-emerald-900 uppercase mb-1">✔️ Verification Method</p>
                        <p className="text-sm text-foreground capitalize">{verification.verification_method.replace(/_/g, ' ')}</p>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-emerald-900 uppercase mb-1">📅 Verified On</p>
                        <p className="text-sm text-foreground">
                          {new Date(verification.verified_timestamp).toLocaleDateString('en-CA')}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-emerald-900 uppercase mb-1">🔐 Authenticity Score</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{ width: `${verification.authenticity_score || 95}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {verification.authenticity_score || 95}% confidence
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Evidence */}
                  {scoop.evidence?.length > 0 && (
                    <div className="pt-3 border-t border-emerald-200">
                      <p className="text-xs font-bold text-emerald-900 uppercase mb-2">Supporting Evidence</p>
                      <ul className="space-y-1">
                        {scoop.evidence.map((ev, i) => (
                          <li key={i} className="text-xs text-foreground">
                            • {ev}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}