import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatRelativeFr } from "@/lib/dateUtils";

export default function ListingReview({ listingId, currentUserEmail }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: reviews = [] } = useQuery({
    queryKey: ["listing-reviews", listingId],
    queryFn: () =>
      base44.entities.Review?.filter?.({ listing_id: listingId }, "-created_date", 50).catch(() => []),
    staleTime: 30_000,
  });

  const createReview = useMutation({
    mutationFn: async () => {
      if (!base44.entities.Review) throw new Error("Review entity not available");
      return base44.entities.Review.create({
        listing_id: listingId,
        user_email: currentUserEmail,
        rating,
        comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing-reviews", listingId] });
      setComment("");
      setRating(5);
      setShowForm(false);
    },
  });

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : 0;

  if (!base44.entities.Review) return null;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-3 py-3 border-t border-b border-border">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
          ))}
        </div>
        <span className="text-sm font-medium text-foreground">{avgRating}</span>
        <span className="text-xs text-muted-foreground">({reviews.length} avis)</span>
      </div>

      {/* Review list */}
      <div className="space-y-3">
        {reviews.slice(0, 3).map((review) => (
          <div key={review.id} className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < (review.rating || 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{formatRelativeFr(review.created_date)}</span>
            </div>
            {review.comment && <p className="text-sm text-foreground">{review.comment}</p>}
          </div>
        ))}
      </div>

      {/* Add review button */}
      {currentUserEmail && !reviews.some((r) => r.user_email === currentUserEmail) && (
        <>
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              size="sm"
              className="rounded-lg gap-2"
            >
              <MessageCircle className="h-4 w-4" /> Ajouter un avis
            </Button>
          ) : (
            <div className="space-y-3 p-3 bg-secondary/20 rounded-lg">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Votre avis…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="text-sm rounded-lg h-16"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => createReview.mutate()}
                  size="sm"
                  disabled={createReview.isPending}
                  className="rounded-lg"
                >
                  Publier
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowForm(false)} className="rounded-lg">
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}