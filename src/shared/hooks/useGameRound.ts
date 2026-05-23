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
  const createRound = useCallback((currentTarget?: T) => {
    const availableItems = currentTarget
      ? items.filter(item => getKey(item) !== getKey(currentTarget))
      : items;
    const newTarget = availableItems[Math.floor(Math.random() * availableItems.length)];

    const otherItems = items.filter(item => getKey(item) !== getKey(newTarget));
    const shuffled = [...otherItems].sort(() => Math.random() - 0.5);
    const selectedOptions = [newTarget, ...shuffled.slice(0, optionCount - 1)];

    return {
      target: newTarget,
      options: selectedOptions.sort(() => Math.random() - 0.5),
    };
  }, [items, optionCount, getKey]);

  const [gameRound, setGameRound] = useState(() => ({
    ...createRound(),
    round: 1,
  }));

  const generateRound = useCallback(() => {
    setGameRound(currentRound => ({
      ...createRound(currentRound.target),
      round: currentRound.round + 1,
    }));
  }, [createRound]);

  return {
    target: gameRound.target,
    options: gameRound.options,
    round: gameRound.round,
    generateRound,
  };
}
