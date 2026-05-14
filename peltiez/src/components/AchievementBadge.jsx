import { Award, Zap, Heart, Leaf, Users, Flame } from "lucide-react";

const ACHIEVEMENTS = {
  first_listing: { icon: Award, label: "Débuts", color: "bg-blue-100 text-blue-700", desc: "Publier la première annonce" },
  green_warrior: { icon: Leaf, label: "Guerrier vert", color: "bg-emerald-100 text-emerald-700", desc: "50 kg CO₂ évité" },
  community_star: { icon: Users, label: "Star communauté", color: "bg-purple-100 text-purple-700", desc: "10 annonces publiées" },
  repair_master: { icon: Zap, label: "Maître réparateur", color: "bg-amber-100 text-amber-700", desc: "5 réparations" },
  donor: { icon: Heart, label: "Âme généreuse", color: "bg-rose-100 text-rose-700", desc: "10 dons" },
  legendary: { icon: Flame, label: "Légende", color: "bg-orange-100 text-orange-700", desc: "100 kg CO₂ évité" },
};

export function AchievementBadge({ achievement, earned = false }) {
  const config = ACHIEVEMENTS[achievement];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-xl ${earned ? config.color : "bg-muted"} ${
        !earned && "opacity-40"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-semibold text-center">{config.label}</span>
    </div>
  );
}

export default ACHIEVEMENTS;