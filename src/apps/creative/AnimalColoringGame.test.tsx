import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnimalColoringGame } from './AnimalColoringGame';
import { NavigationProvider } from '../../shared/contexts/NavigationContext';

const mockNavigate = vi.fn();

const renderColoringGame = () => {
  return render(
    <NavigationProvider onNavigate={mockNavigate}>
      <AnimalColoringGame />
    </NavigationProvider>
  );
};

describe('AnimalColoringGame', () => {
  beforeEach(() => {
    const MockAudio = vi.fn(function (this: HTMLAudioElement) {
      this.pause = vi.fn();
      this.play = vi.fn(() => Promise.resolve()) as HTMLAudioElement['play'];
      this.currentTime = 0;
    });

    vi.stubGlobal(
      'Audio',
      MockAudio
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('starts on the animal picker page before showing the canvas', () => {
    renderColoringGame();

    expect(screen.getByText('Color Animals')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rhino/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Lion/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Monkey/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cow & Calf/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bear & Cub/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bluey & Bingo/ })).toBeInTheDocument();
    expect(screen.queryByTestId('animal-coloring-canvas')).not.toBeInTheDocument();
  });

  it('opens a focused coloring page after choosing an animal', () => {
    renderColoringGame();

    fireEvent.click(screen.getByRole('button', { name: /Lion/ }));

    expect(screen.getByText('Color Lion')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose Animal' })).toBeInTheDocument();
    expect(screen.getByTestId('animal-coloring-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('animal-coloring-canvas').parentElement).toHaveClass('aspect-square');
  });

  it('groups palette colors into rows with three shades', () => {
    renderColoringGame();

    fireEvent.click(screen.getByRole('button', { name: /Rhino/ }));

    expect(screen.getByText('white')).toBeInTheDocument();
    expect(screen.getByText('black')).toBeInTheDocument();
    expect(screen.getByText('pink')).toBeInTheDocument();
    expect(screen.getByTestId('palette-color-#ffffff')).toBeInTheDocument();
    expect(screen.getByTestId('palette-color-#f3f4f6')).toBeInTheDocument();
    expect(screen.getByTestId('palette-color-#d1d5db')).toBeInTheDocument();
  });

  it('updates the canvas cursor to the selected color', () => {
    renderColoringGame();

    fireEvent.click(screen.getByRole('button', { name: /Rhino/ }));
    fireEvent.click(screen.getByTestId('palette-color-#ff0066'));

    const cursor = decodeURIComponent(screen.getByTestId('animal-coloring-canvas').style.cursor);
    expect(cursor).toContain('fill="#ff0066"');
    expect(cursor).toContain('fill-rule="evenodd"');
    expect(cursor).toContain('M13 16h6M16 13v6');
    expect(cursor).toContain('16 16, crosshair');
  });
});
