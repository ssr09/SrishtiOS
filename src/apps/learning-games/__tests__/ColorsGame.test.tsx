import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ColorsGame } from '../ColorsGame';
import { NavigationProvider } from '../../../shared/contexts/NavigationContext';

// Mock useVoice hook
vi.mock('../../../shared/hooks/useVoice', () => ({
  useVoice: () => ({
    speak: vi.fn(),
    stop: vi.fn(),
    isSupported: true,
    voiceName: 'Samantha',
  }),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: React.PropsWithChildren<{ onClick?: () => void }>) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

const mockNavigate = vi.fn();

const renderWithNavigation = (component: React.ReactElement) => {
  return render(
    <NavigationProvider onNavigate={mockNavigate}>
      {component}
    </NavigationProvider>
  );
};

describe('ColorsGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the game with title and score', () => {
    renderWithNavigation(<ColorsGame />);

    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('Score:')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render 4 color options', () => {
    renderWithNavigation(<ColorsGame />);

    // Should have 4 color option buttons + 1 home button = 5 buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(5);
  });

  it('should display a prompt asking to find a color', () => {
    renderWithNavigation(<ColorsGame />);

    // Should show "Can you find [color]?" prompt
    expect(screen.getByText(/Can you find/)).toBeInTheDocument();
  });

  it('should start with score of 0', () => {
    renderWithNavigation(<ColorsGame />);

    // Verify the score starts at 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should have a home button', () => {
    renderWithNavigation(<ColorsGame />);

    // Home button now uses NavigationContext instead of <a href="/">
    expect(screen.getByText('🏠')).toBeInTheDocument();
  });

  it('should show star emoji with score', () => {
    renderWithNavigation(<ColorsGame />);

    expect(screen.getByText('⭐')).toBeInTheDocument();
  });
});
