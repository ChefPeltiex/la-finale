import { Share2, MessageCircle, Facebook, Linkedin, Copy, Check } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

export default function ShareButtons({ listing }) {
  const [copied, setCopied] = useState(false);
  
  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/annonce/${listing.id}`
    : `https://egor69.ca/annonce/${listing.id}`;
  
  const title = `${listing.title} · ${SITE_NAME}`;
  const description = listing.description ? listing.description.substring(0, 100) : `Découvre cet objet sur ${SITE_NAME}.`;

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Lien copié!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${description}\n${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}\n\n${url}`,
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Partager</p>
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
        {navigator.share && (
          <Button
            onClick={handleWebShare}
            size="sm"
            variant="outline"
            className="rounded-lg gap-1.5 h-9 text-xs"
            title="Partager"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Partager</span>
          </Button>
        )}

        <Button
          asChild
          size="sm"
          variant="outline"
          className="rounded-lg gap-1.5 h-9 text-xs bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
          title="Partager sur WhatsApp"
        >
          <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </Button>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="rounded-lg gap-1.5 h-9 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
          title="Partager sur Facebook"
        >
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
            <Facebook className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Facebook</span>
          </a>
        </Button>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="rounded-lg gap-1.5 h-9 text-xs bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200"
          title="Partager sur Twitter"
        >
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">X</span>
          </a>
        </Button>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="rounded-lg gap-1.5 h-9 text-xs bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
          title="Partager sur LinkedIn"
        >
          <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
        </Button>

        <Button
          onClick={handleCopyLink}
          size="sm"
          variant="outline"
          className="rounded-lg gap-1.5 h-9 text-xs"
          title="Copier le lien"
        >
          {copied ? (
            <><Check className="h-3.5 w-3.5 text-emerald-600" /></>
          ) : (
            <><Copy className="h-3.5 w-3.5" /></>
          )}
        </Button>
      </div>
    </div>
  );
}