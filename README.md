# SrishtiOS

A suite of interactive web apps designed for Srishti (2.5 years old) to make her day more exciting, fun, and organized!

**Live Demo**: [https://srishti-os.vercel.app](https://srishti-os.vercel.app)

## Apps

| App | Description |
|-----|-------------|
| **My Day** | Morning, afternoon, and evening routine tracker with checkmarks |
| **Magic Timer** | Visual countdown with hourglass animation and particle effects |
| **My Stars** | Star collection with milestone celebrations |
| **Food Time** | Meal food selection with print functionality |
| **Bath Time** | Bath toy selection by category |
| **Colors** | Color recognition game with voice prompts |
| **Shapes** | Shape identification game |
| **Counting** | Number learning (1-10) with visual counting |
| **Animals** | Animal recognition with sounds |
| **Draw** | Free drawing canvas with colors and music |
| **Stories** | Interactive story reader with narration |

## Features

- **Toddler-Friendly UI**: Extra-large touch targets (140-180px buttons), high contrast colors
- **5 Themes**: Sunshine, Ocean, Garden, Rainbow, Twilight
- **Voice Feedback**: Text-to-speech for learning games
- **Cross-Device Sync**: Optional Firebase sync via family codes
- **Offline Support**: Works without internet after initial load
- **Parent Controls**: Long-press settings icon (1.5s) to access ParentPanel

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

Visit [http://localhost:5173](http://localhost:5173) to see the app.

## Parent Panel

Access by **long-pressing** (1.5 seconds) on the settings icon.

| Tab | Features |
|-----|----------|
| **Apps** | Show/hide apps from home screen |
| **Themes** | Switch between 5 color themes |
| **Foods** | Add, edit, delete food items |
| **Bath Toys** | Add, edit, delete bath toys |
| **Timers** | Customize timer presets |
| **Data** | Cloud sync, reset, clear data |

## Cross-Device Sync

Enable cloud sync in ParentPanel > Data to share settings across devices:

1. Tap "Enable Sync" to generate a 6-character family code
2. On another device, enter the code to connect
3. All settings sync automatically in real-time

Works offline - changes sync when back online.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS |
| Build | Vite |
| Animations | Framer Motion |
| Backend | Firebase Firestore (optional) |
| Testing | Vitest + React Testing Library |
| Hosting | Vercel |

## Project Structure

```
src/
├── App.tsx                    # Main router
├── HomePage.tsx               # App launcher grid
├── shared/
│   ├── components/            # BigButton, AppHeader, ParentPanel, etc.
│   ├── contexts/              # Theme, Navigation, Family contexts
│   ├── hooks/                 # useLocalStorage, useSyncedStorage, useVoice, etc.
│   ├── firebase/              # Firebase configuration
│   └── themes/                # Theme definitions
└── apps/                      # Individual app modules
    ├── daily-routine/
    ├── magic-timer/
    ├── star-rewards/
    ├── food-friends/
    ├── bath-buddy/
    ├── learning-games/
    ├── creative/
    └── stories/
```

## Design Principles

1. **Large Touch Targets** - Minimum 140px buttons for toddler fingers
2. **Immediate Feedback** - Every interaction has visual/audio response
3. **No Failure States** - Positive reinforcement only
4. **Visual Over Text** - Emojis and colors for non-literate users
5. **Offline First** - Works without internet
6. **Mobile First** - Touch-optimized, responsive design

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - Technical overview and patterns
- [Decisions](docs/DECISIONS.md) - Key technical decisions and trade-offs
- [Goals](docs/GOALS.md) - Project goals and future ideas

---

Made with love for Srishti
