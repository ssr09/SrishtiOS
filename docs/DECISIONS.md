# Key Decisions

This document records significant technical decisions made during development.

---

## 2024-12 Initial Architecture

### Decision: State-based routing instead of React Router

**Context**: Need navigation between 11 apps.

**Decision**: Use simple `useState` + switch statement in App.tsx.

**Rationale**:
- App is simple enough that React Router adds unnecessary complexity
- No need for URL-based routing (toddlers don't use URLs)
- Easier to reason about navigation flow
- Smaller bundle size

**Trade-offs**:
- No browser back button support (acceptable for this use case)
- No deep linking (not needed)

---

### Decision: CSS custom properties for theming

**Context**: Need multiple color themes that can be switched at runtime.

**Decision**: Use CSS custom properties (`--theme-*`) with `data-theme` attribute.

**Rationale**:
- Native CSS, no JS runtime cost for style changes
- Works seamlessly with Tailwind (`text-theme-text`, `bg-theme-bg`)
- Easy to add new themes
- Instant switching without re-render

---

### Decision: localStorage for persistence

**Context**: Need to save user preferences, progress, and customizations.

**Decision**: Use localStorage via `useLocalStorage` hook.

**Rationale**:
- Offline-first requirement (no backend)
- Simple API, synchronous access
- Sufficient storage for app data (~5MB)
- Data stays on device (privacy for child data)

**Trade-offs**:
- No cross-device sync (acceptable, each device is independent)
- Data can be cleared by browser (mitigated by export/import in ParentPanel)

---

### Decision: Framer Motion for animations

**Context**: Need engaging animations for toddler UX.

**Decision**: Use Framer Motion library.

**Rationale**:
- Declarative API (`animate`, `whileHover`, `whileTap`)
- Spring physics feel natural and playful
- AnimatePresence handles enter/exit animations
- Well-maintained, good TypeScript support

**Trade-offs**:
- Adds ~50KB to bundle (acceptable for UX benefit)

---

## 2024-12 Refactoring

### Decision: Extract shared components (AppHeader, CelebrationModal, SelectableCard)

**Context**: Same UI patterns duplicated across 8+ files.

**Decision**: Create shared components in `src/shared/components/`.

**Rationale**:
- DRY principle - fix bugs once, benefit everywhere
- Consistent UX across all apps
- Easier to maintain and update styling
- Reduced total codebase by ~200 lines

---

### Decision: Extract custom hooks (useGameRound, usePrint)

**Context**: Game logic and print functionality duplicated across files.

**Decision**: Create reusable hooks in `src/shared/hooks/`.

**Rationale**:
- Encapsulates complex logic
- Easier to test in isolation
- Consistent behavior across games
- Reduced duplication by ~150 lines

---

### Decision: NavigationContext instead of prop drilling

**Context**: Home button in every app needed access to navigation.

**Decision**: Create NavigationContext with `goHome()` and `navigate()`.

**Rationale**:
- Eliminates prop drilling through component trees
- Consistent navigation behavior
- Changed from `<a href="/">` to proper state-based navigation
- AppHeader can work without explicit navigation props

---

### Decision: Split ParentPanel into tab components

**Context**: ParentPanel.tsx was 523 lines handling 5 different concerns.

**Decision**: Split into `ParentPanel/` directory with separate tab components.

**Rationale**:
- Single responsibility principle
- Easier to modify individual tabs
- Better code organization
- Each tab is now ~80-100 lines instead of one 523-line file

---

### Decision: Browser history integration for mobile back button

**Context**: Back button on mobile browsers didn't work - it would exit the app instead of navigating back.

**Decision**: Integrate browser history API with NavigationContext using URL hashes.

**Rationale**:
- Mobile users expect back button to work within apps
- URL hashes (`#colors`, `#timer`) enable deep linking
- No additional dependencies needed
- Works with existing state-based routing

**Implementation**:
- `history.pushState()` on navigation
- `popstate` event listener for back/forward
- URL hash parsed on initial load for deep linking

---

### Decision: Vitest over Jest for testing

**Context**: Need testing framework for React components.

**Decision**: Use Vitest with React Testing Library.

**Rationale**:
- Native Vite integration (same config, faster)
- Jest-compatible API (easy migration)
- Built-in TypeScript support
- Faster test execution

---

### Decision: Web Speech API for voice

**Context**: Learning games should speak words aloud.

**Decision**: Use native Web Speech API via `useVoice` hook.

**Rationale**:
- No external dependencies or API keys
- Works offline
- Supports voice selection (prefers "Samantha" on macOS/iOS)
- Free and built into browsers

**Trade-offs**:
- Voice quality varies by device/browser
- Not available in all browsers (hook checks `isSupported`)
