import { useState, useEffect, useCallback } from 'react';
import { useFamily } from '../contexts/FamilyContext';

/**
 * A hook that syncs state to both localStorage and Firebase Firestore.
 *
 * When connected to a family:
 * - Reads from cloud data (with localStorage fallback)
 * - Writes to both cloud and localStorage
 * - Real-time updates from other devices via FamilyContext
 *
 * When not connected:
 * - Works exactly like useLocalStorage
 *
 * @param key - The key to store the value under (without prefix)
 * @param defaultValue - The default value if none exists
 */
export function useSyncedStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const { familyCode, familyData, updateFamilyData, isConnected } = useFamily();

  // localStorage key with prefix
  const localKey = `srishti-${key}`;

  // Get initial value: cloud > localStorage > default
  const getInitialValue = (): T => {
    // First check cloud data
    if (familyData && key in familyData) {
      return familyData[key as keyof typeof familyData] as T;
    }

    // Fall back to localStorage
    try {
      const item = localStorage.getItem(localKey);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${localKey}":`, error);
    }

    return defaultValue;
  };

  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  // Update local state when cloud data changes
  useEffect(() => {
    if (familyData && key in familyData) {
      const cloudValue = familyData[key as keyof typeof familyData] as T;
      setStoredValue(cloudValue);
    }
  }, [familyData, key]);

  // Set value - updates both localStorage and cloud
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Handle function updates
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Update local state
        setStoredValue(valueToStore);

        // Update localStorage (always, for offline support)
        localStorage.setItem(localKey, JSON.stringify(valueToStore));

        // Update cloud (if connected)
        if (familyCode && isConnected) {
          updateFamilyData(key as keyof typeof familyData, valueToStore);
        }
      } catch (error) {
        console.error(`Error setting synced storage key "${key}":`, error);
      }
    },
    [storedValue, localKey, familyCode, isConnected, updateFamilyData, key]
  );

  return [storedValue, setValue];
}
