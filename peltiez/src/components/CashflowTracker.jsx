import { useMemo } from "react";
import { TrendingUp, Leaf, DollarSign, Recycle, Wrench, Gift } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const CO2_VALUE_PER_KG = 0.18; // CAD per kg CO2 avoided (carbon credit estimate)
const AVG_REPAIR_SAVING = 65; // CAD saved per repair vs buying new
const AVG_DONATION_VALUE = 35; // CAD value of items donated
const AVG_EXCHANGE_VALUE = 55; // CAD value of exchanges

export default function CashflowTracker({ listings = [] }) {
  const stats = useMemo(() => {
    const sold = listings.filter(l => l.status === "vendu" || l.type === "vente");
    const donated = listings.filter(l => l.type === "don");
    const repaired = listings.filter(l => l.type === "réparation");
    const exchanged = listings.filter(l => l.type === "échange");
    const totalCO2 = listings.reduce((s, l) => s + (l.co2_saved || 0), 0);

    const directRevenue = sold.reduce((s, l) => s + (l.price || 0), 0);
    const repairSavings = repaired.length * AVG_REPAIR_SAVING;
    const donationValue = donated.length * AVG_DONATION_VALUE;
    const exchangeValue = exchanged.length * AVG_EXCHANGE_VALUE;
    const co2Value = Math.round(totalCO2 * CO2_VALUE_PER_KG * 100) / 100;
    const total = directRevenue + repairSavings + donationValue + exchangeValue + co2Value;

    return { directRevenue, repairSavings, donationValue, exchangeValue, co2Value, total, totalCO2: Math.round(totalCO2) };
  }, [listings]);

  const rows = [
    { Icon: DollarSign, label: "Revenus directs (ventes)", value: stats.directRevenue, color: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
    { Icon: Wrench,     label: "Économies réparations",    value: stats.repairSavings,  color: "text-amber-400",   bg: "rgba(245,158,11,0.1)" },
    { Icon: Gift,       label: "Valeur des dons",          value: stats.donationValue,  color: "text-pink-400",    bg: "rgba(244,114,182,0.1)" },
    { Icon: Recycle,    label: "Valeur des échanges",      value: stats.exchangeValue,  color: "text-violet-400",  bg: "rgba(139,92,246,0.1)" },
    { Icon: Leaf,       label: `Crédits CO₂ (${stats.totalCO2} kg)`, value: stats.co2Value, color: "text-teal-400", bg: "rgba(20,184,166,0.1)" },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-border"
      style={{ background: "linear-gradient(135deg, rgba(5,10,25,0.6), rgba(5,20,12,0.6))" }}>
      
      <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <TrendingUp className="h-5 w-5 text-emerald-400" />
        <div>
          <p className="font-bold text-white text-sm">💰 CASHFLOW CIRCULAIRE</p>
          <p className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
            Valeur économique totale générée par vos actions circulaires
          </p>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {rows.map(({ Icon, label, value, color, bg }) => (
          <div key={label} className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: bg }}>
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-xs text-white/70">{label}</span>
            </div>
            <span className={`font-bold text-sm font-mono ${color}`}>
              <AnimatedCounter target={Math.round(value)} prefix="$" suffix=" CAD" />
            </span>
          </div>
        ))}

        {/* Total */}
        <div className="mt-4 p-4 rounded-xl flex items-center justify-between"
          style={{ background: "rgba(255,215,0,0.1)", border: "2px solid rgba(255,215,0,0.4)" }}>
          <span className="font-mono font-bold text-white text-sm">💎 IMPACT ÉCONOMIQUE TOTAL</span>
          <span className="font-black text-xl font-mono" style={{ color: "#FFD700" }}>
            <AnimatedCounter target={Math.round(stats.total)} prefix="$" suffix=" CAD" />
          </span>
        </div>

        <p className="text-center text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
          * Estimation basée sur données CirculAI Hub + valeur carbone à 0,18$/kg CO₂
        </p>
      </div>
    </div>
  );
}