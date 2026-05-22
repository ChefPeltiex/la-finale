/** En-tête uniforme pages « pro » — crédibilité marketplace / CirculAI */
/** @param {{ eyebrow?: string, title: import('react').ReactNode, description?: import('react').ReactNode, children?: import('react').ReactNode, variant?: string }} props */
export default function PlatformPageHeader({
  eyebrow,
  title,
  description,
  children,
  variant = "emerald",
}) {
  const accent =
    variant === "sky"
      ? "text-sky-700"
      : variant === "violet"
        ? "text-violet-700"
        : variant === "amber"
          ? "text-amber-700"
          : "text-emerald-700";

  return (
    <header className="platform-page-header mb-8 sm:mb-10">
      {eyebrow ? (
        <p className={`text-xs font-bold uppercase tracking-[0.18em] ${accent}`}>{eyebrow}</p>
      ) : null}
      <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{title}</h1>
      {description ? (
        <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
      ) : null}
      {children ? <div className="mt-6 flex flex-wrap gap-2">{children}</div> : null}
    </header>
  );
}
