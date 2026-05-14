import { useState } from "react";
import { igor } from "@/api/igorClient";
import { Download, CheckCircle2, AlertCircle, Loader2, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DataExportManager() {
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showIntegrity, setShowIntegrity] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await igor.functions.invoke("secureExportUserData", {});
      if (!data?.ok) {
        throw new Error(data?.message || "Export indisponible (mode souverain)");
      }

      const dataHash = data.content_sha256;
      const filename = data.filename || "export.json";
      const blob = new Blob([JSON.stringify(data.export, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Afficher le succès avec le hash
      setResult({
        success: true,
        filename,
        hash: dataHash,
        timestamp: new Date().toLocaleString()
      });

    } catch (err) {
      setError(err.message);
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4 bg-card rounded-2xl border border-border p-6">
      {/* Header */}
      <div className="space-y-2 mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Lock className="h-5 w-5 text-blue-600" /> Exporter mes données
        </h3>
        <p className="text-sm text-muted-foreground">
          Téléchargez toutes vos statistiques personnelles, annonces et scoops validés avec certificat d'intégrité SHA-256.
        </p>
      </div>

      {/* Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
        <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">🔒 Protection des données</p>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>Authentification requise — seules vos données</li>
          <li>Chiffrement SHA-256 pour vérifier l'intégrité</li>
          <li>Téléchargement direct (pas de stockage serveur)</li>
          <li>Format JSON structuré et lisible</li>
        </ul>
      </div>

      {/* Error */}
      {error && (
        <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="space-y-3">
          <div className="flex gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm text-emerald-700">
              <p className="font-bold">Export réussi!</p>
              <p className="mt-1">{result.filename}</p>
              <p className="text-xs mt-1 opacity-75">{result.timestamp}</p>
            </div>
          </div>

          {/* Integrity Hash */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-200">
            <button
              onClick={() => setShowIntegrity(!showIntegrity)}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors">
              <Eye className="h-4 w-4" /> 
              {showIntegrity ? 'Masquer' : 'Afficher'} le hash d'intégrité
            </button>
            {showIntegrity && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <p className="text-[10px] text-slate-600 font-mono break-all bg-white p-2 rounded border border-slate-200">
                  {result.hash}
                </p>
                <p className="text-[10px] text-slate-500">
                  ✓ Utilisez ce hash pour vérifier que votre fichier n'a pas été modifié
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Button */}
      <Button
        onClick={handleExport}
        disabled={exporting}
        className="w-full rounded-xl h-11 font-bold bg-blue-600 hover:bg-blue-700 text-white border-0 gap-2">
        {exporting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Export en cours...</>
        ) : (
          <><Download className="h-4 w-4" /> Télécharger mes données</>
        )}
      </Button>

      {/* Footer */}
      <p className="text-[10px] text-muted-foreground text-center">
        Les données incluent: profil, annonces, scoops, verifications, statistiques CO2 et historique complet.
      </p>
    </div>
  );
}