# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation Maintenance

**IMPORTANT**: Keep the `docs/` folder up to date as you work:

- **`docs/ARCHITECTURE.md`** - Update when adding new components, hooks, contexts, or changing the project structure
- **`docs/DECISIONS.md`** - Add entries when making significant technical decisions (new libraries, patterns, trade-offs)
- **`docs/GOALS.md`** - Update when completing features, adding new ideas, or changing project direction

When making changes, ask yourself:
1. Did I add a new pattern or component? → Update ARCHITECTURE.md
2. Did I make a decision with trade-offs? → Add to DECISIONS.md
3. Did I complete a goal or have a new idea? → Update GOALS.md

## Responsive Design Requirements

**IMPORTANT**: All layouts must work across mobile, tablet, and laptop screens.

Before implementing any UI:
1. Consider how it will look on phone (375px), tablet (768px), and desktop (1024px+)
2. If the layout requires different approaches per screen size, ask the user for preferences
3. If there are trade-offs (e.g., hiding elements on mobile, simplifying interactions), present options to the user

Common patterns:
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Mobile-first: start with mobile layout, enhance for larger screens
- Test with browser dev tools responsive mode before committing

## Test-First Development

**IMPORTANT**: For any significant feature requests, follow this workflow:

1. **Clarify first** - If there's any ambiguity about requirements, ask the user before writing code
2. **Write tests first** - Create tests that define the expected behavior
3. **Implement after** - Write the implementation to make tests pass
4. **Verify** - Run `npm run build && npm run test:run` to confirm everything works

This ensures:
- Requirements are understood before coding
- Expected behavior is documented in tests
- Regressions are caught early
- Code is testable by design

Tests go in `__tests__/` directories adjacent to the code they test:
- `src/shared/components/__tests__/`
- `src/shared/hooks/__tests__/`
- `src/apps/[app-name]/__tests__/`

## Project Overview

SrishtiOS is an interactive web application suite designed for toddlers (2.5 years old). It consists of 11 interconnected apps built with React 19, TypeScript, Vite, and Tailwind CSS. The project prioritizes toddler-friendly UX with large touch targets, colorful themes, and immediate visual feedback.

## Commands

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # TypeScript build + Vite production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
npm run test      # Run Vitest in watch mode
npm run test:run  # Run Vitest once (for CI)
```

## Architecture

### Routing Pattern
Simple state-based routing in `App.tsx` using a `currentRoute` state variable. No React Router - navigation is handled via `NavigationContext`. Apps use the `useNavigation()` hook to access `navigate()` and `goHome()` functions. URL hashes (`#timer`, `#colors`) support browser back/forward buttons and deep linking.

### State Management
- **Global**: React Contexts for Theme, Navigation, and Family (cloud sync)
- **Persistent (local only)**: `useLocalStorage` hook for device-specific data
- **Persistent (cloud-synced)**: `useSyncedStorage` hook for cross-device data (foods, toys, timers, archived apps)
- **Local**: Component state for UI interactions

### Cloud Sync (Optional)
Firebase Firestore enables cross-device sync via 6-character family codes. When enabled, `useSyncedStorage` writes to both localStorage and Firestore. Key files:
- `src/shared/firebase/config.ts` - Firebase initialization
- `src/shared/contexts/FamilyContext.tsx` - Family code management
- `src/shared/hooks/useSyncedStorage.ts` - Synced storage hook

### Theme System
Five themes defined in `src/shared/themes/themes.ts`. Themes are applied via CSS custom properties (defined in `index.css`) and switched using `data-theme` attribute on document element. Variables include `--theme-bg`, `--theme-primary`, `--theme-secondary`, `--theme-accent`, `--theme-text`.

### App Structure Pattern
Each app in `src/apps/` follows this pattern:
- Main component file (e.g., `MagicTimer.tsx`)
- Config file with defaults (e.g., `timerConfig.ts`)
- Database file for static data (e.g., `foodDatabase.ts`)
- Sub-components as needed

### Shared Components
- `BigButton`: Large touch-friendly button with emoji support and size variants (small, medium, large, xlarge)
- `AppHeader`: Header with title, emoji, and home button using NavigationContext
- `CelebrationModal`: Full-screen celebration overlay for positive feedback
- `SelectableCard`: Card with selection state and voice feedback (speaks name on tap)
- `ParentPanel`: Settings modal with 6 tabs (Apps, Themes, Foods, Bath Toys, Timers, Data) - accessed via 1.5s long-press on settings icon

### Shared Hooks
- `useLocalStorage<T>`: Persistent state in localStorage (device-only)
- `useSyncedStorage<T>`: Persistent state synced to localStorage + Firebase
- `useVoice`: Text-to-speech wrapper (Web Speech API, prefers "Samantha" voice)
- `useGameRound<T>`: Game logic for learning games (generates target + shuffled options)
- `usePrint`: Opens print preview for selection lists (used by Food/Bath apps)

### Key Design Constraints
- Minimum button size: 140px (large) to 180px (xlarge)
- All interactions must have immediate visual feedback (Framer Motion animations)
- No failure states - all actions result in positive confirmations
- Offline-first: no external API calls, all data in localStorage
- Target audience is non-literate - rely on emojis, colors, and animations
- **Mobile/tablet first**: App must work seamlessly on touch devices
  - No pinch-to-zoom (disabled via viewport meta)
  - No pull-to-refresh or overscroll bounce
  - No text selection or long-press context menus
  - Use `touch-action: manipulation` for faster taps
  - Support safe-area insets for notched devices
  - Use dynamic viewport height (`100dvh`) for mobile browsers

## File Organization

```
src/
├── App.tsx                    # Main router/state holder
├── HomePage.tsx               # App launcher grid
├── HomePage.test.tsx          # Homepage tests
├── shared/                    # Reusable logic
│   ├── components/            # BigButton, AppHeader, CelebrationModal, SelectableCard
│   │   └── ParentPanel/       # Settings modal split into 6 tab components
│   ├── contexts/              # ThemeContext, NavigationContext, FamilyContext
│   ├── hooks/                 # useLocalStorage, useSyncedStorage, useVoice, useGameRound, usePrint
│   ├── firebase/              # Firebase config and Firestore setup
│   ├── themes/                # Theme definitions (5 themes)
│   └── types/                 # TypeScript interfaces
├── apps/                      # Individual app modules
│   ├── daily-routine/         # Morning/afternoon/evening routines
│   ├── magic-timer/           # Visual countdown with hourglass animation
│   ├── star-rewards/          # Star collection and milestones
│   ├── food-friends/          # Food selection by meal time
│   ├── bath-buddy/            # Bath toy selection by category
│   ├── learning-games/        # Colors, Shapes, Counting, Animal Sounds games
│   ├── creative/              # Drawing canvas with music
│   └── stories/               # Interactive story reader
└── test/
    └── setup.ts               # Vitest setup with mocks
```

## Adding a New App

1. Create folder in `src/apps/` with main component and config files
2. Add route case in `App.tsx` switch statement
3. Add app entry to `appsList` array in `HomePage.tsx` with id, name, emoji, color, route
4. Follow existing patterns:
   - Use `AppHeader` for consistent header with home button
   - Use `BigButton` for large touch-friendly buttons
   - Use `useSyncedStorage` for data that should sync across devices
   - Use `useLocalStorage` for device-specific preferences
   - Use Framer Motion for animations
   - Use `CelebrationModal` for positive feedback
