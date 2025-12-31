import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVoice } from '../../shared/hooks/useVoice';
import { AppHeader } from '../../shared/components/AppHeader';

interface Animal {
  id: string;
  name: string;
  emoji: string;
  soundText: string;
}

const animals: Animal[] = [
  // Farm Animals
  { id: 'cow', name: 'Cow', emoji: '🐄', soundText: 'Moo' },
  { id: 'pig', name: 'Pig', emoji: '🐷', soundText: 'Oink' },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', soundText: 'Baa' },
  { id: 'goat', name: 'Goat', emoji: '🐐', soundText: 'Meh' },
  { id: 'horse', name: 'Horse', emoji: '🐴', soundText: 'Neigh' },
  { id: 'donkey', name: 'Donkey', emoji: '🫏', soundText: 'Hee-haw' },
  { id: 'chicken', name: 'Chicken', emoji: '🐔', soundText: 'Cluck' },
  { id: 'rooster', name: 'Rooster', emoji: '🐓', soundText: 'Cock-a-doodle' },
  { id: 'duck', name: 'Duck', emoji: '🦆', soundText: 'Quack' },
  // Pets
  { id: 'dog', name: 'Dog', emoji: '🐶', soundText: 'Woof' },
  { id: 'cat', name: 'Cat', emoji: '🐱', soundText: 'Meow' },
  // Wild Animals
  { id: 'lion', name: 'Lion', emoji: '🦁', soundText: 'Roar' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯', soundText: 'Roar' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', soundText: 'Trumpet' },
  { id: 'monkey', name: 'Monkey', emoji: '🐵', soundText: 'Ooh ooh' },
  { id: 'gorilla', name: 'Gorilla', emoji: '🦍', soundText: 'Grunt' },
  { id: 'wolf', name: 'Wolf', emoji: '🐺', soundText: 'Howl' },
  { id: 'frog', name: 'Frog', emoji: '🐸', soundText: 'Ribbit' },
  { id: 'snake', name: 'Snake', emoji: '🐍', soundText: 'Hiss' },
  // Birds
  { id: 'bird', name: 'Bird', emoji: '🐦', soundText: 'Tweet' },
  { id: 'owl', name: 'Owl', emoji: '🦉', soundText: 'Hoot' },
  { id: 'parrot', name: 'Parrot', emoji: '🦜', soundText: 'Squawk' },
  // Insects
  { id: 'bee', name: 'Bee', emoji: '🐝', soundText: 'Buzz' },
];

export const AnimalSounds: React.FC = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const { speak, stop } = useVoice();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Stop speech synthesis
      stop();
    };
  }, [stop]);

  const playSound = (animal: Animal) => {
    // Stop any currently playing sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create and play new audio
    const audio = new Audio(`/sounds/animals/${animal.id}.mp3`);
    audioRef.current = audio;

    audio.onended = () => {
      setSelectedAnimal(null);
    };

    audio.onerror = () => {
      // Fallback to speech synthesis if audio file not found
      speak(animal.soundText, { pitch: 1.4, rate: 0.9 });
      setTimeout(() => setSelectedAnimal(null), 1000);
    };

    audio.play().catch(() => {
      audio.onerror?.(new Event('error'));
    });
  };

  const handleAnimalClick = (animal: Animal) => {
    setSelectedAnimal(animal);
    stop();

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // First speak the animal name, then play the sound
    speak(animal.name, { rate: 0.9 });
    timeoutRef.current = window.setTimeout(() => playSound(animal), 800);
  };

  return (
    <div className="min-h-screen bg-theme-bg p-4 md:p-8">
      <div className="mb-6">
        <AppHeader title="Animal Sounds" emoji="🦁" />
      </div>

      {/* Animals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
        {animals.map((animal, index) => (
          <motion.button
            key={animal.name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAnimalClick(animal)}
            className={`
              bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all
              ${selectedAnimal?.name === animal.name ? 'scale-110 bg-yellow-200' : ''}
            `}
          >
            <motion.div
              className="text-7xl mb-3"
              animate={selectedAnimal?.name === animal.name ? {
                scale: [1, 1.2, 1],
              } : {}}
              transition={selectedAnimal?.name === animal.name ? {
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
              } : { duration: 0.3 }}
            >
              {animal.emoji}
            </motion.div>

            <div className="text-xl font-bold text-theme-text mb-1">
              {animal.name}
            </div>

            <div className={`
              text-lg font-semibold
              ${selectedAnimal?.name === animal.name ? 'text-orange-600' : 'text-gray-500'}
            `}>
              {animal.soundText}!
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
