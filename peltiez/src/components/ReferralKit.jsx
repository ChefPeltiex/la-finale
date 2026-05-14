import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Heart, Zap, Users } from "lucide-react";
import { toast } from "sonner";
import { SITE_ORIGIN } from "@/lib/site";

const REFERRAL_MESSAGES = {
  whatsapp: `🌙 Rejoins Egor69 — radar Golden Nuggets, dons, échanges et réparation. Une référence exigeante sur l'économie circulaire, sans chiffres marketing bidons. ${SITE_ORIGIN}`,
  twitter: `🌌 Egor69 — cosmologie produit pour l'économie circulaire. Radar, hubs thématiques, souveraineté utilisateur. ${SITE_ORIGIN} #Egor69 #CircularEconomy`,
  linkedin: `Egor69 ouvre un écosystème circulaire pensé pour la confiance : radar Golden Nuggets, visibilité mesurable, vision long terme. ${SITE_ORIGIN}`,
  facebook: `✨ Egor69 — donner, troquer, réparer, explorer. Une expérience majestique et sobre. ${SITE_ORIGIN}`,
  email: "Découvrez Egor69 — économie circulaire et radar Golden Nuggets",
};

const SHARE_BUTTONS = [
  { platform: "WhatsApp", color: "bg-green-500", icon: "💬", key: "whatsapp", url: (msg) => `https://wa.me/?text=${encodeURIComponent(msg)}` },
  { platform: "Twitter/X", color: "bg-black", icon: "𝕏", key: "twitter", url: (msg) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}` },
  { platform: "LinkedIn", color: "bg-blue-700", icon: "🔗", key: "linkedin", url: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_ORIGIN)}` },
  { platform: "Facebook", color: "bg-blue-600", icon: "f", key: "facebook", url: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_ORIGIN)}` },
  { platform: "Email", color: "bg-gray-500", icon: "✉️", key: "email", url: (msg) => `mailto:?subject=${encodeURIComponent(REFERRAL_MESSAGES.email)}&body=${encodeURIComponent(msg)}` },
];

export default function ReferralKit() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(SITE_ORIGIN);
    setCopied(true);
    toast.success("Lien copié!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOn = (platform) => {
    const msg = REFERRAL_MESSAGES[platform] || REFERRAL_MESSAGES.whatsapp;
    const url = SHARE_BUTTONS.find(b => b.key === platform)?.url(msg);
    if (url) window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold">
          <Zap className="h-4 w-4" /> PARTAGEZ ET GAGNEZ
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Partagez Egor69</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Invitez vos pairs vers le hall cosmique — récompenses et statuts suivent les règles publiées dans votre espace.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Invitations", value: "0", color: "from-blue-500/20 to-cyan-500/20" },
          { icon: Heart, label: "Points gagnés", value: "0", color: "from-rose-500/20 to-pink-500/20" },
          { icon: Zap, label: "Bonus VIP", value: "0%", color: "from-amber-500/20 to-orange-500/20" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 bg-gradient-to-br ${s.color} border border-white/10`}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground font-medium uppercase">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Direct Link */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Share2 className="h-4 w-4 text-primary" /> Ton lien unique
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={SITE_ORIGIN}
            readOnly
            className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground font-mono"
          />
          <Button onClick={copyLink} variant="outline" className="rounded-xl">
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copié!" : "Copier"}
          </Button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-6 space-y-4">
        <p className="text-sm font-semibold text-foreground">Partager sur les réseaux</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {SHARE_BUTTONS.map((btn) => (
            <button
              key={btn.platform}
              onClick={() => shareOn(btn.key)}
              className={`${btn.color} text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className="text-xl mb-1">{btn.icon}</div>
              <div className="text-xs">{btn.platform}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Viral Messages Preview */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Messages pré-rédigés</p>
        {Object.entries(REFERRAL_MESSAGES).map(([platform, msg]) => (
          <div key={platform} className="bg-card rounded-xl border border-border p-4 space-y-2">
            <Badge variant="outline" className="capitalize">{platform}</Badge>
            <p className="text-sm text-foreground italic">"{msg}"</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(msg);
                toast.success("Message copié!");
              }}
              className="text-xs text-primary"
            >
              Copier ce message
            </Button>
          </div>
        ))}
      </div>

      {/* Incentive CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white p-8 text-center space-y-3">
        <h2 className="font-display text-2xl font-bold">Chaque partage compte</h2>
        <p className="text-white/80">Les paliers de parrainage et avantages sont communiqués dans l’app — pas de promesses chiffrées ici.</p>
      </div>
    </div>
  );
}