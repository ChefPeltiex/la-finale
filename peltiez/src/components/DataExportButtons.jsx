import { useState } from 'react';
import { FileJson, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function DataExportButtons({ userName = 'export' }) {
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async (format) => {
    setExporting(true);
    setSuccess(false);
    try {
      const response = await base44.functions.invoke('exportUserData', {});
      const data = response.data;

      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `CirculAI-${userName}-${timestamp}`;

      if (format === 'json') {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        downloadFile(blob, `${fileName}.json`);
      } else if (format === 'csv') {
        const csv = generateCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        downloadFile(blob, `${fileName}.csv`);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Erreur lors de l\'export: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSV = (data) => {
    let csv = 'CirculAI Hub - Export de Données Personnelles\n';
    csv += `Exporté le: ${new Date().toLocaleString('fr-CA')}\n\n`;

    csv += '=== PROFIL UTILISATEUR ===\n';
    csv += `Email,Nom,Rôle,Niveau\n`;
    csv += `${data.user.email},"${data.user.name}",${data.user.role},"${data.profile.level}"\n\n`;

    csv += '=== IMPACT ENVIRONNEMENTAL ===\n';
    csv += `Métrique,Valeur\n`;
    csv += `CO2 Économisé (kg),${data.impact.totalCO2Saved}\n`;
    csv += `Objets Sauvés,${data.impact.totalObjectsSaved}\n`;
    csv += `Réparations,${data.impact.totalRepairs}\n`;
    csv += `Dons,${data.impact.totalDonations}\n`;
    csv += `Réparations (Points),${data.impact.repairPoints}\n\n`;

    csv += '=== REVENUS ===\n';
    csv += `Métrique,Montant (CAD)\n`;
    csv += `Revenu Total,${data.revenue.totalRevenue}\n`;
    csv += `Annonces Vendues,${data.revenue.soldItems}\n`;
    csv += `Prix Moyen par Vente,${data.revenue.averagePricePerSale}\n\n`;

    csv += '=== ANNONCES ===\n';
    csv += `ID,Titre,Type,Catégorie,Prix,État,Statut,CO2 Économisé,Date\n`;
    data.listings.details.forEach(item => {
      csv += `${item.id},"${item.title}",${item.type},${item.category},${item.price},"${item.condition}",${item.status},${item.co2Saved},${item.createdDate}\n`;
    });

    csv += '\n=== DROITS DE L\'UTILISATEUR ===\n';
    csv += 'Droit d\'accès: Confirmé\n';
    csv += 'Droit à la portabilité: Confirmé\n';
    csv += 'Droit à l\'oubli: Disponible\n';
    csv += 'Propriété exclusive: © CirculAI Hub - Utilisateur\n';

    return csv;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => handleExport('json')}
          disabled={exporting}
          variant="outline"
          className="rounded-xl gap-2"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileJson className="h-4 w-4" />
          )}
          JSON
        </Button>
        <Button
          onClick={() => handleExport('csv')}
          disabled={exporting}
          variant="outline"
          className="rounded-xl gap-2"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          CSV
        </Button>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span className="text-sm text-emerald-700 font-medium">Export téléchargé avec succès! ✓</span>
        </div>
      )}
    </div>
  );
}