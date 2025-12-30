import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ParticleType } from '../timerConfig';
import { particleColors, timerColors } from '../timerConfig';

interface HourglassAnimationProps {
  progress: number; // 0-100
  particleType: ParticleType;
  timeRemainingPercent: number; // 0-100, used for urgency colors
  isPaused?: boolean;
  isFlipping?: boolean;
}

// Get the color scheme based on time remaining
function getUrgencyColors(timeRemainingPercent: number, particleType: ParticleType) {
  const baseColors = particleColors[particleType];

  if (timeRemainingPercent <= 10) {
    return timerColors.urgent;
  } else if (timeRemainingPercent <= 25) {
    return timerColors.warning;
  }
  return baseColors;
}

export const HourglassAnimation: React.FC<HourglassAnimationProps> = ({
  progress,
  particleType,
  timeRemainingPercent,
  isPaused = false,
  isFlipping = false
}) => {
  // Calculate sand levels (0-100 maps to visual heights)
  const topSandPercent = Math.max(0, 100 - progress);
  const bottomSandPercent = progress;
  const isFlowing = progress > 0 && progress < 100 && !isPaused;

  // Get colors based on urgency and particle type
  const colors = getUrgencyColors(timeRemainingPercent, particleType);

  // Generate unique IDs for this instance
  const instanceId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // Frame color changes with urgency
  const frameColor = timeRemainingPercent <= 10 ? '#8B0000' :
                     timeRemainingPercent <= 25 ? '#8B4513' : '#8B7355';

  // Top sand: starts at y=50, can go down to y=135 (85 units range)
  const topSandY = 50 + (100 - topSandPercent) * 0.85;

  // Bottom sand: fills from bottom (y=250) upward
  const bottomSandHeight = bottomSandPercent * 0.85;
  const bottomSandY = 250 - bottomSandHeight;

  return (
    <motion.div
      className="relative w-52 h-80 md:w-64 md:h-96 mx-auto"
      animate={{ rotate: isFlipping ? 180 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 300" className="w-full h-full">
        <defs>
          {/* Sand gradient */}
          <linearGradient id={`sand-${instanceId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="50%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.dark} />
          </linearGradient>

          {/* Top bulb clip path - wine glass shape */}
          <clipPath id={`topClip-${instanceId}`}>
            <path d="M 55 45 C 55 45, 55 80, 60 100 C 65 120, 85 140, 100 148 C 115 140, 135 120, 140 100 C 145 80, 145 45, 145 45 L 145 40 L 55 40 Z" />
          </clipPath>

          {/* Bottom bulb clip path - inverted wine glass shape */}
          <clipPath id={`bottomClip-${instanceId}`}>
            <path d="M 100 152 C 85 160, 65 180, 60 200 C 55 220, 55 255, 55 255 L 145 255 C 145 255, 145 220, 140 200 C 135 180, 115 160, 100 152 Z" />
          </clipPath>
        </defs>

        {/* Background glow */}
        <ellipse
          cx="100"
          cy="150"
          rx="65"
          ry="100"
          fill={colors.primary}
          opacity="0.12"
        />

        {/* Top sand */}
        <g clipPath={`url(#topClip-${instanceId})`}>
          <rect
            x="50"
            y={topSandY}
            width="100"
            height="110"
            fill={`url(#sand-${instanceId})`}
          />
          {/* Sand surface curve */}
          <ellipse
            cx="100"
            cy={topSandY}
            rx="35"
            ry="6"
            fill={colors.dark}
          />
        </g>

        {/* Bottom sand */}
        <g clipPath={`url(#bottomClip-${instanceId})`}>
          <rect
            x="50"
            y={bottomSandY}
            width="100"
            height={bottomSandHeight + 15}
            fill={`url(#sand-${instanceId})`}
          />
          {/* Sand pile top highlight */}
          {bottomSandPercent > 5 && (
            <ellipse
              cx="100"
              cy={bottomSandY}
              rx="30"
              ry="8"
              fill={colors.primary}
            />
          )}
        </g>

        {/* Falling particles through neck - from neck down to sand pile */}
        {isFlowing && particleType === 'sand' && (
          <>
            {/* Continuous stream through neck */}
            <rect x="97" y="148" width="6" height="10" fill={colors.secondary} rx="2" />
            {/* Falling sand grains */}
            <motion.circle cx="100" r="3" fill={colors.primary}
              animate={{ cy: [158, bottomSandY - 5] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeIn" }} />
            <motion.circle cx="99" r="2.5" fill={colors.secondary}
              animate={{ cy: [158, bottomSandY - 3] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: 0.2, ease: "easeIn" }} />
            <motion.circle cx="101" r="2.5" fill={colors.primary}
              animate={{ cy: [158, bottomSandY - 2] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: 0.4, ease: "easeIn" }} />
            <motion.circle cx="100" r="2" fill={colors.dark}
              animate={{ cy: [158, bottomSandY] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.6, ease: "easeIn" }} />
          </>
        )}
        {isFlowing && particleType === 'stars' && (
          <>
            <motion.g animate={{ y: [0, bottomSandY - 165] }} transition={{ duration: 0.9, repeat: Infinity, ease: "easeIn" }}>
              <text x="100" y="158" fontSize="12" textAnchor="middle" dominantBaseline="middle">⭐</text>
            </motion.g>
            <motion.g animate={{ y: [0, bottomSandY - 165] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.3, ease: "easeIn" }}>
              <text x="100" y="158" fontSize="10" textAnchor="middle" dominantBaseline="middle">⭐</text>
            </motion.g>
            <motion.g animate={{ y: [0, bottomSandY - 165] }} transition={{ duration: 1.0, repeat: Infinity, delay: 0.6, ease: "easeIn" }}>
              <text x="100" y="158" fontSize="8" textAnchor="middle" dominantBaseline="middle">⭐</text>
            </motion.g>
          </>
        )}
        {isFlowing && particleType === 'hearts' && (
          <>
            <motion.g animate={{ y: [0, bottomSandY - 165] }} transition={{ duration: 0.9, repeat: Infinity, ease: "easeIn" }}>
              <text x="100" y="158" fontSize="12" textAnchor="middle" dominantBaseline="middle">❤️</text>
            </motion.g>
            <motion.g animate={{ y: [0, bottomSandY - 165] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.3, ease: "easeIn" }}>
              <text x="100" y="158" fontSize="10" textAnchor="middle" dominantBaseline="middle">❤️</text>
            </motion.g>
            <motion.g animate={{ y: [0, bottomSandY - 165] }} transition={{ duration: 1.0, repeat: Infinity, delay: 0.6, ease: "easeIn" }}>
              <text x="100" y="158" fontSize="8" textAnchor="middle" dominantBaseline="middle">❤️</text>
            </motion.g>
          </>
        )}
        {isFlowing && particleType === 'snow' && (
          <>
            <motion.g animate={{ y: [0, bottomSandY - 165] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeIn" }}>
              <text x="100" y="158" fontSize="12" textAnchor="middle" dominantBaseline="middle">❄️</text>
            </motion.g>
            <motion.g animate={{ y: [0, bottomSandY - 165] }} transition={{ duration: 1.0, repeat: Infinity, delay: 0.3, ease: "easeIn" }}>
              <text x="100" y="158" fontSize="10" textAnchor="middle" dominantBaseline="middle">❄️</text>
            </motion.g>
            <motion.g animate={{ y: [0, bottomSandY - 165] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.6, ease: "easeIn" }}>
              <text x="100" y="158" fontSize="8" textAnchor="middle" dominantBaseline="middle">❄️</text>
            </motion.g>
          </>
        )}
        {isFlowing && particleType === 'bubbles' && (
          <>
            <motion.circle cx="100" r="4" fill={colors.primary} opacity={0.6} stroke="white" strokeWidth="1"
              animate={{ cy: [158, bottomSandY - 5] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeIn" }} />
            <motion.circle cx="99" r="3" fill={colors.secondary} opacity={0.6} stroke="white" strokeWidth="0.5"
              animate={{ cy: [158, bottomSandY - 3] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: 0.3, ease: "easeIn" }} />
            <motion.circle cx="101" r="3" fill={colors.primary} opacity={0.6} stroke="white" strokeWidth="0.5"
              animate={{ cy: [158, bottomSandY] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: 0.6, ease: "easeIn" }} />
          </>
        )}

        {/* Hourglass glass outline - top bulb */}
        <path
          d="M 55 45 C 55 45, 55 80, 60 100 C 65 120, 85 140, 100 150 C 115 140, 135 120, 140 100 C 145 80, 145 45, 145 45"
          fill="none"
          stroke={frameColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Hourglass glass outline - bottom bulb */}
        <path
          d="M 100 150 C 85 160, 65 180, 60 200 C 55 220, 55 255, 55 255"
          fill="none"
          stroke={frameColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 100 150 C 115 160, 135 180, 140 200 C 145 220, 145 255, 145 255"
          fill="none"
          stroke={frameColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Top curve connecting the bulb */}
        <path
          d="M 55 45 Q 100 38, 145 45"
          fill="none"
          stroke={frameColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Bottom curve connecting the bulb */}
        <path
          d="M 55 255 Q 100 262, 145 255"
          fill="none"
          stroke={frameColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Top cap */}
        <rect x="45" y="32" width="110" height="10" rx="3" fill={frameColor} />

        {/* Bottom cap */}
        <rect x="45" y="258" width="110" height="10" rx="3" fill={frameColor} />

        {/* Neck connector */}
        <rect x="94" y="147" width="12" height="6" rx="2" fill={frameColor} opacity="0.6" />

        {/* Glass shine effect */}
        <path
          d="M 65 55 Q 62 75, 67 95"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M 65 195 Q 62 215, 65 235"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>

      {/* Urgency pulse effect */}
      {timeRemainingPercent <= 10 && isFlowing && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colors.primary}30 0%, transparent 70%)`
          }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.03, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};
