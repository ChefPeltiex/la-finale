import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Zap, Heart, Brain, Globe, Flame, BookOpen, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const SOURCE_COLORS = {
  wikipedia: 'from-blue-500 to-cyan-600',
  news: 'from-orange-500 to-red-600',
  nature: 'from-green-500 to-emerald-600',
  knowledge: 'from-purple-500 to-violet-600',
  quests: 'from-pink-500 to-rose-600',
};

const SOURCE_ICONS = {
  wikipedia: BookOpen,
  news: Globe,
  nature: Heart,
  knowledge: Brain,
  quests: Zap,
};

export default function UniversalHub() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ['universal-content'],
    queryFn: () => base44.entities.ContentFeed.list('-fetched_at', 50),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 1000 * 60 * 5,
  });

  const { data: userQuests = [] } = useQuery({
    queryKey: ['user-quests', user?.email],
    queryFn: () => user ? base44.entities.UserQuestProgress.filter({ user_email: user.email }, '-started_at', 50) : [],
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  const [_selectedContent, setSelectedContent] = useState(null);
  const [filterSource, setFilterSource] = useState('all');

  const featuredContents = contents.filter(c => c.is_featured).slice(0, 3);
  const filteredContents = filterSource === 'all' 
    ? contents 
    : contents.filter(c => c.source === filterSource);

  const startQuest = async (content) => {
    try {
      await base44.entities.UserQuestProgress.create({
        user_email: user.email,
        content_id: content.id,
        quest_title: content.ai_summary || content.title,
        status: 'in_progress',
        progress_percent: 0,
        started_at: new Date().toISOString(),
        learning_tags: content.nature_tags || [],
      });
      toast.success('Quest lancée!');
    } catch (error) {
      toast.error('Erreur: ' + error.message);
    }
  };

  return (
    <div className="pb-20 space-y-12">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden p-12 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(100,50,200,0.1), rgba(50,150,200,0.1))",
          border: "2px solid rgba(100,100,255,0.2)",
        }}>

        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(100,200,255,1), transparent 70%)", filter: "blur(60px)" }} />
        </div>

        <div className="relative z-10 space-y-4">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 font-bold text-lg px-4 py-1">
            ENCYCLOPEDIE COSMIQUE VIVANTE
          </Badge>

          <h1 className="font-display text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
            L&apos;Univers du Savoir
          </h1>

          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Chaque heure, 10+ sources mondiales s&apos;entrelacent ici.<br />
            Wikipedia. Actualites. Art. Nature. Culture. Quetes.<br />
            <strong className="text-emerald-300">Transformez chaque contenu en aventure vers vos reves.</strong>
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild size="lg" className="rounded-xl gap-2 bg-primary border-0">
              <Link to="/avatar-creator">Creer Avatar</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl text-white hover:bg-white/10">
              <Link to="/jeu">Jouer Apprendre</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Contents */}
      {featuredContents.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" /> Contenus Vedettes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredContents.map(content => {
              const Icon = SOURCE_ICONS[content.source] || BookOpen;
              return (
                <div key={content.id} className="rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-card"
                  onClick={() => setSelectedContent(content)}>
                  {content.image_url && (
                    <img src={content.image_url} alt={content.title} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <Badge variant="secondary" className="text-xs">{content.source}</Badge>
                    </div>
                    <h3 className="font-bold text-foreground line-clamp-2">{content.ai_summary || content.title}</h3>
                    <div className="mt-3 flex gap-2">
                      <Button onClick={() => startQuest(content)} size="sm" className="flex-1 rounded-lg gap-1 text-xs">
                        <Zap className="h-3 w-3" /> {content.quest_reward_xp}XP
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1 rounded-lg text-xs">
                        <a href={content.content_url} target="_blank" rel="noopener">Lire</a>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setFilterSource('all')}
          variant={filterSource === 'all' ? 'default' : 'outline'}
          className="rounded-xl"
          size="sm"
        >
          Tous
        </Button>
        {Object.keys(SOURCE_COLORS).map(source => (
          <Button
            key={source}
            onClick={() => setFilterSource(source)}
            variant={filterSource === source ? 'default' : 'outline'}
            className="rounded-xl text-xs"
            size="sm"
          >
            {source === 'wikipedia' ? 'Wikipedia' : source === 'news' ? 'Actualites' : source === 'nature' ? 'Nature' : source === 'knowledge' ? 'Savoir' : 'Quetes'}
          </Button>
        ))}
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredContents.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <Sparkles className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Le savoir universel se charge...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map(content => {
            const Icon = SOURCE_ICONS[content.source] || BookOpen;
            const gradient = SOURCE_COLORS[content.source] || 'from-slate-500 to-slate-600';
            const questStatus = userQuests.find(q => q.content_id === content.id);

            return (
              <div key={content.id} className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all hover:-translate-y-1">
                <div className={`h-2 bg-gradient-to-r ${gradient}`} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                    {questStatus && (
                      <Badge className="bg-emerald-600 text-white text-xs">
                        {questStatus.status === 'completed' ? 'Complet' : 'En cours'}
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-foreground text-sm mb-2 line-clamp-2">{content.ai_summary || content.title}</h3>

                  {content.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{content.description}</p>
                  )}

                  {content.difficulty && (
                    <div className="flex gap-1 mb-3 text-xs text-muted-foreground">
                      {['easy', 'medium', 'hard'].map(d => (
                        <span key={d} className={d === content.difficulty ? 'text-primary font-bold' : ''}>
                          star
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {questStatus?.status !== 'completed' ? (
                      <Button
                        onClick={() => startQuest(content)}
                        size="sm"
                        className="flex-1 rounded-lg text-xs gap-1 h-8"
                      >
                        <Play className="h-3 w-3" /> Quete
                      </Button>
                    ) : (
                      <Button disabled size="sm" variant="outline" className="flex-1 rounded-lg text-xs h-8">
                        Complet
                      </Button>
                    )}

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-lg text-xs h-8"
                    >
                      <a href={content.content_url} target="_blank" rel="noopener">
                        Lire
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-8 rounded-2xl border border-border"
        style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{contents.length}</p>
          <p className="text-xs text-muted-foreground">Contenus aspis</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-500">{userQuests.filter(q => q.status === 'completed').length}</p>
          <p className="text-xs text-muted-foreground">Quetes completees</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-500">{userQuests.length}</p>
          <p className="text-xs text-muted-foreground">Quetes actives</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-500">
            {userQuests.reduce((s, q) => s + (q.xp_earned || 0), 0)}
          </p>
          <p className="text-xs text-muted-foreground">XP gagnes</p>
        </div>
      </div>
    </div>
  );
}