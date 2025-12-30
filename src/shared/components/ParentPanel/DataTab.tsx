import React from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Food } from '../../../apps/food-friends/foodDatabase';
import type { BathToy } from '../../../apps/bath-buddy/toyDatabase';
import type { TimerPreset } from '../../../apps/magic-timer/timerConfig';
import { defaultFoods } from '../../../apps/food-friends/foodDatabase';
import { defaultToys } from '../../../apps/bath-buddy/toyDatabase';
import { timerPresets as defaultTimerPresets } from '../../../apps/magic-timer/timerConfig';

export const DataTab: React.FC = () => {
  const [, setFoods] = useLocalStorage<Food[]>('srishti-foods', defaultFoods);
  const [, setToys] = useLocalStorage<BathToy[]>('srishti-bath-toys', defaultToys);
  const [, setTimerPresets] = useLocalStorage<TimerPreset[]>('srishti-timer-presets', defaultTimerPresets);

  const resetToDefaults = () => {
    if (!confirm('Reset ALL content to defaults? This cannot be undone!')) return;

    setFoods(defaultFoods);
    setToys(defaultToys);
    setTimerPresets(defaultTimerPresets);
  };

  const clearAllData = () => {
    if (!confirm('Clear ALL app data including stars, favorites, and progress? This cannot be undone!')) return;

    localStorage.clear();
    window.location.reload();
  };

  return (
    <motion.div
      key="data"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Data Management</h3>

      <div className="space-y-4">
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4">
          <h4 className="font-bold text-lg mb-2">Warning: Danger Zone</h4>
          <p className="text-gray-700 mb-4">
            These actions cannot be undone. Please be careful!
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600"
        >
          Reset All Content to Defaults
        </button>

        <button
          onClick={clearAllData}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600"
        >
          Clear ALL Data (Stars, Favorites, Progress, etc.)
        </button>

        <div className="bg-blue-100 border-2 border-blue-400 rounded-2xl p-4 mt-6">
          <h4 className="font-bold text-lg mb-2">Storage Info</h4>
          <p className="text-sm text-gray-700">
            All data is stored locally in your browser. No data is sent to any server.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
