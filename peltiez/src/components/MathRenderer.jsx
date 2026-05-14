import "katex/dist/katex.min.css";
import katex from "katex";
import { useMemo } from "react";

function renderKatex(math, displayMode) {
  if (math == null || math === "") return "";
  try {
    return katex.renderToString(String(math), {
      displayMode,
      throwOnError: false,
    });
  } catch {
    return String(math);
  }
}

export function MathInline({ math }) {
  const html = useMemo(() => renderKatex(math, false), [math]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function MathBlock({ math }) {
  const html = useMemo(() => renderKatex(math, true), [math]);
  return <div className="katex-display" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** `display`: true = formule centrée (bloc). */
export default function MathRenderer({ content, display = false }) {
  return display ? <MathBlock math={content} /> : <MathInline math={content} />;
}
