import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  useEffect(() => {
    // Appliquer le thème sombre par défaut
    document.documentElement.classList.add('dark');

    // Charger les préférences utilisateur
    const saved = localStorage.getItem('theme-preference');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
    }

    return () => {
      // Cleanup
    };
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme-preference', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme-preference', 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}