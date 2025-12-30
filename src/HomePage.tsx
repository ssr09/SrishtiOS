import React, { useState } from 'react';
import { BigButton } from './shared/components/BigButton';
import { ParentPanel } from './shared/components/ParentPanel';
import { useNavigation, type AppRoute } from './shared/contexts/NavigationContext';
import { motion } from 'framer-motion';

const apps = [
  { id: 'routine', name: 'My Day', emoji: '🌞', color: 'bg-orange-400' },
  { id: 'timer', name: 'Timer', emoji: '⏳', color: 'bg-blue-400' },
  { id: 'stars', name: 'My Stars', emoji: '⭐', color: 'bg-yellow-400' },
  { id: 'food', name: 'Food Time', emoji: '🍎', color: 'bg-green-400' },
  { id: 'bath', name: 'Bath Time', emoji: '🛁', color: 'bg-cyan-400' },
  { id: 'colors', name: 'Colors', emoji: '🎨', color: 'bg-pink-400' },
  { id: 'shapes', name: 'Shapes', emoji: '🔷', color: 'bg-purple-400' },
  { id: 'counting', name: 'Counting', emoji: '🔢', color: 'bg-indigo-400' },
  { id: 'animals', name: 'Animals', emoji: '🦁', color: 'bg-amber-400' },
  { id: 'draw', name: 'Draw', emoji: '✏️', color: 'bg-rose-400' },
  { id: 'stories', name: 'Stories', emoji: '📖', color: 'bg-teal-400' },
];

export const HomePage: React.FC = () => {
  const { navigate } = useNavigation();
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
    navigate(appId as AppRoute);
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
