import '@testing-library/jest-dom/vitest'

// Les tests de rendu tournent en jsdom, qui ne fournit ni matchMedia ni
// IntersectionObserver. On les remplit ici pour que le rendu reste fidèle
// à ce que le navigateur exécute, sans modifier le code de l'application.
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia
  }

  if (!window.scrollTo) {
    window.scrollTo = (() => {}) as unknown as typeof window.scrollTo
  }
}
