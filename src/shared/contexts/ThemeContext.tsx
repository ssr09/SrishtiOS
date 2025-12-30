import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ThemeName } from '../types';
import { themes, defaultTheme } from '../themes/themes';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useLocalStorage<ThemeName>('srishti-theme', defaultTheme);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { themes };
