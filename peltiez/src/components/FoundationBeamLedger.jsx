import { MASTER_BEAM_META } from "@/data/masterBeamFoundation";

/**
 * Vue « classeur » : tableau HTML dense façon grille Excel — données injectées par props.
 */
export default function FoundationBeamLedger({ title, columns, rows, footnote }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="px-3 py-2 bg-muted/60 border-b border-border flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground">{title}</span>
        <span className="text-[10px] font-mono text-muted-foreground">{MASTER_BEAM_META.key}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-2 font-semibold text-foreground whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id || i}
                className={`border-b border-border/80 ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-2 align-top text-muted-foreground max-w-[280px]">
                    {row[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote ? <p className="text-[11px] text-muted-foreground px-3 py-2 bg-muted/30 border-t border-border">{footnote}</p> : null}
    </div>
  );
}
