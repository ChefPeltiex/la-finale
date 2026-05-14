import { memo } from "react";
import { cn } from "@/lib/utils";

const COLOR_MAP = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/20 text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  chart3: "bg-blue-50 text-blue-600",
};

const StatCard = memo(function StatCard({ icon: Icon, label, value, suffix, color = "primary" }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow duration-300">
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3", COLOR_MAP[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-foreground">
        {value}
        {suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
});

export default StatCard;