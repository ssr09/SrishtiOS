import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSyncedStorage } from '../../shared/hooks/useSyncedStorage';
import { usePrint } from '../../shared/hooks/usePrint';
import { AppHeader } from '../../shared/components/AppHeader';
import { SelectableCard } from '../../shared/components/SelectableCard';
import type { Food, MealTime } from './foodDatabase';
import { defaultFoods, mealTimeConfig } from './foodDatabase';

export const FoodMenu: React.FC = () => {
  const [foods] = useSyncedStorage<Food[]>('foods', defaultFoods);
  const [selectedMealTime, setSelectedMealTime] = useState<MealTime>('breakfast');
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const { print } = usePrint();

  const filteredFoods = foods.filter(food => food.mealTime.includes(selectedMealTime));

  const MAX_SELECTIONS = 3;

  const toggleFood = (foodId: string) => {
    setSelectedFoods(prev => {
      if (prev.includes(foodId)) {
        return prev.filter(id => id !== foodId);
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev;
      }
      return [...prev, foodId];
    });
  };

  const handlePrint = () => {
    const selected = foods.filter(f => selectedFoods.includes(f.id));
    const mealConfig = mealTimeConfig.find(m => m.id === selectedMealTime);
    print(selected, {
      title: mealConfig?.name || 'Meal',
      titleEmoji: mealConfig?.emoji,
      bgColor: '#FFF9E6',
      textColor: '#2D2D2D',
    });
  };

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-6">
      <div className="mb-4">
        <AppHeader title="Food Time" emoji="🍎" />
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex gap-4 md:gap-6">
        {/* Left Sidebar - Meal Time Selector */}
        <div className="flex flex-col gap-3 shrink-0">
          {mealTimeConfig.map(meal => (
            <button
              key={meal.id}
              onClick={() => setSelectedMealTime(meal.id as MealTime)}
              className={`
                w-28 md:w-36 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold transition-all flex flex-col items-center gap-1
                ${selectedMealTime === meal.id
                  ? `${meal.color} text-white scale-105 shadow-lg`
                  : 'bg-white text-theme-text hover:scale-105'
                }
              `}
            >
              <span className="text-4xl md:text-5xl">{meal.emoji}</span>
              <span>{meal.name}</span>
            </button>
          ))}
        </div>

        {/* Right Side - Foods Grid */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {filteredFoods.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-9xl mb-4">🤔</div>
                <div className="text-3xl text-theme-text-secondary">
                  No foods found
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={selectedMealTime}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
              >
                {filteredFoods.map((food, index) => (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SelectableCard
                      emoji={food.emoji}
                      name={food.name}
                      isSelected={selectedFoods.includes(food.id)}
                      onClick={() => toggleFood(food.id)}
                      selectedColor="bg-green-400"
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
        {selectedFoods.length > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handlePrint}
            className="fixed bottom-6 right-6 w-20 h-20 bg-green-500 text-white rounded-full shadow-xl flex flex-col items-center justify-center hover:bg-green-600 active:scale-95 transition-all z-50"
          >
            <span className="text-3xl">🖨️</span>
            <span className="text-xs font-bold">{selectedFoods.length}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
