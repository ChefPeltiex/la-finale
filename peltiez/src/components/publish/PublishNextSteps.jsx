import { Link } from "react-router-dom";
import { ShoppingBag, BookOpen, Download, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    label: "Voir le marketplace",
    desc: "Parcourir les annonces actives",
    to: "/marketplace",
    icon: ShoppingBag,
  },
  {
    label: "Explorer l'Atlas",
    desc: "Fiches vivantes et savoirs",
    to: "/atlas",
    icon: BookOpen,
  },
  {
    label: "Télécharger l'encyclopédie",
    desc: "PDF visuel principal",
    href: "/encyclopedie.pdf",
    icon: Download,
    external: true,
  },
];

export default function PublishNextSteps({ className }) {
  return (
    <aside
      className={cn("pilot-card p-5", className)}
      aria-labelledby="publish-next-steps-title"
    >
      <h2 id="publish-next-steps-title" className="font-display font-bold text-sm text-[#FFD700]">
        Prochaines étapes
      </h2>
      <p className="text-xs text-white/55 mt-1 mb-4">
        Après publication, poursuivre le parcours pilote en un clic.
      </p>
      <ul className="space-y-2">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const inner = (
            <>
              <Icon className="h-4 w-4 shrink-0 text-[#FFD700]/80" aria-hidden />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-white/90">{step.label}</span>
                <span className="block text-[11px] text-white/45">{step.desc}</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/30" aria-hidden />
            </>
          );
          const rowClass =
            "flex items-center gap-3 rounded-xl border border-[#D4AF37]/20 bg-black/40 px-3 py-2.5 transition-colors hover:border-[#FFD700]/40 hover:bg-[#FFD700]/5";

          if (step.href) {
            return (
              <li key={step.label}>
                <a
                  href={step.href}
                  download="encyclopedie.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={rowClass}
                >
                  {inner}
                </a>
              </li>
            );
          }

          return (
            <li key={step.label}>
              <Link to={step.to} className={rowClass}>
                {inner}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
