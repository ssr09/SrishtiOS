import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ShapeOutlinesGame } from '../ShapeOutlinesGame';
import { NavigationProvider } from '../../../shared/contexts/NavigationContext';

const mockVoice = vi.hoisted(() => ({
  speak: vi.fn(),
  stop: vi.fn(),
}));

const mockChime = vi.hoisted(() => ({
  playChime: vi.fn(),
}));

vi.mock('../../../shared/hooks/useVoice', () => ({
  useVoice: () => ({
    speak: mockVoice.speak,
    stop: mockVoice.stop,
    isSupported: true,
    voiceName: 'Samantha',
  }),
}));

vi.mock('../../../shared/hooks/useSuccessChime', () => ({
  useSuccessChime: () => ({
    playChime: mockChime.playChime,
  }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
    button: ({ children, onClick, disabled, ...props }: React.PropsWithChildren<{ onClick?: () => void; disabled?: boolean }>) => (
      <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

const mockNavigate = vi.fn();

const renderWithNavigation = () => {
  return render(
    <NavigationProvider onNavigate={mockNavigate}>
      <ShapeOutlinesGame />
    </NavigationProvider>
  );
};

describe('ShapeOutlinesGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the outline matching activity', () => {
    renderWithNavigation();

    expect(screen.getByText('Shape Outlines')).toBeInTheDocument();
    expect(screen.getByText('Find this outline')).toBeInTheDocument();
    expect(screen.getByText('Score:')).toBeInTheDocument();
    const outlineOptions = screen
      .getAllByRole('button')
      .filter(button => button.getAttribute('aria-label')?.endsWith(' outline'));
    expect(outlineOptions).toHaveLength(4);
  });

  it('replays the spoken prompt from the reference card', () => {
    renderWithNavigation();

    fireEvent.click(screen.getByRole('button', { name: /Find this outline/i }));

    expect(mockVoice.stop).toHaveBeenCalled();
    expect(mockVoice.speak).toHaveBeenCalledWith(expect.stringMatching(/^Can you find the .+\?$/));
    expect(mockVoice.speak).not.toHaveBeenCalledWith(expect.stringContaining('outline'));
  });
});
