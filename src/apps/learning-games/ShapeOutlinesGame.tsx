import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '../../shared/components/AppHeader';
import { CelebrationModal } from '../../shared/components/CelebrationModal';
import { useSuccessChime } from '../../shared/hooks/useSuccessChime';
import { useVoice } from '../../shared/hooks/useVoice';

type ShapeVariant = 'solid' | 'outline';

interface OutlineShape {
  name: string;
  emoji: string;
  color: string;
  render: (variant: ShapeVariant) => React.ReactNode;
}

interface OutlineOption {
  shape: OutlineShape;
  rotation: number;
  strokeScale: number;
}

const outlineStroke = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const outlineShapes: OutlineShape[] = [
  {
    name: 'Circle',
    emoji: '⭕',
    color: '#ef4444',
    render: variant => (
      <circle
        cx="100"
        cy="100"
        r="70"
        fill={variant === 'solid' ? 'currentColor' : 'none'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth="14"
      />
    ),
  },
  {
    name: 'Square',
    emoji: '🟦',
    color: '#2563eb',
    render: variant => (
      <rect
        x="35"
        y="35"
        width="130"
        height="130"
        fill={variant === 'solid' ? 'currentColor' : 'none'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth="14"
        {...(variant === 'outline' ? outlineStroke : {})}
      />
    ),
  },
  {
    name: 'Triangle',
    emoji: '🔺',
    color: '#f97316',
    render: variant => (
      <polygon
        points="100,25 25,170 175,170"
        fill={variant === 'solid' ? 'currentColor' : 'none'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth="14"
        {...(variant === 'outline' ? outlineStroke : {})}
      />
    ),
  },
  {
    name: 'Rectangle',
    emoji: '🟩',
    color: '#16a34a',
    render: variant => (
      <rect
        x="22"
        y="55"
        width="156"
        height="90"
        fill={variant === 'solid' ? 'currentColor' : 'none'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth="14"
        {...(variant === 'outline' ? outlineStroke : {})}
      />
    ),
  },
  {
    name: 'Oval',
    emoji: '🥚',
    color: '#a855f7',
    render: variant => (
      <ellipse
        cx="100"
        cy="100"
        rx="78"
        ry="52"
        fill={variant === 'solid' ? 'currentColor' : 'none'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth="14"
      />
    ),
  },
  {
    name: 'Diamond',
    emoji: '🔷',
    color: '#0891b2',
    render: variant => (
      <polygon
        points="100,18 182,100 100,182 18,100"
        fill={variant === 'solid' ? 'currentColor' : 'none'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth="14"
        {...(variant === 'outline' ? outlineStroke : {})}
      />
    ),
  },
  {
    name: 'Star',
    emoji: '⭐',
    color: '#facc15',
    render: variant => (
      <polygon
        points="100,18 121,74 181,77 134,116 150,174 100,140 50,174 66,116 19,77 79,74"
        fill={variant === 'solid' ? 'currentColor' : 'none'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth="12"
        {...(variant === 'outline' ? outlineStroke : {})}
      />
    ),
  },
  {
    name: 'Heart',
    emoji: '❤️',
    color: '#ec4899',
    render: variant => (
      <path
        d="M100,170 C48,126 32,101 37,72 C42,43 72,36 92,59 C96,64 99,69 100,74 C101,69 104,64 108,59 C128,36 158,43 163,72 C168,101 152,126 100,170 Z"
        fill={variant === 'solid' ? 'currentColor' : 'none'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth="12"
        {...(variant === 'outline' ? outlineStroke : {})}
      />
    ),
  },
];

const optionRotations = [-8, -3, 0, 4, 7];
const strokeScales = [0.9, 1, 1.12];

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const getRandomShape = () => outlineShapes[Math.floor(Math.random() * outlineShapes.length)];

const buildOptions = (target: OutlineShape): OutlineOption[] => {
  const distractors = shuffle(outlineShapes.filter(shape => shape.name !== target.name)).slice(0, 3);
  return shuffle([target, ...distractors]).map((shape, index) => ({
    shape,
    rotation: optionRotations[(index + Math.floor(Math.random() * optionRotations.length)) % optionRotations.length],
    strokeScale: strokeScales[Math.floor(Math.random() * strokeScales.length)],
  }));
};

export const ShapeOutlinesGame: React.FC = () => {
  const [targetShape, setTargetShape] = useState(getRandomShape);
  const [options, setOptions] = useState(() => buildOptions(targetShape));
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [highlightedName, setHighlightedName] = useState<string | null>(null);
  const { speak, stop } = useVoice();
  const { playChime } = useSuccessChime();
  const timeoutsRef = useRef<number[]>([]);

  const clearPendingSpeech = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
    stop();
  }, [stop]);

  const startNextRound = useCallback(() => {
    const nextTarget = getRandomShape();
    setTargetShape(nextTarget);
    setOptions(buildOptions(nextTarget));
    setShowCelebration(false);
    setHighlightedName(null);
  }, []);

  const repeatPrompt = useCallback(() => {
    speak(`Can you find the ${targetShape.name}?`);
  }, [speak, targetShape.name]);

  useEffect(() => {
    const timer = window.setTimeout(repeatPrompt, 550);
    return () => clearTimeout(timer);
  }, [repeatPrompt]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      stop();
    };
  }, [stop]);

  const handleOptionClick = (option: OutlineOption) => {
    if (showCelebration) return;

    clearPendingSpeech();
    setHighlightedName(option.shape.name);

    if (option.shape.name === targetShape.name) {
      setScore(currentScore => currentScore + 1);
      setShowCelebration(true);
      playChime();

      const successTimer = window.setTimeout(() => {
        speak(`Yes. ${targetShape.name}`);
      }, 250);
      timeoutsRef.current.push(successTimer);

      const nextTimer = window.setTimeout(startNextRound, 2100);
      timeoutsRef.current.push(nextTimer);
      return;
    }

    speak(option.shape.name);
    const retryTimer = window.setTimeout(repeatPrompt, 1050);
    timeoutsRef.current.push(retryTimer);
  };

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
      <AppHeader title="Shape Outlines" emoji="▢" />

      <div className="text-center">
        <span className="text-xl font-bold text-theme-text">Score: </span>
        <span className="text-3xl font-bold text-theme-primary">{score}</span>
        <span className="text-2xl"> ⭐</span>
      </div>

      <motion.button
        key={targetShape.name}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          clearPendingSpeech();
          repeatPrompt();
        }}
        className="bg-white rounded-3xl shadow-xl p-5 md:p-7 mx-auto w-full max-w-2xl border-4 border-purple-200"
      >
        <div className="text-2xl md:text-4xl font-black text-theme-text mb-3">
          Find this outline
        </div>
        <svg
          viewBox="0 0 200 200"
          className="w-36 h-36 md:w-44 md:h-44 mx-auto"
          style={{ color: targetShape.color }}
          aria-label={`Solid ${targetShape.name}`}
        >
          {targetShape.render('solid')}
        </svg>
      </motion.button>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl">
          {options.map((option, index) => {
            const isCorrectHighlight = highlightedName === option.shape.name && option.shape.name === targetShape.name;
            const isWrongHighlight = highlightedName === option.shape.name && option.shape.name !== targetShape.name;

            return (
              <motion.button
                key={`${option.shape.name}-${index}`}
                initial={{ opacity: 0, y: 18, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.92 }}
                disabled={showCelebration}
                onClick={() => handleOptionClick(option)}
                className={`h-44 md:h-56 bg-white rounded-3xl shadow-xl border-4 p-4 flex items-center justify-center transition-all ${
                  isCorrectHighlight
                    ? 'border-green-400 bg-green-50'
                    : isWrongHighlight
                      ? 'border-rose-300 bg-rose-50'
                      : 'border-transparent'
                }`}
                aria-label={`${option.shape.name} outline`}
              >
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full"
                  style={{
                    color: option.shape.color,
                    transform: `rotate(${option.rotation}deg) scale(${option.strokeScale})`,
                  }}
                >
                  {option.shape.render('outline')}
                </svg>
              </motion.button>
            );
          })}
        </div>
      </div>

      <CelebrationModal
        show={showCelebration}
        emoji={targetShape.emoji}
        message={targetShape.name}
        subMessage="outline"
        gradient="bg-gradient-to-br from-purple-200 to-sky-300"
        textColor="text-gray-800"
      />
    </div>
  );
};
