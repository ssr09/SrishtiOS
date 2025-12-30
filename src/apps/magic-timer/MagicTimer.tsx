import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSyncedStorage } from '../../shared/hooks/useSyncedStorage';
import { AppHeader } from '../../shared/components/AppHeader';
import { timerPresets as defaultTimerPresets, particleTypes, formatTime } from './timerConfig';
import type { ParticleType, TimerPreset } from './timerConfig';
import { HourglassAnimation } from './animations/HourglassAnimation';

export const MagicTimer: React.FC = () => {
  const [timerPresets] = useSyncedStorage<TimerPreset[]>('timerPresets', defaultTimerPresets);
  const [isMuted, setIsMuted] = useSyncedStorage<boolean>('timerMuted', false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [particleType, setParticleType] = useState<ParticleType>('sand');
  const [showCompletion, setShowCompletion] = useState(false);
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isTock, setIsTock] = useState(false);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;
  const timeRemainingPercent = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 100;

  // Play tick-tock sound
  const playTickTock = () => {
    if (isMuted) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Alternate between tick (higher) and tock (lower)
      oscillator.frequency.value = isTock ? 600 : 800;
      oscillator.type = 'sine';

      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      oscillator.start(now);
      oscillator.stop(now + 0.05);

      setIsTock(!isTock);
    } catch {
      // Audio not supported
    }
  };

  // Play tick sound when timer ticks
  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining > 0 && timeRemaining < totalTime) {
      playTickTock();
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused, timeRemaining]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setShowCompletion(true);
    playCompletionSound();
  };

  const dismissCompletion = () => {
    setShowCompletion(false);
    setTimeRemaining(0);
    setTotalTime(0);
  };

  const playCompletionSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Play a "ta-da-dum!" celebration melody
      const playNote = (frequency: number, startTime: number, duration: number, volume: number = 0.3) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;

      // Ta (C5) - quick
      playNote(523, now, 0.15, 0.25);
      // Da (E5) - quick
      playNote(659, now + 0.15, 0.15, 0.3);
      // Dum! (G5) - longer, triumphant
      playNote(784, now + 0.3, 0.4, 0.35);
      // Final flourish (C6) - highest note
      playNote(1047, now + 0.5, 0.5, 0.25);

    } catch {
      // Audio not supported
    }
  };

  const startTimer = (seconds: number) => {
    setTimeRemaining(seconds);
    setTotalTime(seconds);
    setIsRunning(true);
    setIsPaused(false);
    setShowCustomInput(false);
  };

  const handlePresetClick = (preset: TimerPreset) => {
    startTimer(preset.seconds);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(0);
    setTotalTime(0);
  };

  const handleReset = () => {
    // Trigger flip animation
    setIsFlipping(true);
    setIsPaused(true);

    // After flip animation, reset timer
    setTimeout(() => {
      setTimeRemaining(totalTime);
      setIsPaused(false);
      setIsRunning(true);
      setIsFlipping(false);
    }, 600);
  };

  // Auto-format input as mm:ss when typing numbers
  const handleCustomInputChange = (value: string) => {
    // Strip non-digits and limit to 4 digits (mm:ss)
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setCustomMinutes(digits);
  };

  const handleCustomTime = () => {
    // Parse raw digits as mmss format
    const digits = customMinutes.padStart(4, '0');
    const mins = parseInt(digits.slice(0, 2)) || 0;
    const secs = parseInt(digits.slice(2, 4)) || 0;
    const totalSeconds = mins * 60 + secs;

    if (totalSeconds > 0) {
      startTimer(totalSeconds);
      setCustomMinutes('');
    }
  };

  // Determine urgency styling
  const getUrgencyClass = () => {
    if (!isRunning && !totalTime) return 'text-theme-text-secondary';
    if (timeRemainingPercent <= 10) return 'text-red-500';
    if (timeRemainingPercent <= 25) return 'text-orange-500';
    return 'text-theme-primary';
  };

  const timerDisplay = isRunning || totalTime > 0 ? formatTime(timeRemaining) : '0:00';

  return (
    <div className="h-screen bg-theme-bg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 flex-shrink-0">
        <AppHeader title="Magic Timer" emoji="⏳" />
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 px-3 pb-3 min-h-0 overflow-hidden">

        {/* Mobile: Particle selector as horizontal row at top */}
        <div className="flex lg:hidden gap-2 justify-center flex-shrink-0">
          {particleTypes.map(type => (
            <motion.button
              key={type.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setParticleType(type.id)}
              className={`
                w-12 h-12 rounded-xl text-2xl transition-all
                flex items-center justify-center
                ${particleType === type.id
                  ? 'bg-theme-primary scale-110 shadow-lg'
                  : 'bg-white shadow'
                }
              `}
            >
              {type.emoji}
            </motion.button>
          ))}
        </div>

        {/* Desktop: Left Column - Particles (vertical) */}
        <div className="hidden lg:flex w-20 flex-col justify-center gap-2 bg-white bg-opacity-30 rounded-2xl p-2">
          {particleTypes.map(type => (
            <motion.button
              key={type.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setParticleType(type.id)}
              className={`
                aspect-square rounded-xl text-4xl transition-all
                flex items-center justify-center
                ${particleType === type.id
                  ? 'bg-theme-primary scale-105 shadow-lg'
                  : 'bg-white hover:scale-105 shadow'
                }
              `}
            >
              {type.emoji}
            </motion.button>
          ))}
        </div>

        {/* Center Column: Timer Display + Hourglass + Controls */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white bg-opacity-30 rounded-2xl p-3 min-h-0">
          {/* Time Display */}
          <motion.div
            key={timeRemaining}
            initial={{ scale: 1.02 }}
            animate={{ scale: 1 }}
            className={`text-4xl md:text-5xl font-bold mb-1 tabular-nums ${getUrgencyClass()}`}
          >
            {timerDisplay}
          </motion.div>

          {/* Progress indicator */}
          {(isRunning || isPaused) && (
            <div className="text-base text-theme-text-secondary mb-1">
              {Math.round(progress)}% done
            </div>
          )}

          {/* Hourglass Animation */}
          <div className="flex-1 flex items-center justify-center min-h-0 w-full max-w-xs">
            <HourglassAnimation
              progress={progress}
              particleType={particleType}
              timeRemainingPercent={timeRemainingPercent}
              isPaused={isPaused}
              isFlipping={isFlipping}
            />
          </div>

          {/* Playback Controls */}
          {(isRunning || isPaused) && (
            <div className="flex gap-2 mt-2 w-full max-w-md">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePause}
                disabled={isFlipping}
                className={`
                  flex-1 py-3 rounded-2xl font-bold text-lg transition-colors
                  flex items-center justify-center gap-1
                  disabled:opacity-50
                  ${isPaused
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-yellow-400 hover:bg-yellow-500 text-gray-800'
                  }
                `}
              >
                <span className="text-xl">{isPaused ? '▶️' : '⏸️'}</span>
                <span className="hidden sm:inline">{isPaused ? 'Go' : 'Pause'}</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                disabled={isFlipping}
                className="flex-1 bg-blue-500 text-white py-3 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <span className="text-xl">🔄</span>
                <span className="hidden sm:inline">Reset</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleStop}
                disabled={isFlipping}
                className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-bold text-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <span className="text-xl">⏹️</span>
                <span className="hidden sm:inline">Stop</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMuted(!isMuted)}
                className={`
                  w-14 py-3 rounded-2xl font-bold text-lg transition-colors
                  flex items-center justify-center
                  ${isMuted
                    ? 'bg-gray-400 hover:bg-gray-500 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }
                `}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                <span className="text-xl">{isMuted ? '🔇' : '🔊'}</span>
              </motion.button>
            </div>
          )}

          {/* Custom Time - Only show when not running */}
          {!isRunning && !isPaused && (
            <div className="mt-2 w-full max-w-sm">
              {!showCustomInput ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCustomInput(true)}
                  className="w-full bg-gray-600 text-white py-3 rounded-2xl font-bold text-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">⏱️</span> Custom
                </motion.button>
              ) : (
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="text-lg font-bold text-gray-700 mb-3">Enter time:</div>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={customMinutes}
                        onChange={(e) => handleCustomInputChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCustomTime()}
                        className="absolute inset-0 opacity-0 cursor-text"
                        autoFocus
                      />
                      <div className="px-4 py-4 rounded-xl border-2 border-gray-300 text-center text-3xl font-bold focus-within:border-theme-primary">
                        {(() => {
                          const padded = customMinutes.padStart(4, '0');
                          const mm = padded.slice(0, 2);
                          const ss = padded.slice(2, 4);
                          const n = customMinutes.length;
                          return (
                            <span>
                              <span className={n >= 4 ? 'text-gray-800' : 'text-gray-300'}>{mm[0]}</span>
                              <span className={n >= 3 ? 'text-gray-800' : 'text-gray-300'}>{mm[1]}</span>
                              <span className="text-gray-400">:</span>
                              <span className={n >= 2 ? 'text-gray-800' : 'text-gray-300'}>{ss[0]}</span>
                              <span className={n >= 1 ? 'text-gray-800' : 'text-gray-300'}>{ss[1]}</span>
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCustomTime}
                      className="bg-green-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:bg-green-600"
                    >
                      Start
                    </motion.button>
                  </div>
                  <button
                    onClick={() => setShowCustomInput(false)}
                    className="w-full mt-3 text-gray-500 py-2 font-semibold hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile: Presets as horizontal scrollable row at bottom */}
        {!isRunning && !isPaused && (
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 flex-shrink-0 snap-x snap-mandatory">
            {timerPresets.map(preset => (
              <motion.button
                key={preset.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePresetClick(preset)}
                className={`
                  ${preset.color} text-white px-4 py-3 rounded-2xl font-bold
                  transition-all flex-shrink-0 snap-start
                  flex items-center gap-2 min-w-[140px]
                `}
              >
                <span className="text-3xl">{preset.emoji}</span>
                <div className="text-left">
                  <div className="text-sm font-bold whitespace-nowrap">{preset.name}</div>
                  <div className="text-xs opacity-90">{formatTime(preset.seconds)}</div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Desktop: Right Column - Timer Presets (vertical) */}
        <div className="hidden lg:flex w-56 flex-col gap-2 bg-white bg-opacity-30 rounded-2xl p-2">
          {timerPresets.map(preset => (
            <motion.button
              key={preset.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePresetClick(preset)}
              disabled={isRunning}
              className={`
                ${preset.color} text-white px-4 py-4 rounded-2xl font-bold
                transition-all hover:brightness-110 flex-1
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-3
              `}
            >
              <span className="text-5xl">{preset.emoji}</span>
              <div className="text-left flex-1">
                <div className="text-xl font-bold">{preset.name}</div>
                <div className="text-lg opacity-90">{formatTime(preset.seconds)}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Completion Celebration */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissCompletion}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-md"
            >
              <motion.div
                className="text-8xl mb-4"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🎉
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-green-500 mb-2">Time's Up!</h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-6">Good job!</p>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl"
              >
                👆
              </motion.div>
              <p className="text-lg text-gray-400 mt-2">Tap anywhere to continue</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
