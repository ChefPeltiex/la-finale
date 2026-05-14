import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Package, Gift, Wrench, RefreshCw, Upload, Loader2, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const TYPES = [
  { key: "don",        label: "Don",        icon: Gift,       desc: "Offrir gratuitement" },
  { key: "vente",      label: "Vente",      icon: Package,    desc: "Vendre un objet" },
  { key: "échange",    label: "Échange",    icon: RefreshCw,  desc: "Troquer" },
  { key: "réparation", label: "Réparation", icon: Wrench,     desc: "Proposer une réparation" },
];

const CATEGORIES = ["électronique", "vêtements", "mobilier", "livres", "sport", "maison", "outils", "autre"];

const INITIAL = { title: "", description: "", type: "", category: "", price: "", condition: "", location: "" };

export default function PostItem() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(INITIAL);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = useCallback((k, v) => setForm(p => ({ ...p, [k]: v })), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let image_url = "";
    if (imageFile) {
      const res = await base44.integrations.Core.UploadFile({ file: imageFile });
      image_url = res.file_url;
    }
    const co2_saved = form.type === "don" ? 3.5 : form.type === "réparation" ? 5 : 1.5;
    await base44.entities.Listing.create({
      ...form,
      price: parseFloat(form.price) || 0,
      image_url,
      co2_saved,
      status: "actif",
    });
    queryClient.invalidateQueries({ queryKey: ["listings"] });
    navigate("/marketplace");
  };

  const isValid = form.type && form.title && form.description;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <h1 className="font-display text-2xl font-bold text-foreground">Publier une annonce</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-4">Partagez un objet avec la communauté CirculAI Hub</p>
      <div className="mb-8 p-4 bg-accent rounded-2xl flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-accent-foreground">📦 Vous avez plusieurs objets ?</p>
          <p className="text-xs text-muted-foreground mt-0.5">Importez votre inventaire en une seule fois via CSV.</p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl shrink-0 gap-2">
          <Link to="/import-csv"><FileSpreadsheet className="h-4 w-4" /> Import CSV</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Type d'annonce</Label>
          <div className="grid grid-cols-2 gap-3">
            {TYPES.map(t => (
              <button key={t.key} type="button" onClick={() => update("type", t.key)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                  form.type === t.key ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card hover:bg-accent"
                )}>
                <t.icon className={cn("h-5 w-5", form.type === t.key ? "text-primary" : "text-muted-foreground")} />
                <div>
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="title">Titre</Label>
          <Input id="title" placeholder="Ex: Vélo de montagne en bon état" value={form.title}
            onChange={e => update("title", e.target.value)} className="mt-1.5 rounded-xl h-12" required />
        </div>

        <div>
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" placeholder="Décrivez l'objet en détail…" value={form.description}
            onChange={e => update("description", e.target.value)} className="mt-1.5 rounded-xl min-h-[100px]" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Catégorie</Label>
            <Select value={form.category} onValueChange={v => update("category", v)}>
              <SelectTrigger className="mt-1.5 rounded-xl h-12"><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>État</Label>
            <Select value={form.condition} onValueChange={v => update("condition", v)}>
              <SelectTrigger className="mt-1.5 rounded-xl h-12"><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>
                {["neuf", "très bon", "bon", "acceptable"].map(c => (
                  <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {form.type === "vente" && (
          <div>
            <Label htmlFor="price">Prix (CAD)</Label>
            <Input id="price" type="number" min="0" placeholder="0.00" value={form.price}
              onChange={e => update("price", e.target.value)} className="mt-1.5 rounded-xl h-12" />
          </div>
        )}

        <div>
          <Label htmlFor="location">Localisation</Label>
          <Input id="location" placeholder="Ex: Québec, Limoilou" value={form.location}
            onChange={e => update("location", e.target.value)} className="mt-1.5 rounded-xl h-12" />
        </div>

        {/* Photo */}
        <div>
          <Label>Photo</Label>
          <label className="mt-1.5 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:bg-accent/50 transition-colors">
            {imageFile ? (
              <div className="text-center">
                <p className="text-sm font-medium text-primary">{imageFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">Cliquez pour changer</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Ajouter une photo</p>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full rounded-xl h-12" disabled={submitting || !isValid}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {submitting ? "Publication en cours…" : "Publier l'annonce"}
        </Button>
      </form>
    </div>
  );
}