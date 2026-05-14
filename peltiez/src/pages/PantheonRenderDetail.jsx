import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { PANTHEON_ENTITIES } from "@/data/pantheonEntities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Crown, Sparkles, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { SITE_TAGLINE } from "@/lib/site";
import { submitCrmLead } from "@/lib/submitCrmLead";

export default function PantheonRenderDetail() {
  const { id } = useParams();
  const entity = useMemo(() => PANTHEON_ENTITIES.find((e) => e.id === id) || null, [id]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const request = async () => {
    const e = email.trim();
    if (!e) return toast.error("Email requis.", { icon: "⚠️" });
    setSending(true);
    try {
      await submitCrmLead({
        email: e,
        name: name.trim() || undefined,
        source: `pantheon:${id}`,
        message: message.trim() || `Demande render pour ${entity?.name || id}`,
      });
      toast.success("Merci — Egor69 au service de l’humain et de la planète. Réponse humaine à venir.", { icon: "✅" });
      setEmail("");
      setName("");
      setMessage("");
    } catch (err) {
      toast.error(err?.message || "Erreur d’envoi.", { icon: "⚠️" });
    } finally {
      setSending(false);
    }
  };

  if (!entity) {
    return (
      <div className="pb-20 space-y-6">
        <SEOMeta title="Panthéon — Introuvable | Egor69" canonicalUrl={`/pantheon-renders/${id || ""}`} />
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">Entité introuvable.</p>
          <Button asChild className="mt-4 rounded-xl" variant="outline">
            <Link to="/pantheon-renders">Retour au Panthéon</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title={`${entity.name} — Fiche Render | Egor69`}
        description={entity.description}
        keywords={`renders, panthéon, ${entity.tags?.join(", ")}`}
        canonicalUrl={`/pantheon-renders/${entity.id}`}
        schemaData={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: entity.name,
          description: entity.description,
          keywords: entity.tags,
        }}
      />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/pantheon-renders">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge className="bg-black/30 text-white border-white/10">
            <Crown className="h-3.5 w-3.5 mr-2" /> PANHÉON
          </Badge>
          <Badge variant="outline" className="text-xs">
            {entity.kind} · {entity.realm}
          </Badge>
        </div>
      </div>

      {/* Hero */}
      <div className="rounded-3xl overflow-hidden border border-white/10 bg-card">
        <div className="aspect-[16/8] bg-black/40 relative">
          <img src={entity.media?.cover} alt={entity.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.75))" }} />
          <div className="absolute left-0 right-0 bottom-0 p-7 space-y-2">
            <p className="text-white/60 font-mono text-xs tracking-widest uppercase">{entity.realm}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white">{entity.name}</h1>
            <p className="text-white/70 max-w-2xl">{entity.tagline}</p>
          </div>
        </div>

        <div className="p-7 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{entity.description}</p>
              <div className="flex flex-wrap gap-2">
                {(entity.tags || []).map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-1 rounded-full bg-white/5 text-white/55 border border-white/10">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-3">
              <p className="text-xs font-black tracking-[0.25em] uppercase text-white/60">Stats</p>
              <div className="space-y-2 text-sm">
                {Object.entries(entity.stats || {}).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3">
                    <span className="text-white/50 capitalize">{k}</span>
                    <span className="text-white font-black">{v}/10</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Button asChild className="rounded-xl btn-magic border-0 text-white font-black">
                  <Link to="/avatar-creator">Créer ton Avatar</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/15 text-white hover:bg-white/5">
                  <Link to="/pricing">Activer Paiement</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="space-y-3">
            <p className="text-sm font-black tracking-widest text-foreground">Galerie</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(entity.media?.gallery || []).map((src) => (
                <div key={src} className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                  <img src={src} alt={`${entity.name} render`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          {/* Request custom render (CRM) */}
          <div className="rounded-3xl border border-white/10 bg-black/20 p-7 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="space-y-1">
                <p className="font-display text-2xl font-black text-foreground">Demande un render sur-mesure</p>
                <p className="text-sm text-muted-foreground">
                  {SITE_TAGLINE}. Tu reçois une réponse humaine. Pas de spam. Pas de trackers.
                </p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-400/25">
                <Shield className="h-3.5 w-3.5 mr-2" /> CRM minimal sécurisé
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ton nom (optionnel)" className="rounded-xl" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ton email (requis)" type="email" className="rounded-xl sm:col-span-2" />
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Style, pose, accessoires, univers, résolution…"
              className="w-full p-3 rounded-xl border border-border bg-card text-foreground resize-none h-24"
            />
            <Button
              onClick={request}
              disabled={sending}
              className="rounded-xl font-black gap-2 btn-magic border-0 text-white"
            >
              <Mail className="h-4 w-4" /> {sending ? "Envoi…" : "Envoyer la demande"}
            </Button>
            <p className="text-[11px] text-white/35">
              Astuce: bientôt, ce formulaire déclenchera aussi une génération automatique (renders → 3D).
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-white/40 text-xs">
        <Sparkles className="h-4 w-4 inline mr-2" />
        Prochaine étape: Portail 3D branché sur ce Panthéon.
      </div>
    </div>
  );
}

