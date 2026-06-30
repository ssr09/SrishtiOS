import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSyncedStorage } from '../../shared/hooks/useSyncedStorage';
import { useVoice } from '../../shared/hooks/useVoice';
import { AppHeader } from '../../shared/components/AppHeader';
import type { BathToy } from './toyDatabase';
import { defaultToys, categoryConfig } from './toyDatabase';

export const BathBuddy: React.FC = () => {
  const [toys] = useSyncedStorage<BathToy[]>('bathToys', defaultToys);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { speak } = useVoice();

  const filteredToys = toys.filter(toy => !selectedCategory || toy.category === selectedCategory);

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-6">
      <div className="mb-4">
        <AppHeader title="Bath Time" emoji="🛁" />
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex gap-4 md:gap-6">
        {/* Left Sidebar - Category Selector */}
        <div className="flex flex-col gap-3 shrink-0">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`
              w-28 md:w-36 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold transition-all flex flex-col items-center gap-1
              ${!selectedCategory
                ? 'bg-cyan-400 text-white scale-105 shadow-lg'
                : 'bg-white text-theme-text hover:scale-105'
              }
            `}
          >
            <span className="text-4xl md:text-5xl">🛁</span>
            <span>All</span>
          </button>

          {categoryConfig.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                w-28 md:w-36 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold transition-all flex flex-col items-center gap-1
                ${selectedCategory === category.id
                  ? 'bg-cyan-400 text-white scale-105 shadow-lg'
                  : 'bg-white text-theme-text hover:scale-105'
                }
              `}
            >
              <span className="text-4xl md:text-5xl">{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Right Side - Toys Grid */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {filteredToys.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-9xl mb-4">🤔</div>
                <div className="text-3xl text-theme-text-secondary">
                  No toys found
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={selectedCategory || 'all'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
              >
                {filteredToys.map((toy, index) => (
                  <motion.div
                    key={toy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.button
                      onClick={() => speak(toy.name)}
                      className="w-full rounded-3xl p-6 shadow-lg transition-all relative bg-white hover:scale-105 active:scale-95"
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-8xl mb-3">{toy.emoji}</div>
                      <div className="text-2xl font-bold text-theme-text">{toy.name}</div>
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
