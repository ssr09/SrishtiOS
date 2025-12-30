import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import { AppHeader } from '../../shared/components/AppHeader';
import { CelebrationModal } from '../../shared/components/CelebrationModal';

interface Achievement {
  id: string;
  name: string;
  emoji: string;
  stars: number;
}

const achievements: Achievement[] = [
  { id: 'routine', name: 'Finished Routine', emoji: '🌟', stars: 0 },
  { id: 'food', name: 'Tried New Food', emoji: '🍎', stars: 0 },
  { id: 'tidy', name: 'Tidied Up', emoji: '🧹', stars: 0 },
  { id: 'kind', name: 'Was Kind', emoji: '💝', stars: 0 },
  { id: 'brave', name: 'Was Brave', emoji: '🦁', stars: 0 },
  { id: 'helper', name: 'Great Helper', emoji: '🤝', stars: 0 },
];

const milestones = [
  { stars: 5, reward: 'Pick a Story', emoji: '📚' },
  { stars: 10, reward: 'Extra Play Time', emoji: '🎨' },
  { stars: 15, reward: 'Special Treat', emoji: '🍰' },
  { stars: 20, reward: 'Big Surprise!', emoji: '🎁' },
];

export const StarChart: React.FC = () => {
  const [achievementStars, setAchievementStars] = useLocalStorage<Record<string, number>>(
    'srishti-stars',
    {}
  );
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  const totalStars = Object.values(achievementStars).reduce((sum, stars) => sum + stars, 0);

  const awardStar = (achievementId: string) => {
    const newStars = {
      ...achievementStars,
      [achievementId]: (achievementStars[achievementId] || 0) + 1,
    };
    setAchievementStars(newStars);

    // Check for milestone
    const newTotal = Object.values(newStars).reduce((sum, stars) => sum + stars, 0);
    const milestone = milestones.find(m => m.stars === newTotal);

    if (milestone) {
      setCelebrationMessage(`🎉 ${milestone.stars} Stars! ${milestone.reward}!`);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } else {
      setCelebrationMessage('⭐ Star Earned!');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
    }
  };

  const resetStars = () => {
    if (window.confirm('Reset all stars? This cannot be undone!')) {
      setAchievementStars({});
    }
  };

  const nextMilestone = milestones.find(m => m.stars > totalStars);

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <AppHeader title="My Stars" emoji="⭐" />
      </div>

      {/* Star Jar / Total Display */}
      <motion.div
        className="bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-3xl p-8 mb-8 text-center shadow-2xl max-w-2xl mx-auto"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <div className="text-9xl mb-4">🏆</div>
        <div className="text-7xl font-bold text-yellow-900 mb-2">{totalStars}</div>
        <div className="text-3xl font-bold text-yellow-800">Total Stars!</div>

        {/* Progress to Next Milestone */}
        {nextMilestone && (
          <div className="mt-6">
            <div className="text-xl text-yellow-800 mb-2">
              {nextMilestone.stars - totalStars} more stars until:
            </div>
            <div className="text-2xl font-bold text-yellow-900">
              <span className="text-4xl mr-2">{nextMilestone.emoji}</span>
              {nextMilestone.reward}
            </div>
            {/* Progress bar */}
            <div className="mt-4 bg-yellow-300 rounded-full h-6 overflow-hidden">
              <motion.div
                className="h-full bg-yellow-600"
                initial={{ width: 0 }}
                animate={{
                  width: `${(totalStars / nextMilestone.stars) * 100}%`
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Achievements Grid */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-3xl font-bold text-theme-text mb-4">Earn Stars:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const stars = achievementStars[achievement.id] || 0;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => awardStar(achievement.id)}
                  className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  <div className="text-6xl mb-2">{achievement.emoji}</div>
                  <div className="text-xl font-bold text-theme-text mb-2">
                    {achievement.name}
                  </div>
                  <div className="flex justify-center gap-1 flex-wrap">
                    {[...Array(Math.min(stars, 5))].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="text-3xl"
                      >
                        ⭐
                      </motion.span>
                    ))}
                    {stars > 5 && (
                      <span className="text-2xl font-bold text-yellow-600">
                        +{stars - 5}
                      </span>
                    )}
                  </div>
                  {stars === 0 && (
                    <div className="text-gray-400 text-sm mt-2">Tap to earn!</div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Milestones */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-3xl font-bold text-theme-text mb-4">Rewards:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {milestones.map(milestone => {
            const isUnlocked = totalStars >= milestone.stars;

            return (
              <motion.div
                key={milestone.stars}
                className={`
                  p-4 rounded-2xl text-center transition-all
                  ${isUnlocked
                    ? 'bg-green-400 text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}
                animate={isUnlocked ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className="text-5xl mb-2">{milestone.emoji}</div>
                <div className="font-bold text-lg mb-1">{milestone.stars} ⭐</div>
                <div className="text-sm">{milestone.reward}</div>
                {isUnlocked && (
                  <div className="text-2xl mt-2">✅</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Reset Button (Parent) */}
      <div className="text-center">
        <button
          onClick={resetStars}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          Reset Stars (Parent)
        </button>
      </div>

      {/* Celebration Overlay */}
      <CelebrationModal
        show={showCelebration}
        emoji="⭐"
        message={celebrationMessage}
        gradient="bg-yellow-400"
        textColor="text-yellow-900"
      />
    </div>
  );
};
