import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { SITE_ORIGIN, SITE_TAGLINE } from "@/lib/site";
import { UNREAL_BRIDGE_DOC_RELATIVE } from "@/lib/unrealBridge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Plug,
  Music,
  Image as ImageIcon,
  Video,
  Box,
  BookOpen,
  Building2,
  Leaf,
  ExternalLink,
} from "lucide-react";

const EXTERNAL = [
  {
    label: "Musique (exemples)",
    items: [
      { name: "Suno", href: "https://suno.com" },
      { name: "Udio", href: "https://udio.com" },
    ],
  },
  {
    label: "Image / conception",
    items: [
      { name: "Replicate (API)", href: "https://replicate.com" },
      { name: "Hugging Face", href: "https://huggingface.co" },
    ],
  },
  {
    label: "Vidéo / motion",
    items: [{ name: "Runway", href: "https://runwayml.com" }],
  },
];

export default function IntegrationsOutilsHub() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-28">
      <SEOMeta
        title="Outils, intégrations & cadre réel — Egor69"
        description="Unreal vs Verse web, IA externes, sécurité, entreprise : liens honnêtes, pas de promesse magique."
        canonicalUrl={`${SITE_ORIGIN}/outils-integration`}
        keywords="intégrations, Unreal Engine, Verse 3D, IA générative, sécurité, marketplace, Stripe, empreinte carbone, outils créatifs"
      />

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
            Référence interne
          </Badge>
          <Badge variant="outline" className="border-amber-500/40 text-amber-100">
            Pas de publicité tiers dans l’app
          </Badge>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Outils, IA & ponts créatifs
        </h1>
        <p className="text-sm leading-relaxed text-white/70">
          {SITE_TAGLINE} — cette page **regroupe des liens et des cadres** pour étendre la plateforme. Aucun outil externe n’est
          obligatoire pour naviguer. Les générateurs d’IA listés sont **des services tiers** : leurs conditions, leur coût et leur
          empreinte carbone vous concernent directement.
        </p>
      </header>

      <Card className="border-amber-500/25 bg-amber-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-amber-100 text-base">
            <Shield className="h-4 w-4" />
            Ce que Egor69 ne prétend pas faire
          </CardTitle>
          <CardDescription className="text-amber-100/80 text-xs leading-relaxed">
            Pas d’ERP complet, pas de comptabilité générale automatisée pour tous secteurs, pas de pilotage ministériel intégré,
            pas de « sécurité absolue ». La posture produit = **transparence**, **priorité sécurité** (défense en profondeur), et
            **intégrations documentées** quand vous branchez des systèmes métiers.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/10 bg-zinc-950/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Box className="h-5 w-5 text-cyan-300" />
              Verse 3D (navigateur) vs Unreal
            </CardTitle>
            <CardDescription className="text-white/65 text-xs leading-relaxed">
              Le Verse du site est **WebGL / Three.js**. Unreal = **éditeur + runtime** à installer à part si vous construisez un
              univers parallèle desktop ou Pixel Streaming.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-white/70">
            <p>
              Directives détaillées : fichier dépôt{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5">{UNREAL_BRIDGE_DOC_RELATIVE}</code> (section directives UE).
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="secondary" className="rounded-full">
                <Link to="/world">Ouvrir le Verse 3D</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
                <Link to="/ue-aiouy">Hub UEAIOUY (glTF)</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full border-lime-500/35 text-lime-100 hover:bg-lime-500/10">
                <Link to="/carte-site">Carte du site & parcours</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-950/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Shield className="h-5 w-5 text-emerald-300" />
              Sécurité (priorité)
            </CardTitle>
            <CardDescription className="text-white/65 text-xs leading-relaxed">
              HTTPS, secrets hors bundle, validation serveur, rate limits — voir la page Sécurité et l’API Express.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-500">
              <Link to="/security">Lire la page Sécurité</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-950/60 backdrop-blur-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Plug className="h-5 w-5 text-violet-300" />
              IA génératives & création — liens externes
            </CardTitle>
            <CardDescription className="text-white/65 text-xs leading-relaxed">
              Pour limiter l’empreinte : **évitez** les boucles de génération inutiles, baissez résolution / durée, réutilisez les
              sorties, centralisez les appels via un backend que vous contrôlez (clés API **côté serveur**, jamais exposées au
              navigateur public).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-3">
            {EXTERNAL.map((group) => (
              <div key={group.label} className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/45">{group.label}</p>
                <ul className="space-y-1.5">
                  {group.items.map((it) => (
                    <li key={it.href}>
                      <a
                        href={it.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-emerald-200/90 hover:text-emerald-100"
                      >
                        {it.name}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex flex-col justify-center gap-2 border-t border-white/10 pt-4 sm:col-span-3">
              <div className="flex flex-wrap gap-3 text-[11px] text-white/50">
                <span className="inline-flex items-center gap-1">
                  <Music className="h-3.5 w-3.5" /> Musique
                </span>
                <span className="inline-flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" /> Image
                </span>
                <span className="inline-flex items-center gap-1">
                  <Video className="h-3.5 w-3.5" /> Vidéo
                </span>
                <span className="inline-flex items-center gap-1">
                  <Leaf className="h-3.5 w-3.5" /> Empreinte = usage réel + choix fournisseur
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-950/60 backdrop-blur-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Building2 className="h-5 w-5 text-amber-200" />
              Entreprise, commerce, secteurs publics
            </CardTitle>
            <CardDescription className="text-white/65 text-xs leading-relaxed">
              Logistique avancée, comptabilité, RH ministérielles, chaînes d’approvisionnement complètes : **hors périmètre** du
              bundle actuel. Le site peut servir de **porte d’entrée** (marketplace, contenu, CRM lead, paiements Stripe selon
              configuration) — branchez vos systèmes métiers via API et gouvernance juridique.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-white/65">
            <p>
              Document source : <code className="rounded bg-white/10 px-1.5">docs/INTEGRATIONS-SECURITE-ENTREPRISE.md</code>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-500/20 bg-emerald-950/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-100 text-base">
            <BookOpen className="h-4 w-4" />
            Navigation interne
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
            <Link to="/manuel">Manuel</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
            <Link to="/hub-fondations">Hub fondations</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
            <Link to="/pricing">Abonnements</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
            <Link to="/legal">Légal</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
