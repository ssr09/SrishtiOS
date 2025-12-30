import React from 'react';
import { motion } from 'framer-motion';
import { useVoice } from '../hooks/useVoice';

interface SelectableCardProps {
  emoji: string;
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
  selectedColor?: string; // Tailwind bg color class, e.g. "bg-green-400" or "bg-cyan-400"
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  emoji,
  name,
  isSelected = false,
  onClick,
  selectedColor = 'bg-green-400',
}) => {
  const { speak } = useVoice();

  const handleClick = () => {
    speak(name);
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        w-full rounded-3xl p-6 shadow-lg transition-all relative
        ${isSelected
          ? `${selectedColor} scale-105 shadow-xl`
          : 'bg-white hover:scale-105 active:scale-95'
        }
      `}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="text-8xl mb-3"
        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {emoji}
      </motion.div>

      <div className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-theme-text'}`}>
        {name}
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 text-3xl"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
};
