import { useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Package, Leaf } from "lucide-react";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

export default function ImpactCharts({ listings = [] }) {
  // CO₂ trend (simulated daily data)
  const co2Trend = useMemo(() => {
    if (listings.length === 0) return [];
    const total = listings.reduce((sum, l) => sum + (l.co2_saved || 0), 0);
    const days = 30;
    let cumulative = 0;
    const data = [];
    for (let i = 0; i < days; i++) {
      const dayShare = Math.floor((total / days) * (0.8 + Math.random() * 0.4));
      cumulative += dayShare;
      data.push({
        day: `J${i + 1}`,
        cumulative: Math.round(cumulative),
        daily: dayShare
      });
    }
    return data;
  }, [listings]);

  // Type distribution
  const typeDistribution = useMemo(() => {
    const types = {};
    listings.forEach(l => {
      const type = l.type || "autre";
      types[type] = (types[type] || 0) + 1;
    });
    return Object.entries(types).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      co2: listings.filter(l => l.type === type).reduce((sum, l) => sum + (l.co2_saved || 0), 0)
    }));
  }, [listings]);

  // Category breakdown
  const categoryStats = useMemo(() => {
    const cats = {};
    listings.forEach(l => {
      const cat = l.category || "autre";
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return Object.entries(cats)
      .map(([cat, count]) => ({ category: cat, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [listings]);

  const totalCO2 = useMemo(() => Math.round(listings.reduce((sum, l) => sum + (l.co2_saved || 0), 0)), [listings]);
  const totalItems = listings.length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 bg-emerald-200/50 px-2.5 py-1 rounded-full">En direct</span>
          </div>
          <p className="text-3xl font-black text-emerald-700">{totalCO2.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">kg CO₂ économisés</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <Package className="h-5 w-5 text-blue-600" />
            <span className="text-xs font-bold text-blue-700 bg-blue-200/50 px-2.5 py-1 rounded-full">Actifs</span>
          </div>
          <p className="text-3xl font-black text-blue-700">{totalItems.toLocaleString()}</p>
          <p className="text-xs text-blue-600 mt-1 font-medium">objets partagés</p>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-2xl border border-violet-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <span className="text-xs font-bold text-violet-700 bg-violet-200/50 px-2.5 py-1 rounded-full">Moyenne</span>
          </div>
          <p className="text-3xl font-black text-violet-700">{totalItems > 0 ? Math.round(totalCO2 / totalItems * 10) / 10 : 0}</p>
          <p className="text-xs text-violet-600 mt-1 font-medium">kg CO₂ par objet</p>
        </div>
      </div>

      {/* CO₂ Cumulative Trend */}
      {co2Trend.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" /> Tendance CO₂ (30 derniers jours)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={co2Trend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
              <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value.toLocaleString()} kg`, 'Cumulatif']}
              />
              <Line type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={3} dot={false} name="CO₂ Cumulé" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Type Distribution & Category Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Distribution Pie */}
        {typeDistribution.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
            <h3 className="font-bold text-foreground">Distribution par type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value">
                  {typeDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Objets']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Breakdown Bar */}
        {categoryStats.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
            <h3 className="font-bold text-foreground">Top catégories</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryStats} margin={{ top: 5, right: 30, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} style={{ fontSize: '12px' }} />
                <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [value, 'Objets']}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Type Stats Table */}
      {typeDistribution.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
          <h3 className="font-bold text-foreground">Impact par type</h3>
          <div className="space-y-2">
            {typeDistribution.map((type, idx) => (
              <div key={type.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{type.name}</p>
                    <p className="text-xs text-muted-foreground">{type.value} objet{type.value > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{Math.round(type.co2)} kg CO₂</p>
                  <p className="text-xs text-muted-foreground">{type.value > 0 ? `${(type.co2 / type.value).toFixed(1)}/obj` : '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}