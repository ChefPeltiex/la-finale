import { Link } from "react-router-dom";

const REALMS = [
  { to: "/etherealm", slug: "etherealm", label: "Etherealm", hint: "élévation · don lumineux" },
  { to: "/netherealm", slug: "netherealm", label: "Netherealm", hint: "neutre · lecture calme" },
  { to: "/outworld", slug: "outworld", label: "Outworld", hint: "fiction · chaos réversible" },
];

/** Navigation courte entre les trois plans narratifs Egor69. */
export default function ThreeRealmsNav({ currentSlug }) {
  return (
    <nav
      aria-label="Navigation trois plans"
      className="rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md p-4 sm:p-5"
    >
      <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mb-3 text-center">
        Trilogie des plans
      </p>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
        {REALMS.map((r) => {
          const active = currentSlug === r.slug;
          return (
            <Link
              key={r.slug}
              to={r.to}
              className={`flex-1 rounded-xl border px-4 py-3 text-center transition-colors ${
                active
                  ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-100"
                  : "border-white/12 bg-white/5 text-white/75 hover:border-white/25 hover:bg-white/10"
              }`}
            >
              <span className="block font-display font-bold text-sm">{r.label}</span>
              <span className="block text-[10px] text-white/45 mt-0.5">{r.hint}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
