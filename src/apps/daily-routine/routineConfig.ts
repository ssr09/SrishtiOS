export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface RoutineStep {
  id: string;
  emoji: string;
  title: string;
  description?: string;
}

export const routineSteps: Record<TimeOfDay, RoutineStep[]> = {
  morning: [
    { id: 'brush-am', emoji: '🪥', title: 'Brush', description: 'Clean teeth!' },
    { id: 'potty-am', emoji: '🚽', title: 'Potty', description: 'Good job!' },
    { id: 'playtime-am', emoji: '🎨', title: 'Playtime', description: 'Have fun!' },
    { id: 'bath-am', emoji: '🛁', title: 'Bath', description: 'Splash splash!' },
    { id: 'get-ready', emoji: '👗', title: 'Get Ready', description: 'Looking good!' },
    { id: 'breakfast', emoji: '🥞', title: 'Breakfast', description: 'Yummy!' },
    { id: 'school', emoji: '🏫', title: 'Off to School', description: 'Bye bye!' },
  ],
  afternoon: [
    { id: 'dress-change', emoji: '👚', title: 'Dress Change', description: 'Fresh clothes!' },
    { id: 'lunch', emoji: '🍱', title: 'Lunch', description: 'Time to eat!' },
    { id: 'naptime', emoji: '😴', title: 'Naptime', description: 'Rest time!' },
    { id: 'arya-walk', emoji: '🐕', title: 'Arya Walk', description: 'Woof woof!' },
    { id: 'snacks', emoji: '🍎', title: 'Snacks', description: 'Healthy treats!' },
    { id: 'play', emoji: '🎮', title: 'Off to Play', description: 'Fun time!' },
  ],
  evening: [
    { id: 'bath-pm', emoji: '🛁', title: 'Bath', description: 'Splash splash!' },
    { id: 'dinner', emoji: '🍽️', title: 'Dinner', description: 'Family time!' },
    { id: 'get-ready-bed', emoji: '👚', title: 'Get Ready', description: 'Cozy time!' },
    { id: 'brush-pm', emoji: '🪥', title: 'Brush', description: 'Clean and fresh!' },
    { id: 'reading', emoji: '📖', title: 'Reading', description: 'Story time!' },
    { id: 'bed', emoji: '🛏️', title: 'Off to Bed', description: 'Sweet dreams!' },
  ],
};

export const timeOfDayInfo: Record<TimeOfDay, { emoji: string; label: string; color: string }> = {
  morning: { emoji: '🌅', label: 'Morning', color: 'bg-yellow-400' },
  afternoon: { emoji: '☀️', label: 'Afternoon', color: 'bg-orange-400' },
  evening: { emoji: '🌆', label: 'Evening', color: 'bg-purple-400' },
};

export function getCurrentTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  return 'evening';
}
