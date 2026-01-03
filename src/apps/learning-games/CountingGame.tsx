import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVoice } from '../../shared/hooks/useVoice';
import { useSuccessChime } from '../../shared/hooks/useSuccessChime';
import { AppHeader } from '../../shared/components/AppHeader';
import { CelebrationModal } from '../../shared/components/CelebrationModal';

const objectEmojis = ['🍎', '⭐', '🐱', '🌸', '🎈', '🍪', '🦋', '🌈'];

export const CountingGame: React.FC = () => {
  const [targetCount, setTargetCount] = useState(1);
  const [objectEmoji, setObjectEmoji] = useState('🍎');
  const [options, setOptions] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const { speak } = useVoice();
  const { playChime } = useSuccessChime();

  useEffect(() => {
    generateRound();
  }, []);

  const generateRound = () => {
    // Random count from 1-10
    const count = 1 + Math.floor(Math.random() * 10);
    setTargetCount(count);

    // Random emoji
    setObjectEmoji(objectEmojis[Math.floor(Math.random() * objectEmojis.length)]);

    // Create 3 number options: correct + 2 nearby wrong answers
    const wrongOptions: number[] = [];

    // Add one number below (if possible)
    if (count > 1) {
      wrongOptions.push(count - 1);
    } else {
      wrongOptions.push(count + 1);
    }

    // Add one number above (if possible)
    if (count < 10) {
      wrongOptions.push(count + 1);
    } else {
      wrongOptions.push(count - 1);
    }

    const allOptions = [count, ...wrongOptions];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  };

  const handleNumberClick = (number: number) => {
    if (number === targetCount) {
      // Correct!
      setShowCelebration(true);
      setScore(score + 1);
      playChime();
      speak(String(targetCount));

      setTimeout(() => {
        setShowCelebration(false);
        generateRound();
      }, 2500);
    } else {
      speak(`Try again! Count carefully!`);
    }
  };

  useEffect(() => {
    const itemName = objectEmoji === '🍎' ? 'apples' : objectEmoji === '⭐' ? 'stars' : 'items';
    const timer = setTimeout(() => {
      speak(`Count the ${itemName}!`);
    }, 500);
    return () => clearTimeout(timer);
  }, [targetCount, objectEmoji, speak]);

  // Arrange objects in a recognizable pattern
  const getObjectPositions = (count: number) => {
    const positions = [];

    if (count <= 5) {
      // Single row
      for (let i = 0; i < count; i++) {
        positions.push({ x: i * 80 + 40, y: 100 });
      }
    } else if (count <= 10) {
      // Two rows
      const firstRow = Math.ceil(count / 2);
      const secondRow = count - firstRow;

      for (let i = 0; i < firstRow; i++) {
        positions.push({ x: i * 80 + 40, y: 60 });
      }
      for (let i = 0; i < secondRow; i++) {
        positions.push({ x: i * 80 + 40, y: 140 });
      }
    }

    return positions;
  };

  const positions = getObjectPositions(targetCount);

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-8">
      <div className="mb-6">
        <AppHeader title="Counting" emoji="🔢" />
      </div>

      {/* Score */}
      <div className="text-center mb-8">
        <div className="text-2xl font-bold text-theme-text">
          Score: <span className="text-theme-primary text-4xl">{score}</span> ⭐
        </div>
      </div>

      {/* Prompt */}
      <motion.div
        key={`${targetCount}-${objectEmoji}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <h2 className="text-5xl md:text-6xl font-bold mb-8 text-theme-text">
          Count the objects!
        </h2>

        {/* Objects Display */}
        <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-3xl mx-auto mb-8" style={{ minHeight: '250px' }}>
          <div className="relative flex flex-wrap justify-center items-center gap-4">
            {positions.map((_pos, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-7xl"
              >
                {objectEmoji}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Number Options */}
      <div className="flex justify-center gap-8 max-w-2xl mx-auto">
        {options.map((number, index) => (
          <motion.button
            key={`${number}-${index}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNumberClick(number)}
            className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center"
          >
            <span className="text-7xl font-bold">{number}</span>
          </motion.button>
        ))}
      </div>

      {/* Celebration */}
      <CelebrationModal
        show={showCelebration}
        message={`${targetCount}!`}
        gradient="bg-gradient-to-br from-green-300 to-blue-400"
      />
    </div>
  );
};
