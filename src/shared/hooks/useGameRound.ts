import { useState, useCallback } from 'react';

interface UseGameRoundOptions<T> {
  items: T[];
  optionCount?: number;
  getKey: (item: T) => string;
}

interface UseGameRoundReturn<T> {
  target: T;
  options: T[];
  round: number;
  generateRound: () => void;
}

export function useGameRound<T>({
  items,
  optionCount = 4,
  getKey,
}: UseGameRoundOptions<T>): UseGameRoundReturn<T> {
  const [target, setTarget] = useState<T>(items[0]);
  const [options, setOptions] = useState<T[]>([]);
  const [round, setRound] = useState(0);

  const generateRound = useCallback(() => {
    // Pick a random target, avoiding the current one
    const availableItems = items.filter(item => getKey(item) !== getKey(target));
    const newTarget = availableItems[Math.floor(Math.random() * availableItems.length)];
    setTarget(newTarget);

    // Create options: target + (optionCount-1) random others
    const otherItems = items.filter(item => getKey(item) !== getKey(newTarget));
    const shuffled = [...otherItems].sort(() => Math.random() - 0.5);
    const selectedOptions = [newTarget, ...shuffled.slice(0, optionCount - 1)];

    // Shuffle again so target isn't always first
    setOptions(selectedOptions.sort(() => Math.random() - 0.5));

    // Increment round to trigger any side effects
    setRound(r => r + 1);
  }, [items, optionCount, getKey, target]);

  return { target, options, round, generateRound };
}
