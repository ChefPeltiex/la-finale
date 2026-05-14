import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  setDate,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { parseApiDate } from '@/lib/dateUtils';

export default function DonationCalendar() {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));

  const { data: donations = [] } = useQuery({
    queryKey: ['donations-calendar'],
    queryFn: () => base44.entities.Listing.filter(
      { type: 'don', status: 'actif' },
      '-created_date',
      1000
    ),
    staleTime: 30_000,
  });

  const { data: ecoProfiles = [] } = useQuery({
    queryKey: ['eco-profiles-calendar'],
    queryFn: () => base44.entities.EcoProfile.list('-total_donations', 100),
    staleTime: 60_000,
  });

  const donationsByDate = useMemo(() => {
    const map = {};
    donations.forEach(d => {
      const created = parseApiDate(d.created_date);
      if (!created) return;
      const date = format(created, 'yyyy-MM-dd');
      map[date] = (map[date] || 0) + 1;
    });
    return map;
  }, [donations]);

  const monthStart = startOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = getDay(monthStart);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const topDonators = useMemo(() => {
    return ecoProfiles
      .filter(p => p.total_donations > 0)
      .sort((a, b) => b.total_donations - a.total_donations)
      .slice(0, 5);
  }, [ecoProfiles]);

  const stats = useMemo(() => ({
    totalDons: donations.length,
    uniqueDonators: new Set(donations.map(d => d.created_by)).size,
    thisMonth: Object.values(donationsByDate).reduce((a, b) => a + b, 0),
  }), [donations, donationsByDate]);

  return (
    <div className="pb-20 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Gift className="h-6 w-6 text-emerald-600" />
          <h1 className="font-display text-3xl font-bold text-foreground">Calendrier des Dons</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.totalDons}</p>
            <p className="text-xs text-muted-foreground mt-1">Dons totaux</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.uniqueDonators}</p>
            <p className="text-xs text-muted-foreground mt-1">Donateurs uniques</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.thisMonth}</p>
            <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-foreground">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-8 w-8 p-0"
                onClick={() => setCurrentMonth((m) => startOfMonth(subMonths(m, 1)))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-8 w-8 p-0"
                onClick={() => setCurrentMonth((m) => startOfMonth(addMonths(m, 1)))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const date = format(setDate(monthStart, day), 'yyyy-MM-dd');
              const donCount = donationsByDate[date] || 0;
              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg p-1 text-center text-xs font-medium transition-all ${
                    donCount > 0
                      ? 'bg-emerald-100 border border-emerald-300 text-emerald-700 hover:shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <div className="font-semibold">{day}</div>
                  {donCount > 0 && <div className="text-[10px]">+{donCount}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Donators */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Top Donateurs</h3>
          </div>
          <div className="space-y-3">
            {topDonators.map((profile, i) => (
              <div key={profile.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 flex-1">
                  <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold">
                    #{i + 1}
                  </Badge>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {profile.display_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{profile.city || 'Global'}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-emerald-600">{profile.total_donations}</p>
                  <p className="text-[10px] text-muted-foreground">dons</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6 text-center">
          <Gift className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Rejoins le mouvement des donateurs</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Partage un objet gratuitement et crée de l'impact immédiat.
          </p>
          <Button asChild className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link to="/publier?type=don">✨ Faire un don maintenant</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}