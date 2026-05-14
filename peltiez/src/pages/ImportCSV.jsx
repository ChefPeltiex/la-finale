import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download, ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

const TEMPLATE_HEADERS = ["title", "description", "type", "category", "condition", "price", "location"];
const VALID_TYPES = ["don", "vente", "échange", "réparation"];
const VALID_CONDITIONS = ["neuf", "très bon", "bon", "acceptable"];
const VALID_CATEGORIES = ["électronique", "vêtements", "mobilier", "livres", "sport", "maison", "outils", "autre"];

const CO2_BY_TYPE = { don: 3.5, réparation: 5, échange: 2, vente: 1.5 };

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""));
  return lines.slice(1).map((line, i) => {
    const values = line.split(",").map(v => v.trim().replace(/"/g, ""));
    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
    row._line = i + 2;
    return row;
  });
}

async function parseExcel(arrayBuffer) {
  try {
    const file = new File([arrayBuffer], 'import.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await base44.integrations.Core.UploadFile({ file });
    const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url: uploadRes.file_url,
      json_schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string' },
          category: { type: 'string' },
          condition: { type: 'string' },
          price: { type: 'number' },
          location: { type: 'string' }
        }
      }
    });
    return (result.output || []).map((row, i) => ({ ...row, _line: i + 2 }));
  } catch (err) {
    console.error('Excel parse error:', err);
    return [];
  }
}

function validateRow(row) {
  const errors = [];
  if (!row.title) errors.push("Titre manquant");
  if (!row.type || !VALID_TYPES.includes(row.type)) errors.push(`Type invalide (valeurs: ${VALID_TYPES.join(", ")})`);
  if (row.condition && !VALID_CONDITIONS.includes(row.condition)) errors.push(`État invalide`);
  if (row.category && !VALID_CATEGORIES.includes(row.category)) errors.push(`Catégorie invalide`);
  return errors;
}

function downloadTemplate() {
  const sample = [
    TEMPLATE_HEADERS.join(","),
    '"Vélo de montagne","Excellent état, peu utilisé","don","sport","très bon","0","Québec"',
    '"Table basse ikea","Bois massif, légères traces","vente","mobilier","bon","25","Montréal"',
    '"iPhone 11","Batterie à 80%, fonctionne","échange","électronique","acceptable","","Laval"',
  ].join("\n");
  const blob = new Blob([sample], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "igor-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function ImportCSV() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({});
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [dragging, setDragging] = useState(false);

  const processFile = useCallback((file) => {
    if (!file) return;
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const isCSV = file.name.endsWith('.csv');
    if (!isExcel && !isCSV) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      let parsed = [];
      try {
        if (isCSV) {
          parsed = parseCSV(e.target.result);
        } else {
          parsed = await parseExcel(e.target.result);
        }
        const allErrors = {};
        parsed.forEach((row) => {
          const errs = validateRow(row);
          if (errs.length) allErrors[row._line] = errs;
        });
        setRows(parsed);
        setErrors(allErrors);
        setResults(null);
      } catch (err) {
        console.error('File parsing error:', err);
        alert('Erreur lors de la lecture du fichier. Vérifiez le format.');
      }
    };
    if (isCSV) {
      reader.readAsText(file, 'UTF-8');
    } else {
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleFile = (e) => processFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleImport = async () => {
    const validRows = rows.filter(r => !errors[r._line]);
    if (!validRows.length) return;
    setImporting(true);
    const listings = validRows.map(r => ({
      title: r.title,
      description: r.description || "",
      type: r.type,
      category: r.category || "autre",
      condition: r.condition || "bon",
      price: parseFloat(r.price) || 0,
      location: r.location || "",
      co2_saved: CO2_BY_TYPE[r.type] || 1.5,
      status: "actif",
    }));
    await base44.entities.Listing.bulkCreate(listings);
    queryClient.invalidateQueries({ queryKey: ["listings"] });
    setResults({ success: listings.length, skipped: rows.length - validRows.length });
    setImporting(false);
  };

  const validCount = rows.filter(r => !errors[r._line]).length;
  const errorCount = Object.keys(errors).length;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 rounded-xl -ml-2">
        <ArrowLeft className="h-4 w-4 mr-2" /> Retour
      </Button>

      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Import en masse — CSV ou Excel</h1>
          <p className="text-sm text-muted-foreground">Importez vos objets par centaines en une minute</p>
        </div>
      </div>

      {/* Download template */}
      <div className="mt-6 p-4 bg-accent rounded-2xl flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent-foreground">📋 Format accepté</p>
          <p className="text-xs text-muted-foreground mt-0.5">CSV ou Excel (.xlsx). Téléchargez le modèle avec exemples.</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl shrink-0 gap-2" onClick={downloadTemplate}>
          <Download className="h-4 w-4" /> Télécharger
        </Button>
      </div>

      {/* Columns reference */}
      <div className="mt-4 p-4 bg-card rounded-2xl border border-border text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground mb-2">Colonnes acceptées :</p>
        <div className="grid grid-cols-2 gap-1">
          <span><b>title</b> — Titre (obligatoire)</span>
          <span><b>type</b> — don / vente / échange / réparation (obligatoire)</span>
          <span><b>description</b> — Description</span>
          <span><b>category</b> — électronique, vêtements, mobilier…</span>
          <span><b>condition</b> — neuf / très bon / bon / acceptable</span>
          <span><b>price</b> — Prix en $ (0 pour don)</span>
          <span><b>location</b> — Ville ou région</span>
        </div>
      </div>

      {/* Drop zone */}
      {!results && (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "mt-6 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all",
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent/30"
          )}>
          <Upload className={cn("h-10 w-10 mb-3 transition-colors", dragging ? "text-primary" : "text-muted-foreground/40")} />
          <p className="text-sm font-medium text-foreground">Glissez votre fichier CSV ou Excel ici</p>
          <p className="text-xs text-muted-foreground mt-1">Fichiers acceptés: .csv, .xlsx, .xls</p>
          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFile} />
        </label>
      )}

      {/* Preview table */}
      {rows.length > 0 && !results && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{rows.length} lignes détectées</span>
            {validCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="h-3 w-3" /> {validCount} valide{validCount > 1 ? "s" : ""}
              </span>
            )}
            {errorCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                <AlertCircle className="h-3 w-3" /> {errorCount} erreur{errorCount > 1 ? "s" : ""}
              </span>
            )}
            <button onClick={() => { setRows([]); setErrors({}); }} className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <X className="h-3 w-3" /> Effacer
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-muted-foreground">#</th>
                  {TEMPLATE_HEADERS.map(h => (
                    <th key={h} className="px-3 py-2 text-left text-muted-foreground capitalize">{h}</th>
                  ))}
                  <th className="px-3 py-2 text-left text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const rowErrors = errors[row._line];
                  return (
                    <tr key={row._line} className={cn("border-t border-border", rowErrors ? "bg-red-50" : "hover:bg-muted/30")}>
                      <td className="px-3 py-2 text-muted-foreground">{row._line}</td>
                      {TEMPLATE_HEADERS.map(h => (
                        <td key={h} className="px-3 py-2 max-w-[120px] truncate text-foreground">{row[h] || "—"}</td>
                      ))}
                      <td className="px-3 py-2">
                        {rowErrors ? (
                          <span className="text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{rowErrors[0]}</span>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" />OK</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Button onClick={handleImport} size="lg" className="w-full rounded-xl h-12" disabled={importing || validCount === 0}>
            {importing ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Importation…</> : `Importer ${validCount} annonce${validCount > 1 ? "s" : ""}`}
          </Button>
        </div>
      )}

      {/* Success */}
      {results && (
        <div className="mt-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl p-10">
          <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Import réussi ! 🎉</h2>
          <p className="text-muted-foreground mb-1"><b className="text-emerald-600">{results.success} annonce{results.success > 1 ? "s" : ""}</b> publiée{results.success > 1 ? "s" : ""} avec succès.</p>
          {results.skipped > 0 && <p className="text-sm text-muted-foreground">{results.skipped} ligne{results.skipped > 1 ? "s" : ""} ignorée{results.skipped > 1 ? "s" : ""} (erreurs).</p>}
          <div className="flex gap-3 justify-center mt-6">
            <Button onClick={() => navigate("/marketplace")} className="rounded-xl">Voir mes annonces</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => { setRows([]); setErrors({}); setResults(null); }}>Nouvel import</Button>
          </div>
        </div>
      )}
    </div>
  );
}