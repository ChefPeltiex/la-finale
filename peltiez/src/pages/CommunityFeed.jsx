import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Heart, MessageCircle, Leaf, MapPin, TrendingUp, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatRelativeFr } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";

const TYPE_EMOJI = { don: "🎁", vente: "💳", réparation: "🔧", échange: "🤝" };
const CATEGORY_EMOJI = { pensée: "💭", article: "📝", meme: "😂", question: "❓", annonce: "📢", media: "🎬", débat: "⚔️", ressource: "📚" };

function PostCard({ post, user, currentUserEmail }) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Post.delete(post.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg">
            {user?.avatar_emoji || "🌱"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-foreground text-sm truncate">{user?.display_name || post.created_by?.split("@")[0]}</p>
              <span className="text-xs text-white bg-primary px-2 py-0.5 rounded-full font-medium">
                {CATEGORY_EMOJI[post.category]} {post.category}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{formatRelativeFr(post.created_date)}</p>
          </div>
        </div>
        {post.created_by === currentUserEmail && (
          <button
            onClick={() => deleteMutation.mutate()}
            className="text-muted-foreground hover:text-destructive transition-colors"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="text-foreground text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

      {post.image_url && (
        <div className="mb-4 rounded-xl overflow-hidden aspect-video bg-muted">
          <img src={post.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
        <span>{post.likes_count || 0} likes</span>
        <span>{post.replies_count || 0} réponses</span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-sm font-medium ${
            liked ? "bg-red-50 text-red-600" : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-red-600" : ""}`} /> {liked ? "Aimé" : "Aimer"}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-all text-sm font-medium">
          <MessageSquare className="h-4 w-4" /> Répondre
        </button>
      </div>
    </div>
  );
}

function ActivityCard({ listing, user }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg">
          {user?.avatar_emoji || "🌱"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground text-sm truncate">{user?.display_name || listing.created_by}</p>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              {TYPE_EMOJI[listing.type]} {listing.type}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{formatRelativeFr(listing.created_date)}</p>
        </div>
      </div>

      {/* Image */}
      {listing.image_url && (
        <div className="mb-4 rounded-xl overflow-hidden aspect-video bg-muted">
          <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <Link to={`/annonce/${listing.id}`} className="block group">
        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {listing.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{listing.description}</p>
      </Link>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
        {listing.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {listing.location}
          </span>
        )}
        {listing.co2_saved && (
          <span className="flex items-center gap-1 text-emerald-600">
            <Leaf className="h-3 w-3" /> -{listing.co2_saved}kg CO₂
          </span>
        )}
        {listing.price > 0 && <span className="font-bold text-foreground">{listing.price}$</span>}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setLiked(!liked)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-sm font-medium",
            liked ? "bg-red-50 text-red-600" : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-red-600" : ""}`} /> {liked ? "Aimé" : "Aimer"}
        </button>
        <Button asChild variant="outline" size="sm" className="flex-1 rounded-lg gap-2">
          <Link to={`/annonce/${listing.id}`}>
            <MessageCircle className="h-4 w-4" /> Détails
          </Link>
        </Button>
      </div>
    </div>
  );
}

function UserProfile({ user }) {
  if (!user) return null;
  return (
    <div className="bg-card rounded-2xl border border-border p-6 text-center sticky top-24">
      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
        {user.avatar_emoji || "🌱"}
      </div>
      <p className="font-bold text-foreground text-lg">{user.display_name || user.email?.split("@")[0]}</p>
      <p className="text-xs text-muted-foreground mt-1 mb-4">{user.city || "Global"}</p>
      <div className="grid grid-cols-2 gap-3 mb-4 text-center">
        <div className="bg-muted rounded-lg p-3">
          <p className="text-xl font-bold text-foreground">{user.total_objects_saved || 0}</p>
          <p className="text-[10px] text-muted-foreground">Objets sauvés</p>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <p className="text-xl font-bold text-emerald-600">{(user.total_co2_saved || 0).toFixed(1)}</p>
          <p className="text-[10px] text-muted-foreground">kg CO₂ évité</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{user.level || "Graine 🌱"}</p>
      <Button asChild className="w-full rounded-xl" size="sm">
        <Link to="/profil">Voir mon profil</Link>
      </Button>
    </div>
  );
}

export default function CommunityFeed() {
  const [currentUser, setCurrentUser] = useState(null);

  useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const u = await base44.auth.me();
      setCurrentUser(u);
      return u;
    },
  });

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["feed-listings"],
    queryFn: () => base44.entities.Listing.list("-created_date", 50),
    staleTime: 10_000,
  });

  const { data: ecoProfiles = [] } = useQuery({
    queryKey: ["eco-profiles"],
    queryFn: () => base44.entities.EcoProfile.list("-total_co2_saved", 100),
    staleTime: 30_000,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => base44.entities.Post.list("-created_date", 100),
    staleTime: 5_000,
  });

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN FEED */}
        <div className="lg:col-span-2 space-y-4">
          <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border py-4 mb-4">
            <h1 className="font-display text-2xl font-bold text-foreground">Flux communautaire</h1>
            <p className="text-sm text-muted-foreground mt-1">Activités en direct • {listings.length} annonces</p>
          </div>

          {/* Posts Feed */}
          {postsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-5 animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-24 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {posts.map((post) => {
                const profile = ecoProfiles.find((p) => p.user_email === post.created_by);
                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    user={profile}
                    currentUserEmail={currentUser?.email}
                  />
                );
              })}
            </div>
          )}

          {/* Listings */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-5 animate-pulse space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-40 bg-muted rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => {
                const profile = ecoProfiles.find((p) => p.user_email === listing.created_by);
                return (
                  <ActivityCard
                    key={listing.id}
                    listing={listing}
                    user={profile}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block space-y-6">
          {/* Current User */}
          {currentUser && <UserProfile user={currentUser} />}

          {/* Create Post Button */}
          <Button asChild className="w-full rounded-2xl h-12 font-bold text-base bg-gradient-to-r from-primary to-emerald-600" size="lg">
            <Link to="/create-post">✍️ Écrire un post</Link>
          </Button>

          {/* Top Contributors */}
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" /> Champions du bien
            </h3>
            <div className="space-y-3">
              {ecoProfiles.slice(0, 5).map((profile, i) => (
                <Link
                  key={profile.id}
                  to="/profil"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-sm flex-shrink-0">
                    {profile.avatar_emoji || "🌱"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {profile.display_name}
                    </p>
                    <p className="text-xs text-emerald-600">+{profile.total_co2_saved?.toFixed(1) || 0} kg</p>
                  </div>
                  <span className="text-lg">#{i + 1}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button asChild className="w-full rounded-2xl h-12 font-bold text-base" size="lg">
              <Link to="/create-post">✍️ Écrire un post</Link>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-2xl h-12 font-bold text-base" size="lg">
              <Link to="/publier">⚔️ Publier pour le bien</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}