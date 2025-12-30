import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { SelectableCard } from '../SelectableCard';

// Mock useVoice hook
const mockSpeak = vi.fn();
vi.mock('../../hooks/useVoice', () => ({
  useVoice: () => ({
    speak: mockSpeak,
    stop: vi.fn(),
    isSupported: true,
    voiceName: 'Samantha',
  }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: React.PropsWithChildren<{ onClick?: () => void }>) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
  },
}));

describe('SelectableCard', () => {
  beforeEach(() => {
    mockSpeak.mockClear();
  });

  it('should render name and emoji', () => {
    render(<SelectableCard emoji="🍎" name="Apple" />);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('🍎')).toBeInTheDocument();
  });

  it('should call speak with name when clicked', () => {
    render(<SelectableCard emoji="🍎" name="Apple" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSpeak).toHaveBeenCalledWith('Apple');
  });

  it('should call onClick callback when clicked', () => {
    const handleClick = vi.fn();
    render(<SelectableCard emoji="🍎" name="Apple" onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });

  it('should show checkmark when selected', () => {
    render(<SelectableCard emoji="🍎" name="Apple" isSelected={true} />);

    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should not show checkmark when not selected', () => {
    render(<SelectableCard emoji="🍎" name="Apple" isSelected={false} />);

    expect(screen.queryByText('✓')).not.toBeInTheDocument();
  });

  it('should apply custom selected color', () => {
    render(<SelectableCard emoji="🛁" name="Duck" isSelected={true} selectedColor="bg-cyan-400" />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-cyan-400');
  });

  it('should use default green color when selected without custom color', () => {
    render(<SelectableCard emoji="🍎" name="Apple" isSelected={true} />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-green-400');
  });
});
