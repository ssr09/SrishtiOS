import React, { createContext, useContext, useCallback, useEffect } from 'react';

type AppRoute = 'home' | 'routine' | 'timer' | 'stars' | 'food' | 'bath' | 'colors' | 'shapes' | 'color-shapes' | 'phonics' | 'phonics-cards' | 'first-counting' | 'counting' | 'animals' | 'draw' | 'stories';

const validRoutes: AppRoute[] = ['home', 'routine', 'timer', 'stars', 'food', 'bath', 'colors', 'shapes', 'color-shapes', 'phonics', 'phonics-cards', 'first-counting', 'counting', 'animals', 'draw', 'stories'];

const getRouteFromHash = (): AppRoute => {
  const hash = window.location.hash.slice(1); // Remove #
  return validRoutes.includes(hash as AppRoute) ? (hash as AppRoute) : 'home';
};

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
  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromHash();
      onNavigate(route);
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial route from URL hash
    const initialRoute = getRouteFromHash();
    if (initialRoute !== 'home') {
      onNavigate(initialRoute);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [onNavigate]);

  const navigate = useCallback((route: AppRoute) => {
    // Push to browser history
    window.history.pushState({ route }, '', `#${route}`);
    onNavigate(route);
  }, [onNavigate]);

  const goHome = useCallback(() => {
    // Push home to history
    window.history.pushState({ route: 'home' }, '', '#home');
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
