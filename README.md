# SrishtiOS 🏠

A suite of interactive web apps designed for Srishti (2.5 years old) to make her day more exciting, fun, and organized!

## 🎨 Features Built So Far

### Phase 1: Foundation ✅
- ✅ Vite + React + TypeScript project setup
- ✅ Tailwind CSS with custom theme system
- ✅ 5 Beautiful themes (Sunshine ☀️, Ocean 🌊, Garden 🌻, Rainbow 🌈, Twilight 🌙)
- ✅ Theme persistence in LocalStorage
- ✅ **Srishti's Home** - Main launcher with large, colorful app icons
- ✅ Parent Panel with theme selector (access via long-press on settings ⚙️)
- ✅ Toddler-friendly UI with extra-large touch targets (80px minimum)

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the app!

### Build for Production
```bash
npm run build
```

## 🎯 Planned Apps (Coming Soon!)

### Tier 1 - Daily Essentials
1. **Daily Routine Helper** 🌞 - Full day routine tracker
2. **Magic Hourglass Timer** ⏳ - Visual time understanding
3. **Star Reward Chart** ⭐ - Achievement tracking

### Tier 2 - Engagement & Choice
4. **Food Friends Chooser** 🍎 - Interactive food menu
5. **Bath Time Buddy Selector** 🛁 - Choose bath toys

### Tier 3 - Learning Games
6. **Colors Game** 🎨 - Color recognition
7. **Shapes Game** 🔷 - Shape matching
8. **Counting Game** 🔢 - Count objects (1-10)
9. **Animal Sounds** 🦁 - Learn animal names and sounds

### Tier 4 - Creative & Stories
10. **Creative Canvas** ✏️ - Drawing board + music maker
11. **Story Time Companion** 📖 - Interactive storytelling

## 🎨 Theme System

Parents can switch between themes in the Parent Panel (long-press ⚙️ icon):

- **Sunshine** ☀️ - Warm yellows and oranges (default)
- **Ocean** 🌊 - Calming blues and teals
- **Garden** 🌻 - Nature-inspired greens and purples
- **Rainbow** 🌈 - Vibrant multi-colors
- **Twilight** 🌙 - Soft purples and pinks

## 🔒 Parent Panel

Access by **long-pressing** (1.5 seconds) on the ⚙️ settings icon.

Current features:
- Theme selector

Coming soon:
- Food manager
- Toy manager
- Timer presets
- Routine editor
- Sound settings

## 📱 Design Principles

1. **Extra Large Touch Targets** - Minimum 80px for toddler fingers
2. **High Contrast Colors** - Bright, saturated colors for visibility
3. **Immediate Feedback** - Every interaction has visual/audio response
4. **No Failure States** - Positive reinforcement only
5. **Simple Navigation** - Home button always visible
6. **Offline First** - Everything works without internet
7. **Keep It Simple** - Each app does one thing well

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **State**: React Context + LocalStorage
- **Routing**: React Router (coming soon)
- **PWA**: Service Workers (coming soon)

## 📂 Project Structure

```
SrishtiOS/
├── src/
│   ├── HomePage.tsx              # Main launcher
│   ├── shared/
│   │   ├── components/          # Reusable UI components
│   │   ├── contexts/            # React contexts (Theme, etc.)
│   │   ├── hooks/               # Custom hooks
│   │   ├── themes/              # Theme definitions
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Helper functions
│   ├── apps/                    # Individual apps (coming soon)
│   ├── App.tsx
│   └── main.tsx
├── PLAN.md                      # Detailed implementation plan
└── README.md
```

## 🎉 Next Steps

Building Tier 1 apps next:
1. Daily Routine Helper
2. Magic Hourglass Timer
3. Star Reward Chart

---

Made with ❤️ for Srishti
