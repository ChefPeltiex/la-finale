import { useEffect } from "react";
import { SITE_ORIGIN, SITE_TAGLINE, SITE_SEO_KEYWORDS } from "@/lib/site";

const MANIFESTO_SIGNATURE = "DE MOI, PAR MOI, POUR MOI. DOMINIC PELLETIER.";

export default function SEOMeta({
  title = "Egor69",
  description = SITE_TAGLINE,
  keywords = SITE_SEO_KEYWORDS,
  ogImage = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=630&fit=crop",
  ogType = "website",
  canonicalUrl = SITE_ORIGIN,
  schemaData = null,
  twitterCard = "summary_large_image"
}) {
  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : SITE_ORIGIN;
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

    const normalizeCanonical = (value) => {
      const raw = (value || "").trim();
      if (!raw) return `${origin}${pathname}`;
      // Accept relative paths
      if (raw.startsWith("/")) return `${origin}${raw}`;
      // Migrer anciens domaines vers le canonique
      if (raw.includes("circul-ai-hub.com") || raw.includes("circulo-share-loop.com") || raw.includes("igor.app")) {
        try {
          const u = new URL(raw);
          return `${SITE_ORIGIN}${u.pathname}${u.search}${u.hash}`;
        } catch {
          return SITE_ORIGIN;
        }
      }
      return raw;
    };

    // Update standard meta tags
    const finalTitle = title?.includes("DOMINIC PELLETIER") ? title : `${title} — ${MANIFESTO_SIGNATURE}`;
    const finalDesc = description?.includes("DE MOI, PAR MOI, POUR MOI") ? description : `${description} ${MANIFESTO_SIGNATURE}`;
    const finalKeywords = keywords?.includes("Dominic") ? keywords : `${keywords}, de moi par moi pour moi, dominic pelletier`;
    const finalCanonical = normalizeCanonical(canonicalUrl);

    document.title = finalTitle;
    
    const updateMeta = (name, value) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = value;
    };

    const updateProperty = (property, value) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.property = property;
        document.head.appendChild(tag);
      }
      tag.content = value;
    };

    updateMeta("description", finalDesc);
    updateMeta("keywords", finalKeywords);
    updateMeta("author", "Dominic Pelletier");
    updateMeta("twitter:card", twitterCard);
    updateMeta("twitter:title", finalTitle);
    updateMeta("twitter:description", finalDesc);
    updateMeta("twitter:image", ogImage);

    updateProperty("og:type", ogType);
    updateProperty("og:title", finalTitle);
    updateProperty("og:description", finalDesc);
    updateProperty("og:image", ogImage);
    updateProperty("og:url", finalCanonical);

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = finalCanonical;

    // Add Schema.org markup if provided
    if (schemaData) {
      let schema = document.getElementById("page-schema");
      if (!schema) {
        schema = document.createElement("script");
        schema.id = "page-schema";
        schema.type = "application/ld+json";
        document.head.appendChild(schema);
      }
      schema.textContent = JSON.stringify(schemaData);
    }
  }, [title, description, keywords, ogImage, ogType, canonicalUrl, schemaData, twitterCard]);

  return null;
}