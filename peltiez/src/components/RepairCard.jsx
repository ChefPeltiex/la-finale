import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle, Lightbulb } from "lucide-react";

const CATEGORY_COLORS = {
  électronique: "bg-blue-100 text-blue-700 border-blue-200",
  électroménager: "bg-orange-100 text-orange-700 border-orange-200",
  vêtements: "bg-pink-100 text-pink-700 border-pink-200",
  mobilier: "bg-amber-100 text-amber-700 border-amber-200",
  vélos: "bg-emerald-100 text-emerald-700 border-emerald-200",
  outils: "bg-red-100 text-red-700 border-red-200",
  informatique: "bg-violet-100 text-violet-700 border-violet-200",
  autre: "bg-slate-100 text-slate-700 border-slate-200",
};

const TYPE_ICONS = {
  question: "❓",
  tutoriel: "📚",
  conseil: "💡",
  success_story: "⭐",
};

const DIFFICULTY_COLORS = {
  facile: "text-emerald-600",
  moyen: "text-amber-600",
  difficile: "text-orange-600",
  expert: "text-red-600",
};

export default function RepairCard({ discussion, onVote: _onVote }) {
  const catColor = CATEGORY_COLORS[discussion.category] || CATEGORY_COLORS.autre;
  
  return (
    <Link
      id={`repair-thread-${discussion.id}`}
      to={{ pathname: "/hub-reparation", hash: `#repair-thread-${discussion.id}` }}
      className="scroll-mt-24 bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3"
    >
      
      {/* Header avec badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{TYPE_ICONS[discussion.type] || "💬"}</span>
          {discussion.is_pinned && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">📌 Épinglé</Badge>
          )}
          {discussion.is_featured && (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">⭐ En vedette</Badge>
          )}
        </div>
        <Badge className={`text-xs border ${catColor}`}>{discussion.category}</Badge>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {discussion.title}
      </h3>

      {/* Content preview */}
      {discussion.content && (
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {discussion.content}
        </p>
      )}

      {/* Tags & Difficulty */}
      <div className="flex flex-wrap gap-1.5">
        {discussion.tags && discussion.tags.slice(0, 3).map(tag => (
          <Badge key={tag} variant="outline" className="text-[10px] bg-muted">
            {tag}
          </Badge>
        ))}
        {discussion.difficulty_level && (
          <Badge variant="outline" className={`text-[10px] ${DIFFICULTY_COLORS[discussion.difficulty_level]}`}>
            {discussion.difficulty_level}
          </Badge>
        )}
      </div>

      {/* Stats footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
            <ThumbsUp className="h-3.5 w-3.5" /> {discussion.upvotes || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" /> {discussion.replies_count || 0}
          </span>
          {discussion.helpful_count > 0 && (
            <span className="flex items-center gap-1 text-emerald-600">
              <Lightbulb className="h-3.5 w-3.5" /> {discussion.helpful_count}
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">
          par {discussion.author_name || "Anonyme"}
        </span>
      </div>
    </Link>
  );
}