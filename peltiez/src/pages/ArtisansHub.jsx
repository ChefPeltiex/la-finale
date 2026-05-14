import { useState } from "react";
import { Wrench, Clock, Droplets, Cpu, Leaf, Scissors, Zap, ChefHat, Paintbrush, Music, BookOpen, Home, Car, Camera, Heart, Scale, ArrowRight, Users, Star, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const METIERS = [
  { id: "plombier",      label: "Plombiers",         emoji: "🔧", icon: Droplets,  color: "from-blue-600 to-cyan-700",       desc: "Gestion devis, calendrier d'interventions, historique clients, facturation.", clients: 1243, note: 4.9 },
  { id: "horloger",      label: "Horlogers",          emoji: "⏱️", icon: Clock,     color: "from-amber-600 to-orange-700",    desc: "Suivi des montres en réparation, devis automatiques, galerie de réalisations.", clients: 412,  note: 5.0 },
  { id: "developpeur",   label: "Développeurs",       emoji: "💻", icon: Cpu,       color: "from-indigo-600 to-blue-700",     desc: "Portfolio projets, matching clients tech, gestion missions et freelance.", clients: 3891, note: 4.8 },
  { id: "agriculteur",   label: "Agriculteurs",       emoji: "🌾", icon: Leaf,      color: "from-green-600 to-emerald-700",   desc: "Vente directe, calendrier récoltes, AMAP, circuit court et troc semences.", clients: 2341, note: 4.9 },
  { id: "couturier",     label: "Couturiers",         emoji: "🧵", icon: Scissors,  color: "from-rose-600 to-pink-700",       desc: "Galerie créations, prises de mesures digitales, suivi commandes, upcycling.", clients: 876,  note: 4.7 },
  { id: "electricien",   label: "Électriciens",       emoji: "⚡", icon: Zap,       color: "from-yellow-600 to-amber-700",    desc: "Devis électrique en ligne, compliance codes, suivi interventions.", clients: 2109, note: 4.8 },
  { id: "cuisinier",     label: "Cuisiniers / Chefs", emoji: "👨‍🍳", icon: ChefHat,  color: "from-orange-600 to-red-700",      desc: "Menu du jour, vente traiteur, ateliers cuisine, zéro gaspillage alimentaire.", clients: 1654, note: 4.9 },
  { id: "peintre",       label: "Peintres & Artistes",emoji: "🎨", icon: Paintbrush,color: "from-violet-600 to-purple-700",   desc: "Portfolio NFT-free, commissions, ateliers, galerie virtuelle, vente œuvres.", clients: 2987, note: 4.8 },
  { id: "musicien",      label: "Musiciens",          emoji: "🎵", icon: Music,     color: "from-fuchsia-600 to-pink-700",    desc: "Réservation concerts, leçons en ligne, vente albums, collaborations.", clients: 1432, note: 4.7 },
  { id: "professeur",    label: "Professeurs / Tuteurs", emoji: "📚", icon: BookOpen, color: "from-teal-600 to-cyan-700",   desc: "Agenda cours, paiement en ligne, suivi élèves, ressources pédagogiques.", clients: 4231, note: 4.9 },
  { id: "constructeur",  label: "Constructeurs / Éco", emoji: "🏠", icon: Home,     color: "from-stone-600 to-amber-800",    desc: "Devis éco-construction, suivi chantier, matériaux biosourcés, certifications.", clients: 987,  note: 4.8 },
  { id: "mecanicien",    label: "Mécaniciens",        emoji: "🚗", icon: Car,       color: "from-slate-600 to-gray-700",      desc: "Diagnostic en ligne, devis pièces, historique véhicules, réparation équitable.", clients: 3210, note: 4.7 },
  { id: "photographe",   label: "Photographes",       emoji: "📷", icon: Camera,    color: "from-zinc-600 to-slate-700",      desc: "Booking sessions, galeries privées, vente tirages, collaborations marques.", clients: 2143, note: 4.9 },
  { id: "therapeute",    label: "Thérapeutes & Bien-être", emoji: "💆", icon: Heart, color: "from-rose-500 to-red-700",     desc: "Agenda consultations, suivi patients, ressources thérapeutiques, confidentialité.", clients: 1876, note: 5.0 },
  { id: "juriste",       label: "Juristes & Médiateurs", emoji: "⚖️", icon: Scale,  color: "from-gray-600 to-slate-700",     desc: "Consultations en ligne, contrats simplifiés, médiation citoyenne, tarifs équitables.", clients: 654,  note: 4.8 },
  { id: "jardinier",     label: "Jardiniers & Paysagistes", emoji: "🌿", icon: Leaf, color: "from-green-500 to-teal-700",  desc: "Planning entretien, vente plants, formation permaculture, éco-paysagisme.", clients: 1987, note: 4.9 },
  { id: "menuisier",     label: "Menuisiers & Ébénistes", emoji: "🪵", icon: Wrench, color: "from-amber-700 to-orange-800", desc: "Galerie meubles, devis personnalisés, bois locaux et recyclés, sur-mesure.", clients: 876,  note: 4.8 },
  { id: "soudeur",       label: "Soudeurs & Métallurgistes", emoji: "🔥", icon: Zap, color: "from-red-700 to-orange-800",  desc: "Projets métal, devis industriels, sculptures, réparations machines.", clients: 543,  note: 4.7 },
  { id: "infirmier",     label: "Infirmier·ères indépendant·es", emoji: "🩺", icon: Heart, color: "from-sky-600 to-blue-700", desc: "Soins à domicile, agenda patients, téléconsultation, ressources santé.", clients: 1234, note: 5.0 },
  { id: "traducteur",    label: "Traducteurs & Interprètes", emoji: "🌐", icon: BookOpen, color: "from-cyan-600 to-blue-700", desc: "Matching langues, devis par mot, gestion projets multilingues.", clients: 987,  note: 4.9 },
];

export default function ArtisansHub() {
  const [selected, setSelected] = useState(null);
  const [joined, setJoined] = useState(() => { try { return JSON.parse(localStorage.getItem("artisan_metiers") || "[]"); } catch { return []; } });

  const join = (id) => {
    if (joined.includes(id)) return;
    const updated = [...joined, id];
    setJoined(updated);
    localStorage.setItem("artisan_metiers", JSON.stringify(updated));
    toast.success("Établi virtuel activé ! +50 XP 🎉", { icon: "🔧" });
  };

  return (
    <div className="pb-20 space-y-10 max-w-6xl mx-auto px-4 pt-8">
      {/* Hero */}
      <div className="rounded-3xl p-10 text-center space-y-5 border border-border"
        style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(16,185,129,0.08))" }}>
        <div className="text-5xl">🔨</div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground">Réseau des Artisans</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          20 métiers. 20 établis virtuels. Gérez vos clients, devis et agenda — <strong className="text-foreground">sans payer Meta ni Google.</strong>
        </p>
        <div className="flex justify-center gap-8 text-sm">
          <div className="text-center"><p className="text-3xl font-black text-primary">{METIERS.length}</p><p className="text-muted-foreground text-xs">Métiers</p></div>
          <div className="text-center"><p className="text-3xl font-black text-amber-400">{METIERS.reduce((s,m) => s + m.clients, 0).toLocaleString("fr-CA")}</p><p className="text-muted-foreground text-xs">Artisans actifs</p></div>
          <div className="text-center"><p className="text-3xl font-black text-emerald-400">0$</p><p className="text-muted-foreground text-xs">Frais Meta</p></div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {METIERS.map(metier => {
          const isJoined = joined.includes(metier.id);
          const isSelected = selected === metier.id;
          return (
            <div key={metier.id} className="rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              onClick={() => setSelected(isSelected ? null : metier.id)}>
              <div className={`px-4 py-3 bg-gradient-to-br ${metier.color} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{metier.emoji}</span>
                  <p className="font-bold text-white text-sm">{metier.label}</p>
                </div>
                {isJoined && <CheckCircle className="h-4 w-4 text-white/80" />}
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" /> <span>{metier.clients.toLocaleString("fr-CA")} artisans</span>
                  <span className="ml-auto flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{metier.note}</span>
                </div>
                {isSelected && <p className="text-xs text-muted-foreground leading-relaxed">{metier.desc}</p>}
                <button onClick={(e) => { e.stopPropagation(); join(metier.id); }} disabled={isJoined}
                  className="w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] disabled:opacity-70"
                  style={{
                    background: isJoined ? "rgba(16,185,129,0.1)" : "hsl(var(--primary))",
                    color: isJoined ? "hsl(var(--primary))" : "white",
                    border: isJoined ? "1px solid hsl(var(--primary) / 0.3)" : "none"
                  }}>
                  <Wrench className="h-3 w-3" /> {isJoined ? "Établi actif ✓" : "Ouvrir mon établi"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 border border-amber-500/20 bg-amber-500/5">
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Votre métier n'est pas dans la liste ?</h2>
          <p className="text-muted-foreground text-sm">Proposez votre établi virtuel. Nous le créons avec vous en 48h.</p>
        </div>
        <button onClick={() => toast.success("Demande reçue ! Votre établi sera créé sous 48h. 🔨")}
          className="px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 flex-shrink-0 transition-all hover:scale-[1.02]"
          style={{ background: "hsl(var(--primary))" }}>
          <ArrowRight className="h-4 w-4" /> Demander mon métier
        </button>
      </div>
    </div>
  );
}