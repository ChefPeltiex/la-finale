import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Star, MessageSquare, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { formatRelativeFr } from "@/lib/dateUtils";

export default function ArtisanDetail() {
  const { artisanId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [messageText, setMessageText] = useState("");
  const [rating, setRating] = useState(5);
  const [emoji, setEmoji] = useState("💚");

  const { data: artisan, isLoading: loadingArtisan } = useQuery({
    queryKey: ["artisan", artisanId],
    queryFn: () => base44.entities.Artisan.get(artisanId),
    staleTime: 30_000,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["artisan-messages", artisanId],
    queryFn: () =>
      base44.entities.ArtisanMessage.filter(
        { artisan_id: artisanId, approved: true },
        "-created_date",
        100
      ),
    staleTime: 10_000,
  });

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const postMessageMutation = useMutation({
    mutationFn: () =>
      base44.entities.ArtisanMessage.create({
        artisan_id: artisanId,
        user_email: currentUser.email,
        user_name: currentUser.full_name,
        message: messageText,
        rating,
        emoji,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artisan-messages"] });
      setMessageText("");
      setRating(5);
      setEmoji("💚");
    },
  });

  if (loadingArtisan) return null;
  if (!artisan) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Artisan non trouvé</p>
        <Button asChild variant="outline" className="mt-4 rounded-xl">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  const avgRating = messages.length > 0
    ? (messages.reduce((sum, m) => sum + (m.rating || 5), 0) / messages.length).toFixed(1)
    : 0;

  return (
    <div className="pb-20 max-w-3xl mx-auto">
      {/* Header */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" /> Retour
      </Button>

      {/* Artisan Profile */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
          {artisan.image_url && (
            <div className="sm:col-span-1">
              <img
                src={artisan.image_url}
                alt={artisan.business_name}
                className="w-full h-40 rounded-xl object-cover"
              />
            </div>
          )}

          <div className={artisan.image_url ? "sm:col-span-2" : "sm:col-span-3"}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {artisan.business_name}
                </h1>
                <p className="text-sm text-muted-foreground">{artisan.owner_name}</p>
              </div>
              {artisan.verified && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                  ✓ Vérifié
                </Badge>
              )}
            </div>

            <p className="text-foreground/80 mb-4">{artisan.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {avgRating} ({messages.length})
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {artisan.location && (
                <p className="text-muted-foreground">📍 {artisan.location}</p>
              )}
              {artisan.phone && (
                <p className="text-muted-foreground">📞 {artisan.phone}</p>
              )}
              {artisan.email && (
                <p className="text-muted-foreground">📧 {artisan.email}</p>
              )}
              {artisan.website && (
                <p className="text-primary">
                  <a href={artisan.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    🌐 Site web
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Section */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="h-6 w-6 text-rose-500" /> Messages de gratitude
        </h2>

        {/* Form */}
        {currentUser && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Partage ton amour 💚</h3>

            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Dis-lui à quel point tu apprécies son travail..."
              className="w-full p-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
            />

            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Note:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRating(r)}
                      className={`text-xl transition-transform ${
                        r <= rating ? "scale-125" : "opacity-40"
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Emoji:</span>
                <div className="flex gap-1">
                  {["💚", "❤️", "🙏", "✨", "🔥"].map((em) => (
                    <button
                      key={em}
                      onClick={() => setEmoji(em)}
                      className={`text-xl p-1 rounded transition-all ${
                        em === emoji ? "bg-primary/20 scale-125" : "opacity-50"
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={() => postMessageMutation.mutate()}
              className="w-full rounded-xl font-bold gap-2"
              disabled={!messageText.trim() || postMessageMutation.isPending}
            >
              {postMessageMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Envoyer mon amour
            </Button>
          </div>
        )}

        {/* Messages List */}
        {messages.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
            <MessageSquare className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-muted-foreground">Aucun message pour le moment</p>
            <p className="text-sm text-muted-foreground mt-1">Sois le premier à laisser un message! 💚</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{msg.user_name}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeFr(msg.created_date)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{msg.emoji || "💚"}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < (msg.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}