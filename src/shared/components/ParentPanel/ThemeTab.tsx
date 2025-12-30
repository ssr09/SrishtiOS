import React from 'react';
import { motion } from 'framer-motion';
import { useTheme, themes } from '../../contexts/ThemeContext';

export const ThemeTab: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <motion.div
      key="theme"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Choose Theme</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.values(themes).map((theme) => (
          <button
            key={theme.name}
            onClick={() => setTheme(theme.name)}
            className={`
              p-6 rounded-xl border-4 transition-all
              ${currentTheme === theme.name ? 'border-blue-500 scale-105 shadow-lg' : 'border-gray-200 hover:scale-105'}
            `}
            style={{ backgroundColor: theme.colors.bg }}
          >
            <div className="text-5xl mb-2">{theme.emoji}</div>
            <div className="text-lg font-semibold" style={{ color: theme.colors.text }}>
              {theme.displayName}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
