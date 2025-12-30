import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should update value and persist to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });

  it('should return stored value if it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('should handle objects', () => {
    const initialValue = { name: 'test', count: 0 };
    const { result } = renderHook(() => useLocalStorage('test-obj', initialValue));

    expect(result.current[0]).toEqual(initialValue);

    act(() => {
      result.current[1]({ name: 'updated', count: 5 });
    });

    expect(result.current[0]).toEqual({ name: 'updated', count: 5 });
  });

  it('should handle arrays', () => {
    const initialValue = ['a', 'b', 'c'];
    const { result } = renderHook(() => useLocalStorage('test-array', initialValue));

    expect(result.current[0]).toEqual(initialValue);

    act(() => {
      result.current[1](['x', 'y', 'z']);
    });

    expect(result.current[0]).toEqual(['x', 'y', 'z']);
  });
});
