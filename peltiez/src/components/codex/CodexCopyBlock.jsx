import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CodexCopyBlock({ title, audience, body }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <article className="rounded-xl border border-white/10 bg-black/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-amber-400/90">{audience}</p>
          <h3 className="font-semibold text-white mt-1">{title}</h3>
        </div>
        <Button type="button" size="sm" variant="outline" className="border-amber-500/30 shrink-0" onClick={copy}>
          {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
          {copied ? "Copié" : "Copier"}
        </Button>
      </div>
      <pre className="mt-3 text-sm text-white/70 whitespace-pre-wrap font-sans leading-relaxed">{body}</pre>
    </article>
  );
}
