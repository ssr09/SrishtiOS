import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useVoice } from '../../shared/hooks/useVoice';
import { useSuccessChime } from '../../shared/hooks/useSuccessChime';
import { AppHeader } from '../../shared/components/AppHeader';
import { CelebrationModal } from '../../shared/components/CelebrationModal';

interface CountingItem {
  singular: string;
  plural: string;
  emoji: string;
}

const countingItems: CountingItem[] = [
  { singular: 'apple', plural: 'apples', emoji: '🍎' },
  { singular: 'cookie', plural: 'cookies', emoji: '🍪' },
  { singular: 'banana', plural: 'bananas', emoji: '🍌' },
  { singular: 'berry', plural: 'berries', emoji: '🫐' },
  { singular: 'carrot', plural: 'carrots', emoji: '🥕' },
];

const numberWords = ['zero', 'one', 'two', 'three'];

const getRandomItem = () => countingItems[Math.floor(Math.random() * countingItems.length)];
const getRandomTarget = () => 1 + Math.floor(Math.random() * 3);

export const FirstCountingGame: React.FC = () => {
  const [targetCount, setTargetCount] = useState(getRandomTarget);
  const [givenCount, setGivenCount] = useState(0);
  const [item, setItem] = useState(getRandomItem);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const { speak, stop } = useVoice();
  const { playChime } = useSuccessChime();
  const timeoutsRef = useRef<number[]>([]);

  const itemName = targetCount === 1 ? item.singular : item.plural;
  const isRoundComplete = givenCount >= targetCount;

  const clearPendingSpeech = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
    stop();
  }, [stop]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
      stop();
    };
  }, [stop]);

  const speakPrompt = useCallback(() => {
    speak(`Give teddy ${numberWords[targetCount]} ${itemName}`);
  }, [itemName, speak, targetCount]);

  const startNextRound = useCallback(() => {
    setTargetCount(getRandomTarget());
    setGivenCount(0);
    setItem(getRandomItem());
    setShowCelebration(false);
  }, []);

  const handleItemTap = () => {
    if (isRoundComplete) return;

    clearPendingSpeech();

    const updatedCount = givenCount + 1;
    setGivenCount(updatedCount);
    speak(numberWords[updatedCount]);

    if (updatedCount === targetCount) {
      setShowCelebration(true);
      setScore(currentScore => currentScore + 1);
      playChime();

      const successTimer = window.setTimeout(() => {
        speak(`${numberWords[targetCount]} ${itemName}`);
      }, 850);
      timeoutsRef.current.push(successTimer);

      const nextRoundTimer = window.setTimeout(startNextRound, 2600);
      timeoutsRef.current.push(nextRoundTimer);
    }
  };

  useEffect(() => {
    const promptTimer = window.setTimeout(speakPrompt, 550);
    return () => clearTimeout(promptTimer);
  }, [speakPrompt, targetCount, item]);

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-8 flex flex-col overflow-y-auto">
      <div className="mb-4 md:mb-6">
        <AppHeader title="First Counting" emoji="🍎" />
      </div>

      <div className="text-center mb-4">
        <span className="text-xl font-bold text-theme-text">Score: </span>
        <span className="text-3xl font-bold text-theme-primary">{score}</span>
        <span className="text-2xl"> ⭐</span>
      </div>

      <motion.button
        key={`${targetCount}-${item.singular}`}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Repeat counting prompt"
        onClick={() => {
          clearPendingSpeech();
          speakPrompt();
        }}
        className="bg-white rounded-3xl p-5 md:p-7 shadow-xl mx-auto text-center max-w-2xl w-full"
      >
        <div className="text-3xl md:text-5xl font-black text-theme-text">
          Give teddy {numberWords[targetCount]} {itemName}
        </div>
      </motion.button>

      <div className="flex-1 grid grid-rows-[auto_1fr_auto] gap-5 pt-6 max-w-5xl mx-auto w-full">
        <div className="flex justify-center">
          <div className="bg-white rounded-3xl shadow-xl px-8 py-5 flex items-center gap-5">
            <div className="text-7xl md:text-8xl">🧸</div>
            <div className="w-32 h-24 md:w-44 md:h-28 rounded-b-3xl rounded-t-xl bg-amber-200 border-4 border-amber-400 flex items-center justify-center overflow-hidden">
              <div className="flex gap-1 md:gap-2 flex-wrap justify-center px-2">
                {Array.from({ length: givenCount }).map((_, index) => (
                  <motion.span
                    key={`${item.singular}-${index}`}
                    data-testid="fed-item"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-3xl md:text-4xl"
                  >
                    {item.emoji}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-72">
          {!isRoundComplete && (
            <motion.button
              key={item.singular}
              initial={{ opacity: 0, scale: 0.75, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Give teddy a ${item.singular}`}
              data-testid="food-button"
              onClick={handleItemTap}
              className="w-56 h-56 md:w-72 md:h-72 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-transparent hover:border-green-300"
            >
              <span className="text-9xl md:text-[11rem] leading-none">{item.emoji}</span>
            </motion.button>
          )}
        </div>

        <div className="flex justify-center pb-2">
          <div className="flex gap-4 md:gap-5">
            {Array.from({ length: targetCount }).map((_, index) => {
              const isFilled = index < givenCount;
              return (
                <div
                  key={index}
                  data-testid="target-dot"
                  className={`w-7 h-7 md:w-9 md:h-9 rounded-full border-4 ${isFilled ? 'bg-green-400 border-green-500' : 'bg-white border-gray-300'}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <CelebrationModal
        show={showCelebration}
        emoji="🧸"
        message={numberWords[targetCount]}
        subMessage={itemName}
        gradient="bg-gradient-to-br from-green-300 to-blue-300"
        textColor="text-gray-800"
      />
    </div>
  );
};
