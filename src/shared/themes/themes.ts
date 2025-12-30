import type { Theme, ThemeName } from '../types';

export const themes: Record<ThemeName, Theme> = {
  sunshine: {
    name: 'sunshine',
    displayName: 'Sunshine',
    emoji: '☀️',
    colors: {
      bg: '#FFF9E6',
      bgSecondary: '#FFF4D4',
      primary: '#FFB84D',
      secondary: '#FF9F40',
      accent: '#FF6B35',
      text: '#2D2D2D',
      textSecondary: '#5A5A5A',
    },
  },
  ocean: {
    name: 'ocean',
    displayName: 'Ocean',
    emoji: '🌊',
    colors: {
      bg: '#E6F7FF',
      bgSecondary: '#CCF0FF',
      primary: '#4DB8FF',
      secondary: '#33A3E6',
      accent: '#0088CC',
      text: '#1A4D66',
      textSecondary: '#336B85',
    },
  },
  garden: {
    name: 'garden',
    displayName: 'Garden',
    emoji: '🌻',
    colors: {
      bg: '#F0FFE6',
      bgSecondary: '#E0FFCC',
      primary: '#7ACC52',
      secondary: '#5BB33D',
      accent: '#9C4DCC',
      text: '#2D4D1A',
      textSecondary: '#4D7033',
    },
  },
  rainbow: {
    name: 'rainbow',
    displayName: 'Rainbow',
    emoji: '🌈',
    colors: {
      bg: '#FFF5FF',
      bgSecondary: '#FFE6FF',
      primary: '#FF6B9D',
      secondary: '#FFB347',
      accent: '#A78BFA',
      text: '#4D1A3D',
      textSecondary: '#70527A',
    },
  },
  twilight: {
    name: 'twilight',
    displayName: 'Twilight',
    emoji: '🌙',
    colors: {
      bg: '#F5E6FF',
      bgSecondary: '#EBCCFF',
      primary: '#B88BFF',
      secondary: '#D6A3FF',
      accent: '#FF8BC3',
      text: '#3D1A52',
      textSecondary: '#5C3D70',
    },
  },
};

export const defaultTheme: ThemeName = 'sunshine';
