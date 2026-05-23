import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useVoice } from '../../shared/hooks/useVoice';
import { useSuccessChime } from '../../shared/hooks/useSuccessChime';
import { useGameRound } from '../../shared/hooks/useGameRound';
import { AppHeader } from '../../shared/components/AppHeader';
import { CelebrationModal } from '../../shared/components/CelebrationModal';

interface SoundLetter {
  letter: string;
  spokenSound: string;
  exampleWord: string;
}

const soundLetters: SoundLetter[] = [
  { letter: 'A', spokenSound: 'ah', exampleWord: 'apple' },
  { letter: 'B', spokenSound: 'buh', exampleWord: 'ball' },
  { letter: 'C', spokenSound: 'kuh', exampleWord: 'cat' },
  { letter: 'D', spokenSound: 'duh', exampleWord: 'dog' },
  { letter: 'E', spokenSound: 'eh', exampleWord: 'egg' },
  { letter: 'F', spokenSound: 'fff', exampleWord: 'fish' },
  { letter: 'G', spokenSound: 'guh', exampleWord: 'goat' },
  { letter: 'H', spokenSound: 'huh', exampleWord: 'hat' },
  { letter: 'I', spokenSound: 'ih', exampleWord: 'ink' },
  { letter: 'J', spokenSound: 'juh', exampleWord: 'jug' },
  { letter: 'K', spokenSound: 'kuh', exampleWord: 'kite' },
  { letter: 'L', spokenSound: 'lll', exampleWord: 'lion' },
  { letter: 'M', spokenSound: 'mmm', exampleWord: 'moon' },
  { letter: 'N', spokenSound: 'nnn', exampleWord: 'nest' },
  { letter: 'O', spokenSound: 'oh', exampleWord: 'orange' },
  { letter: 'P', spokenSound: 'puh', exampleWord: 'pig' },
  { letter: 'Q', spokenSound: 'kwuh', exampleWord: 'queen' },
  { letter: 'R', spokenSound: 'rrr', exampleWord: 'rain' },
  { letter: 'S', spokenSound: 'sss', exampleWord: 'sun' },
  { letter: 'T', spokenSound: 'tuh', exampleWord: 'tree' },
  { letter: 'U', spokenSound: 'uh', exampleWord: 'umbrella' },
  { letter: 'V', spokenSound: 'vvv', exampleWord: 'van' },
  { letter: 'W', spokenSound: 'wuh', exampleWord: 'whale' },
  { letter: 'X', spokenSound: 'ks', exampleWord: 'xylophone' },
  { letter: 'Y', spokenSound: 'yuh', exampleWord: 'yellow' },
  { letter: 'Z', spokenSound: 'zzz', exampleWord: 'zip' },
];

const getSoundKey = (soundLetter: SoundLetter) => soundLetter.letter;

export const PhonicsGame: React.FC = () => {
  const { target, options, round, generateRound } = useGameRound({
    items: soundLetters,
    optionCount: 3,
    getKey: getSoundKey,
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const { speak, stop } = useVoice();
  const { playChime } = useSuccessChime();
  const timeoutsRef = useRef<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(t => clearTimeout(t));
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stop();
    };
  }, [stop]);

  const playPhonicAudio = useCallback((soundLetter: SoundLetter, onEnd?: () => void) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = null;
    }

    const audio = new Audio(`/sounds/phonics/${soundLetter.letter.toLowerCase()}.mp3`);
    audioRef.current = audio;
    let didFinish = false;

    const finishAudio = () => {
      if (didFinish) return;
      didFinish = true;
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
        audioTimeoutRef.current = null;
      }
      onEnd?.();
    };

    audio.onended = finishAudio;

    audio.onerror = () => {
      speak(soundLetter.spokenSound, { onEnd: finishAudio });
    };

    audioTimeoutRef.current = window.setTimeout(finishAudio, 1600);

    audio.play().catch(() => {
      speak(soundLetter.spokenSound, { onEnd: finishAudio });
    });
  }, [speak]);

  const clearPendingAudio = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = null;
    }
    stop();
  }, [stop]);

  const speakWithPhonic = useCallback((prefix: string, soundLetter: SoundLetter) => {
    if (prefix) {
      speak(prefix);
    }

    const t = window.setTimeout(() => {
      playPhonicAudio(soundLetter);
    }, prefix ? 650 : 0);
    timeoutsRef.current.push(t);
  }, [playPhonicAudio, speak]);

  const playHint = useCallback(() => {
    clearPendingAudio();

    playPhonicAudio(target, () => {
      playPhonicAudio(target, () => {
        speak(target.exampleWord, { rate: 0.8, pitch: 1.1 });
      });
    });
  }, [clearPendingAudio, playPhonicAudio, speak, target]);

  const handleLetterClick = (soundLetter: SoundLetter) => {
    if (soundLetter.letter === target.letter) {
      setShowCelebration(true);
      setScore(currentScore => currentScore + 1);
      playChime();
      speakWithPhonic('Yes!', target);

      const t = window.setTimeout(() => {
        setShowCelebration(false);
        generateRound();
      }, 2000);
      timeoutsRef.current.push(t);
    } else {
      speakWithPhonic('That says', soundLetter);
      const t = window.setTimeout(() => {
        speakWithPhonic('Can you find', target);
      }, 1500);
      timeoutsRef.current.push(t);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      speakWithPhonic('Can you find', target);
    }, round === 1 ? 600 : 500);
    return () => clearTimeout(timer);
  }, [round, speakWithPhonic, target]);

  return (
    <div className="min-h-screen bg-theme-bg p-4 flex flex-col overflow-y-auto">
      <AppHeader title="Phonics" emoji="🔤" />

      <div className="text-center py-2">
        <span className="text-xl font-bold text-theme-text">Score: </span>
        <span className="text-3xl font-bold text-theme-primary">{score}</span>
        <span className="text-2xl"> ⭐</span>
      </div>

      <motion.button
        key={target.letter}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => speakWithPhonic('Can you find', target)}
        className="bg-white rounded-3xl p-5 md:p-8 shadow-2xl mx-auto text-center cursor-pointer hover:shadow-3xl transition-shadow"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
          Can you find
        </h2>
        <div className="text-7xl md:text-9xl font-black text-gray-950 tracking-normal leading-none" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          {target.letter}
        </div>
      </motion.button>

      <button
        type="button"
        onClick={playHint}
        disabled={showCelebration}
        className="mt-4 mx-auto rounded-full bg-yellow-300 px-6 py-3 text-xl font-bold text-gray-800 shadow-lg hover:bg-yellow-200 disabled:opacity-50 disabled:pointer-events-none"
      >
        Hint
      </button>

      <div className="flex-1 flex items-center justify-center py-8">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {options.map((soundLetter, index) => (
            <motion.button
              key={soundLetter.letter}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => !showCelebration && handleLetterClick(soundLetter)}
              disabled={showCelebration}
              className={`w-24 h-28 sm:w-32 sm:h-36 md:w-44 md:h-48 rounded-3xl shadow-2xl hover:shadow-3xl transition-all bg-white border-4 border-gray-200 text-gray-950 flex items-center justify-center ${showCelebration ? 'pointer-events-none' : ''}`}
            >
              <span className="text-6xl sm:text-7xl md:text-9xl font-black leading-none" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {soundLetter.letter}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <CelebrationModal
        show={showCelebration}
        message={target.letter}
        gradient="bg-gradient-to-br from-yellow-300 to-lime-300"
        textColor="text-gray-800"
      />
    </div>
  );
};
