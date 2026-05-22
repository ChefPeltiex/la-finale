/** Cadre or — coins filigrane (style planche Larousse / oracle) */
export default function PlancheOrFrame({ children, className = "" }) {
  return (
    <div className={`relative border border-[#D4AF37]/40 rounded-lg ${className}`}>
      <span className="pointer-events-none absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FFD700]/60 rounded-tl-lg" />
      <span className="pointer-events-none absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FFD700]/60 rounded-tr-lg" />
      <span className="pointer-events-none absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#FFD700]/60 rounded-bl-lg" />
      <span className="pointer-events-none absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#FFD700]/60 rounded-br-lg" />
      {children}
    </div>
  );
}
