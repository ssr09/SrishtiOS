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
  const audioTimeoutRef = useRef<number | null>(null);
  const wordTimeoutRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);
  const playbackTokenRef = useRef(0);
  const { speak, stop } = useVoice();

  useEffect(() => {
    return () => {
      playbackTokenRef.current += 1;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }

      if (wordTimeoutRef.current) {
        clearTimeout(wordTimeoutRef.current);
      }

      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      stop();
    };
  }, [stop]);

  const clearPendingPlayback = () => {
    playbackTokenRef.current += 1;

    if (wordTimeoutRef.current) {
      clearTimeout(wordTimeoutRef.current);
      wordTimeoutRef.current = null;
    }

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = null;
    }

    stop();
  };

  const clearSelection = (token: number) => {
    if (playbackTokenRef.current !== token) return;

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    setSelectedCard(null);
  };

  const speakExampleWord = (card: PhonicCard, token: number) => {
    wordTimeoutRef.current = window.setTimeout(() => {
      if (playbackTokenRef.current !== token) return;

      const fallbackDuration = Math.max(900, card.exampleWord.length * 140 + 500);
      resetTimeoutRef.current = window.setTimeout(() => {
        clearSelection(token);
      }, fallbackDuration);

      speak(card.exampleWord, {
        rate: 0.8,
        pitch: 1.1,
        onEnd: () => clearSelection(token),
      });
    }, 350);
  };

  const playPhonicSound = (card: PhonicCard, token: number, repeatCount = 0) => {
    if (playbackTokenRef.current !== token) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(`/sounds/phonics/${card.letter.toLowerCase()}.mp3`);
    audioRef.current = audio;
    let didFinish = false;

    const finishAudio = () => {
      if (didFinish || playbackTokenRef.current !== token) return;
      didFinish = true;
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
        audioTimeoutRef.current = null;
      }

      if (repeatCount < 1) {
        playPhonicSound(card, token, repeatCount + 1);
        return;
      }

      speakExampleWord(card, token);
    };

    audio.onended = finishAudio;
    audio.onerror = finishAudio;

    audioTimeoutRef.current = window.setTimeout(finishAudio, 1600);

    audio.play().catch(() => {
      finishAudio();
    });
  };

  const handleCardClick = (card: PhonicCard) => {
    clearPendingPlayback();
    const token = playbackTokenRef.current;

    setSelectedCard(card);
    playPhonicSound(card, token);
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
