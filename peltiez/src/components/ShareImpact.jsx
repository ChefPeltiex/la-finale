import { useState } from "react";
import { Share2, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ShareImpact({ revenue, co2, donations, repairs, userName: _userName }) {
  const [isOpen, setIsOpen] = useState(false);

  const messages = {
    twitter: `🌍 J'ai généré $${revenue} CAD et sauvé ${co2}kg CO₂ avec CirculAI Hub!\n\n♻️ ${donations} dons\n🔧 ${repairs} réparations\n💚 L'économie circulaire en action\n\nRejoingnez le mouvement ce soir à 19h 🚀\n\ncirculai.hub`,
    
    facebook: `Je suis tellement fier(e)! 💚\n\nSur CirculAI Hub, j'ai:\n✅ Gagné $${revenue} CAD\n✅ Sauvé ${co2}kg de CO₂\n✅ Fait ${donations} dons\n✅ Répété ${repairs} objets\n\nL'économie circulaire ce n'est pas un rêve, c'est MAINTENANT. Rejoins-moi ce soir 19h! 🌍`,
    
    linkedin: `L'impact entrepreneurial que je vis depuis quelques semaines sur CirculAI Hub:\n\n📊 Revenue: $${revenue} CAD\n🌱 CO₂ sauvé: ${co2}kg\n📦 Dons générés: ${donations}\n🔧 Réparations facilitées: ${repairs}\n\nC'est la preuve que l'économie circulaire fonctionne. Elle fonctionne maintenant. Et elle scale globalement. 🚀\n\n#CircularEconomy #Sustainability #Impact`,
    
    whatsapp: `🌍 CIRCULAI HUB - Mon Impact 🌍\n\nJ'ai généralement:\n💰 $${revenue} CAD\n♻️ ${co2}kg CO₂ sauvés\n🎁 ${donations} dons\n🔧 ${repairs} réparations\n\nTu peux faire pareil! Lancement ce soir 19h 🚀\n\ncirculai.hub`,
    
    instagram: `♻️ MON IMPACT CIRCULAIRE ♻️\n\n💚 $${revenue} générés\n🌍 ${co2}kg CO₂ sauvés\n🎁 ${donations} dons\n🔧 ${repairs} réparations\n\nL'économie circulaire n'est pas une théorie.\nC'est ma réalité. Maintenant.\n\n👉 CirculAI Hub ouvre CE SOIR 19h 🚀\n\n#CircularEconomy #Sustainability #circulai`,
  };

  const handleCopy = (platform) => {
    navigator.clipboard.writeText(messages[platform]);
    toast.success(`${platform} — Copié! Partage maintenant 🚀`);
  };

  const handleShare = (platform) => {
    const msg = messages[platform];
    const encodedMsg = encodeURIComponent(msg);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMsg}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=https://circulai.hub&quote=${encodedMsg}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://circulai.hub`,
      whatsapp: `https://wa.me/?text=${encodedMsg}`,
      instagram: `https://www.instagram.com/`,
    };

    if (platform === "instagram") {
      handleCopy(platform);
    } else {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className="rounded-xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0" 
        size="lg"
      >
        <Share2 className="h-5 w-5" />
        Partager mon impact
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-card rounded-2xl border border-border max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Share2 className="h-5 w-5 text-emerald-600" />
                Partage sur les réseaux
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">Clique pour copier, puis partage le message dans tes réseaux!</p>

            <div className="space-y-2">
              {Object.entries(messages).map(([platform, _]) => (
                <div key={platform} className="flex gap-2">
                  <button
                    onClick={() => handleShare(platform)}
                    className="flex-1 flex items-center gap-2 p-3 rounded-lg bg-muted hover:bg-accent transition-colors text-left"
                  >
                    <span className="font-semibold text-foreground capitalize">{platform}</span>
                    <span className="text-xs text-muted-foreground ml-auto">→</span>
                  </button>
                  <button
                    onClick={() => handleCopy(platform)}
                    className="p-3 rounded-lg hover:bg-accent transition-colors"
                    title="Copier le message"
                  >
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Partage autant que tu veux 🌍 L'impact s'amplifie!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}