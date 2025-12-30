import React from 'react';
import { motion } from 'framer-motion';
import type { RoutineStep as RoutineStepType } from './routineConfig';

interface RoutineStepProps {
  step: RoutineStepType;
  isCompleted: boolean;
  onToggle: () => void;
}

export const RoutineStep: React.FC<RoutineStepProps> = ({ step, isCompleted, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`
        relative
        w-full
        p-6
        rounded-3xl
        shadow-lg
        transition-all
        duration-300
        ${isCompleted
          ? 'bg-green-400 opacity-75'
          : 'bg-white border-4 border-theme-primary'
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Emoji */}
        <div className="text-6xl flex-shrink-0">
          {step.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 text-left">
          <h3 className={`text-2xl font-bold ${isCompleted ? 'text-white' : 'text-theme-text'}`}>
            {step.title}
          </h3>
          {step.description && (
            <p className={`text-lg mt-1 ${isCompleted ? 'text-white' : 'text-theme-text-secondary'}`}>
              {step.description}
            </p>
          )}
        </div>

        {/* Checkmark */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-6xl flex-shrink-0"
          >
            ✅
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};
