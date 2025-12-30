import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { TimerPreset } from '../../../apps/magic-timer/timerConfig';
import { timerPresets as defaultTimerPresets } from '../../../apps/magic-timer/timerConfig';

export const TimersTab: React.FC = () => {
  const [timerPresets, setTimerPresets] = useLocalStorage<TimerPreset[]>('srishti-timer-presets', defaultTimerPresets);
  const [newTimer, setNewTimer] = useState({
    name: '',
    emoji: '',
    seconds: 60,
    color: 'bg-blue-400'
  });

  const addTimer = () => {
    if (newTimer.name && newTimer.emoji && newTimer.seconds > 0) {
      const timer: TimerPreset = {
        id: newTimer.name.toLowerCase().replace(/\s+/g, '-'),
        name: newTimer.name,
        emoji: newTimer.emoji,
        seconds: newTimer.seconds,
        color: newTimer.color
      };
      setTimerPresets([...timerPresets, timer]);
      setNewTimer({ name: '', emoji: '', seconds: 60, color: 'bg-blue-400' });
    }
  };

  const deleteTimer = (id: string) => {
    setTimerPresets(timerPresets.filter(t => t.id !== id));
  };

  const resetToDefaults = () => {
    if (confirm('Reset timers to defaults? This cannot be undone!')) {
      setTimerPresets(defaultTimerPresets);
    }
  };

  return (
    <motion.div
      key="timers"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Manage Timer Presets</h3>

      {/* Add Timer Form */}
      <div className="bg-gray-100 rounded-2xl p-4 mb-6">
        <h4 className="font-bold text-lg mb-3">Add New Timer Preset</h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Name (e.g., Snack Time)"
            value={newTimer.name}
            onChange={(e) => setNewTimer({ ...newTimer, name: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            placeholder="Emoji (e.g., 🍪)"
            value={newTimer.emoji}
            onChange={(e) => setNewTimer({ ...newTimer, emoji: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="number"
            placeholder="Seconds"
            value={newTimer.seconds}
            onChange={(e) => setNewTimer({ ...newTimer, seconds: parseInt(e.target.value) || 0 })}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <select
            value={newTimer.color}
            onChange={(e) => setNewTimer({ ...newTimer, color: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            <option value="bg-blue-400">Blue</option>
            <option value="bg-green-400">Green</option>
            <option value="bg-yellow-400">Yellow</option>
            <option value="bg-red-400">Red</option>
            <option value="bg-purple-400">Purple</option>
            <option value="bg-pink-400">Pink</option>
          </select>
        </div>
        <button
          onClick={addTimer}
          className="w-full bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600"
        >
          + Add Timer
        </button>
      </div>

      {/* Timers List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {timerPresets.map(timer => (
          <div key={timer.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{timer.emoji}</span>
              <div>
                <div className="font-bold">{timer.name}</div>
                <div className="text-sm text-gray-600">
                  {Math.floor(timer.seconds / 60)}m {timer.seconds % 60}s
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteTimer(timer.id)}
              className="text-red-500 hover:text-red-700 text-xl"
            >
              X
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={resetToDefaults}
        className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg font-bold hover:bg-gray-600"
      >
        Reset to Defaults
      </button>
    </motion.div>
  );
};
