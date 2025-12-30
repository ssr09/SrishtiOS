import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '../../shared/hooks/useVoice';
import { AppHeader } from '../../shared/components/AppHeader';
import type { Story } from './storyData';
import { stories } from './storyData';

export const StoryTime: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [autoNarrate, setAutoNarrate] = useState(true);
  const { speak } = useVoice();

  const currentScene = selectedStory?.scenes[currentSceneIndex];

  useEffect(() => {
    if (currentScene && autoNarrate) {
      const timer = setTimeout(() => {
        speak(currentScene.text);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentScene, autoNarrate, speak]);

  const handleNext = () => {
    if (selectedStory && currentSceneIndex < selectedStory.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else {
      // Story finished, go back to selection
      setSelectedStory(null);
      setCurrentSceneIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  const handleInteraction = (sound: string) => {
    speak(sound, { rate: 1.1, pitch: 1.3 });
  };

  const selectStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentSceneIndex(0);
  };

  // Story Selection Screen
  if (!selectedStory) {
    return (
      <div className="min-h-screen bg-theme-bg p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <AppHeader title="Story Time" emoji="📖" />
        </div>

        {/* Story Selection */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-theme-text mb-6 text-center">
            Choose a Story!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <motion.button
                key={story.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectStory(story)}
                className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all"
              >
                <div className="text-9xl mb-4">{story.emoji}</div>
                <h3 className="text-3xl font-bold text-theme-text">{story.title}</h3>
                <p className="text-xl text-gray-600 mt-2">
                  {story.scenes.length} scenes
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Story Reading Screen
  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <AppHeader
          title={selectedStory.title}
          emoji="📖"
          onHome={() => {
            setSelectedStory(null);
            setCurrentSceneIndex(0);
          }}
        />
      </div>

      {/* Progress */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold text-theme-text">
            Scene {currentSceneIndex + 1} of {selectedStory.scenes.length}
          </span>
          <button
            onClick={() => setAutoNarrate(!autoNarrate)}
            className={`
              px-4 py-2 rounded-xl text-lg font-bold transition-all
              ${autoNarrate ? 'bg-green-400 text-white' : 'bg-gray-300 text-gray-700'}
            `}
          >
            🔊 {autoNarrate ? 'Auto Narrate ON' : 'Auto Narrate OFF'}
          </button>
        </div>
        <div className="bg-gray-200 rounded-full h-4">
          <motion.div
            className="bg-theme-primary h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSceneIndex + 1) / selectedStory.scenes.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Scene Display */}
      <AnimatePresence mode="wait">
        {currentScene && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-4xl mx-auto mb-8"
          >
            {/* Scene Content */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
              {/* Main Emoji */}
              <div className="text-center mb-6">
                <div className="text-9xl">{currentScene.emoji}</div>
              </div>

              {/* Interactive Scene Area */}
              <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 mb-6 h-64 overflow-hidden">
                {currentScene.interactiveElements?.map((element, index) => (
                  <motion.button
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleInteraction(element.sound)}
                    className="absolute text-7xl"
                    style={{
                      left: `${element.position.x}%`,
                      top: `${element.position.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {element.emoji}
                  </motion.button>
                ))}
              </div>

              {/* Text */}
              <p className="text-3xl text-center text-gray-800 leading-relaxed">
                {currentScene.text}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentSceneIndex === 0}
                className={`
                  px-8 py-4 rounded-2xl text-2xl font-bold transition-all
                  ${currentSceneIndex === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-400 text-white hover:bg-blue-500 shadow-lg'
                  }
                `}
              >
                ⬅️ Previous
              </button>

              <button
                onClick={handleNext}
                className="px-8 py-4 bg-green-400 text-white rounded-2xl text-2xl font-bold hover:bg-green-500 transition-all shadow-lg"
              >
                {currentSceneIndex === selectedStory.scenes.length - 1 ? '🏠 Finish' : 'Next ➡️'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
