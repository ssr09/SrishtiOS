import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useVoice } from '../../shared/hooks/useVoice';
import { AppHeader } from '../../shared/components/AppHeader';

interface PhonicCard {
  letter: string;
  soundText: string;
  exampleWord: string;
}

const phonicCards: PhonicCard[] = [
  { letter: 'A', soundText: 'ah', exampleWord: 'apple' },
  { letter: 'B', soundText: 'buh', exampleWord: 'ball' },
  { letter: 'C', soundText: 'kuh', exampleWord: 'cat' },
  { letter: 'D', soundText: 'duh', exampleWord: 'dog' },
  { letter: 'E', soundText: 'eh', exampleWord: 'egg' },
  { letter: 'F', soundText: 'fff', exampleWord: 'fish' },
  { letter: 'G', soundText: 'guh', exampleWord: 'goat' },
  { letter: 'H', soundText: 'huh', exampleWord: 'hat' },
  { letter: 'I', soundText: 'ih', exampleWord: 'ink' },
  { letter: 'J', soundText: 'juh', exampleWord: 'jug' },
  { letter: 'K', soundText: 'kuh', exampleWord: 'kite' },
  { letter: 'L', soundText: 'lll', exampleWord: 'lion' },
  { letter: 'M', soundText: 'mmm', exampleWord: 'moon' },
  { letter: 'N', soundText: 'nnn', exampleWord: 'nest' },
  { letter: 'O', soundText: 'oh', exampleWord: 'orange' },
  { letter: 'P', soundText: 'puh', exampleWord: 'pig' },
  { letter: 'Q', soundText: 'kwuh', exampleWord: 'queen' },
  { letter: 'R', soundText: 'rrr', exampleWord: 'rain' },
  { letter: 'S', soundText: 'sss', exampleWord: 'sun' },
  { letter: 'T', soundText: 'tuh', exampleWord: 'tree' },
  { letter: 'U', soundText: 'uh', exampleWord: 'umbrella' },
  { letter: 'V', soundText: 'vvv', exampleWord: 'van' },
  { letter: 'W', soundText: 'wuh', exampleWord: 'whale' },
  { letter: 'X', soundText: 'ks', exampleWord: 'xylophone' },
  { letter: 'Y', soundText: 'yuh', exampleWord: 'yellow' },
  { letter: 'Z', soundText: 'zzz', exampleWord: 'zip' },
];

export const PhonicsCardsGame: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<PhonicCard | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const { speak, stop } = useVoice();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      stop();
    };
  }, [stop]);

  const clearPendingWord = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const speakExampleWord = (card: PhonicCard) => {
    timeoutRef.current = window.setTimeout(() => {
      speak(card.exampleWord, {
        rate: 0.8,
        pitch: 1.1,
        onEnd: () => setSelectedCard(null),
      });
    }, 550);
  };

  const playPhonicSound = (card: PhonicCard, repeatCount = 0) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(`/sounds/phonics/${card.letter.toLowerCase()}.mp3`);
    audioRef.current = audio;

    audio.onended = () => {
      if (repeatCount < 1) {
        playPhonicSound(card, repeatCount + 1);
        return;
      }

      speakExampleWord(card);
    };
    audio.onerror = () => speakExampleWord(card);

    audio.play().catch(() => {
      speakExampleWord(card);
    });
  };

  const handleCardClick = (card: PhonicCard) => {
    setSelectedCard(card);
    stop();
    clearPendingWord();
    playPhonicSound(card);
  };

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-8">
      <div className="mb-6">
        <AppHeader title="Phonics Cards" emoji="🔤" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7 max-w-6xl mx-auto">
        {phonicCards.map((card, index) => {
          const lowerLetter = card.letter.toLowerCase();
          const isSelected = selectedCard?.letter === card.letter;

          return (
            <motion.button
              key={card.letter}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleCardClick(card)}
              className={`
                bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all
                min-h-56 md:min-h-64 flex flex-col items-center justify-center border-4
                ${isSelected ? 'scale-105 bg-yellow-200 border-yellow-300' : 'border-transparent'}
              `}
            >
              <motion.div
                className="text-8xl md:text-9xl font-black text-gray-950 leading-none mb-6"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                animate={isSelected ? { scale: [1, 1.12, 1] } : {}}
                transition={isSelected ? {
                  duration: 0.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                } : { duration: 0.3 }}
              >
                {card.letter}{lowerLetter}
              </motion.div>

              <div className="text-sm md:text-base font-medium text-gray-400 capitalize">
                {card.soundText} · {card.exampleWord}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
