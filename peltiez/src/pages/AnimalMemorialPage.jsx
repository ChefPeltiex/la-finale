import { Link } from 'react-router-dom';
import AnimalGallery from '@/components/AnimalGallery';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

export default function AnimalMemorialPage() {
  return (
    <div className="pb-20 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Button asChild variant="ghost" className="rounded-xl -ml-2">
          <Link to="/sanctuary">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour au Sanctuaire
          </Link>
        </Button>

        <div className="space-y-3">
          <h1 className="font-display text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
            Galerie Éternelle
          </h1>
          <p className="text-muted-foreground text-lg">
            Un mémorial vivant pour honorer l'amour, la fidélité et la joie que nos compagnons nous ont donnés.
          </p>
        </div>
      </div>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden p-12 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(244,63,94,0.1), rgba(236,72,153,0.08))",
          border: "2px solid rgba(244,63,94,0.2)",
        }}>
        <div className="space-y-4">
          <span className="text-6xl">🕯️</span>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            « Bien qu'absent de nos yeux, vous demeurez à jamais présents dans nos cœurs. »
            <br />
            <span className="text-rose-300 text-sm mt-2 block">— Hommage aux âmes fidèles</span>
          </p>
        </div>
      </div>

      {/* Gallery Component */}
      <AnimalGallery />

      {/* Add Memorial CTA */}
      <div className="rounded-2xl border border-primary/30 p-8 bg-gradient-to-br from-primary/10 to-emerald-500/10 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Partager la Mémoire d'un Compagnon
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Vous avez un compagnon dont vous voulez honorer la mémoire ? Créez un mémorial pour qu'il vivre éternellement.
        </p>
        <Button asChild size="lg" className="rounded-xl gap-2 bg-primary hover:bg-primary/90">
          <Link to="/sanctuary">
            <Plus className="h-4 w-4" /> Créer un Mémorial
          </Link>
        </Button>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '❤️', title: 'Amour Inconditionnel', desc: 'Honorer leur loyauté infinie' },
          { icon: '🌈', title: 'Arc-en-ciel', desc: 'Croire au pont arc-en-ciel' },
          { icon: '✨', title: 'Immortalité', desc: 'Vivre pour toujours dans nos cœurs' },
        ].map((value, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 text-center space-y-2">
            <span className="text-3xl block">{value.icon}</span>
            <h3 className="font-semibold text-foreground">{value.title}</h3>
            <p className="text-xs text-muted-foreground">{value.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}