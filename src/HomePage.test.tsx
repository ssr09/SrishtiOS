import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomePage } from './HomePage';
import { NavigationProvider } from './shared/contexts/NavigationContext';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: React.PropsWithChildren<{ onClick?: () => void }>) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
    h1: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

const mockNavigate = vi.fn();

interface RenderOptions {
  archivedApps?: string[];
  appLastUsed?: Record<string, number>;
}

const renderHomePage = (options: RenderOptions = {}) => {
  const { archivedApps = [], appLastUsed = {} } = options;

  // Set localStorage directly before render
  localStorage.setItem('srishti-archived-apps', JSON.stringify(archivedApps));
  localStorage.setItem('srishti-app-last-used', JSON.stringify(appLastUsed));

  return render(
    <NavigationProvider onNavigate={mockNavigate}>
      <HomePage />
    </NavigationProvider>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render all apps when none are archived', () => {
    renderHomePage({});

    expect(screen.getByText('My Day')).toBeInTheDocument();
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('Stories')).toBeInTheDocument();
  });

  it('should hide archived apps from main grid', () => {
    renderHomePage({ archivedApps: ['colors', 'shapes'] });

    // These should be in main grid
    expect(screen.getByText('My Day')).toBeInTheDocument();
    expect(screen.getByText('Timer')).toBeInTheDocument();
  });

  it('should show "More Apps" section when apps are archived', () => {
    renderHomePage({ archivedApps: ['colors'] });

    expect(screen.getByText(/More Apps/)).toBeInTheDocument();
  });

  it('should not show "More Apps" section when no apps are archived', () => {
    renderHomePage({});

    expect(screen.queryByText(/More Apps/)).not.toBeInTheDocument();
  });

  it('should expand archived section when clicked', () => {
    renderHomePage({ archivedApps: ['colors'] });

    const moreAppsButton = screen.getByText(/More Apps/);
    fireEvent.click(moreAppsButton);

    // After expanding, Colors should be visible
    expect(screen.getByText('Colors')).toBeInTheDocument();
  });

  it('should sort archived apps by last used (most recent first)', () => {
    const now = Date.now();
    renderHomePage({
      archivedApps: ['colors', 'shapes', 'counting'],
      appLastUsed: {
        'colors': now - 3000,    // 3 seconds ago (oldest)
        'shapes': now - 1000,    // 1 second ago (most recent)
        'counting': now - 2000,  // 2 seconds ago
      },
    });

    // Expand the section
    const moreAppsButton = screen.getByText(/More Apps/);
    fireEvent.click(moreAppsButton);

    // Get all archived app buttons and check order
    // Shapes should be first (most recent), then Counting, then Colors
    const archivedSection = screen.getByTestId('archived-apps');
    const buttons = archivedSection.querySelectorAll('button');

    expect(buttons[0]).toHaveTextContent('Shapes');
    expect(buttons[1]).toHaveTextContent('Counting');
    expect(buttons[2]).toHaveTextContent('Colors');
  });
});
