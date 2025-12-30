import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock Firebase
vi.mock('../../firebase/config', () => ({
  db: {},
}));

// Mock Firestore functions
const mockOnSnapshot = vi.fn();
const mockSetDoc = vi.fn();
const mockDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
}));

// Mock FamilyContext
const mockFamilyCode = 'ABC123';
const mockUpdateFamilyData = vi.fn();
let mockFamilyData: Record<string, unknown> = {};

vi.mock('../../contexts/FamilyContext', () => ({
  useFamily: () => ({
    familyCode: mockFamilyCode,
    familyData: mockFamilyData,
    updateFamilyData: mockUpdateFamilyData,
    isConnected: true,
  }),
}));

// Import after mocks
import { useSyncedStorage } from '../useSyncedStorage';

describe('useSyncedStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockFamilyData = {};
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return default value when no stored value exists', () => {
    const { result } = renderHook(() => useSyncedStorage('testKey', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('should return cloud value when family data has the key', () => {
    mockFamilyData = { testKey: 'cloudValue' };

    const { result } = renderHook(() => useSyncedStorage('testKey', 'default'));

    expect(result.current[0]).toBe('cloudValue');
  });

  it('should fall back to localStorage when cloud value is undefined', () => {
    localStorage.setItem('srishti-testKey', JSON.stringify('localValue'));
    mockFamilyData = {};

    const { result } = renderHook(() => useSyncedStorage('testKey', 'default'));

    expect(result.current[0]).toBe('localValue');
  });

  it('should update both cloud and local storage on setValue', async () => {
    const { result } = renderHook(() => useSyncedStorage('testKey', 'default'));

    await act(async () => {
      result.current[1]('newValue');
    });

    // Check localStorage was updated
    expect(localStorage.getItem('srishti-testKey')).toBe(JSON.stringify('newValue'));

    // Check cloud update was called
    expect(mockUpdateFamilyData).toHaveBeenCalledWith('testKey', 'newValue');
  });

  it('should handle complex objects', async () => {
    const complexObject = { items: ['a', 'b'], count: 5 };
    mockFamilyData = { testKey: complexObject };

    const { result } = renderHook(() =>
      useSyncedStorage('testKey', { items: [], count: 0 })
    );

    expect(result.current[0]).toEqual(complexObject);
  });

  it('should handle arrays', async () => {
    const arrayValue = ['item1', 'item2', 'item3'];
    mockFamilyData = { testKey: arrayValue };

    const { result } = renderHook(() => useSyncedStorage<string[]>('testKey', []));

    expect(result.current[0]).toEqual(arrayValue);
  });

  it('should update state when cloud data changes', async () => {
    const { result, rerender } = renderHook(() =>
      useSyncedStorage('testKey', 'default')
    );

    expect(result.current[0]).toBe('default');

    // Simulate cloud data change
    mockFamilyData = { testKey: 'updatedFromCloud' };
    rerender();

    expect(result.current[0]).toBe('updatedFromCloud');
  });

  it('should use localStorage prefix correctly', () => {
    localStorage.setItem('srishti-customKey', JSON.stringify('prefixedValue'));

    const { result } = renderHook(() => useSyncedStorage('customKey', 'default'));

    // Should find the value with the prefix
    expect(result.current[0]).toBe('prefixedValue');
  });
});

describe('useSyncedStorage without family connection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should work like useLocalStorage when not connected', async () => {
    // Override the mock for this test
    vi.doMock('../../contexts/FamilyContext', () => ({
      useFamily: () => ({
        familyCode: null,
        familyData: {},
        updateFamilyData: vi.fn(),
        isConnected: false,
      }),
    }));

    localStorage.setItem('srishti-testKey', JSON.stringify('localOnly'));

    const { result } = renderHook(() => useSyncedStorage('testKey', 'default'));

    // When not connected, should still read from localStorage via family data fallback
    // Since familyData is empty, it falls back to localStorage
    expect(result.current[0]).toBe('localOnly');
  });
});
