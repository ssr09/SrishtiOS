import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { BathToy } from '../../../apps/bath-buddy/toyDatabase';
import { defaultToys } from '../../../apps/bath-buddy/toyDatabase';

export const ToysTab: React.FC = () => {
  const [toys, setToys] = useLocalStorage<BathToy[]>('srishti-bath-toys', defaultToys);
  const [newToy, setNewToy] = useState({
    name: '',
    emoji: '',
    category: 'animal' as BathToy['category'],
    sound: ''
  });

  const addToy = () => {
    if (newToy.name && newToy.emoji) {
      const toy: BathToy = {
        id: newToy.name.toLowerCase().replace(/\s+/g, '-'),
        name: newToy.name,
        emoji: newToy.emoji,
        category: newToy.category,
        sound: newToy.sound || undefined
      };
      setToys([...toys, toy]);
      setNewToy({ name: '', emoji: '', category: 'animal', sound: '' });
    }
  };

  const deleteToy = (id: string) => {
    setToys(toys.filter(t => t.id !== id));
  };

  const resetToDefaults = () => {
    if (confirm('Reset toys to defaults? This cannot be undone!')) {
      setToys(defaultToys);
    }
  };

  return (
    <motion.div
      key="toys"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Manage Bath Toys</h3>

      {/* Add Toy Form */}
      <div className="bg-gray-100 rounded-2xl p-4 mb-6">
        <h4 className="font-bold text-lg mb-3">Add New Bath Toy</h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Name (e.g., Rubber Duck)"
            value={newToy.name}
            onChange={(e) => setNewToy({ ...newToy, name: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            placeholder="Emoji (e.g., 🦆)"
            value={newToy.emoji}
            onChange={(e) => setNewToy({ ...newToy, emoji: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select
            value={newToy.category}
            onChange={(e) => setNewToy({ ...newToy, category: e.target.value as BathToy['category'] })}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            <option value="animal">Animal</option>
            <option value="vehicle">Vehicle</option>
            <option value="character">Character</option>
            <option value="tool">Tool</option>
          </select>
          <input
            type="text"
            placeholder="Sound (e.g., quack)"
            value={newToy.sound}
            onChange={(e) => setNewToy({ ...newToy, sound: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
        </div>
        <button
          onClick={addToy}
          className="w-full bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600"
        >
          + Add Toy
        </button>
      </div>

      {/* Toys List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {toys.map(toy => (
          <div key={toy.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{toy.emoji}</span>
              <div>
                <div className="font-bold">{toy.name}</div>
                <div className="text-sm text-gray-600">{toy.category} {toy.sound && `- ${toy.sound}`}</div>
              </div>
            </div>
            <button
              onClick={() => deleteToy(toy.id)}
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
