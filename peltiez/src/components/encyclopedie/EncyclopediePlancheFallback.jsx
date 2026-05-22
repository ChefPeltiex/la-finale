/** Planche Larousse — repli or & noir quand l'image n'est pas encore importée */
export default function EncyclopediePlancheFallback({ num, title, compact = false }) {
  const rot = (Number(num) || 1) * 24;
  return (
    <div
      className={`relative w-full h-full bg-gradient-to-b from-[#1a1508] via-black to-black flex flex-col items-center justify-center overflow-hidden ${compact ? "min-h-[200px]" : "min-h-full"}`}
      aria-hidden={compact ? undefined : true}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 35%, rgba(212,175,55,0.35), transparent)`,
        }}
      />
      <svg
        className="absolute opacity-50"
        style={{ transform: `rotate(${rot}deg)` }}
        width={compact ? 120 : 200}
        height={compact ? 120 : 200}
        viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="88" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity="0.7" />
        <circle cx="100" cy="100" r="28" fill="none" stroke="#F5F0E6" strokeWidth="0.4" opacity="0.5" />
      </svg>
      <div className="relative z-10 text-center px-4">
        <p className="text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase">{num}.</p>
        {!compact && (
          <p className="mt-2 font-display text-sm md:text-base text-[#FFD700] uppercase max-w-[14rem] leading-snug">
            {title}
          </p>
        )}
        <p className="mt-2 text-[9px] text-[#F5F0E6]/40 uppercase tracking-widest">φ · planche à venir</p>
      </div>
      <div className="absolute inset-3 border border-[#D4AF37]/35 rounded-lg pointer-events-none" />
    </div>
  );
}
