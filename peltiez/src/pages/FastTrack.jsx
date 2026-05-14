import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Zap, Globe, Check, ArrowRight, Loader2, Building2, Crown } from "lucide-react";
import { Link } from "react-router-dom";

export default function FastTrack() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const scan = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setProfile(null);
    const res = await base44.functions.invoke("fastTrackScan", { url });
    if (res.data?.error) {
      setError(res.data.error);
    } else {
      setProfile(res.data);
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    await base44.entities.Artisan.create({
      business_name: profile.business_name,
      owner_name: profile.owner_name || "À compléter",
      category: profile.category || "autre",
      description: profile.description,
      city: profile.city || "Québec",
      website: url,
      status: "en_attente",
    });
    setSaved(true);
    setSaving(false);
  };

  return (
    <div className="min-h-screen pb-20 px-4 py-16 max-w-3xl mx-auto">

      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-mono text-xs font-bold mb-2"
          style={{ background: "rgba(16,185,129,0.1)", border: "2px solid rgba(16,185,129,0.4)", color: "#10b981" }}>
          <Zap className="h-4 w-4" /> FAST-TRACK · ACCÈS ENTREPRISE EN 10 SECONDES
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">
          Votre profil CirculAI<br />
          <span className="text-primary">créé automatiquement.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Collez l'URL de votre site web. Notre IA scanne, analyse et construit votre profil Circulaire en quelques secondes.
        </p>
      </div>

      {/* Scanner */}
      <div className="rounded-2xl p-8 mb-8 border border-border bg-card space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="h-5 w-5 text-primary" />
          <p className="font-semibold text-foreground">URL de votre site web ou LinkedIn</p>
        </div>
        <div className="flex gap-3">
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://votreentreprise.com"
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary/50 font-mono"
            onKeyDown={e => e.key === "Enter" && scan()}
          />
          <button onClick={scan} disabled={loading || !url}
            className="px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, hsl(158,60%,30%), hsl(158,80%,20%))" }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {loading ? "Scan…" : "Scanner"}
          </button>
        </div>

        {loading && (
          <div className="text-center py-8 space-y-3">
            <div className="flex justify-center gap-2">
              {["🔍 Analyse du site", "🧠 Extraction IA", "✨ Création du profil"].map((step, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.4}s`, background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-destructive text-sm font-mono">{error}</p>}
      </div>

      {/* Profile Result */}
      {profile && !saved && (
        <div className="rounded-2xl border border-primary/30 bg-card overflow-hidden mb-6"
          style={{ boxShadow: "0 0 30px rgba(16,185,129,0.08)" }}>
          <div className="px-6 py-4 flex items-center gap-2"
            style={{ background: "rgba(16,185,129,0.08)", borderBottom: "1px solid rgba(16,185,129,0.15)" }}>
            <Check className="h-5 w-5 text-primary" />
            <p className="font-bold text-foreground">Profil détecté en {profile.scan_ms || "< 3"}s</p>
            <span className="ml-auto text-xs font-mono text-primary px-2 py-0.5 rounded" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
              Score circulaire : {profile.circular_score || "?"}/10
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Nom de l'entreprise", value: profile.business_name },
              { label: "Catégorie", value: profile.category },
              { label: "Ville", value: profile.city },
              { label: "Responsable", value: profile.owner_name },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground font-mono mb-1">{label}</p>
                <p className="font-semibold text-foreground">{value || "—"}</p>
              </div>
            ))}
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground font-mono mb-1">Description générée</p>
              <p className="text-sm text-foreground leading-relaxed">{profile.description}</p>
            </div>
            {profile.circular_opportunities && (
              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground font-mono mb-2">Opportunités circulaires détectées</p>
                <ul className="space-y-1">
                  {profile.circular_opportunities.map((op, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-3 w-3 text-primary flex-shrink-0" /> {op}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="px-6 py-4" style={{ borderTop: "1px solid rgba(16,185,129,0.1)", background: "rgba(16,185,129,0.04)" }}>
            <button onClick={saveProfile} disabled={saving}
              className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, hsl(158,60%,30%), hsl(158,80%,20%))" }}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building2 className="h-4 w-4" />}
              {saving ? "Création…" : "✅ Créer mon profil CirculAI"}
            </button>
          </div>
        </div>
      )}

      {saved && (
        <div className="rounded-2xl p-8 text-center space-y-4 border border-primary/30"
          style={{ background: "rgba(16,185,129,0.06)" }}>
          <div className="text-5xl">🎉</div>
          <h2 className="font-display text-2xl font-bold text-foreground">Profil créé avec succès !</h2>
          <p className="text-muted-foreground">Votre dossier entre dans le réseau Egor69. Nous revenons vers vous sous 24–48 h ouvrées.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/marketplace" className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, hsl(158,60%,30%), hsl(158,80%,20%))" }}>
              Explorer le Hub <ArrowRight className="inline h-4 w-4 ml-1" />
            </Link>
            <Link to="/piliers" className="px-6 py-3 rounded-xl font-semibold border border-border text-foreground hover:bg-accent transition-all">
              <Crown className="inline h-4 w-4 mr-1" /> Devenir Pilier
            </Link>
          </div>
        </div>
      )}

      {/* Benefits */}
      {!profile && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { emoji: "⚡", title: "10 secondes", desc: "Profil créé automatiquement par IA" },
            { emoji: "🌍", title: "Réseau mondial", desc: "Ouverture internationale · communauté en construction" },
            { emoji: "💰", title: "Gratuit à vie", desc: "Aucun frais caché, jamais" },
          ].map((b, i) => (
            <div key={i} className="rounded-xl p-5 border border-border bg-card text-center">
              <div className="text-3xl mb-2">{b.emoji}</div>
              <p className="font-semibold text-foreground mb-1">{b.title}</p>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}