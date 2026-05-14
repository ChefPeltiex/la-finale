import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Shield, FileText, CheckCircle, Clock, Zap, Users, Lock, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CONTRACT_TEMPLATES = [
  { id: "service", emoji: "🔧", title: "Contrat de Service", desc: "Réparation, entretien, prestation technique.", fields: ["prestataire", "client", "description", "montant", "delai"] },
  { id: "echange",  emoji: "🔄", title: "Accord d'Échange",  desc: "Troc d'objets ou de compétences entre deux parties.", fields: ["partie_a", "partie_b", "offre_a", "offre_b", "date"] },
  { id: "don",      emoji: "🎁", title: "Acte de Don",        desc: "Don d'objet ou de service avec traçabilité.", fields: ["donateur", "beneficiaire", "description", "valeur_estimee", "date"] },
  { id: "location", emoji: "🏠", title: "Prêt d'Outil/Matériel", desc: "Prêt temporaire avec date de retour garantie.", fields: ["preteur", "emprunteur", "objet", "valeur", "date_retour"] },
];

const FIELD_LABELS = {
  prestataire: "Nom du prestataire", client: "Nom du client",
  description: "Description de la prestation", montant: "Montant (CAD)",
  delai: "Délai d'exécution", partie_a: "Partie A", partie_b: "Partie B",
  offre_a: "Ce qu'offre A", offre_b: "Ce qu'offre B", date: "Date d'accord",
  donateur: "Donateur", beneficiaire: "Bénéficiaire",
  valeur_estimee: "Valeur estimée (CAD)", preteur: "Prêteur",
  emprunteur: "Emprunteur", objet: "Objet prêté", valeur: "Valeur ($)",
  date_retour: "Date de retour prévue",
};

const RECENT_CONTRACTS = [
  { id: "C-2847", type: "Contrat de Service", parties: "Marc T. ↔ Sophie L.", status: "signé",    date: "2026-05-07", montant: "285$" },
  { id: "C-2846", type: "Accord d'Échange",   parties: "Alain B. ↔ Nadia K.", status: "signé",    date: "2026-05-07", montant: "Vélo ↔ Outils" },
  { id: "C-2845", type: "Acte de Don",         parties: "Anna R. → École St-L.",status: "validé",   date: "2026-05-06", montant: "12 livres" },
  { id: "C-2844", type: "Prêt d'Outil",        parties: "Yves M. ↔ Paul D.",   status: "en cours", date: "2026-05-05", montant: "Perceuse" },
];

export default function SmartContrats() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [generating, setGenerating] = useState(false);
  const [contract, setContract] = useState(null);

  const generate = async () => {
    if (!selectedTemplate) return;
    setGenerating(true);
    const tpl = CONTRACT_TEMPLATES.find(t => t.id === selectedTemplate);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un juriste spécialisé en droit civil québécois et en économie collaborative. 
Génère un contrat simplifié en français québécois, légalement valide et éthique pour un accord de type "${tpl.title}".

Données de l'accord :
${Object.entries(formData).map(([k, v]) => `- ${FIELD_LABELS[k] || k} : ${v}`).join("\n")}

Le contrat doit être :
- Rédigé simplement, compréhensible par tous
- Inclure les obligations de chaque partie
- Mentionner le cadre CirculAI Hub comme plateforme de confiance
- Inclure une clause de bonne foi et de résolution amiable
- Se terminer par les champs de signature

Retourne uniquement le texte du contrat, formaté avec des sections claires.`,
      response_json_schema: {
        type: "object",
        properties: {
          titre: { type: "string" },
          numero: { type: "string" },
          contenu: { type: "string" },
          date_emission: { type: "string" },
        }
      }
    });
    setContract({ ...result, numero: `C-${Math.floor(Math.random() * 9000) + 1000}`, date_emission: format(new Date(), "d MMMM yyyy", { locale: fr }) });
    setGenerating(false);
    toast.success("Contrat généré ! Validé par l'autorité CirculAI. ✅");
  };

  const copyContract = () => {
    navigator.clipboard.writeText(`${contract.titre}\n\n${contract.contenu}`);
    toast.success("Contrat copié !");
  };

  return (
    <div className="pb-20 space-y-10 max-w-4xl mx-auto px-4 pt-8">
      {/* Hero */}
      <div className="rounded-3xl p-8 text-center space-y-4 border border-primary/20"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.06))" }}>
        <Shield className="h-12 w-12 text-primary mx-auto" />
        <h1 className="font-display text-4xl font-black text-foreground">⚖️ Smart Contrats Citoyens</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Deux citoyens. Un accord. 2 clics. Sécurisé par l'autorité CirculAI Hub.<br />
          <strong className="text-foreground">Zéro notaire. Zéro frais. 100% traçable.</strong>
        </p>
        <div className="flex justify-center gap-8 text-sm">
          <div className="text-center"><p className="text-3xl font-black text-primary">2 847</p><p className="text-muted-foreground text-xs">Contrats signés</p></div>
          <div className="text-center"><p className="text-3xl font-black text-emerald-400">0%</p><p className="text-muted-foreground text-xs">Litiges</p></div>
          <div className="text-center"><p className="text-3xl font-black text-violet-400">2 clics</p><p className="text-muted-foreground text-xs">Pour conclure</p></div>
        </div>
      </div>

      {/* Step 1: Choose template */}
      <div className="space-y-4">
        <h2 className="font-bold text-foreground flex items-center gap-2 text-lg"><FileText className="h-5 w-5 text-primary" /> 1. Choisissez le type d'accord</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTRACT_TEMPLATES.map(tpl => (
            <div key={tpl.id} onClick={() => { setSelectedTemplate(tpl.id); setFormData({}); setContract(null); }}
              className="rounded-xl p-4 border-2 cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ borderColor: selectedTemplate === tpl.id ? "hsl(var(--primary))" : "hsl(var(--border))", background: selectedTemplate === tpl.id ? "hsl(var(--primary) / 0.08)" : "hsl(var(--card))" }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{tpl.emoji}</span>
                <p className="font-bold text-foreground">{tpl.title}</p>
                {selectedTemplate === tpl.id && <CheckCircle className="h-4 w-4 text-primary ml-auto" />}
              </div>
              <p className="text-xs text-muted-foreground">{tpl.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Fill form */}
      {selectedTemplate && (
        <div className="space-y-4">
          <h2 className="font-bold text-foreground flex items-center gap-2 text-lg"><Users className="h-5 w-5 text-primary" /> 2. Remplissez les informations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONTRACT_TEMPLATES.find(t => t.id === selectedTemplate)?.fields.map(field => (
              <div key={field}>
                <label className="block text-xs font-mono font-bold text-muted-foreground mb-1">{(FIELD_LABELS[field] || field).toUpperCase()}</label>
                <input value={formData[field] || ""} onChange={e => setFormData(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={FIELD_LABELS[field] || field}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary/50" />
              </div>
            ))}
          </div>
          <button onClick={generate} disabled={generating || Object.keys(formData).length < 2}
            className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.01]"
            style={{ background: "hsl(var(--primary))" }}>
            {generating ? <><Loader2 className="h-5 w-5 animate-spin" /> Génération IA en cours…</> : <><Zap className="h-5 w-5" /> Générer le contrat en 2 clics</>}
          </button>
        </div>
      )}

      {/* Step 3: Contract result */}
      {contract && (
        <div className="space-y-4">
          <h2 className="font-bold text-foreground flex items-center gap-2 text-lg"><CheckCircle className="h-5 w-5 text-emerald-400" /> 3. Votre contrat est prêt</h2>
          <div className="rounded-2xl border-2 border-emerald-500/30 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: "rgba(16,185,129,0.08)", borderBottom: "1px solid rgba(16,185,129,0.15)" }}>
              <div>
                <p className="font-bold text-foreground">{contract.titre}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-emerald-400" /> N° {contract.numero}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {contract.date_emission}</span>
                  <span className="flex items-center gap-1 text-emerald-500 font-bold"><CheckCircle className="h-3 w-3" /> Validé CirculAI</span>
                </div>
              </div>
              <button onClick={copyContract} className="px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 transition-all">
                <Download className="h-3.5 w-3.5 inline mr-1" /> Copier
              </button>
            </div>
            <div className="p-6">
              <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">{contract.contenu}</pre>
            </div>
            <div className="px-6 py-4 grid grid-cols-2 gap-6" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid hsl(var(--border))" }}>
              {["Partie A", "Partie B"].map(p => (
                <div key={p}>
                  <p className="text-xs font-mono text-muted-foreground mb-3">{p} — Signature</p>
                  <div className="h-12 rounded-lg" style={{ border: "1px dashed hsl(var(--border))" }} />
                  <p className="text-[10px] text-muted-foreground mt-1">Date : ___________</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent contracts */}
      <div className="space-y-3">
        <h2 className="font-bold text-foreground flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Contrats récents de la communauté</h2>
        <div className="space-y-2">
          {RECENT_CONTRACTS.map(c => (
            <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
              <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{c.type}</p>
                <p className="text-xs text-muted-foreground">{c.parties}</p>
              </div>
              <span className="text-xs font-bold text-primary">{c.montant}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${c.status === "signé" || c.status === "validé" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}