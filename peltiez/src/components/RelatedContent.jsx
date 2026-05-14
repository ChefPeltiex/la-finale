import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { BookOpen, Package, FileText, Loader2, ArrowRight } from "lucide-react";

const CONTENT_TYPES = {
  blog: { icon: BookOpen, label: "Article", color: "from-violet-500/20 to-violet-600/20" },
  educational: { icon: FileText, label: "Fiche", color: "from-emerald-500/20 to-emerald-600/20" },
  listing: { icon: Package, label: "Annonce", color: "from-blue-500/20 to-blue-600/20" },
};

/** Permaliens SPA alignés sur `App.jsx` + ancres stables dans `BlogHub.jsx`. */
function relatedItemTo(item) {
  if (!item?.id) return "/";
  if (item.type === "listing") return `/annonce/${item.id}`;
  if (item.type === "blog") return `/blog#blog-post-${item.id}`;
  if (item.type === "educational") return `/blog#edu-sheet-${item.id}`;
  return "/blog";
}

export default function RelatedContent({ contentId, contentType = "blog", limit = 5 }) {
  const { data: relatedItems = [], isLoading, error } = useQuery({
    queryKey: [`related-${contentType}-${contentId}`],
    queryFn: async () => {
      try {
        // Fetch the main content item to get related_content field
        let mainContent;
        if (contentType === "blog") {
          mainContent = await base44.entities.BlogPost.get(contentId);
        } else if (contentType === "educational") {
          mainContent = await base44.entities.EducationalSheet.get(contentId);
        } else if (contentType === "listing") {
          mainContent = await base44.entities.Listing.get(contentId);
        }

        if (!mainContent?.related_content || mainContent.related_content.length === 0) {
          return [];
        }

        // Fetch each related item
        const items = [];
        for (const link of mainContent.related_content.slice(0, limit)) {
          try {
            let item;
            if (link.type === "blog") {
              item = await base44.entities.BlogPost.get(link.id);
              items.push({ ...item, type: "blog" });
            } else if (link.type === "educational") {
              item = await base44.entities.EducationalSheet.get(link.id);
              items.push({ ...item, type: "educational" });
            } else if (link.type === "listing") {
              item = await base44.entities.Listing.get(link.id);
              items.push({ ...item, type: "listing" });
            }
          } catch (e) {
            if (import.meta.env.DEV) {
              console.warn(`Failed to fetch related item ${link.id}:`, e.message);
            }
          }
        }
        return items;
      } catch (e) {
        console.error("Related content fetch error:", e.message);
        return [];
      }
    },
    staleTime: 600_000,
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || relatedItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
        <ArrowRight className="h-4 w-4 text-primary" />
        Ressources liées
      </h3>
      <div className="space-y-2">
        {relatedItems.map(item => {
          const typeConfig = CONTENT_TYPES[item.type] || CONTENT_TYPES.blog;
          const Icon = typeConfig.icon;
          const title = item.title || item.name || "Sans titre";
          const to = relatedItemTo(item);

          return (
            <Link
              key={`${item.type}-${item.id}`}
              to={to}
              className={`flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br ${typeConfig.color} border border-transparent hover:border-primary/30 transition-all hover:shadow-sm`}
            >
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-foreground/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                  {typeConfig.label}
                </p>
                <p className="text-sm font-medium text-foreground line-clamp-2 mt-0.5">
                  {title}
                </p>
                {item.excerpt && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {item.excerpt}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}