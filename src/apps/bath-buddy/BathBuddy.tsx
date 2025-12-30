import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSyncedStorage } from '../../shared/hooks/useSyncedStorage';
import { usePrint } from '../../shared/hooks/usePrint';
import { AppHeader } from '../../shared/components/AppHeader';
import { SelectableCard } from '../../shared/components/SelectableCard';
import type { BathToy } from './toyDatabase';
import { defaultToys, categoryConfig } from './toyDatabase';

export const BathBuddy: React.FC = () => {
  const [toys] = useSyncedStorage<BathToy[]>('bathToys', defaultToys);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedToys, setSelectedToys] = useState<string[]>([]);
  const { print } = usePrint();

  const filteredToys = toys.filter(toy => !selectedCategory || toy.category === selectedCategory);

  const MAX_SELECTIONS = 3;

  const toggleToy = (toyId: string) => {
    setSelectedToys(prev => {
      if (prev.includes(toyId)) {
        return prev.filter(id => id !== toyId);
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev;
      }
      return [...prev, toyId];
    });
  };

  const handlePrint = () => {
    const selected = toys.filter(t => selectedToys.includes(t.id));
    print(selected, {
      title: 'Bath Time Toys',
      titleEmoji: '🛁',
      bgColor: '#E6F7FF',
      textColor: '#1A4D66',
    });
  };

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
                    <SelectableCard
                      emoji={toy.emoji}
                      name={toy.name}
                      isSelected={selectedToys.includes(toy.id)}
                      onClick={() => toggleToy(toy.id)}
                      selectedColor="bg-cyan-400"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Print Button */}
      <AnimatePresence>
        {selectedToys.length > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handlePrint}
            className="fixed bottom-6 right-6 w-20 h-20 bg-cyan-500 text-white rounded-full shadow-xl flex flex-col items-center justify-center hover:bg-cyan-600 active:scale-95 transition-all z-50"
          >
            <span className="text-3xl">🖨️</span>
            <span className="text-xs font-bold">{selectedToys.length}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
