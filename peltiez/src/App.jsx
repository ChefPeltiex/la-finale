import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import MagicLayout from '@/components/MagicLayout';
import { ThemeProvider } from '@/lib/ThemeProvider';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import AmbientMusic from '@/components/AmbientMusic';
import AudioControl from '@/components/AudioControl';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ErrorBoundary from '@/components/ErrorBoundary';
import OfflineIndicator from '@/components/OfflineIndicator';
import OfflineProfile from '@/pages/OfflineProfile';
import Layout from './components/Layout.jsx';

// Initialize push notifications
import PushNotifications from './components/PushNotifications';
import SovereigntyBanner from './components/SovereigntyBanner';
import LaunchIntro from './components/LaunchIntro';
import { EXPERIENCE_FLAGS } from "@/lib/experienceFlags";
import WarpZoneProvider from "@/components/WarpZoneProvider";
import TorusTransactionSigil from "@/components/TorusTransactionSigil";
import UniversePreferencesSync from "@/components/UniversePreferencesSync";
import CheatCodeGateway from "@/components/CheatCodeGateway";
import ConciergeOrb from "@/components/ConciergeOrb";
import PersonalRealmGuard from "@/components/PersonalRealmGuard";

import React, { Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/Home.jsx"));
const Marketplace = lazy(() => import("./pages/Marketplace.jsx"));
const PostItem = lazy(() => import("./pages/PostItem.jsx"));
const ItemDetail = lazy(() => import("./pages/ItemDetail.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const GitCommits = lazy(() => import("./pages/GitCommits"));
const ImportCSV = lazy(() => import("./pages/ImportCSV"));
const Actualite = lazy(() => import("./pages/Actualite"));
const Abonnement = lazy(() => import("./pages/Abonnement"));
const Jeu = lazy(() => import("./pages/Jeu"));
const Game = lazy(() => import("./pages/Game"));
const Charte = lazy(() => import("./pages/Charte"));
const Alliance = lazy(() => import("./pages/Alliance"));
const Vision = lazy(() => import("./pages/Vision"));
const Welcome = lazy(() => import("./pages/Welcome"));
const Intro = lazy(() => import("./pages/Intro"));
const Underworld = lazy(() => import("./pages/Underworld"));
const Etherealm = lazy(() => import("./pages/Etherealm"));
const Netherealm = lazy(() => import("./pages/Netherealm"));
const OutworldChaos = lazy(() => import("./pages/OutworldChaos"));
const AnimalSanctuary = lazy(() => import("./pages/AnimalSanctuary"));
const AnimalMemorialPage = lazy(() => import("./pages/AnimalMemorialPage"));
const EternelBien = lazy(() => import("./pages/EternelBien"));
const Ultimatum = lazy(() => import("./pages/Ultimatum"));
const PlayTime = lazy(() => import("./pages/PlayTime"));
const SustainableFuels = lazy(() => import("./pages/SustainableFuels"));
const NinjasManifesto = lazy(() => import("./pages/NinjasManifesto"));
const GlobalIndependence = lazy(() => import("./pages/GlobalIndependence"));
const CommunityFeed = lazy(() => import("./pages/CommunityFeed"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const ClayMockery = lazy(() => import("./pages/ClayMockery"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const Credits = lazy(() => import("./pages/Credits"));
const Security = lazy(() => import("./pages/Security"));
const GlobalImpact = lazy(() => import("./pages/GlobalImpact"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PlatformLiveMetrics = lazy(() => import("./pages/PlatformLiveMetrics"));
const PersonalVault = lazy(() => import("./pages/PersonalVault"));
const AlertPreferences = lazy(() => import("./pages/AlertPreferences"));
const LaunchNight = lazy(() => import("./pages/LaunchNight"));
const MothersDay = lazy(() => import("./pages/MothersDay"));
const ArtisanDetail = lazy(() => import("./pages/ArtisanDetail"));
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const LegalSingularity = lazy(() => import("./pages/LegalSingularity"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const MonthlyReports = lazy(() => import("./pages/MonthlyReports"));
const ReferralKit = lazy(() => import("./pages/ReferralKit"));
const DashboardRoyal = lazy(() => import("./pages/DashboardRoyal"));
const ShareQuestsPage = lazy(() => import("./pages/ShareQuests.jsx"));
const Tutorials = lazy(() => import("./pages/Tutorials"));
const DonationCalendar = lazy(() => import("./pages/DonationCalendar"));
const AvatarCreator = lazy(() => import("./pages/AvatarCreator"));
const UniversalHub = lazy(() => import("./pages/UniversalHub"));
const ConsciousnessDirectory = lazy(() => import("./pages/ConsciousnessDirectory"));
const EpicJourney = lazy(() => import("./pages/EpicJourney"));
const Piliers144K = lazy(() => import("./pages/Piliers144K"));
const Partenaires = lazy(() => import("./pages/Partenaires"));
const MicroCommunautes = lazy(() => import("./pages/MicroCommunautes"));
const FastTrack = lazy(() => import("./pages/FastTrack"));
const ConseilJedi = lazy(() => import("./pages/ConseilJedi"));
const PortailsMondiaux = lazy(() => import("./pages/PortailsMondiaux"));
const ArtisansHub = lazy(() => import("./pages/ArtisansHub"));
const SmartContrats = lazy(() => import("./pages/SmartContrats"));
const MicroOutils = lazy(() => import("./pages/MicroOutils"));
const SceauEternite = lazy(() => import("./pages/SceauEternite"));
const CityHub = lazy(() => import("./pages/CityHub"));
const NegociationIA = lazy(() => import("./pages/NegociationIA"));
const Recommandations = lazy(() => import("./pages/Recommandations"));
const MaitreDuJeu = lazy(() => import("./pages/MaitreDuJeu"));
const SystemeVivant = lazy(() => import("./pages/SystemeVivant"));
const Heritage = lazy(() => import("./pages/Heritage"));
const BesoinsMatch = lazy(() => import("./pages/BesoinsMatch"));
const CarteDuCiel = lazy(() => import("./pages/CarteDuCiel"));
const RevesJournal = lazy(() => import("./pages/RevesJournal"));
const RevesSymboles = lazy(() => import("./pages/RevesSymboles"));
const HolisticWellness = lazy(() => import("./pages/HolisticWellness"));
const WellnessQuests = lazy(() => import("./pages/WellnessQuests"));
const Numerology = lazy(() => import("./pages/Numerology"));
const TestYourMight = lazy(() => import("./pages/TestYourMight"));
const ParanormalMystique = lazy(() => import("./pages/ParanormalMystique"));
const EsotericismHub = lazy(() => import("./pages/EsotericismHub"));
const MythologiesHub = lazy(() => import("./pages/MythologiesHub"));
const WellnessLexiqueHub = lazy(() => import("./pages/WellnessLexiqueHub"));
const PhilosophiesBelief = lazy(() => import("./pages/PhilosophiesBelief"));
const NumerologyParanormalDashboard = lazy(() => import("./pages/NumerologyParanormalDashboard"));
const BlogHub = lazy(() => import("./pages/BlogHub"));
const DailyChallenges = lazy(() => import("./pages/DailyChallenges"));
const SyncMysticalMarketplace = lazy(() => import("./pages/SyncMysticalMarketplace"));
const FloraHub = lazy(() => import("./pages/FloraHub"));
const FaunaHub = lazy(() => import("./pages/FaunaHub"));
const InsectsHub = lazy(() => import("./pages/InsectsHub"));
const MineralsHub = lazy(() => import("./pages/MineralsHub"));
const ChemistryHub = lazy(() => import("./pages/ChemistryHub"));
const MagicHub = lazy(() => import("./pages/MagicHub"));
const CompetitorIntelligence = lazy(() => import("./pages/CompetitorIntelligence"));
const PaparazziDashboard = lazy(() => import("./pages/PaparazziDashboard"));
const AuthenticityControl = lazy(() => import("./pages/AuthenticityControl"));
const ReportersDashboard = lazy(() => import("./pages/ReportersDashboard"));
const FactCheckDashboard = lazy(() => import("./pages/FactCheckDashboard"));
const TransparencyLog = lazy(() => import("./pages/TransparencyLog"));
const ConspiracyMythDatabase = lazy(() => import("./pages/ConspiracyMythDatabase"));
const CosmicPortal = lazy(() => import("./pages/CosmicPortal"));
const Genome = lazy(() => import("./pages/Genome"));
const Atlas = lazy(() => import("./pages/Atlas"));
const CardPage = lazy(() => import("./pages/CardPage"));
const Sentinelle = lazy(() => import("./pages/Sentinelle"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const Soutien = lazy(() => import("./pages/Soutien.jsx"));
const PantheonRenders = lazy(() => import("./pages/PantheonRenders.jsx"));
const PantheonRenderDetail = lazy(() => import("./pages/PantheonRenderDetail.jsx"));
const Pantheon3D = lazy(() => import("./pages/Pantheon3D.jsx"));
const WorldHub = lazy(() => import("./pages/WorldHub.jsx"));
const BibleEncyclopedia = lazy(() => import("./pages/BibleEncyclopedia.jsx"));
const BibleEntryDetail = lazy(() => import("./pages/BibleEntryDetail.jsx"));
const BibleTimeline = lazy(() => import("./pages/BibleTimeline.jsx"));
const BiblePlacesMap = lazy(() => import("./pages/BiblePlacesMap.jsx"));
const BibleGraph = lazy(() => import("./pages/BibleGraph.jsx"));
const BibleScene3D = lazy(() => import("./pages/BibleScene3D.jsx"));
const MyUniverse = lazy(() => import("./pages/MyUniverse.jsx"));
const VirtualCampaignArena = lazy(() => import("./pages/VirtualCampaignArena.jsx"));
const EnterpriseLearningHub = lazy(() => import("./pages/EnterpriseLearningHub.jsx"));
const SovereignEcoHub = lazy(() => import("./pages/SovereignEcoHub.jsx"));
const UeAiouyHub = lazy(() => import("./pages/UeAiouyHub.jsx"));
const ManuelPlateforme = lazy(() => import("./pages/ManuelPlateforme.jsx"));
const IntegrationsOutilsHub = lazy(() => import("./pages/IntegrationsOutilsHub.jsx"));
const CarteSiteEtLiens = lazy(() => import("./pages/CarteSiteEtLiens.jsx"));
const RepairHub = lazy(() => import("./pages/RepairHub.jsx"));
const ArtisanWorkshop = lazy(() => import("./pages/ArtisanWorkshop.jsx"));
const CorporatePartners = lazy(() => import("./pages/CorporatePartners.jsx"));
const DivinatoryArts = lazy(() => import("./pages/DivinatoryArts.jsx"));
const DivinatoryLexiqueHub = lazy(() => import("./pages/DivinatoryLexiqueHub.jsx"));
const GlobalDashboard = lazy(() => import("./pages/GlobalDashboard.jsx"));
const GoldenEye = lazy(() => import("./pages/GoldenEye.jsx"));
const InfiniteLegions = lazy(() => import("./pages/InfiniteLegions.jsx"));
const LiveFeed = lazy(() => import("./pages/LiveFeed.jsx"));
const LocalMap = lazy(() => import("./pages/LocalMap.jsx"));
const MicroCommunities = lazy(() => import("./pages/MicroCommunities.jsx"));
const PiliersLegacy = lazy(() => import("./pages/Piliers.jsx"));
const ReputationSystem = lazy(() => import("./pages/ReputationSystem.jsx"));

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div></div>}>
    <Routes>
      <Route element={<Layout />}>
      <Route path="/intro" element={<Intro />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/underworld" element={<Underworld />} />
      <Route path="/etherealm" element={<Etherealm />} />
      <Route path="/netherealm" element={<Netherealm />} />
      <Route path="/outworld" element={<OutworldChaos />} />
      <Route path="/arene-virtuelle" element={<VirtualCampaignArena />} />
      <Route path="/sanctuary" element={<AnimalSanctuary />} />
      <Route path="/animal-memorial" element={<AnimalMemorialPage />} />
      <Route path="/eternel" element={<EternelBien />} />
      <Route path="/ultimatum" element={<Ultimatum />} />
      <Route path="/playtime" element={<PlayTime />} />
      <Route path="/fuels" element={<SustainableFuels />} />
      <Route path="/ninjas" element={<NinjasManifesto />} />
      <Route path="/independence" element={<GlobalIndependence />} />
      <Route path="/feed" element={<CommunityFeed />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/clay" element={<ClayMockery />} />
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/credits" element={<Credits />} />
      <Route path="/security" element={<Security />} />
      <Route path="/impact" element={<GlobalImpact />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/plateforme/temps-reel" element={<PlatformLiveMetrics />} />
      <Route path="/vault" element={<PersonalVault />} />
      <Route path="/alerts" element={<AlertPreferences />} />
      <Route path="/launch" element={<LaunchNight />} />
      <Route path="/mothers-day" element={<MothersDay />} />
      <Route path="/artisan/:artisanId" element={<ArtisanDetail />} />
      <Route path="/legal" element={<LegalNotice />} />
      <Route path="/legal/singularite" element={<LegalSingularity />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/reports" element={<MonthlyReports />} />
      <Route path="/referral" element={<ReferralKit />} />
      <Route path="/share-quests" element={<ShareQuestsPage />} />
      <Route path="/dashboard-royal" element={<DashboardRoyal />} />
      <Route path="/tutorials" element={<Tutorials />} />
      <Route path="/donations" element={<DonationCalendar />} />
      <Route path="/avatar-creator" element={<AvatarCreator />} />
      <Route path="/universal-hub" element={<UniversalHub />} />
      <Route path="/consciousness" element={<ConsciousnessDirectory />} />
      <Route path="/epic-journey" element={<EpicJourney />} />
      <Route path="/piliers" element={<Piliers144K />} />
      <Route path="/fast-track" element={<FastTrack />} />
      <Route path="/partenaires" element={<Partenaires />} />
      <Route path="/micro-communautes" element={<Navigate to="/communautes" replace />} />
      <Route path="/communautes" element={<MicroCommunautes />} />
      <Route path="/conseil-jedi" element={<ConseilJedi />} />
      <Route path="/portails-mondiaux" element={<PortailsMondiaux />} />
      <Route path="/artisans" element={<ArtisansHub />} />
      <Route path="/smart-contrats" element={<SmartContrats />} />
      <Route path="/micro-outils" element={<MicroOutils />} />
      <Route path="/sceau" element={<SceauEternite />} />
      <Route path="/city-hubs" element={<CityHub />} />
      <Route path="/city-hubs/:citySlug" element={<CityHub />} />
      <Route path="/negociation-ia" element={<NegociationIA />} />
      <Route path="/recommandations" element={<Recommandations />} />
      <Route path="/maitre" element={<MaitreDuJeu />} />
      <Route path="/systeme" element={<SystemeVivant />} />
      <Route path="/heritage" element={<Heritage />} />
      <Route path="/besoins" element={<BesoinsMatch />} />
      <Route path="/carte-ciel" element={<CarteDuCiel />} />
      <Route path="/reves" element={<RevesJournal />} />
      <Route path="/reves-symboles" element={<RevesSymboles />} />
      <Route path="/wellness" element={<HolisticWellness />} />
      <Route path="/wellness-quests" element={<WellnessQuests />} />
      <Route path="/hub-reparation" element={<RepairHub />} />
      <Route path="/numerology" element={<Numerology />} />
      <Route path="/test-your-might" element={<TestYourMight />} />
      <Route path="/paranormal-mystique" element={<ParanormalMystique />} />
      <Route path="/mythologies" element={<MythologiesHub />} />
      <Route path="/bien-etre-lexique" element={<WellnessLexiqueHub />} />
      <Route path="/esotericism" element={<EsotericismHub />} />
      <Route path="/philosophies-beliefs" element={<PhilosophiesBelief />} />
      <Route path="/numerology-paranormal-dashboard" element={<NumerologyParanormalDashboard />} />
      <Route path="/blog" element={<BlogHub />} />
      <Route path="/daily-challenges" element={<DailyChallenges />} />
      <Route path="/sync-mystical-marketplace" element={<SyncMysticalMarketplace />} />
      <Route path="/flora-hub" element={<FloraHub />} />
      <Route path="/fauna-hub" element={<FaunaHub />} />
      <Route path="/insects-hub" element={<InsectsHub />} />
      <Route path="/minerals-hub" element={<MineralsHub />} />
      <Route path="/chemistry-hub" element={<ChemistryHub />} />
      <Route path="/magic-hub" element={<MagicHub />} />
      <Route path="/competitor-intelligence" element={<CompetitorIntelligence />} />
      <Route path="/paparazzi" element={<PaparazziDashboard />} />
      <Route path="/authenticity" element={<AuthenticityControl />} />
      <Route path="/reporters" element={<ReportersDashboard />} />
      <Route path="/fact-check" element={<FactCheckDashboard />} />
      <Route path="/transparency-log" element={<TransparencyLog />} />
      <Route path="/sentinelle" element={<Sentinelle />} />
      <Route path="/conspiracy-myths" element={<ConspiracyMythDatabase />} />
      <Route path="/cosmic-portal" element={<CosmicPortal />} />
      <Route path="/genome" element={<Genome />} />
      <Route path="/pantheon-renders" element={<PantheonRenders />} />
      <Route path="/pantheon-renders/:id" element={<PantheonRenderDetail />} />
      <Route path="/pantheon-3d" element={<Pantheon3D />} />
      <Route path="/encyclopedie-biblique" element={<BibleEncyclopedia />} />
      <Route path="/encyclopedie-biblique/timeline" element={<BibleTimeline />} />
      <Route path="/encyclopedie-biblique/carte" element={<BiblePlacesMap />} />
      <Route path="/encyclopedie-biblique/graphe" element={<BibleGraph />} />
      <Route path="/encyclopedie-biblique/scene/:id" element={<BibleScene3D />} />
      <Route path="/encyclopedie-biblique/:id" element={<BibleEntryDetail />} />
      <Route path="/card/:kind/:id" element={<CardPage />} />
      <Route path="/world" element={<WorldHub />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/commits" element={<GitCommits />} />
      <Route path="/artisan-workshop" element={<ArtisanWorkshop />} />
      <Route path="/corporate-partners" element={<CorporatePartners />} />
      <Route path="/arts-divinatoires" element={<DivinatoryArts />} />
      <Route path="/arts-divinatoires-lexique" element={<DivinatoryLexiqueHub />} />
      <Route path="/global-dashboard" element={<GlobalDashboard />} />
      <Route path="/golden-eye" element={<GoldenEye />} />
      <Route path="/infinite-legions" element={<InfiniteLegions />} />
      <Route path="/live-feed" element={<LiveFeed />} />
      <Route path="/local-map" element={<LocalMap />} />
      <Route path="/micro-communities" element={<MicroCommunities />} />
      <Route path="/piliers-classique" element={<PiliersLegacy />} />
      <Route path="/reputation" element={<ReputationSystem />} />
        <Route path="/atlas" element={<Atlas />} />
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/publier" element={<PostItem />} />
        <Route path="/annonce/:itemId" element={<ItemDetail />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/mon-univers" element={<MyUniverse />} />
        <Route path="/ue-aiouy" element={<UeAiouyHub />} />
        <Route path="/manuel" element={<ManuelPlateforme />} />
        <Route path="/outils-integration" element={<IntegrationsOutilsHub />} />
        <Route path="/carte-site" element={<CarteSiteEtLiens />} />
        <Route path="/hub-fondations" element={<EnterpriseLearningHub />} />
        <Route path="/hub-souverain" element={<SovereignEcoHub />} />
        <Route path="/offline-profile" element={<OfflineProfile />} />
        <Route path="/import-csv" element={<ImportCSV />} />
        <Route path="/actualite" element={<Actualite />} />
        <Route path="/abonnement" element={<Abonnement />} />
        <Route path="/soutien" element={<Soutien />} />
        <Route path="/jeu" element={<Jeu />} />
        <Route path="/game" element={<Game />} />
        <Route path="/charte" element={<Charte />} />
        <Route path="/alliance" element={<Alliance />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
    </Suspense>
  );
};


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <MagicLayout>
                <PushNotifications />
                {EXPERIENCE_FLAGS.ambientMusic ? <AmbientMusic /> : null}
                {EXPERIENCE_FLAGS.audioControl ? <AudioControl /> : null}
                <OfflineIndicator />
                {EXPERIENCE_FLAGS.sovereigntyBanner ? <SovereigntyBanner /> : null}
                {EXPERIENCE_FLAGS.launchIntro ? <LaunchIntro /> : null}
                <TorusTransactionSigil />
                <UniversePreferencesSync />
                <CheatCodeGateway />
                <ConciergeOrb />
                <WarpZoneProvider>
                  <PersonalRealmGuard />
                  <AuthenticatedApp />
                </WarpZoneProvider>
                <Toaster />
                <SonnerToaster />
              </MagicLayout>
            </Router>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App