import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AvatarStudio, { AVATAR_LOCAL_PROFILE_EMAIL } from '@/components/AvatarStudio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Crown, Heart, Sparkles, Infinity, Wand2, Store, CreditCard, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOMeta from '@/components/SEOMeta';
import { SITE_ORIGIN, SITE_TAGLINE } from '@/lib/site';
import { toast } from 'sonner';

const MYTHOLOGIES = [
  {
    name: "OLYMPE",
    emoji: "⚡",
    desc: "Les dieux grecs - Puissance, sagesse, amour",
    color: "from-amber-500/20 to-yellow-500/20",
    examples: ["Zeus - Dieu du Ciel", "Athena - Deesse de la Sagesse", "Aphrodite - Deesse de l'Amour"],
  },
  {
    name: "ABYSSE",
    emoji: "🌑",
    desc: "Monstres et creatures des profondeurs",
    color: "from-purple-900/20 to-blue-900/20",
    examples: ["Kraken - Dieu des Mers", "Leviathan - Bete Cosmique", "Medusa - Maudite Eternelle"],
  },
  {
    name: "CELESTIAL",
    emoji: "✨",
    desc: "Anges, esprits lumineux, entites stellaires",
    color: "from-cyan-300/20 to-blue-300/20",
    examples: ["Archange Michael", "Gabriel - Messager Divin", "Uriel - Feu de Dieu"],
  },
  {
    name: "ELEMENTAIRE",
    emoji: "🔥",
    desc: "Esprits des 5 elements - feu, eau, air, terre, ether",
    color: "from-orange-500/20 to-red-500/20",
    examples: ["Phoenix - Reincarnation du Feu", "Triton - Seigneur des Mers", "Zephyr - Vent Eternel"],
  },
  {
    name: "CYBERPUNK",
    emoji: "⚙️",
    desc: "Cyborgs, IAs transcendantes, entites numeriques",
    color: "from-green-500/20 to-lime-500/20",
    examples: ["Neo-Divinity AI", "Chrome Angel", "Quantum Phantom"],
  },
  {
    name: "QUANTIQUE",
    emoji: "⚛️",
    desc: "Entites quantiques - superposition, intrication, paradoxes",
    color: "from-violet-500/20 to-purple-500/20",
    examples: ["Schrodinger's Demiurge", "Entanglement Consciousness", "Wave-Particle Deity"],
  },
  {
    name: "ETERNEL",
    emoji: "∞",
    desc: "L'Etre Suprême - au-delà de tous les univers",
    color: "from-yellow-300/20 to-pink-300/20",
    examples: ["Logos - Verbe Primordial", "Absolute Self", "Infinite Consciousness"],
  },
];

const DIVINE_FEATURES = [
  { icon: Wand2, title: "Editeur Visuel", desc: "Personalize couleurs, aura, elements cosmiques" },
  { icon: Zap, title: "Pouvoir Cosmique", desc: "Puissance 1-10 + frequence unique 1-999Hz" },
  { icon: Heart, title: "Essence Divine", desc: "Choisis element + traits physiques uniques" },
  { icon: Sparkles, title: "Lore Personnalise", desc: "Raconter l'histoire de ton avatar" },
  { icon: Crown, title: "Marketplace", desc: "Publie quand ton backend encaisse — Egor69 relie narration et circuits réels." },
  { icon: Infinity, title: "Persistance", desc: "Brouillon local immédiat ; synchro quand ton identité cloud est active." },
];

export default function AvatarCreator() {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedMythology, setSelectedMythology] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const profileEmail = user?.email || AVATAR_LOCAL_PROFILE_EMAIL;

  const { data: myAvatars = [] } = useQuery({
    queryKey: ['my-avatars', profileEmail],
    queryFn: () =>
      base44.entities.AvatarCustomizer.filter({ user_email: profileEmail }, '-created_at', 50),
  });

  const equipAvatar = (avatarId) => {
    try {
      localStorage.setItem('igor:avatar:equippedId', avatarId);
      toast.success('Avatar mémorisé sur cet appareil pour les expériences Egor69 compatibles.');
    } catch {
      toast.error('Impossible de mémoriser cet avatar sur cet appareil.');
    }
  };

  return (
    <div className="pb-20 space-y-12">
      <SEOMeta
        title="Studio Avatar — forge & marketplace"
        description={`Crée une identité cosmique narrative, exporte ton lore et relie-la au marketplace Egor69. ${SITE_TAGLINE}`}
        keywords="igor, avatar, studio créatif, marketplace, lore, cosmétiques narratifs, économie circulaire"
        canonicalUrl={`${SITE_ORIGIN}/avatar-creator`}
      />

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(200,50,255,0.1), rgba(100,200,255,0.1))",
          border: "2px solid rgba(255,215,0,0.2)",
        }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-5 left-10 text-4xl animate-pulse">✨</div>
          <div className="absolute top-10 right-20 text-3xl animate-pulse" style={{ animationDelay: '0.5s' }}>⚡</div>
          <div className="absolute bottom-5 left-1/3 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>👑</div>
        </div>

        <div className="relative z-10">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 font-bold text-lg px-6 py-1">
            🌟 TEMPLE COSMIQUE DES AVATARS DIVINS 🌟
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-purple-300 to-pink-300 mb-3">
            Crée ta divinité numérique
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            {SITE_TAGLINE}
            <br />
            <span className="text-white/60 text-base mt-2 block">
              Forge une entité, équipe-la, relie-la au marketplace — sans compte, la persistance est souveraine sur cet appareil (jeton local{' '}
              <span className="text-white/45 font-mono text-[11px]">{AVATAR_LOCAL_PROFILE_EMAIL}</span>
              , pas une boîte mail). Connecté, tes avatars sont liés à ton email réel et aux flux cloud Egor69.
            </span>
          </p>
        </div>
      </div>

      {/* Conversion / monetization strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            href: '/marketplace',
            icon: Store,
            title: 'Marketplace',
            desc: 'Donne, troque ou vend des créations alignées Egor69.',
          },
          {
            href: '/pricing',
            icon: CreditCard,
            title: 'Tarifs',
            desc: 'Comprends ce qui est gratuit vs soutien / pro.',
          },
          {
            href: '/abonnement',
            icon: Crown,
            title: 'Abonnement',
            desc: 'Débloque synchro multi-appareils quand ton backend est branché.',
          },
          {
            href: '/partenaires',
            icon: Handshake,
            title: 'Partenaires',
            desc: 'Accords B2B pour expériences immersives & CRM.',
          },
        ].map((card) => (
          <Link
            key={card.href}
            to={card.href}
            className="rounded-2xl border border-border bg-card/80 p-4 hover:border-primary/40 transition-colors flex gap-3"
          >
            <card.icon className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground text-sm">{card.title}</p>
              <p className="text-xs text-muted-foreground leading-snug">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-3 justify-center flex-wrap">
        {[
          { id: 'create', label: '🎨 Créer', icon: Wand2 },
          { id: 'mythologies', label: '📚 Mythologies', icon: Crown },
          { id: 'my-avatars', label: '👤 Mes avatars', icon: Heart },
          { id: 'gallery', label: '🏛️ Galerie', icon: Sparkles },
        ].map(tab => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            className="rounded-xl gap-2 font-bold"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* TAB: CREATE */}
      {activeTab === 'create' && (
        <div>
          <h2 className="font-display text-3xl font-bold text-center mb-8">Forge Ton Avatar</h2>
          <AvatarStudio onSave={() => setActiveTab('my-avatars')} />
        </div>
      )}

      {/* TAB: MYTHOLOGIES */}
      {activeTab === 'mythologies' && (
        <div>
          <h2 className="font-display text-3xl font-bold text-center mb-8">7 Univers Cosmiques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MYTHOLOGIES.map((myth, i) => (
              <div
                key={i}
                onClick={() => setSelectedMythology(myth.name)}
                className={`relative rounded-2xl p-6 border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group bg-gradient-to-br ${myth.color}`}
                style={{
                  borderColor: selectedMythology === myth.name ? '#FFD700' : 'rgba(255,255,255,0.1)',
                  boxShadow: selectedMythology === myth.name ? `0 0 30px rgba(255,215,0,0.3)` : 'none',
                }}
              >
                <div className="text-5xl mb-3">{myth.emoji}</div>
                <h3 className="font-display text-xl font-bold text-foreground mb-1">{myth.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{myth.desc}</p>

                <div className="space-y-1 mb-4">
                  {myth.examples.map((ex, j) => (
                    <p key={j} className="text-xs text-foreground/70">• {ex}</p>
                  ))}
                </div>

                <Button
                  size="sm"
                  className="w-full rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                  onClick={() => {
                    setActiveTab('create');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Créer dans {myth.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: MY AVATARS */}
      {activeTab === 'my-avatars' && (
        <div>
          <h2 className="font-display text-3xl font-bold text-center mb-8">Mes avatars</h2>
          {myAvatars.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed border-border">
              <p className="text-muted-foreground text-lg mb-4">Aucun avatar pour l’instant — lance la forge.</p>
              <Button onClick={() => setActiveTab('create')} className="rounded-xl gap-2">
                <Wand2 className="h-4 w-4" /> Créer maintenant
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myAvatars.map(avatar => (
                <div key={avatar.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all hover:-translate-y-1">
                  <div className="text-5xl mb-3" style={{ color: avatar.base_colors.primary }}>
                    {['dieu', 'deesse'].includes(avatar.avatar_type) ? '👑' : '✨'}
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">{avatar.avatar_name}</h3>
                  <div className="text-xs text-muted-foreground space-y-1 mb-3">
                    <p>Type: {avatar.avatar_type}</p>
                    <p>Universe: {avatar.universe}</p>
                    <p>Puissance: {avatar.power_essence.power_level}/10</p>
                    <p>Cosmicite: {avatar.cosmicity_score}/100</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1 rounded-lg" variant="outline">
                      <Link to={`/marketplace`}>Vendre</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 rounded-lg bg-primary text-primary-foreground"
                      type="button"
                      onClick={() => equipAvatar(avatar.id)}
                    >
                      Équiper
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: GALLERY */}
      {activeTab === 'gallery' && (
        <div>
          <h2 className="font-display text-3xl font-bold text-center mb-8">Galerie des légendes (aperçu)</h2>
          <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto mb-6">
            Exemples fictionnels pour inspirer ta forge — les transactions réelles passent par Marketplace et les parcours conformes (paiement, mentions légales).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Zeus Supreme', power: 10, cosmos: 100, universe: 'Olympe' },
              { name: 'Athena Eternelle', power: 9, cosmos: 95, universe: 'Olympe' },
              { name: 'Leviathan Infini', power: 10, cosmos: 98, universe: 'Abysse' },
              { name: 'Archange Michael', power: 9, cosmos: 97, universe: 'Celestial' },
              { name: 'Phoenix Renaissant', power: 8, cosmos: 92, universe: 'Elementaire' },
              { name: 'Neo-Divinity', power: 9, cosmos: 94, universe: 'Cyberpunk' },
              { name: 'Quantum Consciousness', power: 10, cosmos: 99, universe: 'Quantique' },
              { name: 'The Infinite One', power: 10, cosmos: 100, universe: 'Eternel' },
            ].map((leg, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4 text-center hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="text-4xl mb-2">👑</div>
                <p className="font-bold text-foreground text-sm">{leg.name}</p>
                <p className="text-xs text-muted-foreground">{leg.universe}</p>
                <div className="mt-2 space-y-1 text-xs">
                  <p>⚡ Pouvoir: {leg.power}/10</p>
                  <p>✨ Cosmicite: {leg.cosmos}/100</p>
                </div>
                <Button asChild size="sm" className="w-full mt-3 rounded-lg h-8" variant="outline">
                  <Link to="/abonnement">Obtenir</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divine Features */}
      <div>
        <h2 className="font-display text-3xl font-bold text-center mb-8">Pouvoirs Divins</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIVINE_FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all hover:-translate-y-1">
                <Icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-foreground mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}