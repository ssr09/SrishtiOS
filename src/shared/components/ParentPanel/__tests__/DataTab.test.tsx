import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataTab } from '../DataTab';

// Mock useLocalStorage
vi.mock('../../../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn((_key: string, defaultValue: unknown) => {
    return [defaultValue, vi.fn()];
  }),
}));

// Mock useFamily hook
const mockSetFamilyCode = vi.fn();
const mockGenerateNewCode = vi.fn();
const mockDisconnect = vi.fn();

let mockFamilyState = {
  familyCode: null as string | null,
  isConnected: false,
  isLoading: false,
};

vi.mock('../../../contexts/FamilyContext', () => ({
  useFamily: () => ({
    ...mockFamilyState,
    setFamilyCode: mockSetFamilyCode,
    generateNewCode: mockGenerateNewCode,
    disconnect: mockDisconnect,
  }),
}));

describe('DataTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFamilyState = {
      familyCode: null,
      isConnected: false,
      isLoading: false,
    };
  });

  it('should render data management section', () => {
    render(<DataTab />);

    expect(screen.getByText('Data Management')).toBeInTheDocument();
  });

  it('should show sync setup when not connected', () => {
    render(<DataTab />);

    expect(screen.getByText('Cloud Sync')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enable Sync/i })).toBeInTheDocument();
  });

  it('should show family code when connected', () => {
    mockFamilyState = {
      familyCode: 'ABC123',
      isConnected: true,
      isLoading: false,
    };

    render(<DataTab />);

    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText(/Synced/i)).toBeInTheDocument();
  });

  it('should have button to generate new family code', () => {
    render(<DataTab />);

    const enableButton = screen.getByRole('button', { name: /Enable Sync/i });
    expect(enableButton).toBeInTheDocument();
  });

  it('should call generateNewCode when enable sync is clicked', async () => {
    mockGenerateNewCode.mockResolvedValue('XYZ789');

    render(<DataTab />);

    const enableButton = screen.getByRole('button', { name: /Enable Sync/i });
    fireEvent.click(enableButton);

    await waitFor(() => {
      expect(mockGenerateNewCode).toHaveBeenCalled();
    });
  });

  it('should show connect option with input field', () => {
    render(<DataTab />);

    // Should have an option to connect to existing family
    expect(screen.getByText(/Have a family code/i)).toBeInTheDocument();
  });

  it('should show disconnect button when connected', () => {
    mockFamilyState = {
      familyCode: 'ABC123',
      isConnected: true,
      isLoading: false,
    };

    render(<DataTab />);

    expect(screen.getByRole('button', { name: /Disconnect/i })).toBeInTheDocument();
  });

  it('should call disconnect when disconnect button is clicked', async () => {
    // Mock confirm to return true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    mockFamilyState = {
      familyCode: 'ABC123',
      isConnected: true,
      isLoading: false,
    };

    render(<DataTab />);

    const disconnectButton = screen.getByRole('button', { name: /Disconnect/i });
    fireEvent.click(disconnectButton);

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should show loading state', () => {
    mockFamilyState = {
      familyCode: 'ABC123',
      isConnected: false,
      isLoading: true,
    };

    render(<DataTab />);

    expect(screen.getByText(/Connecting/i)).toBeInTheDocument();
  });

  it('should still show reset buttons', () => {
    render(<DataTab />);

    expect(screen.getByRole('button', { name: /Reset All Content/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear ALL Data/i })).toBeInTheDocument();
  });
});
