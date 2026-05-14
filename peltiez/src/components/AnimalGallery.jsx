import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Heart, Sparkles, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { parseApiDate } from '@/lib/dateUtils';

const SPECIES_EMOJI = {
  chat: '🐱',
  chien: '🐶',
  oiseau: '🦅',
  lapin: '🐰',
  tortue: '🐢',
  poisson: '🐠',
  hamster: '🐹',
  autre: '🐾',
};

function AnimalCard({ memorial, onSelect }) {
  return (
    <div
      onClick={() => onSelect(memorial)}
      className="group cursor-pointer rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 bg-card"
    >
      {memorial.photo_url ? (
        <img
          src={memorial.photo_url}
          alt={memorial.animal_name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center text-6xl">
          {SPECIES_EMOJI[memorial.species] || '🐾'}
        </div>
      )}

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{SPECIES_EMOJI[memorial.species] || '🐾'}</span>
          <div>
            <h3 className="font-bold text-foreground">{memorial.animal_name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{memorial.species}</p>
          </div>
        </div>

        {memorial.memorial_date &&
          (() => {
            const d = parseApiDate(memorial.memorial_date);
            return d ? (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(d, "MMM yyyy", { locale: fr })}
              </p>
            ) : null;
          })()}

        <p className="text-sm text-foreground/70 line-clamp-2 italic">{memorial.story}</p>

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          <span className="text-xs text-muted-foreground">{memorial.tribute_count || 0} hommages</span>
        </div>
      </div>
    </div>
  );
}

function MemorialDetail({ memorial, onClose, onTribute }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          ✕
        </button>

        {/* Photo */}
        {memorial.photo_url && (
          <img
            src={memorial.photo_url}
            alt={memorial.animal_name}
            className="w-full h-64 object-cover rounded-xl"
          />
        )}

        {/* Name & Dates */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-4xl">{SPECIES_EMOJI[memorial.species]}</span>
            <h2 className="font-display text-3xl font-bold text-foreground">{memorial.animal_name}</h2>
          </div>

          {memorial.birth_date && memorial.memorial_date && (() => {
            const b = parseApiDate(memorial.birth_date);
            const m = parseApiDate(memorial.memorial_date);
            return b && m ? (
              <p className="text-sm text-muted-foreground">
                {format(b, "dd MMM yyyy", { locale: fr })} — {format(m, "dd MMM yyyy", { locale: fr })}
              </p>
            ) : null;
          })()}
        </div>

        {/* Story */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Son Histoire
          </h3>
          <p className="text-foreground/80 leading-relaxed">{memorial.story}</p>
        </div>

        {/* Memories */}
        {memorial.memories && memorial.memories.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" /> Moments Mémorables
            </h3>
            <ul className="space-y-2">
              {memorial.memories.map((memory, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                  <span className="text-primary mt-1">•</span>
                  <span>{memory}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Legacy */}
        {memorial.legacy && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-emerald-600">Son Héritage</h3>
            <p className="text-foreground/80">{memorial.legacy}</p>
          </div>
        )}

        {/* Tribute Button */}
        <Button
          onClick={() => onTribute(memorial.id)}
          className="w-full rounded-xl gap-2 bg-red-500 hover:bg-red-600 text-white"
        >
          <Heart className="h-4 w-4 fill-white" /> Rendre Hommage
        </Button>

        {/* Tribute Count */}
        <div className="text-center text-sm text-muted-foreground">
          {memorial.tribute_count || 0} personnes ont rendu hommage
        </div>
      </div>
    </div>
  );
}

export default function AnimalGallery() {
  const [selectedMemorial, setSelectedMemorial] = useState(null);

  const { data: memorials = [] } = useQuery({
    queryKey: ['animal-memorials'],
    queryFn: () => base44.entities.AnimalMemorial.list('-memorial_date', 100),
    staleTime: 30_000,
  });

  const handleTribute = async (memorialId) => {
    try {
      const memorial = memorials.find(m => m.id === memorialId);
      await base44.entities.AnimalMemorial.update(memorialId, {
        tribute_count: (memorial.tribute_count || 0) + 1,
      });
      setSelectedMemorial({ ...memorial, tribute_count: (memorial.tribute_count || 0) + 1 });
    } catch (error) {
      console.error('Erreur hommage:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl font-bold text-foreground">
          🌈 Galerie des Compagnons Éternels
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Chaque compagnon a marqué nos vies. Leurs histoires vivent à jamais ici.
        </p>
      </div>

      {/* Gallery Grid */}
      {memorials.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
          <span className="text-4xl mb-3 block">🐾</span>
          <p className="text-muted-foreground">Aucun compagnon mémorisé encore.</p>
          <p className="text-xs text-muted-foreground mt-2">Les histoires de vos compagnons bien-aimés apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {memorials.map((memorial) => (
            <AnimalCard
              key={memorial.id}
              memorial={memorial}
              onSelect={() => setSelectedMemorial(memorial)}
            />
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selectedMemorial && (
        <MemorialDetail
          memorial={selectedMemorial}
          onClose={() => setSelectedMemorial(null)}
          onTribute={handleTribute}
        />
      )}

      {/* Message */}
      <div className="rounded-2xl border border-rose-300/30 bg-rose-500/5 p-6 text-center space-y-2">
        <p className="text-sm text-rose-600 font-semibold">💝 UN ESPACE SACRÉ</p>
        <p className="text-foreground/80">
          Ce sanctuaire honore la mémoire de tous les compagnons qui nous ont aimés sans condition.
          <br />
          Leurs légendes ne s'effaceront jamais.
        </p>
      </div>
    </div>
  );
}