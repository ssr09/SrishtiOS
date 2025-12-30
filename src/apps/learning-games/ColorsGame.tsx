import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVoice } from '../../shared/hooks/useVoice';
import { useGameRound } from '../../shared/hooks/useGameRound';
import { AppHeader } from '../../shared/components/AppHeader';
import { CelebrationModal } from '../../shared/components/CelebrationModal';

interface Color {
  name: string;
  hex: string;
  emoji: string;
}

const colors: Color[] = [
  { name: 'Red', hex: '#FF0000', emoji: '❤️' },
  { name: 'Blue', hex: '#0000FF', emoji: '💙' },
  { name: 'Yellow', hex: '#FFD700', emoji: '💛' },
  { name: 'Green', hex: '#00FF00', emoji: '💚' },
  { name: 'Orange', hex: '#FF8C00', emoji: '🧡' },
  { name: 'Purple', hex: '#9370DB', emoji: '💜' },
  { name: 'Pink', hex: '#FF69B4', emoji: '🩷' },
  { name: 'Brown', hex: '#8B4513', emoji: '🤎' },
];

const getColorKey = (color: Color) => color.name;

export const ColorsGame: React.FC = () => {
  const { target: targetColor, options, round, generateRound } = useGameRound({
    items: colors,
    optionCount: 4,
    getKey: getColorKey,
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const { speak } = useVoice();

  useEffect(() => {
    generateRound();
  }, []);

  const handleColorClick = (color: Color) => {
    if (color.name === targetColor.name) {
      // Correct!
      setShowCelebration(true);
      setScore(score + 1);
      speak(`Good job! That's ${color.name}!`);

      setTimeout(() => {
        setShowCelebration(false);
        generateRound();
      }, 2000);
    } else {
      // Name what they picked, pause, then guide to correct answer
      speak(`That's ${color.name}...`);
      setTimeout(() => {
        speak(`Can you find ${targetColor.name}?`);
      }, 1200);
    }
  };

  // Speak the target color name on each round
  useEffect(() => {
    if (round === 0) return;
    const timer = setTimeout(() => {
      speak(`Can you find ${targetColor.name}?`);
    }, 500);
    return () => clearTimeout(timer);
  }, [round, speak]);

  return (
    <div className="h-screen bg-theme-bg p-4 flex flex-col overflow-hidden">
      <AppHeader title="Colors" emoji="🎨" />

      {/* Score */}
      <div className="text-center py-2">
        <span className="text-xl font-bold text-theme-text">Score: </span>
        <span className="text-3xl font-bold text-theme-primary">{score}</span>
        <span className="text-2xl"> ⭐</span>
      </div>

      {/* Prompt */}
      <motion.div
        key={targetColor.name}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 shadow-2xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: targetColor.hex }}>
          Can you find {targetColor.name}?
        </h2>
        <div className="text-7xl md:text-8xl">{targetColor.emoji}</div>
      </motion.div>

      {/* Color Options */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {options.map((color, index) => (
            <motion.button
              key={`${color.name}-${index}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleColorClick(color)}
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-2xl hover:shadow-3xl transition-all border-4 border-white flex items-center justify-center"
              style={{ backgroundColor: color.hex }}
            >
              <motion.div
                className="text-5xl md:text-6xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {color.emoji}
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Celebration */}
      <CelebrationModal
        show={showCelebration}
        message="Good job!"
        gradient="bg-gradient-to-br from-yellow-300 to-orange-400"
      />
    </div>
  );
};
