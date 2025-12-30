import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSyncedStorage } from '../../hooks/useSyncedStorage';
import type { Food } from '../../../apps/food-friends/foodDatabase';
import { defaultFoods } from '../../../apps/food-friends/foodDatabase';

export const FoodsTab: React.FC = () => {
  const [foods, setFoods] = useSyncedStorage<Food[]>('foods', defaultFoods);
  const [newFood, setNewFood] = useState({
    name: '',
    emoji: '',
    category: 'fruit' as Food['category'],
    mealTime: [] as Food['mealTime']
  });

  const addFood = () => {
    if (newFood.name && newFood.emoji && newFood.mealTime.length > 0) {
      const food: Food = {
        id: newFood.name.toLowerCase().replace(/\s+/g, '-'),
        name: newFood.name,
        emoji: newFood.emoji,
        category: newFood.category,
        mealTime: newFood.mealTime
      };
      setFoods([...foods, food]);
      setNewFood({ name: '', emoji: '', category: 'fruit', mealTime: [] });
    }
  };

  const deleteFood = (id: string) => {
    setFoods(foods.filter(f => f.id !== id));
  };

  const resetToDefaults = () => {
    if (confirm('Reset foods to defaults? This cannot be undone!')) {
      setFoods(defaultFoods);
    }
  };

  return (
    <motion.div
      key="foods"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Manage Foods</h3>

      {/* Add Food Form */}
      <div className="bg-gray-100 rounded-2xl p-4 mb-6">
        <h4 className="font-bold text-lg mb-3">Add New Food</h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Name (e.g., Apple)"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            placeholder="Emoji (e.g., 🍎)"
            value={newFood.emoji}
            onChange={(e) => setNewFood({ ...newFood, emoji: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select
            value={newFood.category}
            onChange={(e) => setNewFood({ ...newFood, category: e.target.value as Food['category'] })}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            <option value="fruit">Fruit</option>
            <option value="veggie">Veggie</option>
            <option value="protein">Protein</option>
            <option value="grain">Grain</option>
            <option value="dairy">Dairy</option>
          </select>
          <div className="flex gap-2">
            {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
              <label key={meal} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={newFood.mealTime.includes(meal as Food['mealTime'][number])}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewFood({ ...newFood, mealTime: [...newFood.mealTime, meal as Food['mealTime'][number]] });
                    } else {
                      setNewFood({ ...newFood, mealTime: newFood.mealTime.filter(m => m !== meal) });
                    }
                  }}
                />
                {meal}
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={addFood}
          className="w-full bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600"
        >
          + Add Food
        </button>
      </div>

      {/* Foods List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {foods.map(food => (
          <div key={food.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{food.emoji}</span>
              <div>
                <div className="font-bold">{food.name}</div>
                <div className="text-sm text-gray-600">{food.category} - {food.mealTime.join(', ')}</div>
              </div>
            </div>
            <button
              onClick={() => deleteFood(food.id)}
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
