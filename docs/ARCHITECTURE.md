# Architecture

## Overview

SrishtiOS is a single-page application (SPA) built with React 19, TypeScript, Vite, and Tailwind CSS. It's designed as an offline-first, mobile-first app suite for toddlers.

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | React 19 | UI components and state management |
| Language | TypeScript | Type safety and better DX |
| Build | Vite | Fast dev server and optimized builds |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Animation | Framer Motion | Declarative animations |
| Hosting | Vercel | Automatic deployments from GitHub |

## Directory Structure

```
src/
├── App.tsx                 # Root component with routing
├── HomePage.tsx            # App launcher grid
├── apps/                   # Individual app modules
│   ├── daily-routine/      # Morning/evening routine tracker
│   ├── magic-timer/        # Visual countdown timer
│   ├── star-rewards/       # Star chart reward system
│   ├── food-friends/       # Food selection for meals
│   ├── bath-buddy/         # Bath toy selection
│   ├── learning-games/     # Colors, shapes, counting, animals
│   ├── creative/           # Drawing canvas
│   └── stories/            # Interactive story viewer
├── shared/
│   ├── components/         # Reusable UI components
│   │   ├── AppHeader.tsx
│   │   ├── BigButton.tsx
│   │   ├── CelebrationModal.tsx
│   │   ├── SelectableCard.tsx
│   │   └── ParentPanel/    # Settings panel (split into tabs)
│   ├── contexts/
│   │   ├── ThemeContext.tsx
│   │   └── NavigationContext.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useVoice.ts
│   │   ├── useGameRound.ts
│   │   └── usePrint.ts
│   ├── themes/
│   │   └── themes.ts
│   └── types/
│       └── index.ts
└── test/
    └── setup.ts
```

## Core Patterns

### Routing

Simple state-based routing without React Router:

```tsx
// App.tsx
const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');

<NavigationProvider onNavigate={setCurrentRoute}>
  {renderApp()}  // Switch statement on currentRoute
</NavigationProvider>
```

### Navigation Context

Centralized navigation via React Context:

```tsx
const { goHome, navigate } = useNavigation();
```

### State Management

| Scope | Solution | Example |
|-------|----------|---------|
| Global | React Context | Theme, Navigation |
| Persistent | useLocalStorage | User preferences, progress |
| Local | useState | UI state, form inputs |

### Theme System

CSS custom properties switched via `data-theme` attribute:

```css
[data-theme="ocean"] {
  --theme-bg: #e0f7fa;
  --theme-primary: #00bcd4;
  /* ... */
}
```

### Component Patterns

**AppHeader** - Consistent header with emoji, title, home button:
```tsx
<AppHeader title="Colors" emoji="🎨" />
```

**CelebrationModal** - Success feedback overlay:
```tsx
<CelebrationModal show={showCelebration} emoji="⭐" />
```

**SelectableCard** - Selectable item (food, toys):
```tsx
<SelectableCard emoji="🍎" name="Apple" isSelected={true} />
```

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useLocalStorage<T>` | Persistent state with JSON serialization |
| `useVoice` | Text-to-speech with preferred voice selection |
| `useGameRound<T>` | Game logic for learning games (target + options) |
| `usePrint` | Print functionality for selection lists |

## Data Flow

```
User Action
    ↓
Component State (useState)
    ↓
Side Effects (useEffect)
    ↓
Persistent Storage (useLocalStorage → localStorage)
```

## Testing

- **Framework**: Vitest + React Testing Library
- **Location**: `__tests__/` directories adjacent to source
- **Run**: `npm run test` (watch) or `npm run test:run` (CI)

## Deployment

- **Repository**: https://github.com/ssr09/SrishtiOS
- **Hosting**: Vercel (auto-deploy on push to main)
- **URL**: https://srishti-os.vercel.app
