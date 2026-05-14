import { useState, useEffect } from "react";
import { getLang, setLang as setLangStore, T } from "@/lib/translations";

export function useLanguage() {
  const [lang, setLangState] = useState(getLang());

  useEffect(() => {
    const handler = () => setLangState(getLang());
    window.addEventListener("lang_change", handler);
    return () => window.removeEventListener("lang_change", handler);
  }, []);

  const setLang = (code) => {
    setLangStore(code);
    setLangState(code);
  };

  const t = T[lang] || T.fr;

  return { lang, setLang, t };
}