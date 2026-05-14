import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildCardShare } from "@/lib/shareKit";
import { Copy, Check, Share2 } from "lucide-react";

export default function CardSharePanel({ card }) {
  const [copied, setCopied] = useState(false);
  if (!card) return null;

  const share = buildCardShare({ card });

  const copy = async () => {
    await navigator.clipboard.writeText(share.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const webShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: share.title, text: share.text, url: share.url });
    } catch {}
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Badge className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0 font-bold px-3 py-1">
            SHARE KIT
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Partage propre, net, irrésistible (dans les règles des plateformes).
          </p>
        </div>
        <div className="flex gap-2">
          {navigator.share ? (
            <Button variant="outline" className="gap-2" onClick={webShare}>
              <Share2 className="h-4 w-4" /> Partager
            </Button>
          ) : null}
          <Button variant="outline" className="gap-2" onClick={copy}>
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copié" : "Copier lien"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <a href={share.links.x} target="_blank" rel="noopener noreferrer">X</a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={share.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={share.links.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={share.links.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={share.links.email}>Email</a>
        </Button>
      </div>
    </div>
  );
}

