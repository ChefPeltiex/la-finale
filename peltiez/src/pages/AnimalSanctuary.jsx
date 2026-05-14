import { useState, useCallback } from "react";
import SEOMeta from "@/components/SEOMeta";
import { Heart, Image as ImageIcon, Send, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";

const ANIMALS = [
  { emoji: "🐘", name: "Éléphant", status: "Protégé", description: "Refuge de la savane africaine", photos: ["https://images.unsplash.com/photo-1564349637480-3e89a8cb0b78?w=500&h=400&fit=crop", "https://images.unsplash.com/photo-1567812735426-8f1eee8c9e89?w=500&h=400&fit=crop"] },
  { emoji: "🐯", name: "Tigre du Bengale", status: "En soins", description: "Espèce en danger critique - Programme de conservation", photos: ["https://images.unsplash.com/photo-1540573133985-87b6da594e23?w=500&h=400&fit=crop", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop"] },
  { emoji: "🦁", name: "Lion d'Afrique", status: "Prospère", description: "Roi de la savane en zone protégée", photos: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=400&fit=crop", "https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?w=500&h=400&fit=crop"] },
  { emoji: "🐼", name: "Panda géant", status: "Protégé", description: "Symbole de conservation mondiale", photos: ["https://images.unsplash.com/photo-1525382455947-f319bc05fb35?w=500&h=400&fit=crop"] },
  { emoji: "🦈", name: "Grand blanc", status: "Soigné", description: "Outil pédagogique pour l'océan", photos: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop"] },
  { emoji: "🦅", name: "Aigle royal", status: "En réhabilitation", description: "Oiseau charismatique de montagne", photos: ["https://images.unsplash.com/photo-1570988176057-31e9e6d68e4d?w=500&h=400&fit=crop"] },
];

function PhotoGallery({ animal, onClose }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = animal.photos || [];
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        {photos.length > 0 && (
          <>
            <img src={photos[photoIdx]} alt={animal.name} className="w-full h-auto rounded-xl" />
            {photos.length > 1 && (
              <>
                <button onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-all">
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <button onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-all">
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </>
            )}
          </>
        )}
        <button onClick={onClose} className="absolute -top-12 right-0 text-white font-bold hover:text-white/70">Fermer</button>
      </div>
    </div>
  );
}

export default function AnimalSanctuary() {
  const [saved, setSaved] = useState(localStorage.getItem("saved_animals")?.split(",") || []);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [supportForm, setSupportForm] = useState({ name: "", email: "", message: "", amount: "" });
  const [submitting, setSubmitting] = useState(false);

  const toggleSave = useCallback((name) => {
    const newSaved = saved.includes(name)
      ? saved.filter(n => n !== name)
      : [...saved, name];
    setSaved(newSaved);
    localStorage.setItem("saved_animals", newSaved.join(","));
  }, [saved]);

  const handleSupport = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: "sanctuary@egor69.ca",
        subject: `Soutien Sanctuary - ${supportForm.name}`,
        body: `Nom: ${supportForm.name}\nEmail: ${supportForm.email}\nMontant: $${supportForm.amount || 0}\n\nMessage:\n${supportForm.message}`
      });
      setSupportForm({ name: "", email: "", message: "", amount: "" });
      alert("✨ Merci pour votre soutien! Nous avons reçu votre contribution.");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "AnimalShelter",
    "name": "Egor69 Animal Sanctuary",
    "description": "Global sanctuary protecting endangered species. Support wildlife conservation projects."
  };

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title="Animal Sanctuary — Protégez la Vie Sauvage | Egor69"
        description="Sanctuaire global d'animaux en danger. Galerie photos, histoires de rédemption, et soutenez nos projets de conservation."
        keywords="sanctuaire, animaux, conservation, faune, espèces en danger, protection"
        canonicalUrl="https://egor69.ca/sanctuary"
        schemaData={seoSchema}
      />

      {/* Hero */}
      <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-300/30">
        <div className="text-6xl mb-3">🦁🐘🦅</div>
        <h1 className="font-display text-4xl font-bold text-foreground">Animal Sanctuary</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Protégez les créatures en danger. Chaque soutien sauve des vies.</p>
      </div>

      {/* Animals Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">🌍 Résidents du Sanctuaire</h2>
          <p className="text-sm text-muted-foreground mt-1">Découvrez les animaux que nous protégeons</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ANIMALS.map((animal) => {
            const isSaved = saved.includes(animal.name);
            return (
              <div key={animal.name} className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-emerald-300/50 transition-all hover:-translate-y-1">
                {/* Photo preview */}
                <div className="aspect-video bg-gradient-to-br from-emerald-400 to-emerald-600 relative overflow-hidden">
                  {animal.photos?.[0] ? (
                    <img src={animal.photos[0]} alt={animal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">{animal.emoji}</div>
                  )}
                  <button
                    onClick={() => setSelectedAnimal(animal)}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all group-hover:opacity-100 opacity-0">
                    <ImageIcon className="h-8 w-8 text-white" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-foreground">{animal.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{animal.description}</p>
                    </div>
                    <button
                      onClick={() => toggleSave(animal.name)}
                      className={`p-1.5 rounded-lg transition-all ${
                        isSaved
                          ? "bg-rose-100 text-rose-600"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}>
                      <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <Badge className={
                    animal.status === "Protégé" ? "bg-emerald-100 text-emerald-700 border-0" :
                    animal.status === "En soins" ? "bg-amber-100 text-amber-700 border-0" :
                    animal.status === "En réhabilitation" ? "bg-blue-100 text-blue-700 border-0" :
                    "bg-purple-100 text-purple-700 border-0"
                  }>{animal.status}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Support Form */}
      <section className="rounded-3xl p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">💚 Soutenir nos projets</h2>
          <p className="text-muted-foreground mb-6">Votre contribution finance directement la nourriture, les soins vétérinaires et la protection des habitats.</p>

          <form onSubmit={handleSupport} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Votre nom"
                value={supportForm.name}
                onChange={e => setSupportForm({ ...supportForm, name: e.target.value })}
                className="rounded-xl h-11"
                required
              />
              <Input
                placeholder="Email"
                type="email"
                value={supportForm.email}
                onChange={e => setSupportForm({ ...supportForm, email: e.target.value })}
                className="rounded-xl h-11"
                required
              />
            </div>

            <Input
              placeholder="Montant à supporter (CAD, optionnel)"
              type="number"
              min="0"
              step="0.01"
              value={supportForm.amount}
              onChange={e => setSupportForm({ ...supportForm, amount: e.target.value })}
              className="rounded-xl h-11"
            />

            <Textarea
              placeholder="Votre message (quel animal vous inspire? Pourquoi cette cause?)..."
              value={supportForm.message}
              onChange={e => setSupportForm({ ...supportForm, message: e.target.value })}
              className="rounded-xl min-h-[100px]"
              required
            />

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 border-0">
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours...</>
              ) : (
                <><Send className="h-4 w-4" /> Soutenir le sanctuaire</>
              )}
            </Button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-300 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{ANIMALS.length}</p>
          <p className="text-xs text-emerald-700 mt-1 font-bold">Espèces protégées</p>
        </div>
        <div className="bg-blue-50 rounded-2xl border-2 border-blue-300 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{saved.length}</p>
          <p className="text-xs text-blue-700 mt-1 font-bold">Animaux sauvegardés</p>
        </div>
        <div className="bg-purple-50 rounded-2xl border-2 border-purple-300 p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">6</p>
          <p className="text-xs text-purple-700 mt-1 font-bold">Continents</p>
        </div>
        <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">∞</p>
          <p className="text-xs text-amber-700 mt-1 font-bold">Impact perpétuel</p>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {selectedAnimal && (
        <PhotoGallery animal={selectedAnimal} onClose={() => setSelectedAnimal(null)} />
      )}
    </div>
  );
}