import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSyncedStorage } from '../../shared/hooks/useSyncedStorage';
import { useVoice } from '../../shared/hooks/useVoice';
import { AppHeader } from '../../shared/components/AppHeader';
import type { Food, MealTime } from './foodDatabase';
import { defaultFoods, mealTimeConfig } from './foodDatabase';

export const FoodMenu: React.FC = () => {
  const [foods] = useSyncedStorage<Food[]>('foods', defaultFoods);
  const [selectedMealTime, setSelectedMealTime] = useState<MealTime>('breakfast');
  const { speak } = useVoice();

  const filteredFoods = foods.filter(food => food.mealTime.includes(selectedMealTime));

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
                    <motion.button
                      onClick={() => speak(food.name)}
                      className="w-full rounded-3xl p-6 shadow-lg transition-all relative bg-white hover:scale-105 active:scale-95"
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-8xl mb-3">{food.emoji}</div>
                      <div className="text-2xl font-bold text-theme-text">{food.name}</div>
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
