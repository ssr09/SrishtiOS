import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NavigationProvider } from '../../shared/contexts/NavigationContext';
import { CreativeCanvas } from './CreativeCanvas';

const mockNavigate = vi.fn();
const mockContext = {
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  fillRect: vi.fn(),
  fillStyle: '',
};

describe('CreativeCanvas', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockContext as unknown as CanvasRenderingContext2D
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('maps pointer coordinates into the resized canvas drawing buffer', () => {
    const { container } = render(
      <NavigationProvider onNavigate={mockNavigate}>
        <CreativeCanvas />
      </NavigationProvider>
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();

    Object.defineProperties(canvas!, {
      clientWidth: { configurable: true, value: 984 },
      clientHeight: { configurable: true, value: 738 },
      clientLeft: { configurable: true, value: 4 },
      clientTop: { configurable: true, value: 4 },
    });
    vi.spyOn(canvas!, 'getBoundingClientRect').mockReturnValue({
      x: 144,
      y: 429,
      left: 144,
      top: 429,
      right: 1136,
      bottom: 1175,
      width: 992,
      height: 746,
      toJSON: () => ({}),
    });

    fireEvent.mouseDown(canvas!, { clientX: 640, clientY: 802 });

    expect(mockContext.arc).toHaveBeenCalledWith(400, 300, 10, 0, Math.PI * 2);
  });
});
