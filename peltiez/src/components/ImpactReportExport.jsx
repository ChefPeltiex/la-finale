import { useState } from "react";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";

export default function ImpactReportExport({ user, vaultData, listings = [] }) {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingCSV, setLoadingCSV] = useState(false);

  const today = new Date().toLocaleDateString("fr-CA");
  const userName = user?.full_name || "Utilisateur";

  const generatePDF = async () => {
    setLoadingPDF(true);
    const doc = new jsPDF();

    // Header golden bar
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 0, 210, 18, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("CirculAI Hub — Rapport d'Impact Personnel", 12, 12);

    // Date & user
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 18, 210, 18, "F");
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Agent : ${userName}`, 12, 27);
    doc.text(`Email : ${user?.email || "—"}`, 12, 33);
    doc.text(`Date : ${today}`, 160, 27);

    // Section title
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("📊 Indicateurs Clés d'Impact", 12, 50);

    const kpis = [
      ["Revenus Totaux Générés", `${vaultData.totalRevenue.toFixed(2)} $ CAD`],
      ["Annonces Vendues", `${vaultData.soldCount}`],
      ["Annonces Actives", `${vaultData.activeListings}`],
      ["CO₂ Évité (estimé)", `${vaultData.totalCO2} kg`],
      ["Total des Annonces", `${listings.length}`],
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let y = 60;
    kpis.forEach(([label, value], i) => {
      if (i % 2 === 0) doc.setFillColor(248, 248, 248);
      else doc.setFillColor(255, 255, 255);
      doc.rect(12, y - 5, 186, 10, "F");
      doc.setTextColor(60, 60, 60);
      doc.text(label, 16, y);
      doc.setTextColor(16, 100, 60);
      doc.setFont("helvetica", "bold");
      doc.text(value, 160, y);
      doc.setFont("helvetica", "normal");
      y += 12;
    });

    // Listings table
    if (listings.length > 0) {
      y += 8;
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("📋 Détail des Annonces", 12, y);
      y += 8;

      // Table header
      doc.setFillColor(212, 175, 55);
      doc.rect(12, y - 5, 186, 9, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.text("Titre", 14, y);
      doc.text("Type", 90, y);
      doc.text("Statut", 125, y);
      doc.text("Prix", 158, y);
      doc.text("CO₂ (kg)", 180, y);
      y += 8;

      listings.slice(0, 25).forEach((l, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        if (i % 2 === 0) doc.setFillColor(250, 250, 250);
        else doc.setFillColor(255, 255, 255);
        doc.rect(12, y - 5, 186, 8, "F");
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "normal");
        const title = l.title?.length > 35 ? l.title.slice(0, 32) + "..." : (l.title || "—");
        doc.text(title, 14, y);
        doc.text(l.type || "—", 90, y);
        doc.text(l.status || "—", 125, y);
        doc.text(l.price > 0 ? `${l.price}$` : "Gratuit", 158, y);
        doc.text(`${l.co2_saved || 0}`, 182, y);
        y += 8;
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFillColor(212, 175, 55);
      doc.rect(0, 287, 210, 10, "F");
      doc.setFontSize(7);
      doc.setTextColor(0, 0, 0);
      doc.text("CirculAI Hub — Rapport Confidentiel · Généré le " + today, 12, 294);
      doc.text(`Page ${p}/${pageCount}`, 185, 294);
    }

    doc.save(`CirculAI_Impact_${userName.replace(/ /g, "_")}_${today}.pdf`);
    setLoadingPDF(false);
  };

  const generateCSV = () => {
    setLoadingCSV(true);

    const headers = ["Titre", "Type", "Catégorie", "Prix ($)", "Statut", "CO2 Évité (kg)", "Localisation", "Date"];
    const rows = listings.map(l => [
      `"${(l.title || "").replace(/"/g, "'")}"`,
      l.type || "",
      l.category || "",
      l.price || 0,
      l.status || "",
      l.co2_saved || 0,
      `"${(l.location || "").replace(/"/g, "'")}"`,
      l.created_date ? new Date(l.created_date).toLocaleDateString("fr-CA") : "",
    ]);

    const summary = [
      ["=== RAPPORT D'IMPACT CIRCULAI HUB ==="],
      [`Agent: ${userName}`],
      [`Email: ${user?.email || ""}`],
      [`Date: ${today}`],
      [],
      ["=== KPIs ==="],
      ["Revenus Totaux", `${vaultData.totalRevenue.toFixed(2)} $`],
      ["Annonces Vendues", vaultData.soldCount],
      ["Annonces Actives", vaultData.activeListings],
      ["CO2 Évité Total", `${vaultData.totalCO2} kg`],
      [],
      ["=== ANNONCES ==="],
      headers,
      ...rows,
    ];

    const csv = summary.map(r => (Array.isArray(r) ? r.join(",") : r)).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CirculAI_Impact_${userName.replace(/ /g, "_")}_${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setLoadingCSV(false);
  };

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Download className="h-5 w-5 text-amber-400" />
        <h3 className="font-bold text-foreground">Télécharger mon Rapport d'Impact</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Exporte ton rapport personnel complet — revenus, CO₂ évité, toutes tes annonces — en PDF élégant ou CSV exploitable.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={generatePDF}
          disabled={loadingPDF}
          className="gap-2 rounded-xl font-bold"
          style={{ background: "linear-gradient(135deg, #B8860B, #FFD700)", color: "#000", border: "none" }}
        >
          {loadingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          Télécharger PDF
        </Button>
        <Button
          onClick={generateCSV}
          disabled={loadingCSV}
          variant="outline"
          className="gap-2 rounded-xl font-bold border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10"
        >
          {loadingCSV ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
          Télécharger CSV
        </Button>
      </div>
    </div>
  );
}