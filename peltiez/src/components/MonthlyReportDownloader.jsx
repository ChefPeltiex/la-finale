import { useState } from "react";
import { igor } from "@/api/igorClient";
import { Download, Calendar, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MonthlyReportDownloader() {
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleDownload = async () => {
    setDownloading(true);
    setMessage(null);

    try {
      const { data } = await igor.functions.invoke("generateMonthlyReport", {});
      if (!data?.ok) {
        throw new Error(data?.message || "Rapport indisponible (mode souverain)");
      }

      const mime = data.mime || "text/plain;charset=utf-8";
      const blob = new Blob([data.body || ""], { type: mime });
      const filename = data.filename || "rapport.txt";
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({
        type: 'success',
        text: "Rapport téléchargé (mode souverain : fichier texte d’aperçu). Branchement e-mail / PDF réel à prévoir en production."
      });

    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message
      });
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4 bg-card rounded-2xl border border-border p-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-600" /> Rapport d'Impact Mensuel
        </h3>
        <p className="text-sm text-muted-foreground">
          Téléchargez un aperçu de rapport (mode souverain : fichier texte ; PDF et e-mail automatiques à brancher en production).
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
        <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide">📊 Contenu du rapport</p>
        <ul className="text-xs text-emerald-800 space-y-1 list-disc list-inside">
          <li>Impact CO₂ du mois et cumulatif</li>
          <li>Liste de vos annonces publiées</li>
          <li>Scoops validés du mois</li>
          <li>Statistiques d'engagement</li>
        </ul>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex gap-3 p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className={`text-sm ${message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
            {message.text}
          </div>
        </div>
      )}

      {/* Button */}
      <Button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full rounded-xl h-11 font-bold bg-emerald-600 hover:bg-emerald-700 text-white border-0 gap-2">
        {downloading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Génération du rapport...</>
        ) : (
          <><Download className="h-4 w-4" /> Télécharger mon rapport</>
        )}
      </Button>

      {/* Footer */}
      <p className="text-[10px] text-muted-foreground text-center">
        🤖 Les rapports sont aussi générés automatiquement le 1er du mois et envoyés par email.
      </p>
    </div>
  );
}