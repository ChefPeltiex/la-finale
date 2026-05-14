export function buildCardShare({ card, origin } = {}) {
  const o = origin || (typeof window !== "undefined" ? window.location.origin : "https://egor69.ca");
  const url = `${o}/card/${encodeURIComponent(card.kind)}/${encodeURIComponent(card.id)}`;
  const title = `${card.title} • Egor69`;
  const hook = card.summary || "Une fiche = une sensation + une action.";
  const text = `${hook}\n\n${url}`;

  return {
    url,
    title,
    text,
    links: {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(hook)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
    },
  };
}

