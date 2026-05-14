import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Users, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReferralStats({ userEmail }) {
  const [copied, setCopied] = useState(false);

  const { data: referralData, isLoading } = useQuery({
    queryKey: ["referral-stats", userEmail],
    queryFn: async () => {
      const refs = await base44.entities.ReferralLink.filter(
        { referrer_email: userEmail },
        "-created_date",
        1
      );
      return refs[0] || null;
    },
    enabled: !!userEmail,
    staleTime: 30_000,
  });

  const { data: invitations = [] } = useQuery({
    queryKey: ["referral-invitations", referralData?.id],
    queryFn: () => 
      base44.entities.ReferralInvitation.filter(
        { referral_link_id: referralData.id },
        "-invited_at",
        50
      ),
    enabled: !!referralData?.id,
    staleTime: 30_000,
  });

  const handleCopyLink = () => {
    if (referralData?.referral_link) {
      navigator.clipboard.writeText(referralData.referral_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Chargement...</div>;
  }

  if (!referralData) {
    return null;
  }

  const invitedCount = referralData.invited_count || 0;
  const communityPoints = referralData.community_points || 0;

  return (
    <div className="space-y-4 bg-card rounded-2xl border border-border p-6">
      {/* Header */}
      <div className="space-y-2 mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-cyan-600" /> Mon Réseau de Parrainage
        </h3>
        <p className="text-sm text-muted-foreground">
          Invitez vos proches et gagnez des points de contribution communautaire.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-cyan-600">{invitedCount}</p>
          <p className="text-xs text-cyan-700 mt-1 font-bold">Personnes invitées</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-amber-600">{communityPoints}</p>
          <p className="text-xs text-amber-700 mt-1 font-bold">Points gagnés</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wide">
          🔗 Votre lien de parrainage
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralData.referral_link}
            readOnly
            className="flex-1 px-3 py-2 text-xs bg-muted rounded-lg border border-border text-muted-foreground"
          />
          <Button
            size="sm"
            onClick={handleCopyLink}
            className="rounded-lg gap-2 border-0 bg-cyan-600 hover:bg-cyan-700 text-white">
            {copied ? (
              <><Check className="h-4 w-4" /> Copié</>
            ) : (
              <><Copy className="h-4 w-4" /> Copier</>
            )}
          </Button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: '📨 Email', url: `mailto:?subject=Rejoins%20CirculAI%20Hub&body=${encodeURIComponent(referralData.referral_link)}` },
          { label: '🔗 Partager', action: () => {
            if (navigator.share) {
              navigator.share({
                title: 'CirculAI Hub',
                text: 'Rejoins ma communauté CirculAI Hub!',
                url: referralData.referral_link
              });
            }
          }},
        ].map((btn, i) => (
          <Button
            key={i}
            size="sm"
            variant="outline"
            onClick={btn.action || (() => window.open(btn.url))}
            className="text-xs rounded-lg flex-1">
            {btn.label}
          </Button>
        ))}
      </div>

      {/* Invitations List */}
      {invitations.length > 0 && (
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-xs font-bold text-foreground uppercase tracking-wide">👥 Vos invitations</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {invitations.slice(0, 5).map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-2.5 bg-muted rounded-lg text-xs">
                <div>
                  <p className="font-semibold text-foreground">{inv.invited_email}</p>
                  <p className="text-muted-foreground text-[10px]">
                    {new Date(inv.invited_at).toLocaleDateString('fr-CA')}
                  </p>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-0">
                  +{inv.community_points_earned}
                </Badge>
              </div>
            ))}
            {invitations.length > 5 && (
              <p className="text-[10px] text-muted-foreground text-center py-2">
                ... et {invitations.length - 5} autres
              </p>
            )}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 space-y-1">
        <p className="text-xs font-bold text-cyan-900">💡 Comment ça marche?</p>
        <ul className="text-[10px] text-cyan-800 space-y-0.5 list-disc list-inside">
          <li>Partagez votre lien avec vos amis</li>
          <li>Gagnez 100 points par nouvelle invitation</li>
          <li>Les points augmentent votre niveau communautaire</li>
        </ul>
      </div>
    </div>
  );
}