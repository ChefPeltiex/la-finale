import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, DollarSign, Leaf, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { parseApiDate } from '@/lib/dateUtils';

export default function MonthlyReports() {
  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['my-vault-listings', currentUser?.email],
    queryFn: () =>
      currentUser?.email
        ? base44.entities.Listing.filter({ created_by: currentUser.email }, '-created_date', 10000)
        : [],
    enabled: !!currentUser?.email,
  });

  const monthlyData = useMemo(() => {
    const months = {};
    
    listings.forEach(listing => {
      const created = parseApiDate(listing.created_date);
      if (!created) return;
      const monthKey = format(created, 'yyyy-MM');
      if (!months[monthKey]) {
        months[monthKey] = {
          monthKey,
          month: format(created, 'MMM yyyy', { locale: fr }),
          revenue: 0,
          sold: 0,
          co2: 0,
          dons: 0,
          repairs: 0,
          exchanges: 0,
        };
      }
      
      if (listing.type === 'vente' && listing.status === 'vendu') {
        months[monthKey].revenue += listing.price || 0;
        months[monthKey].sold += 1;
      }
      if (listing.type === 'don') months[monthKey].dons += 1;
      if (listing.type === 'réparation') months[monthKey].repairs += 1;
      if (listing.type === 'échange') months[monthKey].exchanges += 1;
      months[monthKey].co2 += listing.co2_saved || 0;
    });

    return Object.values(months).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [listings]);

  const typeDistribution = useMemo(() => {
    const types = {};
    listings.forEach(l => {
      types[l.type] = (types[l.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [listings]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  const currentMonth = monthlyData[monthlyData.length - 1] || {};
  const previousMonth = monthlyData[monthlyData.length - 2] || {};

  const revenueGrowth = previousMonth.revenue > 0
    ? Math.round(((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100)
    : 0;

  if (!currentUser) return null;

  return (
    <div className="pb-20 space-y-8">
      {/* Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-4">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground">Rapports Mensuels</h1>
        <p className="text-sm text-muted-foreground mt-1">Suivi complet de votre activité et impact</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Revenu ce mois', value: `$${currentMonth.revenue?.toFixed(2) || 0}`, color: 'from-blue-500/20 to-cyan-500/20', growth: revenueGrowth },
          { icon: TrendingUp, label: 'Annonces vendues', value: currentMonth.sold || 0, color: 'from-emerald-500/20 to-teal-500/20' },
          { icon: Leaf, label: 'kg CO₂ économisés', value: Math.round(currentMonth.co2 || 0), color: 'from-green-500/20 to-emerald-600/20' },
          { icon: Calendar, label: 'Actions totales', value: (currentMonth.sold || 0) + (currentMonth.dons || 0) + (currentMonth.repairs || 0), color: 'from-purple-500/20 to-pink-500/20' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`rounded-2xl p-5 bg-gradient-to-br ${kpi.color} border border-white/10`}>
              <div className="flex items-center gap-3 mb-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{kpi.label}</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
              {kpi.growth !== undefined && (
                <p className={`text-xs mt-1 ${kpi.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {kpi.growth >= 0 ? '↑' : '↓'} {Math.abs(kpi.growth)}% vs mois dernier
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Revenue Trend */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" /> Revenus mensuels
        </h2>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenu ($)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground py-12">Aucune donnée disponible</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Distribution */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-4">Distribution des activités</h2>
          {typeDistribution.length > 0 ? (
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
                  dataKey="value"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-12">Aucune donnée</p>
          )}
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Détails mensuels
          </h2>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {monthlyData.slice(-6).reverse().map((month, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{month.month}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {month.dons + month.repairs + month.exchanges} actions · ${month.revenue.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{month.sold} ventes</p>
                  <p className="text-xs text-muted-foreground">{Math.round(month.co2)} kg CO₂</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Annual Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl border border-primary/30 p-8 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Résumé annuel</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Revenu total', value: `$${listings.filter(l => l.status === 'vendu').reduce((s, l) => s + (l.price || 0), 0).toFixed(2)}` },
            { label: 'CO₂ sauvé', value: `${Math.round(listings.reduce((s, l) => s + (l.co2_saved || 0), 0))} kg` },
            { label: 'Objets sauvés', value: listings.length },
            { label: 'Impact mensuel', value: monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].month : 'N/A' },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => window.sendCirculAINotification?.('Rapport mensuel téléchargé! 📊', { body: 'Vérifiez votre dossier de téléchargement.' })}
          className="gap-2 rounded-xl"
        >
          <Download className="h-4 w-4" /> Télécharger le rapport complet
        </Button>
      </div>
    </div>
  );
}