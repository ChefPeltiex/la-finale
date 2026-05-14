import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Save, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AVATAR_LOCAL_PROFILE_EMAIL } from '@/lib/igorProfileEmail';

export { AVATAR_LOCAL_PROFILE_EMAIL };

const ACCESSORIES = [
  // Head
  { id: "crown_omega", name: "Couronne Ω", slot: "head", rarity: "legendary", emoji: "👑", desc: "Sceau royal de la singularité" },
  { id: "halo_prism", name: "Halo Prismatique", slot: "head", rarity: "epic", emoji: "🪽", desc: "Aura céleste à spectre complet" },
  { id: "hood_void", name: "Capuche du Vide", slot: "head", rarity: "rare", emoji: "🧥", desc: "Silence cosmique, présence absolue" },

  // Face
  { id: "glasses_quantum", name: "Lunettes Quantiques", slot: "face", rarity: "rare", emoji: "🕶️", desc: "Voir les probabilités avant qu'elles arrivent" },
  { id: "mask_ritual", name: "Masque Rituel", slot: "face", rarity: "epic", emoji: "🎭", desc: "Identité mythique, signature inviolable" },

  // Back
  { id: "cape_aurora", name: "Cape Aurora", slot: "back", rarity: "epic", emoji: "🦸", desc: "Traînée boréale en mouvement" },
  { id: "wings_stellar", name: "Ailes Stellaires", slot: "back", rarity: "legendary", emoji: "🪽", desc: "Portance divine, vitesse lumière" },

  // Aura
  { id: "aura_emerald", name: "Aura Émeraude", slot: "aura", rarity: "common", emoji: "🟢", desc: "Soin, croissance, souveraineté" },
  { id: "aura_golden", name: "Aura Dorée", slot: "aura", rarity: "rare", emoji: "🟡", desc: "Abondance continue" },
  { id: "aura_nebula", name: "Aura Nébuleuse", slot: "aura", rarity: "epic", emoji: "🌌", desc: "Brouillard cosmique vivant" },

  // Companion
  { id: "pet_phoenix", name: "Familier Phoenix", slot: "companion", rarity: "legendary", emoji: "🦅", desc: "Renaissance infinie" },
  { id: "pet_orb", name: "Orbe Sentinelle", slot: "companion", rarity: "rare", emoji: "🧿", desc: "Protège et observe" },
  { id: "pet_fox", name: "Renard Astral", slot: "companion", rarity: "epic", emoji: "🦊", desc: "Ruse lumineuse" },

  // FX
  { id: "fx_stardust", name: "Traînée Stardust", slot: "fx", rarity: "common", emoji: "✨", desc: "Poussière d'étoiles" },
  { id: "fx_lightning", name: "Foudre Fine", slot: "fx", rarity: "rare", emoji: "⚡", desc: "Étincelles d'impact" },
  { id: "fx_supernova", name: "Supernova", slot: "fx", rarity: "legendary", emoji: "💥", desc: "Explosion contrôlée (cinématique)" },

  // Badges
  { id: "badge_founder", name: "Badge Fondateur", slot: "badge", rarity: "legendary", emoji: "🏅", desc: "Marque des premiers" },
  { id: "badge_verified", name: "Badge Vérifié", slot: "badge", rarity: "rare", emoji: "✅", desc: "Signature authentifiée" },
];

const RARITY_STYLE = {
  common:   { bg: "bg-muted", text: "text-muted-foreground", ring: "ring-white/5" },
  rare:     { bg: "bg-blue-500/10", text: "text-blue-300", ring: "ring-blue-400/30" },
  epic:     { bg: "bg-violet-500/10", text: "text-violet-300", ring: "ring-violet-400/30" },
  legendary:{ bg: "bg-amber-500/10", text: "text-amber-300", ring: "ring-amber-400/35" },
};

// IMAGES RÉELLES LIBRES - Unsplash, Pixabay, ESA
const MYTHOLOGY_GALLERIES = {
  olympe: {
    name: "OLYMPE - Les Dieux Grecs",
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop", // Statue divine
      "https://images.unsplash.com/photo-1572365992253-3cb3e56dd362?w=600&h=400&fit=crop", // Lumière dorée
      "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=600&h=400&fit=crop", // Ciel étoilé
      "https://images.unsplash.com/photo-1569163139394-de4798aa62b2?w=600&h=400&fit=crop", // Architecture ancienne
    ],
    colors: ["#FFD700", "#FFA500", "#FFDAB9", "#FF8C00"],
    archetypes: [
      { name: "Zeus", desc: "Roi des dieux - Foudre & Ciel", power: 10 },
      { name: "Athena", desc: "Sagesse & Stratégie", power: 9 },
      { name: "Aphrodite", desc: "Amour & Beauté", power: 8 },
      { name: "Ares", desc: "Guerre & Puissance", power: 10 },
      { name: "Hades", desc: "Roi des Abysses", power: 10 },
      { name: "Poseidon", desc: "Seigneur des Mers", power: 10 },
    ]
  },
  abysse: {
    name: "ABYSSE - Les Monstres Cosmiques",
    images: [
      "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=600&h=400&fit=crop", // Océan sombre
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop", // Profondeurs
      "https://images.unsplash.com/photo-1462332420958-a05d1e7413ab?w=600&h=400&fit=crop", // Vague sombre
      "https://images.unsplash.com/photo-1534080564697-d2a84e47ac35?w=600&h=400&fit=crop", // Créature marine
    ],
    colors: ["#1a1a2e", "#16213e", "#0f3460", "#533483"],
    archetypes: [
      { name: "Kraken", desc: "Dieu des Mers Infernales", power: 10 },
      { name: "Leviathan", desc: "Bête Cosmique", power: 10 },
      { name: "Médusa", desc: "Gorgone Maudite", power: 9 },
      { name: "Chimère", desc: "Créature Hybride", power: 8 },
      { name: "Hydra", desc: "Serpent aux Mille Têtes", power: 10 },
    ]
  },
  celestial: {
    name: "CELESTIAL - Les Anges Divins",
    images: [
      "https://images.unsplash.com/photo-1444927714806-8a9009e6d569?w=600&h=400&fit=crop", // Ciel infini
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop", // Lumière céleste
      "https://images.unsplash.com/photo-1462332420958-a05d1e7413ab?w=600&h=400&fit=crop", // Aurore
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop", // Étoiles
    ],
    colors: ["#00CED1", "#87CEEB", "#E0FFFF", "#B0E0E6"],
    archetypes: [
      { name: "Archange Michael", desc: "Guerrier Céleste", power: 10 },
      { name: "Gabriel", desc: "Messager Divin", power: 9 },
      { name: "Uriel", desc: "Feu de Dieu", power: 10 },
      { name: "Raphael", desc: "Guérisseur Sacré", power: 9 },
      { name: "Samael", desc: "Sévérité Cosmique", power: 10 },
    ]
  },
  elementaire: {
    name: "ELEMENTAIRE - Esprits des 5 Éléments",
    images: [
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&h=400&fit=crop", // Feu
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=400&fit=crop", // Eau
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop", // Air
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop", // Terre
    ],
    colors: ["#FF4500", "#1E90FF", "#228B22", "#DAA520"],
    archetypes: [
      { name: "Phoenix", desc: "Reincarnation du Feu", power: 10 },
      { name: "Triton", desc: "Seigneur des Mers", power: 9 },
      { name: "Zephyr", desc: "Vent Éternel", power: 8 },
      { name: "Gaia", desc: "Mère Terre", power: 10 },
      { name: "Tempête", desc: "Chaos Élémentaire", power: 9 },
    ]
  },
  cyberpunk: {
    name: "CYBERPUNK - Entités Numériques",
    images: [
      "https://images.unsplash.com/photo-1526374965328-7f5ae4e8a0c5?w=600&h=400&fit=crop", // Tech
      "https://images.unsplash.com/photo-1518932506881-b72b27e84530?w=600&h=400&fit=crop", // Code
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop", // Numérique
      "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=600&h=400&fit=crop", // Futur
    ],
    colors: ["#00FF00", "#00FFFF", "#FF00FF", "#FFFF00"],
    archetypes: [
      { name: "Neo-Divinity", desc: "IA Transcendante", power: 10 },
      { name: "Chrome Angel", desc: "Cyborg Céleste", power: 9 },
      { name: "Quantum Ghost", desc: "Fantôme Numérique", power: 10 },
      { name: "Zero", desc: "Hackeur Cosmique", power: 8 },
    ]
  },
  quantique: {
    name: "QUANTIQUE - Entités Paradoxales",
    images: [
      "https://images.unsplash.com/photo-1458611846045-b17f6e27da39?w=600&h=400&fit=crop", // Particules
      "https://images.unsplash.com/photo-1492664313050-cb280141a980?w=600&h=400&fit=crop", // Abstrait
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop", // Supernova
      "https://images.unsplash.com/photo-1502470876313-52581002a659?w=600&h=400&fit=crop", // Univers
    ],
    colors: ["#9D00FF", "#00DDFF", "#FF00AA", "#FFDD00"],
    archetypes: [
      { name: "Schrödinger", desc: "Demiurge Paradoxal", power: 10 },
      { name: "Entanglement", desc: "Conscience Liée", power: 10 },
      { name: "Wave-Particle", desc: "Dualité Absolue", power: 9 },
    ]
  },
  eternel: {
    name: "ETERNEL - L'Être Suprême",
    images: [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop", // Infini
      "https://images.unsplash.com/photo-1462332420958-a05d1e7413ab?w=600&h=400&fit=crop", // Au-delà
      "https://images.unsplash.com/photo-1502470876313-52581002a659?w=600&h=400&fit=crop", // Cosmique
      "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=600&h=400&fit=crop", // Absolu
    ],
    colors: ["#FFD700", "#FFFFFF", "#FF00FF", "#00FFFF"],
    archetypes: [
      { name: "Logos", desc: "Verbe Primordial", power: 10 },
      { name: "Absolute Self", desc: "Conscience Pure", power: 10 },
      { name: "Infinite One", desc: "Tout et Rien", power: 10 },
    ]
  },
};

export default function AvatarStudio({ onSave }) {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    avatar_name: '',
    avatar_type: 'humain',
    universe: 'olympe',
    base_colors: { primary: '#FFD700', secondary: '#FFA500', accent: '#FFDAB9', glow: '#FF8C00' },
    physical_traits: { eyes: 'Eyes of Gold', skin: 'Divine Light', hair: 'Flowing Starlight', aura: 'Golden Radiance', wings: false, horns: false, tail: false },
    power_essence: { element: 'lumiere', power_level: 5, cosmic_frequency: 432 },
    artifacts: [],
    animations: { idle_animation: 'float', interaction_animation: 'burst', animation_speed: 1 },
    lore: '',
    cosmicity_score: 50,
    is_active: true,
    is_public: false,
    marketplace_price: 0,
  });

  const [selectedUniverse, setSelectedUniverse] = useState('olympe');
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [accQuery, setAccQuery] = useState("");
  const [accSlot, setAccSlot] = useState("all");

  const profileEmail = user?.email || AVATAR_LOCAL_PROFILE_EMAIL;

  const createMutation = useMutation({
    mutationFn: async () => {
      return base44.entities.AvatarCustomizer.create({
        ...formData,
        user_email: profileEmail,
      });
    },
    onSuccess: () => {
      toast.success(user ? 'Avatar créé — synchronisé avec ton profil.' : 'Avatar enregistré localement. Connecte un compte pour synchro & marketplace.');
      queryClient.invalidateQueries({ queryKey: ['my-avatars'] });
      onSave?.();
    },
    onError: (err) => {
      toast.error(`Erreur: ${err.message}`);
    },
  });

  const applyArchetype = (arch) => {
    setSelectedArchetype(arch.name);
    setFormData(prev => ({
      ...prev,
      avatar_name: arch.name,
      power_essence: { ...prev.power_essence, power_level: arch.power },
      physical_traits: { ...prev.physical_traits, aura: `Aura of ${arch.name}` },
    }));
  };

  const updateColors = (colorPalette) => {
    setFormData(prev => ({
      ...prev,
      base_colors: {
        primary: colorPalette[0],
        secondary: colorPalette[1],
        accent: colorPalette[2],
        glow: colorPalette[3],
      }
    }));
  };

  const toggleAccessory = (id) => {
    setFormData(prev => {
      const set = new Set(prev.artifacts || []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, artifacts: Array.from(set) };
    });
  };

  const filteredAccessories = ACCESSORIES.filter(a => {
    const q = accQuery.trim().toLowerCase();
    const matchQ = !q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || a.slot.toLowerCase().includes(q);
    const matchSlot = accSlot === "all" || a.slot === accSlot;
    return matchQ && matchSlot;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!user && (
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:p-5 space-y-3">
          <p className="text-sm font-semibold text-foreground">Mode explorateur</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tu peux forger et sauvegarder ton avatar sur cet appareil. Pour vendre sur la marketplace,
            synchroniser plusieurs sessions ou ouvrir des options pro, passe par les offres Egor69.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="default" className="rounded-lg">
              <Link to="/pricing">Voir les tarifs</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-lg">
              <Link to="/abonnement">Abonnement</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-lg">
              <Link to="/marketplace">Marketplace</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="flex gap-2 justify-between">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {/* STEP 1: Universe Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold">Choisir ton Univers Cosmique</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(MYTHOLOGY_GALLERIES).map(([key, gal]) => (
              <div
                key={key}
                onClick={() => {
                  setSelectedUniverse(key);
                  setFormData(prev => ({ ...prev, universe: key }));
                  setStep(2);
                }}
                className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 ${
                  selectedUniverse === key ? 'border-primary' : 'border-border'
                }`}
              >
                <img src={gal.images[0]} alt={gal.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-foreground">{gal.name}</h3>
                  <p className="text-xs text-muted-foreground">{gal.archetypes.length} archétypes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Archetype Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold">{MYTHOLOGY_GALLERIES[selectedUniverse].name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MYTHOLOGY_GALLERIES[selectedUniverse].images.map((img, i) => (
              <img key={i} src={img} alt={`${selectedUniverse}-${i}`} className="w-full h-48 rounded-xl object-cover" />
            ))}
          </div>
          <h3 className="font-bold text-lg mt-8">Archétypes Divins</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MYTHOLOGY_GALLERIES[selectedUniverse].archetypes.map((arch, i) => (
              <div
                key={i}
                onClick={() => applyArchetype(arch)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                  selectedArchetype === arch.name ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <p className="font-bold text-foreground">{arch.name}</p>
                <p className="text-sm text-muted-foreground">{arch.desc}</p>
                <p className="text-xs text-primary mt-2">Puissance: {arch.power}/10</p>
              </div>
            ))}
          </div>
          <Button onClick={() => setStep(3)} className="w-full rounded-xl gap-2">
            Continuer <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* STEP 3: Colors & Details */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold">Personnalise tes Couleurs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MYTHOLOGY_GALLERIES[selectedUniverse].colors.map((hex, i) => {
              const palette = MYTHOLOGY_GALLERIES[selectedUniverse].colors;
              const rotated = [...palette.slice(i), ...palette.slice(0, i)];
              const four = () =>
                rotated.length >= 4
                  ? rotated.slice(0, 4)
                  : [...rotated, ...rotated, ...rotated].slice(0, 4);
              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => updateColors(four())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') updateColors(four());
                  }}
                  className="aspect-square rounded-xl cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
                  style={{ backgroundColor: hex }}
                />
              );
            })}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold">Nom de l'Avatar</label>
            <Input
              value={formData.avatar_name}
              onChange={(e) => setFormData(prev => ({ ...prev, avatar_name: e.target.value }))}
              placeholder="Ex: Zeus Supreme, Aphrodite Eternelle..."
              className="rounded-xl"
            />
          </div>

          {/* Accessories */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="font-bold text-foreground">Accessoires & Artefacts</p>
                <p className="text-xs text-muted-foreground">
                  Sélectionne autant que tu veux. Sauvegardé dans ton avatar.
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {formData.artifacts?.length || 0} équipé(s)
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                value={accQuery}
                onChange={(e) => setAccQuery(e.target.value)}
                placeholder="Rechercher (halo, aura, badge...)"
                className="rounded-xl"
              />
              <div className="sm:col-span-2 flex gap-2 overflow-x-auto pb-1">
                {["all", "head", "face", "back", "aura", "companion", "fx", "badge"].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setAccSlot(s)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                      accSlot === s ? "bg-primary text-primary-foreground border-primary/40" : "bg-muted/40 text-muted-foreground border-border hover:bg-accent"
                    }`}
                  >
                    {s === "all" ? "Tous" : s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAccessories.map(acc => {
                const equipped = (formData.artifacts || []).includes(acc.id);
                const rs = RARITY_STYLE[acc.rarity] || RARITY_STYLE.common;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => toggleAccessory(acc.id)}
                    className={`text-left p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${
                      equipped ? "border-primary/60 bg-primary/5 shadow-lg" : "border-border bg-card hover:border-primary/25"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{acc.emoji}</span>
                        <div>
                          <p className="font-bold text-foreground text-sm">{acc.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{acc.slot}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black ring-1 ${rs.bg} ${rs.text} ${rs.ring}`}>
                        {acc.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{acc.desc}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-white/50 font-mono">
                        id: {acc.id}
                      </span>
                      <span className={`text-[10px] font-black ${equipped ? "text-emerald-400" : "text-white/30"}`}>
                        {equipped ? "ÉQUIPÉ" : "ÉQUIPER"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold">Histoire (Lore)</label>
            <textarea
              value={formData.lore}
              onChange={(e) => setFormData(prev => ({ ...prev, lore: e.target.value }))}
              placeholder="Raconte l'histoire de ton avatar..."
              className="w-full p-3 rounded-xl border border-border bg-card text-foreground resize-none h-24"
            />
          </div>

          <Button onClick={() => setStep(4)} className="w-full rounded-xl gap-2">
            Finaliser <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* STEP 4: Preview & Save */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold">Confirme ta création</h2>
          <div className="rounded-2xl border border-border p-8 bg-card space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="h-20 w-20 rounded-2xl shadow-lg"
                style={{ backgroundColor: formData.base_colors.primary }}
              />
              <div>
                <p className="font-display text-2xl font-bold">{formData.avatar_name}</p>
                <p className="text-muted-foreground">{selectedUniverse.toUpperCase()}</p>
                <p className="text-sm text-primary">Puissance: {formData.power_essence.power_level}/10</p>
              </div>
            </div>

            {formData.lore && (
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm italic text-foreground/70">{formData.lore}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
            <p className="text-sm font-semibold text-foreground">Monétisation (optionnel)</p>
            <p className="text-xs text-muted-foreground">
              Indique un prix public seulement si tu prévois une mise en vente réelle sur la marketplace.
              Les commissions et validations sont décrites sur les pages Marketplace et Tarifs — rien n’est encaissé ici sans parcours de paiement actif.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Prix affiché (CAD, 0 = gratuit)
                </label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={formData.marketplace_price ?? 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      marketplace_price: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="rounded-xl"
                />
              </div>
              <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-border"
                  checked={!!formData.is_public}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_public: e.target.checked }))
                  }
                />
                <span className="text-sm">
                  <span className="font-semibold block text-foreground">Lister publiquement</span>
                  <span className="text-xs text-muted-foreground">
                    Visible dans les galeries lorsque la marketplace affichera les fiches créateurs (compte requis).
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(3)} className="flex-1 rounded-xl">
              Retour
            </Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="flex-1 rounded-xl gap-2 bg-primary"
            >
              {createMutation.isPending ? (
                <>Création en cours...</>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Sauvegarder
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}