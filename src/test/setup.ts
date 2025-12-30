import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock speechSynthesis API
const mockSpeak = vi.fn();
const mockCancel = vi.fn();

Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: mockSpeak,
    cancel: mockCancel,
    getVoices: () => [],
    onvoiceschanged: null,
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// Reset mocks before each test
beforeEach(() => {
  mockSpeak.mockClear();
  mockCancel.mockClear();
  localStorageMock.clear();
});

// Export mocks for test assertions
export { mockSpeak, mockCancel };
