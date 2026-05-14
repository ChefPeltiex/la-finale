import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, User, Package, Gift, Wrench, RefreshCw, Trash2, Loader2, Heart, Leaf } from "lucide-react";
import { formatRelativeFr } from "@/lib/dateUtils";
import ShareButtons from "@/components/ShareButtons";

const TYPE_CONFIG = {
  vente:      { label: "Vente",      icon: Package,   color: "bg-blue-100 text-blue-700" },
  don:        { label: "Don",        icon: Gift,       color: "bg-emerald-100 text-emerald-700" },
  réparation: { label: "Réparation", icon: Wrench,     color: "bg-amber-100 text-amber-700" },
  échange:    { label: "Échange",    icon: RefreshCw,  color: "bg-purple-100 text-purple-700" },
};

const CONDITION_LABELS = { neuf: "Neuf", "très bon": "Très bon", bon: "Bon", acceptable: "Acceptable" };

export default function ItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", itemId],
    queryFn: () => base44.entities.Listing.get(itemId),
    staleTime: 30_000,
  });

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Listing.delete(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      navigate("/marketplace");
    },
  });

  const markSoldMutation = useMutation({
    mutationFn: () => base44.entities.Listing.update(itemId, { status: "vendu" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listing", itemId] }),
  });

  const saveFavoriMutation = useMutation({
    mutationFn: () => base44.entities.Favori.create({
      user_email: currentUser.email,
      listing_id: listing.id,
      listing_title: listing.title,
      listing_type: listing.type,
      listing_price: listing.price || 0,
      listing_image: listing.image_url || "",
      listing_location: listing.location || "",
      folder: "Inspirations",
    }),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (!listing) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground">Annonce non trouvée</p>
      <Button asChild variant="outline" className="mt-4 rounded-xl">
        <Link to="/marketplace">Retour au marketplace</Link>
      </Button>
    </div>
  );

  const cfg = TYPE_CONFIG[listing.type] || TYPE_CONFIG.don;
  const Icon = cfg.icon;
  const isOwner = currentUser && listing.created_by === currentUser.email;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 rounded-xl -ml-2">
        <ArrowLeft className="h-4 w-4 mr-2" /> Retour
      </Button>

      <div className="aspect-[16/9] bg-muted rounded-2xl overflow-hidden mb-6">
        {listing.image_url ? (
          <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="h-20 w-20 text-muted-foreground/10" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color} mb-3`}>
              <Icon className="h-3.5 w-3.5" /> {cfg.label}
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">{listing.title}</h1>
            {listing.price > 0 && (
              <p className="text-2xl font-bold text-primary mt-1">{listing.price} $</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {listing.status !== "actif" && (
              <Badge variant="secondary" className="capitalize">{listing.status}</Badge>
            )}
            {listing.co2_saved && (
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium">
                <Leaf className="h-3.5 w-3.5" /> {listing.co2_saved} kg CO₂ évité
              </div>
            )}
          </div>
        </div>

        {listing.description && (
          <p className="text-foreground/80 leading-relaxed">{listing.description}</p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {listing.condition && <Badge variant="outline">{CONDITION_LABELS[listing.condition] || listing.condition}</Badge>}
          {listing.category && <Badge variant="outline" className="capitalize">{listing.category}</Badge>}
          {listing.location && (
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {listing.location}</span>
          )}
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatRelativeFr(listing.created_date)}</span>
          <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {listing.seller_name || listing.created_by}</span>
        </div>

        {/* Share Buttons */}
        <div className="pt-6 border-t border-border">
          <ShareButtons listing={listing} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border flex-wrap">
          {!isOwner && currentUser && (
            <Button onClick={() => saveFavoriMutation.mutate()} variant="outline" className="rounded-xl gap-2"
              disabled={saveFavoriMutation.isPending || saveFavoriMutation.isSuccess}>
              <Heart className={`h-4 w-4 ${saveFavoriMutation.isSuccess ? "fill-red-500 text-red-500" : ""}`} />
              {saveFavoriMutation.isSuccess ? "Sauvegardé !" : "Sauvegarder"}
            </Button>
          )}

          {isOwner && listing.status === "actif" && (
            <>
              <Button onClick={() => markSoldMutation.mutate()} variant="outline" className="rounded-xl flex-1"
                disabled={markSoldMutation.isPending}>
                {markSoldMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Marquer comme vendu/donné"}
              </Button>
              <Button onClick={() => deleteMutation.mutate()} variant="destructive" className="rounded-xl"
                disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}