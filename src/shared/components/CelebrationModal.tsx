import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelebrationModalProps {
  show: boolean;
  emoji?: string;
  message?: string;
  subMessage?: string;
  gradient?: string; // Tailwind gradient/bg classes, e.g. "bg-gradient-to-br from-yellow-300 to-orange-400"
  textColor?: string; // Tailwind text color class, defaults to "text-white"
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  show,
  emoji = '🎉',
  message,
  subMessage,
  gradient = 'bg-gradient-to-br from-yellow-300 to-orange-400',
  textColor = 'text-white',
}) => {
  // Simple mode: just emoji, no background
  const isSimple = !message && !gradient;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
        >
          {isSimple ? (
            <div className="text-9xl">{emoji}</div>
          ) : (
            <div className={`${gradient} rounded-3xl p-12 shadow-2xl text-center`}>
              <div className="text-9xl mb-4">{emoji}</div>
              {message && (
                <div className={`text-5xl font-bold ${textColor}`}>
                  {message}
                </div>
              )}
              {subMessage && (
                <div className={`text-3xl font-bold ${textColor} mt-2`}>
                  {subMessage}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
