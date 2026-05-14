import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { key: "pensée", emoji: "💭", label: "Pensée" },
  { key: "article", emoji: "📝", label: "Article" },
  { key: "meme", emoji: "😂", label: "Meme" },
  { key: "question", emoji: "❓", label: "Question" },
  { key: "annonce", emoji: "📢", label: "Annonce" },
  { key: "media", emoji: "🎬", label: "Média" },
  { key: "débat", emoji: "⚔️", label: "Débat" },
  { key: "ressource", emoji: "📚", label: "Ressource" },
];

export default function CreatePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [tags, setTags] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      let image_url = "";
      if (imageFile) {
        const res = await base44.integrations.Core.UploadFile({ file: imageFile });
        image_url = res.file_url;
      }
      return base44.entities.Post.create({
        content,
        category,
        image_url,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/feed");
    },
  });

  const isValid = content.trim() && category;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <Link to="/feed" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Retour au flux
      </Link>

      <div className="bg-card rounded-3xl border border-border p-8 space-y-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Partager ta pensée</h1>
        <p className="text-muted-foreground">Politique, love, justice, environnement, memes — peu importe le sujet.</p>

        {/* Content */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Ton message</label>
          <Textarea
            placeholder="Raconte ce que tu penses, ressens, découvres... Aucune limite de sujet."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="rounded-2xl min-h-[150px] p-4 text-base resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">{content.length} caractères</p>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Type de post</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  category === cat.key
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 bg-muted/50"
                }`}
              >
                <span className="text-2xl mb-1">{cat.emoji}</span>
                <span className="text-[10px] font-semibold text-center">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Image/vidéo (optionnel)</label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-8 cursor-pointer hover:bg-accent/50 transition-colors">
            {imageFile ? (
              <div className="text-center">
                <p className="text-sm font-medium text-primary">{imageFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">Cliquez pour changer</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Ajouter une image/vidéo</p>
              </>
            )}
            <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
          </label>
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Tags (séparés par des virgules)</label>
          <input
            type="text"
            placeholder="#politique #love #justice #environnement"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm"
          />
        </div>

        {/* Submit */}
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !isValid}
          className="w-full rounded-2xl h-12 font-bold text-base"
          size="lg"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {mutation.isPending ? "Publication..." : "✨ Partager mon message"}
        </Button>
      </div>
    </div>
  );
}