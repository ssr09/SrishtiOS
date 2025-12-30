import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import { useNavigation } from '../../shared/contexts/NavigationContext';
import { CelebrationModal } from '../../shared/components/CelebrationModal';
import { RoutineStep } from './RoutineStep';
import { routineSteps, getCurrentTimeOfDay, timeOfDayInfo } from './routineConfig';
import type { TimeOfDay } from './routineConfig';

interface CompletedSteps {
  [key: string]: boolean;
}

export const DailyRoutine: React.FC = () => {
  const { goHome } = useNavigation();
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState<TimeOfDay>(getCurrentTimeOfDay());
  const [completedSteps, setCompletedSteps] = useLocalStorage<CompletedSteps>('srishti-routine-completed', {});
  const [showCelebration, setShowCelebration] = useState(false);

  // Update time of day every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeOfDay(getCurrentTimeOfDay());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Reset completed steps at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setCompletedSteps({});
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, [setCompletedSteps]);

  const handleToggleStep = (stepId: string) => {
    const newCompletedSteps = {
      ...completedSteps,
      [stepId]: !completedSteps[stepId],
    };
    setCompletedSteps(newCompletedSteps);

    // Show celebration if marking as complete
    if (!completedSteps[stepId]) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const currentSteps = routineSteps[currentTimeOfDay];
  const completedCount = currentSteps.filter(step => completedSteps[step.id]).length;
  const totalCount = currentSteps.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const timeInfo = timeOfDayInfo[currentTimeOfDay];

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-text flex items-center gap-3">
            <span className="text-6xl">{timeInfo.emoji}</span>
            {timeInfo.label} Time
          </h1>

          <button
            onClick={goHome}
            className="text-5xl hover:scale-110 transition-transform"
          >
            🏠
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-full h-8 overflow-hidden shadow-lg">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            className={`h-full ${timeInfo.color} flex items-center justify-center`}
            transition={{ duration: 0.5 }}
          >
            {completedCount > 0 && (
              <span className="text-white font-bold text-lg">
                {completedCount} / {totalCount}
              </span>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Routine Steps */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {currentSteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RoutineStep
              step={step}
              isCompleted={!!completedSteps[step.id]}
              onToggle={() => handleToggleStep(step.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* All Done Message */}
      {completedCount === totalCount && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 text-center"
        >
          <div className="inline-block bg-green-400 text-white rounded-3xl px-8 py-6 shadow-2xl">
            <div className="text-6xl mb-2">🎉</div>
            <h2 className="text-3xl font-bold">All Done!</h2>
            <p className="text-xl mt-2">Great job, Srishti!</p>
          </div>
        </motion.div>
      )}

      {/* Celebration Animation */}
      <CelebrationModal show={showCelebration} emoji="⭐" />

      {/* Time of Day Selector (for testing) */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex gap-2 opacity-30 hover:opacity-100 transition-opacity">
        {(Object.keys(timeOfDayInfo) as TimeOfDay[]).map(timeKey => (
          <button
            key={timeKey}
            onClick={() => setCurrentTimeOfDay(timeKey)}
            className={`
              px-4 py-2 rounded-full text-2xl transition-all
              ${currentTimeOfDay === timeKey ? timeOfDayInfo[timeKey].color + ' scale-110' : 'hover:scale-105'}
            `}
          >
            {timeOfDayInfo[timeKey].emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
