import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, MapPin, Sparkles } from "lucide-react";
import SEOMeta from "@/components/SEOMeta";
import { CIRCULAI_BRAND, SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import { CIRCULAI_EGOR_SPLIT, CIRCULAI_KIT_DOCS } from "@/lib/circulaiEgorBrand";

export default function CirculaiKitRegional() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-sky-950/25 via-zinc-950 to-emerald-950/20 pb-24 sm:pb-16">
      <div className="container max-w-3xl py-6 sm:py-8 px-4 sm:px-6">
        <SEOMeta
          title={`Kit régional — ${CIRCULAI_BRAND}`}
          description="Lettre pilote municipal, plan d'affaires v2 (cabinet / investisseur), plan d'action Québec 2026 et script démo 10 min — CirculAI uniquement."
          keywords="circulai kit, pilote municipal, plan affaires régional, québec ville, économie circulaire"
          canonicalUrl={`${SITE_ORIGIN}/docs/circulai-kit-regional`}
        />

        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            to="/entreprises"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-zinc-900/80 px-3 py-2 text-sm text-white/85 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Entreprises & pilote
          </Link>
          <Link
            to="/pilote"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/10"
          >
            Pilote 90 jours
          </Link>
        </div>

        <header className="mb-8 rounded-2xl border border-sky-500/30 bg-black/45 p-6 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
            {CIRCULAI_BRAND} · territoire · investisseur
          </p>
          <h1 className="mt-2 text-2xl font-bold text-sky-100">Kit régional</h1>
          <p className="mt-2 text-sm text-white/75 leading-relaxed">
            Dossier municipal / OBNL : lettre type,{" "}
            <strong className="text-white/90">plan d&apos;affaires v2</strong> (cabinet & investisseur), plan
            d&apos;action 2026 et script démo 10 min. Exemple :{" "}
            <span className="text-emerald-300/90">Ville de Québec</span>.
          </p>
          <p className="mt-3 inline-flex flex-wrap items-center gap-2 text-xs text-white/55">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden />
            <a
              href="https://fr.wikipedia.org/wiki/Qu%C3%A9bec_(ville)"
              className="text-sky-300 underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Québec (ville)
            </a>
            <span className="text-white/30">·</span>
            <a
              href="https://fr.wikipedia.org/wiki/Hydro-Qu%C3%A9bec"
              className="text-sky-300 underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hydro-Québec
            </a>
            <span className="text-white/30">·</span>
            <a
              href="https://fr.wikipedia.org/wiki/Investissement_Qu%C3%A9bec"
              className="text-sky-300 underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Investissement Québec
            </a>
          </p>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/35 bg-emerald-950/25 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/90">
              {CIRCULAI_EGOR_SPLIT.circulai.name}
            </p>
            <p className="mt-1 text-xs text-emerald-200/80">{CIRCULAI_EGOR_SPLIT.circulai.role}</p>
            <p className="mt-2 text-sm text-white/70 leading-relaxed">{CIRCULAI_EGOR_SPLIT.circulai.pitch}</p>
          </div>
          <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300/90">
              {CIRCULAI_EGOR_SPLIT.egor.name}
            </p>
            <p className="mt-1 text-xs text-violet-200/70">{CIRCULAI_EGOR_SPLIT.egor.role}</p>
            <p className="mt-2 text-sm text-white/65 leading-relaxed">{CIRCULAI_EGOR_SPLIT.egor.pitch}</p>
            <Link to="/world" className="mt-2 inline-flex items-center gap-1 text-xs text-violet-300 hover:underline">
              <Sparkles className="h-3 w-3" aria-hidden />
              Verse 3D (hors dossier municipal)
            </Link>
          </div>
        </section>

        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-sky-400/90">
          Dossier municipal · preuves · partenaires
        </p>
        <ul className="space-y-3">
          {CIRCULAI_KIT_DOCS.map((doc) => (
            <li key={doc.id} className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden">
              <Link to={doc.path} className="flex items-center gap-3 px-4 py-4 transition hover:bg-sky-950/20">
                <FileText className="h-5 w-5 shrink-0 text-sky-400" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white/90">{doc.title}</p>
                  <p className="text-xs text-white/50 font-mono">{doc.path}</p>
                  {doc.summary ? <p className="mt-1 text-xs text-white/55">{doc.summary}</p> : null}
                </div>
              </Link>
              <div className="border-t border-white/10 px-4 py-2">
                <a
                  href={`/docs/${doc.file}`}
                  download
                  className="inline-flex items-center gap-1.5 text-xs text-sky-300/90 hover:text-sky-200"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  Télécharger le fichier .md
                </a>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-xs text-white/45 leading-relaxed">
          <strong className="text-white/60">Où récupérer sur disque :</strong>{" "}
          <code className="text-[10px]">peltiez/public/docs/circulai/</code> (web) · miroir{" "}
          <code className="text-[10px]">peltiez/docs/circulai/</code> (dépôt). {SITE_NAME} = jumeau divertissement,
          hors pitch mairie.
        </p>
      </div>
    </div>
  );
}
