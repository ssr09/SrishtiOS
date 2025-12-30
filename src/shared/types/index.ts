export type ThemeName = 'sunshine' | 'ocean' | 'garden' | 'rainbow' | 'twilight';

export interface Theme {
  name: ThemeName;
  displayName: string;
  emoji: string;
  colors: {
    bg: string;
    bgSecondary: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
  };
}

export interface AppRoute {
  path: string;
  name: string;
  emoji: string;
  color: string;
}
