import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeTab } from './ThemeTab';
import { FoodsTab } from './FoodsTab';
import { ToysTab } from './ToysTab';
import { TimersTab } from './TimersTab';
import { DataTab } from './DataTab';

interface ParentPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'theme' | 'foods' | 'toys' | 'timers' | 'data';

const tabs = [
  { id: 'theme' as Tab, label: 'Themes', emoji: '🎨' },
  { id: 'foods' as Tab, label: 'Foods', emoji: '🍎' },
  { id: 'toys' as Tab, label: 'Bath Toys', emoji: '🛁' },
  { id: 'timers' as Tab, label: 'Timers', emoji: '⏳' },
  { id: 'data' as Tab, label: 'Data', emoji: '💾' },
];

export const ParentPanel: React.FC<ParentPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('theme');

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-3xl font-bold text-gray-800">Parent Settings</h2>
          <button
            onClick={onClose}
            className="text-4xl hover:scale-110 transition-transform"
          >
            X
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-4 text-lg font-semibold transition-all whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-2xl mr-2">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'theme' && <ThemeTab />}
            {activeTab === 'foods' && <FoodsTab />}
            {activeTab === 'toys' && <ToysTab />}
            {activeTab === 'timers' && <TimersTab />}
            {activeTab === 'data' && <DataTab />}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gray-800 text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
