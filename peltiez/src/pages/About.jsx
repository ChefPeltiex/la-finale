import { motion } from 'framer-motion';
import { useState } from 'react';
import { Leaf, Target, Eye, Heart, Shield, Globe, Zap, Users, Award, TrendingUp, Building2, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CATHEDRALE_ESPRIT, DISCLAIMER, describeSoulEngineForAbout } from '@/data/cathedralOfMind';

const values = [
  { icon: Leaf, title: 'Durabilité', description: 'Chaque décision est prise en tenant compte de son impact environnemental à long terme.' },
  { icon: Shield, title: 'Transparence', description: 'Traçabilité blockchain complète et reporting ESG rigoureux pour tous nos partenaires.' },
  { icon: Users, title: 'Communauté', description: 'Nous croyons au pouvoir collectif pour transformer les habitudes de consommation.' },
  { icon: Globe, title: 'Impact local', description: "Ancrés au Québec, nous privilégions les échanges locaux pour réduire l'empreinte logistique." },
  { icon: Zap, title: 'Innovation', description: "L'IA et la blockchain au service d'une économie plus juste et plus efficiente." },
  { icon: Heart, title: 'Accessibilité', description: 'Le commerce circulaire doit être accessible à tous, pas seulement aux privilégiés.' },
];

const milestones = [
  { year: '2024', title: 'Genèse', desc: 'Idée fondatrice — constater le gaspillage systémique au Québec' },
  { year: '2025', title: 'Recherche et développement', desc: 'Études de marché, architecture technologique, levée de fonds seed' },
  { year: 'Avr 2026', title: 'Lancement plateforme v1', desc: 'Déploiement public d’Egor69 / IGOR — Phase bêta' },
  { year: '2027', title: 'Expansion canadienne', desc: 'Ontario, Colombie-Britannique — 50 000 utilisateurs' },
  { year: '2028', title: 'Marchés internationaux', desc: 'Europe francophone — Partenariats institutionnels' },
  { year: '2030', title: 'Leader nord-américain', desc: '850 000 utilisateurs — 41,5M$ ARR — IPO envisagée' },
];

const team = [
  { name: 'Directrice Générale', role: 'PDG & Co-fondatrice', desc: "Experte en économie circulaire et stratégie ESG. 12 ans d'expérience en développement durable.", img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
  { name: 'Directeur Technique', role: 'CTO & Co-fondateur', desc: 'Architecte IA senior. Ancien Google et Shopify. Expert en systèmes distribués et blockchain.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
  { name: 'Directrice Produit', role: 'CPO', desc: "Designer UX primée. Ancienne Ubisoft. Passionnée par l'expérience utilisateur éthique.", img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
  { name: 'Directeur Financier', role: 'CFO', desc: "MBA HEC Montréal. 15 ans en capital-risque et financement d'entreprises technologiques.", img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
];

export default function About() {
  const [texts, setTexts] = useState(['', '', '']);
  const [cathedralOpen, setCathedralOpen] = useState(false);
  const setZone = (i, val) => setTexts(prev => { const n = [...prev]; n[i] = val; return n; });

  return (
    <div className="min-h-screen bg-background">
      {/* Zone personnalisée */}
      <section className="pt-8 pb-12 bg-secondary/20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {texts.map((text, i) => (
              <textarea
                key={i}
                value={text}
                onChange={e => setZone(i, e.target.value)}
                placeholder={`Zone ${i + 1} — cliquez pour écrire...`}
                className="w-full h-40 p-4 rounded-2xl border-2 border-dashed border-border bg-card text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary/50 transition-colors text-sm"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="gradient-hero pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
          >
            <Leaf className="w-4 h-4" style={{color:'hsl(158,55%,65%)'}} />
            <span className="text-xs font-medium text-white/80">Notre histoire et notre mission</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            À propos de<br /><span style={{color:'hsl(158,55%,65%)'}}>Egor69 · IGOR</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-xl max-w-3xl mx-auto"
          >
            Nous sommes une équipe de passionnés convaincus que la technologie peut et doit être mise 
            au service d'une économie plus juste, plus durable et plus résiliente.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-primary rounded-3xl p-10 text-primary-foreground"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-4">Notre Mission</h2>
              <p className="text-primary-foreground/80 leading-relaxed text-lg">
                Démocratiser l'accès à l'économie circulaire en Québec grâce à une plateforme numérique 
                intelligente qui rend le commerce durable aussi simple et accessible que le commerce 
                traditionnel.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-card rounded-3xl p-10 border border-border"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">Notre Vision</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Devenir le leader nord-américain du commerce circulaire alimenté par l'IA d'ici 2030, 
                en contribuant à éviter l'émission de 100 000 tonnes de CO₂ et en mobilisant 
                plus d'un million de consommateurs responsables.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cathédrale de l’esprit — cadre narratif (non clinique) */}
      <section className="py-16 bg-secondary/20 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-widest text-primary uppercase block mb-2">Architecte des mystères · métaphore</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">La cathédrale de l’esprit</h2>
              <p className="text-muted-foreground leading-relaxed">{CATHEDRALE_ESPRIT.tagline}</p>
              <p className="text-sm text-primary/90 mt-3 italic">{CATHEDRALE_ESPRIT.structureMetaphor}</p>
            </div>
          </div>

          <Collapsible open={cathedralOpen} onOpenChange={setCathedralOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-left hover:border-primary/35 hover:bg-card/80 transition-colors">
              <span className="text-sm font-semibold text-foreground">Ouvrir les tribunes — cartes culturelles et aphorismes</span>
              <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${cathedralOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 rounded-2xl border border-border bg-card/80 p-5 sm:p-6">
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {describeSoulEngineForAbout()}
              </pre>
            </CollapsibleContent>
          </Collapsible>

          <p className="text-[11px] text-muted-foreground/90 mt-5 leading-relaxed">{DISCLAIMER}</p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-primary uppercase mb-4 block">Ce qui nous guide</span>
            <h2 className="font-display text-4xl font-bold text-foreground">Nos valeurs fondamentales</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-7 border border-border hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-primary uppercase mb-4 block">Feuille de route</span>
            <h2 className="font-display text-4xl font-bold text-foreground">Notre parcours</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    i === 2 ? 'bg-primary text-primary-foreground' : 'bg-card border-2 border-border text-muted-foreground'
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="bg-card rounded-2xl border border-border p-5 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{m.year}</span>
                      <h3 className="font-semibold text-foreground">{m.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-primary uppercase mb-4 block">L'équipe fondatrice</span>
            <h2 className="font-display text-4xl font-bold text-foreground">Derrière Egor69</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-md transition-all"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4"
                />
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-xs text-primary font-medium mt-1 mb-3">{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ESG */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-hero rounded-3xl p-12 text-center">
            <TrendingUp className="w-10 h-10 mx-auto mb-4" style={{color:'hsl(158,55%,65%)'}} />
            <h2 className="font-display text-3xl font-bold text-white mb-4">Objectifs ESG 2030</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              {[
                { icon: '🌿', label: 'Environnement', val: '100 000t', desc: 'CO₂ évité cumulé' },
                { icon: '🤝', label: 'Social', val: '50 000', desc: 'emplois verts soutenus' },
                { icon: '📊', label: 'Gouvernance', val: 'AAA', desc: 'notation ESG visée' },
              ].map((item, i) => (
                <div key={i} className="glass rounded-2xl p-6">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-display text-2xl font-bold text-white mb-1">{item.val}</div>
                  <div className="text-sm text-white/60">{item.desc}</div>
                  <div className="text-xs text-white/40 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}