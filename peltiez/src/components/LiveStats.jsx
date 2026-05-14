import { useState, useEffect, useRef } from "react";
import { Leaf, Users, Package, TrendingUp } from "lucide-react";

function useAnimatedCounter(target, duration = 2000) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === 0) return;
    startRef.current = null;
    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else setValue(target);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

const BASE_STATS = {
  co2: 2_143_870,
  members: 142_340,
  objects: 891_200,
  transactions: 54_320,
  countries: 83,
  revenue_shared: 387_450,
};

export default function LiveStats() {
  const [stats, setStats] = useState(BASE_STATS);
  const [pulse, setPulse] = useState(false);

  // Simulate real-time increments every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        co2:             prev.co2 + Math.floor(Math.random() * 12 + 3),
        members:         prev.members + (Math.random() > 0.7 ? 1 : 0),
        objects:         prev.objects + Math.floor(Math.random() * 5 + 1),
        transactions:    prev.transactions + (Math.random() > 0.5 ? 1 : 0),
        countries:       prev.countries,
        revenue_shared:  prev.revenue_shared + Math.floor(Math.random() * 8),
      }));
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const co2       = useAnimatedCounter(stats.co2, 1800);
  const members   = useAnimatedCounter(stats.members, 1800);
  const objects   = useAnimatedCounter(stats.objects, 1800);
  const shared    = useAnimatedCounter(stats.revenue_shared, 1800);

  const ITEMS = [
    { icon: Leaf,        label: "kg CO₂ évités",       val: co2.toLocaleString("fr"),     color: "text-emerald-600", bg: "bg-emerald-50",  dot: "bg-emerald-500" },
    { icon: Users,       label: "Membres actifs",       val: members.toLocaleString("fr"), color: "text-blue-600",    bg: "bg-blue-50",     dot: "bg-blue-500" },
    { icon: Package,     label: "Objets sauvés",        val: objects.toLocaleString("fr"), color: "text-purple-600",  bg: "bg-purple-50",   dot: "bg-purple-500" },
    { icon: TrendingUp,  label: "$ redistribués",       val: `${shared.toLocaleString("fr")}$`, color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className={`h-2 w-2 rounded-full bg-emerald-500 ${pulse ? "animate-ping" : "animate-pulse"}`} />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Chiffres en direct · Planète entière</span>
        <div className={`h-2 w-2 rounded-full bg-emerald-500 ${pulse ? "animate-ping" : "animate-pulse"}`} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ITEMS.map(({ icon: Icon, label, val, color, bg, dot }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 border border-border relative overflow-hidden`}>
            <div className={`absolute top-2 right-2 h-1.5 w-1.5 rounded-full ${dot} animate-pulse`} />
            <Icon className={`h-5 w-5 mb-2 ${color}`} />
            <p className={`text-2xl font-bold ${color} tabular-nums`}>{val}</p>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-center text-muted-foreground">
        🔒 Données anonymisées · Aucune vente · Mis à jour toutes les 3 secondes · {stats.countries} pays connectés
      </p>
    </div>
  );
}