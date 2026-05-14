import { useState } from "react";
import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import ArtisanInteractiveMap from "@/components/ArtisanInteractiveMap";
import { MapPin, Navigation, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function LocalMap() {
  const [radius, setRadius] = useState(25);

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Carte Interactive — Ateliers & Zones de Don Locales",
    "description": "Trouvez les ateliers artisanaux et zones de don autour de vous. Réparation, partage, économie circulaire locale."
  };

  return (
    <div className="pb-20 space-y-8 max-w-4xl mx-auto px-4 pt-6">
      <SEOMeta
        title="Carte Interactive — Ateliers & Zones de Don Locales | CirculAI Hub"
        description="Localisez les ateliers artisanaux, zones de réparation et dons près de chez vous. Économie circulaire locale, petits artisans, troc et partage."
        keywords="carte interactive, ateliers artisanaux, réparation, zones de don, économie locale, commerce local, partage d'objets, communauté"
        canonicalUrl="https://egor69.ca/local-map"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg, #10b981, #0891b2)" }}>
          <Navigation className="h-3.5 w-3.5" /> Géolocalisation
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">
          Découvre ta communauté locale
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Trouve les ateliers artisanaux, zones de don et points de partage autour de toi. Économie circulaire à portée de main.
        </p>
      </div>

      {/* Contrôle du rayon */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div>
          <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Rayon de recherche : <span className="text-emerald-600 font-black">{radius}km</span>
          </label>
          <Slider
            min={5}
            max={50}
            step={5}
            value={[radius]}
            onValueChange={([val]) => setRadius(val)}
            className="w-full"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {radius <= 10 && "Très proche — quartier uniquement"}
          {radius > 10 && radius <= 20 && "Zone locale — votre agglomération"}
          {radius > 20 && "Zone élargie — région complète"}
        </p>
      </div>

      {/* Carte Interactive */}
      <ArtisanInteractiveMap radius={radius} />

      {/* Conseils */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "🔨", title: "Ateliers Artisanaux", desc: "Réparez vos objets avec des experts locaux" },
          { icon: "🎁", title: "Zones de Don", desc: "Trouvez des dons à proximité ou offrez le vôtre" },
          { icon: "👥", title: "Communauté", desc: "Connectez-vous avec des gens qui partagent vos valeurs" },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-card rounded-2xl border border-border p-4 text-center">
            <div className="text-4xl mb-2">{icon}</div>
            <h3 className="font-bold text-foreground mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-3xl overflow-hidden p-8 sm:p-12 text-center"
        style={{ background: "linear-gradient(135deg, hsl(158,60%,12%), hsl(220,50%,10%))" }}>
        <Zap className="h-12 w-12 text-amber-400 mx-auto mb-4 float-slow" />
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
          Impacte localement, résonne globalement
        </h2>
        <p className="text-white/60 mb-6 max-w-xl mx-auto">
          Chaque connexion locale crée des ondes positives. Repair, share, thrive.
        </p>
        <Button asChild size="lg" className="rounded-xl font-bold border-0"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
          <Link to="/marketplace">Voir le Marketplace</Link>
        </Button>
      </div>
    </div>
  );
}