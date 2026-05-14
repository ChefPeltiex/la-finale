import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Eye, Loader2, Zap } from "lucide-react";

const EVENT_ICONS = {
  donation: "🎁",
  synchronicity: "✨",
  mystical_discovery: "🌙",
  user_achievement: "🏆",
  community_milestone: "🌍",
  paranormal_alert: "👻",
  numerology_event: "🔢"
};

const EVENT_COLORS = {
  donation: "from-emerald-500 to-teal-500",
  synchronicity: "from-purple-500 to-violet-500",
  mystical_discovery: "from-indigo-500 to-purple-500",
  user_achievement: "from-amber-500 to-orange-500",
  community_milestone: "from-blue-500 to-cyan-500",
  paranormal_alert: "from-red-500 to-pink-500",
  numerology_event: "from-violet-500 to-purple-500"
};

function NewsCard({ event, onView }) {
  const handleView = () => {
    if (onView) onView(event.id);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all hover:-translate-y-1 group cursor-pointer"
      onClick={handleView}>
      
      {/* Image + Event Badge */}
      <div className="relative h-40 bg-muted overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${EVENT_COLORS[event.event_type] || "from-slate-500 to-slate-600"} flex items-center justify-center text-5xl`}>
            {EVENT_ICONS[event.event_type] || "📰"}
          </div>
        )}
        
        {/* Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          {event.emoji} {event.event_type.replace(/_/g, ' ')}
        </div>

        {/* Impact Score */}
        {event.impact_score && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-white text-xs font-bold">
            <Zap className="h-3 w-3" /> {event.impact_score}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {event.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" /> {event.engagement_count || 0}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">À l'instant</span>
        </div>
      </div>
    </div>
  );
}

export default function DynamicNewsStream({ limit = 12, showFilters = true }) {
  const [filter, setFilter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: events = [], isLoading, refetch: _refetch } = useQuery({
    queryKey: ["dynamic-feed", filter],
    queryFn: async () => {
      let query = { is_archived: false };
      if (filter !== "all") {
        query.event_type = filter;
      }
      return base44.entities.DynamicFeed.filter(query, "-created_date", limit);
    },
    staleTime: 5_000,
    refetchInterval: autoRefresh ? 10_000 : false
  });

  const eventTypes = Object.keys(EVENT_ICONS);

  return (
    <div className="space-y-6">
      {/* Controls */}
      {showFilters && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}>
              Tous
            </button>
            {eventTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all capitalize ${
                  filter === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:bg-accent"
                }`}>
                {EVENT_ICONS[type]} {type.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              autoRefresh
                ? "bg-emerald-600 text-white"
                : "bg-card border border-border text-muted-foreground hover:bg-accent"
            }`}>
            {autoRefresh ? "🔴 En direct" : "⚪ Pause"}
          </button>
        </div>
      )}

      {/* News Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
          <div className="text-4xl mb-3">📰</div>
          <p className="text-muted-foreground font-medium">Aucun événement pour le moment</p>
          <p className="text-sm text-muted-foreground mt-1">Reviens bientôt pour les dernières nouvelles!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <NewsCard
              key={event.id}
              event={event}
              onView={(id) => {
                // Update engagement
                const updated = events.find(e => e.id === id);
                if (updated) {
                  base44.entities.DynamicFeed.update(id, {
                    engagement_count: (updated.engagement_count || 0) + 1
                  });
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}