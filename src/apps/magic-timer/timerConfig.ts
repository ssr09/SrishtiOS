export type ParticleType = 'sand' | 'stars' | 'hearts' | 'snow' | 'bubbles';

export interface TimerPreset {
  id: string;
  name: string;
  emoji: string;
  seconds: number;
  color: string;
}

export const timerPresets: TimerPreset[] = [
  { id: 'quick-task', name: 'Quick Task', emoji: '⚡', seconds: 60, color: 'bg-yellow-500' },
  { id: 'brush-teeth', name: 'Brush Teeth', emoji: '🪥', seconds: 120, color: 'bg-blue-400' },
  { id: 'snack-wait', name: 'Wait for Snack', emoji: '🍎', seconds: 300, color: 'bg-red-400' },
  { id: 'quiet-time', name: 'Quiet Time', emoji: '📚', seconds: 900, color: 'bg-purple-400' },
];

export const particleTypes: { id: ParticleType; emoji: string; label: string }[] = [
  { id: 'sand', emoji: '🏖️', label: 'Sand' },
  { id: 'stars', emoji: '⭐', label: 'Stars' },
  { id: 'hearts', emoji: '❤️', label: 'Hearts' },
  { id: 'snow', emoji: '❄️', label: 'Snow' },
  { id: 'bubbles', emoji: '🫧', label: 'Bubbles' },
];

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Color schemes based on time remaining
export const timerColors = {
  normal: {
    primary: '#FFD700',
    secondary: '#FFB84D',
    dark: '#E6A030',
  },
  warning: { // 25% remaining
    primary: '#FF8C00',
    secondary: '#FF6B00',
    dark: '#CC5500',
  },
  urgent: { // 10% remaining
    primary: '#FF4444',
    secondary: '#FF2222',
    dark: '#CC0000',
  },
};

// Particle color schemes
export const particleColors: Record<ParticleType, { primary: string; secondary: string; dark: string }> = {
  sand: { primary: '#FFD700', secondary: '#FFB84D', dark: '#E6A030' },
  stars: { primary: '#FFE135', secondary: '#FFD700', dark: '#FFC000' },
  hearts: { primary: '#FF6B9D', secondary: '#FF4081', dark: '#E91E63' },
  snow: { primary: '#E0F7FF', secondary: '#B3E5FC', dark: '#81D4FA' },
  bubbles: { primary: '#64B5F6', secondary: '#42A5F5', dark: '#2196F3' },
};
