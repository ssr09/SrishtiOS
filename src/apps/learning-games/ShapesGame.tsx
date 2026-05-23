import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useVoice } from '../../shared/hooks/useVoice';
import { useSuccessChime } from '../../shared/hooks/useSuccessChime';
import { useGameRound } from '../../shared/hooks/useGameRound';
import { AppHeader } from '../../shared/components/AppHeader';
import { CelebrationModal } from '../../shared/components/CelebrationModal';

interface Shape {
  name: string;
  emoji: string;
  svg: React.ReactElement;
}

const shapes: Shape[] = [
  // Basic shapes
  {
    name: 'Circle',
    emoji: '⭕',
    svg: <circle cx="100" cy="100" r="80" fill="currentColor" />
  },
  {
    name: 'Square',
    emoji: '🟦',
    svg: <rect x="20" y="20" width="160" height="160" fill="currentColor" />
  },
  {
    name: 'Rectangle',
    emoji: '🟩',
    svg: <rect x="10" y="50" width="180" height="100" fill="currentColor" />
  },
  {
    name: 'Triangle',
    emoji: '🔺',
    svg: <polygon points="100,20 20,180 180,180" fill="currentColor" />
  },
  {
    name: 'Oval',
    emoji: '🥚',
    svg: <ellipse cx="100" cy="100" rx="85" ry="60" fill="currentColor" />
  },
  {
    name: 'Diamond',
    emoji: '🔷',
    svg: <polygon points="100,10 190,100 100,190 10,100" fill="currentColor" />
  },
  {
    name: 'Rhombus',
    emoji: '🔷',
    svg: <polygon points="75,30 180,30 125,170 20,170" fill="currentColor" />
  },
  {
    name: 'Trapezoid',
    emoji: '🔶',
    svg: <polygon points="55,45 145,45 185,165 15,165" fill="currentColor" />
  },
  {
    name: 'Parallelogram',
    emoji: '▱',
    svg: <polygon points="60,45 185,45 140,165 15,165" fill="currentColor" />
  },
  // Polygons
  {
    name: 'Pentagon',
    emoji: '⬠',
    svg: <polygon points="100,15 190,70 160,175 40,175 10,70" fill="currentColor" />
  },
  {
    name: 'Hexagon',
    emoji: '⬡',
    svg: <polygon points="50,25 150,25 190,100 150,175 50,175 10,100" fill="currentColor" />
  },
  {
    name: 'Octagon',
    emoji: '🛑',
    svg: <polygon points="60,20 140,20 180,60 180,140 140,180 60,180 20,140 20,60" fill="currentColor" />
  },
  // Fun shapes
  {
    name: 'Star',
    emoji: '⭐',
    svg: <polygon points="100,10 120,75 190,80 135,125 150,190 100,155 50,190 65,125 10,80 80,75" fill="currentColor" />
  },
  {
    name: 'Heart',
    emoji: '❤️',
    svg: <path d="M100,170 Q40,120 40,80 Q40,40 75,40 Q100,40 100,70 Q100,40 125,40 Q160,40 160,80 Q160,120 100,170 Z" fill="currentColor" />
  },
  {
    name: 'Moon',
    emoji: '🌙',
    svg: (
      <>
        <defs>
          <mask id="moonMask">
            <circle cx="100" cy="100" r="75" fill="white" />
            <circle cx="140" cy="90" r="60" fill="black" />
          </mask>
        </defs>
        <circle cx="100" cy="100" r="75" fill="currentColor" mask="url(#moonMask)" />
      </>
    )
  },
  {
    name: 'Cross',
    emoji: '➕',
    svg: <path d="M70,20 h60 v50 h50 v60 h-50 v50 h-60 v-50 h-50 v-60 h50 z" fill="currentColor" />
  },
  {
    name: 'Arrow',
    emoji: '➡️',
    svg: <polygon points="20,70 120,70 120,30 180,100 120,170 120,130 20,130" fill="currentColor" />
  },
  {
    name: 'Semicircle',
    emoji: '🌈',
    svg: <path d="M20,120 A80,80 0 0,1 180,120 Z" fill="currentColor" />
  },
  {
    name: 'Crescent',
    emoji: '🌙',
    svg: (
      <>
        <defs>
          <mask id="crescentMask">
            <circle cx="92" cy="100" r="78" fill="white" />
            <circle cx="130" cy="82" r="72" fill="black" />
          </mask>
        </defs>
        <circle cx="92" cy="100" r="78" fill="currentColor" mask="url(#crescentMask)" />
      </>
    )
  },
  {
    name: 'Ring',
    emoji: '⭕',
    svg: (
      <>
        <circle cx="100" cy="100" r="78" fill="currentColor" />
        <circle cx="100" cy="100" r="42" fill="white" />
      </>
    )
  },
  {
    name: 'Teardrop',
    emoji: '💧',
    svg: <path d="M100,15 C145,70 168,105 168,135 C168,172 138,190 100,190 C62,190 32,172 32,135 C32,105 55,70 100,15 Z" fill="currentColor" />
  },
  {
    name: 'Cloud',
    emoji: '☁️',
    svg: <path d="M58,145 C35,145 20,130 20,110 C20,91 34,77 53,76 C62,50 84,35 112,41 C134,46 151,63 156,86 C174,89 188,103 188,122 C188,136 176,145 160,145 Z" fill="currentColor" />
  },
  {
    name: 'Kite',
    emoji: '🪁',
    svg: <polygon points="100,10 175,90 100,190 25,90" fill="currentColor" />
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
    )
  },
  {
    name: 'Cone',
    emoji: '🍦',
    svg: (
      <>
        <ellipse cx="100" cy="160" rx="65" ry="20" fill="currentColor" opacity="0.65" />
        <path d="M100,20 L165,160 L35,160 Z" fill="currentColor" />
      </>
    )
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
    )
  },
];

const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3', '#F38181', '#A8E6CF', '#FFB6C1'];

const getShapeKey = (shape: Shape) => shape.name;
const getRandomShapeColor = () => colors[Math.floor(Math.random() * colors.length)];

export const ShapesGame: React.FC = () => {
  const { target: targetShape, options, round, generateRound: generateShapeRound } = useGameRound({
    items: shapes,
    optionCount: 4,
    getKey: getShapeKey,
  });
  const [shapeColor, setShapeColor] = useState(getRandomShapeColor);
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const { speak, stop } = useVoice();
  const { playChime } = useSuccessChime();
  const timeoutsRef = useRef<number[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
      stop();
    };
  }, [stop]);

  const generateRound = () => {
    generateShapeRound();
    // Pick random color
    setShapeColor(getRandomShapeColor);
  };

  const handleShapeClick = (shape: Shape) => {
    if (shape.name === targetShape.name) {
      // Correct!
      setShowCelebration(true);
      setScore(score + 1);
      playChime();
      speak(`Yes! That's a ${shape.name}`);

      const t = window.setTimeout(() => {
        setShowCelebration(false);
        generateRound();
      }, 2000);
      timeoutsRef.current.push(t);
    } else {
      // Name what they picked, pause, then guide to correct answer
      speak(`That's a ${shape.name}...`);
      const t = window.setTimeout(() => {
        speak(`Can you find the ${targetShape.name}?`);
      }, 1200);
      timeoutsRef.current.push(t);
    }
  };

  // Speak the target shape name on each round
  useEffect(() => {
    if (round === 0) return;
    const timer = setTimeout(() => {
      speak(`Can you find the ${targetShape.name}?`);
    }, 500);
    return () => clearTimeout(timer);
  }, [round, speak]);

  return (
    <div className="h-screen bg-theme-bg p-4 flex flex-col overflow-hidden">
      <AppHeader title="Shapes" emoji="🔷" />

      {/* Score */}
      <div className="text-center py-2">
        <span className="text-xl font-bold text-theme-text">Score: </span>
        <span className="text-3xl font-bold text-theme-primary">{score}</span>
        <span className="text-2xl"> ⭐</span>
      </div>

      {/* Prompt - tap to repeat question */}
      <motion.button
        key={targetShape.name}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => speak(`Can you find the ${targetShape.name}?`)}
        className="bg-white rounded-3xl p-6 shadow-2xl mx-auto text-center cursor-pointer hover:shadow-3xl transition-shadow"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Can you find the {targetShape.name}?
        </h2>
        <svg viewBox="0 0 200 200" className="w-28 h-28 md:w-36 md:h-36 mx-auto" style={{ color: shapeColor }}>
          {targetShape.svg}
        </svg>
      </motion.button>

      {/* Shape Options */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {options.map((shape, index) => (
            <motion.button
              key={`${shape.name}-${index}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => !showCelebration && handleShapeClick(shape)}
              disabled={showCelebration}
              className={`w-36 h-36 md:w-44 md:h-44 bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all p-4 flex flex-col items-center justify-center ${showCelebration ? 'pointer-events-none' : ''}`}
            >
              <svg viewBox="0 0 200 200" className="w-full h-3/4" style={{ color: shapeColor }}>
                {shape.svg}
              </svg>
              <div className="text-lg font-bold text-gray-700">{shape.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Celebration */}
      <CelebrationModal
        show={showCelebration}
        message={targetShape.emoji}
        gradient="bg-gradient-to-br from-purple-300 to-pink-400"
      />
    </div>
  );
};
