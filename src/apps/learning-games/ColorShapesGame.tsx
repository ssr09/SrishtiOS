import React, { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '../../shared/hooks/useVoice';
import { useSuccessChime } from '../../shared/hooks/useSuccessChime';
import { AppHeader } from '../../shared/components/AppHeader';

interface Shape {
  name: string;
  emoji: string;
  svg: React.ReactElement;
}

interface Color {
  name: string;
  hex: string;
}

interface ColorShape {
  shape: Shape;
  color: Color;
}

const shapes: Shape[] = [
  {
    name: 'Circle',
    emoji: '⭕',
    svg: <circle cx="100" cy="100" r="80" fill="currentColor" />,
  },
  {
    name: 'Square',
    emoji: '🟦',
    svg: <rect x="20" y="20" width="160" height="160" fill="currentColor" />,
  },
  {
    name: 'Triangle',
    emoji: '🔺',
    svg: <polygon points="100,20 20,180 180,180" fill="currentColor" />,
  },
  {
    name: 'Rectangle',
    emoji: '🟩',
    svg: <rect x="10" y="50" width="180" height="100" fill="currentColor" />,
  },
  {
    name: 'Oval',
    emoji: '🥚',
    svg: <ellipse cx="100" cy="100" rx="85" ry="60" fill="currentColor" />,
  },
  {
    name: 'Diamond',
    emoji: '🔷',
    svg: <polygon points="100,10 190,100 100,190 10,100" fill="currentColor" />,
  },
  {
    name: 'Rhombus',
    emoji: '🔷',
    svg: <polygon points="75,30 180,30 125,170 20,170" fill="currentColor" />,
  },
  {
    name: 'Trapezoid',
    emoji: '🔶',
    svg: <polygon points="55,45 145,45 185,165 15,165" fill="currentColor" />,
  },
  {
    name: 'Parallelogram',
    emoji: '▱',
    svg: <polygon points="60,45 185,45 140,165 15,165" fill="currentColor" />,
  },
  {
    name: 'Star',
    emoji: '⭐',
    svg: <polygon points="100,10 120,75 190,80 135,125 150,190 100,155 50,190 65,125 10,80 80,75" fill="currentColor" />,
  },
  {
    name: 'Heart',
    emoji: '❤️',
    svg: <path d="M100,170 Q40,120 40,80 Q40,40 75,40 Q100,40 100,70 Q100,40 125,40 Q160,40 160,80 Q160,120 100,170 Z" fill="currentColor" />,
  },
  {
    name: 'Crescent',
    emoji: '🌙',
    svg: (
      <>
        <defs>
          <mask id="colorCrescentMask">
            <circle cx="92" cy="100" r="78" fill="white" />
            <circle cx="130" cy="82" r="72" fill="black" />
          </mask>
        </defs>
        <circle cx="92" cy="100" r="78" fill="currentColor" mask="url(#colorCrescentMask)" />
      </>
    ),
  },
  {
    name: 'Ring',
    emoji: '⭕',
    svg: (
      <>
        <circle cx="100" cy="100" r="78" fill="currentColor" />
        <circle cx="100" cy="100" r="42" fill="white" />
      </>
    ),
  },
  {
    name: 'Teardrop',
    emoji: '💧',
    svg: <path d="M100,15 C145,70 168,105 168,135 C168,172 138,190 100,190 C62,190 32,172 32,135 C32,105 55,70 100,15 Z" fill="currentColor" />,
  },
  {
    name: 'Cloud',
    emoji: '☁️',
    svg: <path d="M58,145 C35,145 20,130 20,110 C20,91 34,77 53,76 C62,50 84,35 112,41 C134,46 151,63 156,86 C174,89 188,103 188,122 C188,136 176,145 160,145 Z" fill="currentColor" />,
  },
  {
    name: 'Kite',
    emoji: '🪁',
    svg: <polygon points="100,10 175,90 100,190 25,90" fill="currentColor" />,
  },
  {
    name: 'Cube',
    emoji: '🧊',
    svg: (
      <>
        <polygon points="75,25 155,55 155,145 75,115" fill="currentColor" opacity="0.85" />
        <polygon points="45,55 75,25 75,115 45,145" fill="currentColor" opacity="0.65" />
        <polygon points="45,145 75,115 155,145 125,175" fill="currentColor" />
      </>
    ),
  },
  {
    name: 'Cone',
    emoji: '🍦',
    svg: (
      <>
        <ellipse cx="100" cy="160" rx="65" ry="20" fill="currentColor" opacity="0.65" />
        <path d="M100,20 L165,160 L35,160 Z" fill="currentColor" />
      </>
    ),
  },
  {
    name: 'Cylinder',
    emoji: '🥫',
    svg: (
      <>
        <rect x="40" y="55" width="120" height="105" fill="currentColor" />
        <ellipse cx="100" cy="55" rx="60" ry="24" fill="currentColor" opacity="0.8" />
        <ellipse cx="100" cy="160" rx="60" ry="24" fill="currentColor" opacity="0.6" />
      </>
    ),
  },
];

const colors: Color[] = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Yellow', hex: '#FFD700' },
  { name: 'Green', hex: '#00B050' },
  { name: 'Orange', hex: '#FF8C00' },
  { name: 'Purple', hex: '#9370DB' },
  { name: 'Pink', hex: '#FF69B4' },
  { name: 'Brown', hex: '#8B4513' },
];

const getPairKey = ({ color, shape }: ColorShape) => `${color.name}-${shape.name}`;
const getQuestion = ({ color, shape }: ColorShape) => `Can you find the ${color.name} ${shape.name}?`;

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const pickDifferent = <T,>(items: T[], current: T): T => {
  const choices = items.filter(item => item !== current);
  return choices[Math.floor(Math.random() * choices.length)];
};

const createTarget = (): ColorShape => ({
  shape: shapes[Math.floor(Math.random() * shapes.length)],
  color: colors[Math.floor(Math.random() * colors.length)],
});

const buildOptions = (target: ColorShape): ColorShape[] => {
  const sameShapeDifferentColor = {
    shape: target.shape,
    color: pickDifferent(colors, target.color),
  };
  const sameColorDifferentShape = {
    shape: pickDifferent(shapes, target.shape),
    color: target.color,
  };
  const differentShapeAndColor = {
    shape: pickDifferent(shapes, target.shape),
    color: pickDifferent(colors, target.color),
  };

  const uniqueOptions = [target, sameShapeDifferentColor, sameColorDifferentShape, differentShapeAndColor].filter(
    (option, index, allOptions) => allOptions.findIndex(item => getPairKey(item) === getPairKey(option)) === index
  );

  return shuffle(uniqueOptions);
};

export const ColorShapesGame: React.FC = () => {
  const [roundState, setRoundState] = useState(() => {
    const initialTarget = createTarget();
    return {
      target: initialTarget,
      options: buildOptions(initialTarget),
      round: 1,
    };
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const { speak, stop } = useVoice();
  const { playChime } = useSuccessChime();
  const timeoutsRef = useRef<number[]>([]);
  const { target, options, round } = roundState;

  const clearPendingSpeech = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
    stop();
  }, [stop]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(t => clearTimeout(t));
      stop();
    };
  }, [stop]);

  const generateRound = () => {
    const nextTarget = createTarget();
    setRoundState(currentRoundState => ({
      target: nextTarget,
      options: buildOptions(nextTarget),
      round: currentRoundState.round + 1,
    }));
  };

  const speakQuestion = useCallback(() => {
    speak(getQuestion(target));
  }, [speak, target]);

  const handleOptionClick = (option: ColorShape) => {
    clearPendingSpeech();

    if (getPairKey(option) === getPairKey(target)) {
      setShowCelebration(true);
      setScore(currentScore => currentScore + 1);
      playChime();

      const answerTimer = window.setTimeout(() => {
        speak(`Yes! That's the ${option.color.name} ${option.shape.name}`);
      }, 250);
      timeoutsRef.current.push(answerTimer);

      const t = window.setTimeout(() => {
        setShowCelebration(false);
        generateRound();
      }, 2000);
      timeoutsRef.current.push(t);
    } else {
      speak(`That's a ${option.color.name} ${option.shape.name}...`);
      const t = window.setTimeout(() => {
        speak(getQuestion(target));
      }, 1400);
      timeoutsRef.current.push(t);
    }
  };

  useEffect(() => {
    if (round === 0) return;
    const timer = window.setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
  }, [round, speakQuestion]);

  return (
    <div className="min-h-screen bg-theme-bg p-4 flex flex-col overflow-y-auto">
      <AppHeader title="Color Shapes" emoji="🎨" />

      <div className="text-center py-2">
        <span className="text-xl font-bold text-theme-text">Score: </span>
        <span className="text-3xl font-bold text-theme-primary">{score}</span>
        <span className="text-2xl"> ⭐</span>
      </div>

      <motion.button
        key={getPairKey(target)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={speakQuestion}
        className="bg-white rounded-3xl p-4 md:p-6 shadow-2xl mx-auto text-center cursor-pointer hover:shadow-3xl transition-shadow"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
          Can you find the{' '}
          <span style={{ color: target.color.hex }}>{target.color.name}</span>{' '}
          {target.shape.name}?
        </h2>
        <svg viewBox="0 0 200 200" className="w-20 h-20 md:w-32 md:h-32 mx-auto" style={{ color: target.color.hex }}>
          {target.shape.svg}
        </svg>
      </motion.button>

      <div className="flex-1 flex items-start md:items-center justify-center pt-6 md:pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {options.map((option, index) => (
            <motion.button
              key={`${getPairKey(option)}-${index}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => !showCelebration && handleOptionClick(option)}
              disabled={showCelebration}
              className={`w-32 h-32 md:w-44 md:h-44 bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all p-3 md:p-4 flex flex-col items-center justify-center ${showCelebration ? 'pointer-events-none' : ''}`}
            >
              <svg viewBox="0 0 200 200" className="w-full h-3/4" style={{ color: option.color.hex }}>
                {option.shape.svg}
              </svg>
              <div className="text-sm md:text-lg font-bold text-gray-700 leading-tight">
                {option.color.name} {option.shape.name}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-gradient-to-br from-cyan-300 to-lime-300 rounded-3xl p-10 shadow-2xl">
              <svg viewBox="0 0 200 200" className="w-36 h-36 md:w-48 md:h-48" style={{ color: target.color.hex }}>
                {target.shape.svg}
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
