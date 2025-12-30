export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'bedtime';

export interface RoutineStep {
  id: string;
  emoji: string;
  title: string;
  description?: string;
}

export const routineSteps: Record<TimeOfDay, RoutineStep[]> = {
  morning: [
    { id: 'wake-up', emoji: '🌅', title: 'Wake Up', description: 'Good morning!' },
    { id: 'brush-teeth', emoji: '🪥', title: 'Brush Teeth', description: 'Make them sparkle!' },
    { id: 'get-dressed', emoji: '👗', title: 'Get Dressed', description: 'Pick fun clothes!' },
    { id: 'breakfast', emoji: '🥞', title: 'Breakfast', description: 'Yummy food!' },
  ],
  afternoon: [
    { id: 'lunch', emoji: '🍱', title: 'Lunch', description: 'Time to eat!' },
    { id: 'play', emoji: '🎨', title: 'Play Time', description: 'Have fun!' },
    { id: 'snack', emoji: '🍎', title: 'Snack', description: 'Healthy treats!' },
  ],
  evening: [
    { id: 'dinner', emoji: '🍽️', title: 'Dinner', description: 'Family time!' },
    { id: 'play-evening', emoji: '🧸', title: 'Play', description: 'Quiet time!' },
    { id: 'tidy-up', emoji: '🧹', title: 'Tidy Up', description: 'Put toys away!' },
  ],
  bedtime: [
    { id: 'bath', emoji: '🛁', title: 'Bath Time', description: 'Splash splash!' },
    { id: 'brush-teeth-night', emoji: '🪥', title: 'Brush Teeth', description: 'Clean and fresh!' },
    { id: 'pajamas', emoji: '👚', title: 'Pajamas', description: 'Cozy time!' },
    { id: 'story', emoji: '📖', title: 'Story Time', description: 'Read together!' },
    { id: 'sleep', emoji: '😴', title: 'Sleep', description: 'Sweet dreams!' },
  ],
};

export const timeOfDayInfo: Record<TimeOfDay, { emoji: string; label: string; color: string }> = {
  morning: { emoji: '🌅', label: 'Morning', color: 'bg-yellow-400' },
  afternoon: { emoji: '☀️', label: 'Afternoon', color: 'bg-orange-400' },
  evening: { emoji: '🌆', label: 'Evening', color: 'bg-purple-400' },
  bedtime: { emoji: '🌙', label: 'Bedtime', color: 'bg-indigo-500' },
};

export function getCurrentTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'bedtime';
}
