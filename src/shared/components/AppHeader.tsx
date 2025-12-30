import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';

interface AppHeaderProps {
  title: string;
  emoji: string;
  onHome?: () => void; // Override default goHome behavior (e.g., for back navigation within an app)
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, emoji, onHome }) => {
  const { goHome } = useNavigation();

  const handleHomeClick = () => {
    if (onHome) {
      onHome();
    } else {
      goHome();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl md:text-4xl font-bold text-theme-text flex items-center gap-2">
        <span className="text-4xl">{emoji}</span>
        {title}
      </h1>
      <button
        onClick={handleHomeClick}
        className="text-4xl hover:scale-110 transition-transform"
      >
        🏠
      </button>
    </div>
  );
};
