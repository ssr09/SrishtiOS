import React, { useState } from 'react';
import { BigButton } from './shared/components/BigButton';
import { ParentPanel } from './shared/components/ParentPanel';
import { useNavigation, type AppRoute } from './shared/contexts/NavigationContext';
import { useSyncedStorage } from './shared/hooks/useSyncedStorage';
import { motion, AnimatePresence } from 'framer-motion';

export const apps = [
  { id: 'routine', name: 'My Day', emoji: '🌞', color: 'bg-orange-400' },
  { id: 'timer', name: 'Timer', emoji: '⏳', color: 'bg-blue-400' },
  { id: 'stars', name: 'My Stars', emoji: '⭐', color: 'bg-yellow-400' },
  { id: 'food', name: 'Food Time', emoji: '🍎', color: 'bg-green-400' },
  { id: 'bath', name: 'Bath Time', emoji: '🛁', color: 'bg-cyan-400' },
  { id: 'colors', name: 'Colors', emoji: '🎨', color: 'bg-pink-400' },
  { id: 'shapes', name: 'Shapes', emoji: '🔷', color: 'bg-purple-400' },
  { id: 'color-shapes', name: 'Color Shapes', emoji: '🟢', color: 'bg-lime-400' },
  { id: 'phonics', name: 'Phonics', emoji: '🔤', color: 'bg-sky-400' },
  { id: 'phonics-cards', name: 'Phonics Cards', emoji: 'Aa', color: 'bg-violet-400' },
  { id: 'first-counting', name: 'First Counting', emoji: '🍎', color: 'bg-emerald-400' },
  { id: 'counting', name: 'Counting', emoji: '🔢', color: 'bg-indigo-400' },
  { id: 'animals', name: 'Animals', emoji: '🦁', color: 'bg-amber-400' },
  { id: 'draw', name: 'Draw', emoji: '✏️', color: 'bg-rose-400' },
  { id: 'color-animals', name: 'Color Animals', emoji: '🦏', color: 'bg-fuchsia-400' },
  { id: 'stories', name: 'Stories', emoji: '📖', color: 'bg-teal-400' },
];

export const HomePage: React.FC = () => {
  const { navigate } = useNavigation();
  const [showParentPanel, setShowParentPanel] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [archivedApps] = useSyncedStorage<string[]>('archivedApps', []);
  const [appLastUsed, setAppLastUsed] = useSyncedStorage<Record<string, number>>('appLastUsed', {});

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
    // Track last used time
    setAppLastUsed({ ...appLastUsed, [appId]: Date.now() });
    navigate(appId as AppRoute);
  };

  // Filter apps into active and archived
  const activeApps = apps.filter(app => !archivedApps.includes(app.id));
  const archivedAppsList = apps
    .filter(app => archivedApps.includes(app.id))
    .sort((a, b) => {
      // Sort by last used (most recent first), fallback to 0 for never-used apps
      const aTime = appLastUsed[a.id] || 0;
      const bTime = appLastUsed[b.id] || 0;
      return bTime - aTime;
    });

  return (
    <div className="min-h-screen bg-theme-bg p-4 pb-24 md:p-8 md:pb-8 overflow-y-auto">
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

      {/* App Grid - Active Apps */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
        {activeApps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
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

      {/* Archived Apps Section */}
      {archivedAppsList.length > 0 && (
        <div className="mt-8 max-w-7xl mx-auto">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2 text-theme-text-secondary hover:text-theme-text transition-colors mb-4"
          >
            <span className="text-2xl">{showArchived ? '📂' : '📁'}</span>
            <span className="text-lg font-semibold">More Apps ({archivedAppsList.length})</span>
            <span className="text-xl">{showArchived ? '▼' : '▶'}</span>
          </button>

          <AnimatePresence>
            {showArchived && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                data-testid="archived-apps"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 overflow-hidden"
              >
                {archivedAppsList.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BigButton
                      emoji={app.emoji}
                      onClick={() => handleAppClick(app.id)}
                      color={app.color}
                      size="large"
                      className="opacity-75 hover:opacity-100"
                    >
                      {app.name}
                    </BigButton>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Parent Panel */}
      <ParentPanel
        isOpen={showParentPanel}
        onClose={() => setShowParentPanel(false)}
      />
    </div>
  );
};
