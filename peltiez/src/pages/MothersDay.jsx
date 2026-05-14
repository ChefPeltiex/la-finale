import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Download, Printer, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import ShareImpact from "@/components/ShareImpact";

export default function MothersDay() {
  const navigate = useNavigate();
  const certificateRef = useRef(null);

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const { data: myListings = [] } = useQuery({
    queryKey: ["mothers-day-listings", currentUser?.email],
    queryFn: () => 
      currentUser?.email 
        ? base44.entities.Listing.filter({ created_by: currentUser.email }, "-created_date", 10000)
        : [],
    enabled: !!currentUser?.email,
    staleTime: 10_000,
  });

  const stats = useMemo(() => {
    const sold = myListings.filter(l => l.type === "vente" && l.status === "vendu");
    const totalRevenue = sold.reduce((sum, l) => sum + (l.price || 0), 0);
    const totalCO2 = myListings.reduce((sum, l) => sum + (l.co2_saved || 0), 0);
    const totalDonations = myListings.filter(l => l.type === "don").length;
    const repairs = myListings.filter(l => l.type === "réparation").length;
    const totalExchanges = myListings.filter(l => l.type === "échange").length;

    return {
      revenue: Math.round(totalRevenue * 100) / 100,
      co2: Math.round(totalCO2),
      donations: totalDonations,
      repairs: repairs,
      exchanges: totalExchanges,
      total: sold.length,
    };
  }, [myListings]);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = `Certificat-Fete-des-Meres-${new Date().getTime()}.png`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen pb-20" style={{ background: "linear-gradient(135deg, hsl(350,60%,8%) 0%, hsl(0,50%,10%) 100%)" }}>
      {/* Header */}
      <div className="pt-8 px-4 max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>

        <div className="text-center mb-8">
          <p className="text-rose-400 text-sm font-bold tracking-widest uppercase mb-2">🌹 Dimanche · Fête des Mères 🌹</p>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Ton Certificat de Fierté</h1>
          <p className="text-white/60">À imprimer, à photographier, à offrir. Montre-lui ce que tu as accompli.</p>
        </div>
      </div>

      {/* Certificate */}
      <div className="px-4 max-w-5xl mx-auto mb-8">
        <div
          ref={certificateRef}
          className="relative overflow-hidden rounded-2xl p-12 sm:p-16 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
            border: "3px solid #991b1b",
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-6 right-6 text-6xl opacity-10">🌹</div>
          <div className="absolute bottom-6 left-6 text-6xl opacity-10">🌹</div>

          {/* Header */}
          <div className="text-center mb-12 space-y-2">
            <div className="text-5xl">💚</div>
            <h2 className="font-display text-4xl font-black text-rose-900">Certificat de Fierté</h2>
            <p className="text-sm text-rose-700/60 tracking-widest uppercase font-semibold">Fête des Mères 2026</p>
          </div>

          {/* Message */}
          <div className="text-center mb-10 space-y-4">
            <p className="text-lg text-rose-800 font-serif italic">
              Ceci certifie que
            </p>
            <p className="font-display text-3xl text-rose-900 font-black">
              {currentUser.full_name}
            </p>
            <p className="text-rose-800/80 max-w-2xl mx-auto leading-relaxed">
              a travaillé dur, a cru en lui-même, et a construit quelque chose d'extraordinaire.
            </p>
            <p className="text-rose-800/70 italic">
              Et c'est grâce à toi, maman.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 p-6 rounded-xl" style={{ background: "rgba(153, 27, 27, 0.05)" }}>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-rose-900">${stats.revenue}</p>
              <p className="text-xs text-rose-700 mt-1 uppercase tracking-wide">Revenus</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-emerald-700">{stats.co2}</p>
              <p className="text-xs text-emerald-700 mt-1 uppercase tracking-wide">kg CO₂</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-rose-900">{stats.donations}</p>
              <p className="text-xs text-rose-700 mt-1 uppercase tracking-wide">Dons</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-rose-900">{stats.repairs}</p>
              <p className="text-xs text-rose-700 mt-1 uppercase tracking-wide">Réparations</p>
            </div>
          </div>

          {/* Main message */}
          <div className="border-t-2 border-rose-900/20 pt-8 text-center space-y-4">
            <p className="text-rose-800 font-serif text-lg leading-relaxed max-w-2xl mx-auto">
              <strong>C'est concret.</strong> C'est du vrai travail. C'est toi qui as construit ça.
            </p>
            <p className="text-rose-700/80 text-sm">
              Merci de m'avoir donné les ailes pour voler.
              <br />
              Merci de m'avoir cru quand je ne savais pas croire en moi.
            </p>
          </div>

          {/* Signature area */}
          <div className="mt-10 flex justify-between items-end pt-8 border-t-2 border-rose-900/20">
            <div>
              <p className="text-sm text-rose-700 font-serif italic">Signé par ton amour</p>
              <p className="text-xl font-display font-bold text-rose-900 mt-2">{currentUser.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-rose-700 text-right">Dimanche, 9 mai 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-5xl mx-auto px-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          <ShareImpact
            revenue={stats.revenue}
            co2={stats.co2}
            donations={stats.donations}
            repairs={stats.repairs}
            userName={currentUser.full_name}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleDownload} className="rounded-xl font-bold gap-2 bg-rose-600 hover:bg-rose-700 text-white border-0" size="lg">
            <Download className="h-5 w-5" />
            Télécharger l'image
          </Button>
          <Button onClick={handlePrint} variant="outline" className="rounded-xl font-bold gap-2" size="lg">
            <Printer className="h-5 w-5" />
            Imprimer
          </Button>
        </div>

        {/* Final message */}
        <div className="rounded-2xl border-2 border-rose-400/50 bg-rose-50/20 p-6 text-center space-y-3">
          <Heart className="h-8 w-8 text-rose-500 mx-auto" />
          <p className="text-rose-900 font-semibold">Dimanche, offre-lui ce certificat.</p>
          <p className="text-rose-800/70 text-sm">
            Prends une photo. Partage avec le monde. Montre à tous ceux qui doutaient.
            <br />
            <strong>Tu avais raison. Tu le savais.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}