import React, { useState } from 'react';
import { BigButton } from './shared/components/BigButton';
import { ParentPanel } from './shared/components/ParentPanel';
import { motion } from 'framer-motion';

const apps = [
  { id: 'routine', name: 'My Day', emoji: '🌞', path: '/routine', color: 'bg-orange-400' },
  { id: 'timer', name: 'Timer', emoji: '⏳', path: '/timer', color: 'bg-blue-400' },
  { id: 'stars', name: 'My Stars', emoji: '⭐', path: '/stars', color: 'bg-yellow-400' },
  { id: 'food', name: 'Food Time', emoji: '🍎', path: '/food', color: 'bg-green-400' },
  { id: 'bath', name: 'Bath Time', emoji: '🛁', path: '/bath', color: 'bg-cyan-400' },
  { id: 'colors', name: 'Colors', emoji: '🎨', path: '/colors', color: 'bg-pink-400' },
  { id: 'shapes', name: 'Shapes', emoji: '🔷', path: '/shapes', color: 'bg-purple-400' },
  { id: 'counting', name: 'Counting', emoji: '🔢', path: '/counting', color: 'bg-indigo-400' },
  { id: 'animals', name: 'Animals', emoji: '🦁', path: '/animals', color: 'bg-amber-400' },
  { id: 'draw', name: 'Draw', emoji: '✏️', path: '/draw', color: 'bg-rose-400' },
  { id: 'stories', name: 'Stories', emoji: '📖', path: '/stories', color: 'bg-teal-400' },
];

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [showParentPanel, setShowParentPanel] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);

  const handleSettingsPress = () => {
    const timer = window.setTimeout(() => {
      setShowParentPanel(true);
    }, 1500); // Long press for 1.5 seconds
    setLongPressTimer(timer);
  };

  const handleSettingsRelease = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleAppClick = (appId: string) => {
    // Navigate to all available apps
    onNavigate(appId as any);
  };

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-theme-text"
        >
          <span className="text-5xl md:text-7xl mr-3">🏠</span>
          Srishti's Home
        </motion.h1>

        {/* Settings Icon (Long Press) */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onMouseDown={handleSettingsPress}
          onMouseUp={handleSettingsRelease}
          onTouchStart={handleSettingsPress}
          onTouchEnd={handleSettingsRelease}
          className="text-4xl opacity-30 hover:opacity-50 transition-opacity"
        >
          ⚙️
        </motion.button>
      </header>

      {/* App Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
        {apps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <BigButton
              emoji={app.emoji}
              onClick={() => handleAppClick(app.id)}
              color={app.color}
              size="large"
            >
              {app.name}
            </BigButton>
          </motion.div>
        ))}
      </div>

      {/* Parent Panel */}
      <ParentPanel
        isOpen={showParentPanel}
        onClose={() => setShowParentPanel(false)}
      />
    </div>
  );
};
