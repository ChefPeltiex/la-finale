import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "circul_user_prefs";
const MAX_HISTORY = 30;

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}

function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// Incrément avec decay exponentiel (les actions récentes comptent plus)
function increment(map, key, weight = 1) {
  const current = map[key] || 0;
  return { ...map, [key]: +(current * 0.9 + weight).toFixed(3) };
}

export function useUserPreferences() {
  const [prefs, setPrefs] = useState(load);
  const saveTimer = useRef(null);

  // Persist debouncé
  const persist = useCallback((next) => {
    setPrefs(next);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(next), 1000);
  }, []);

  // Enregistre une visite de page
  const trackPage = useCallback((path) => {
    setPrefs(prev => {
      const next = {
        ...prev,
        pages: increment(prev.pages || {}, path),
        lastSeen: Date.now(),
        sessionPages: (prev.sessionPages || 0) + 1,
      };
      persist(next);
      return next;
    });
  }, [persist]);

  // Enregistre un clic sur une annonce
  const trackListing = useCallback((listing) => {
    setPrefs(prev => {
      const next = {
        ...prev,
        types: increment(prev.types || {}, listing.type, 2),
        categories: listing.category ? increment(prev.categories || {}, listing.category, 1.5) : prev.categories,
        priceRange: {
          min: Math.min(prev.priceRange?.min ?? Infinity, listing.price || 0),
          max: Math.max(prev.priceRange?.max ?? 0, listing.price || 0),
          avg: prev.priceRange?.avg
            ? +(prev.priceRange.avg * 0.8 + (listing.price || 0) * 0.2).toFixed(2)
            : listing.price || 0,
        },
        history: [
          { id: listing.id, type: listing.type, t: Date.now() },
          ...(prev.history || [])
        ].slice(0, MAX_HISTORY),
      };
      persist(next);
      return next;
    });
  }, [persist]);

  // Enregistre une recherche texte
  const trackSearch = useCallback((query) => {
    if (!query || query.length < 2) return;
    setPrefs(prev => {
      const next = {
        ...prev,
        searches: [query, ...(prev.searches || [])].slice(0, 10),
      };
      persist(next);
      return next;
    });
  }, [persist]);

  // Résumé lisible pour le prompt IA
  const getSummary = useCallback(() => {
    const p = load(); // lire depuis storage pour avoir les données fraîches
    const parts = [];

    if (p.types) {
      const top = Object.entries(p.types).sort((a, b) => b[1] - a[1]).slice(0, 2);
      if (top.length) parts.push(`Préfère les annonces de type : ${top.map(([k]) => k).join(", ")}`);
    }
    if (p.categories) {
      const top = Object.entries(p.categories).sort((a, b) => b[1] - a[1]).slice(0, 2);
      if (top.length) parts.push(`Catégories favorites : ${top.map(([k]) => k).join(", ")}`);
    }
    if (p.priceRange?.avg !== undefined) {
      parts.push(`Budget moyen consulté : ~${Math.round(p.priceRange.avg)}$`);
    }
    if (p.searches?.length) {
      parts.push(`Recherches récentes : "${p.searches.slice(0, 3).join('", "')}"`);
    }
    if (p.pages) {
      const top = Object.entries(p.pages).sort((a, b) => b[1] - a[1]).slice(0, 3);
      if (top.length) parts.push(`Pages les plus visitées : ${top.map(([k]) => k).join(", ")}`);
    }
    const viewedIds = (p.history || []).map(h => h.id);
    return { summary: parts.join(". "), viewedIds };
  }, []);

  return { prefs, trackPage, trackListing, trackSearch, getSummary };
}