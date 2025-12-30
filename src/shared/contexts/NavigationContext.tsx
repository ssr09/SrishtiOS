import React, { createContext, useContext, useCallback } from 'react';

type AppRoute = 'home' | 'routine' | 'timer' | 'stars' | 'food' | 'bath' | 'colors' | 'shapes' | 'counting' | 'animals' | 'draw' | 'stories';

interface NavigationContextType {
  navigate: (route: AppRoute) => void;
  goHome: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

interface NavigationProviderProps {
  children: React.ReactNode;
  onNavigate: (route: AppRoute) => void;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children, onNavigate }) => {
  const navigate = useCallback((route: AppRoute) => {
    onNavigate(route);
  }, [onNavigate]);

  const goHome = useCallback(() => {
    onNavigate('home');
  }, [onNavigate]);

  return (
    <NavigationContext.Provider value={{ navigate, goHome }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export type { AppRoute };
