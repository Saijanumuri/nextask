# 📁 Project Structure

## Root Directory

```
nextask/
├── docs/                    # 📖 Documentation
├── public/                  # 🌐 Static assets
├── src/                     # 💻 Source code
├── dist/                    # 📦 Build output (generated)
├── node_modules/            # 📚 Dependencies (generated)
├── index.html              # 🏠 Entry HTML
├── package.json            # 📋 Project config
├── tsconfig.json           # ⚙️ TypeScript config
├── vite.config.ts          # ⚡ Vite config
└── README.md               # 📄 Main documentation
```

---

## 📖 Documentation (`docs/`)

```
docs/
├── LUXURY_QUICK_START.md           # ⚡ Quick start guide
├── LUXURY_EDITION_COMPLETE.md      # 📚 Complete feature docs
├── ELEVENLABS_SETUP.md             # 🎤 ElevenLabs setup
├── FEATURES_VISUAL_GUIDE.md        # 🎨 Visual guide
├── HOW_TO_ADD_MORE_STORIES.md      # ➕ Add stories guide
└── UPGRADE_SUMMARY.md              # 📊 What changed
```

---

## 🌐 Public Assets (`public/`)

```
public/
├── audio/
│   └── music/
│       ├── soft-intro.mp3          # 🎵 Intro music
│       ├── light-transition.mp3    # 🎵 Transition music
│       ├── soft-ending.mp3         # 🎵 Ending music
│       └── fade-out.mp3            # 🎵 Fade out music
├── favicon.svg                     # 🔖 Browser icon
└── icons.svg                       # 🎨 App icons
```

---

## 💻 Source Code (`src/`)

### Main Files
```
src/
├── App.tsx                 # 🎯 Main app component
├── main.tsx               # 🚀 Entry point
└── index.css              # 🎨 Global styles
```

### Components (`src/components/`)
```
components/
├── AuthScreen.tsx          # 🔐 Login/Register screen
├── CinematicPlayer.tsx     # 🎬 Fullscreen story player
├── Sidebar.tsx             # 📱 Navigation sidebar
├── TopBar.tsx              # 🔝 Top navigation bar
├── CalendarGrid.tsx        # 📅 Calendar component
├── TaskCard.tsx            # ✅ Task card
├── TaskDrawer.tsx          # 📝 Task details drawer
├── StreakCard.tsx          # 🔥 Streak display
├── RageMode.tsx            # 😤 Rage mode overlay
└── SoundEngine.tsx         # 🔊 Sound effects
```

### Pages (`src/pages/`)
```
pages/
├── Dashboard.tsx           # 🏠 Main dashboard
├── Tasks.tsx               # ✅ Todo list page
├── Calendar.tsx            # 📅 Calendar page
├── FocusMode.tsx           # 🎯 Pomodoro timer
├── Stopwatch.tsx           # ⏱️ Stopwatch page
└── Stories.tsx             # 📚 Telugu stories page
```

### State Management (`src/stores/`)
```
stores/
├── useAppStore.ts          # 🎯 App state (current page, rage mode)
├── useAuthStore.ts         # 🔐 Authentication state
├── useTaskStore.ts         # ✅ Tasks state
├── useStreakStore.ts       # 🔥 Streak state
├── useTimerStore.ts        # ⏲️ Focus timer state
└── useStopwatchStore.ts    # ⏱️ Stopwatch state
```

### Utilities (`src/utils/`)
```
utils/
├── cinematicAudioEngine.ts # 🎬 Premium audio engine
│                           # - ElevenLabs integration
│                           # - Smart audio ducking
│                           # - Sleep timer
│                           # - Volume controls
│
└── storyAudioParser.ts     # 📖 Story content parser
                            # - Parse music markers (🎵)
                            # - Parse pause markers (🎧)
                            # - Create audio segments
```

### Database (`src/db/`)
```
db/
├── db.ts                   # 💾 Dexie database setup
└── queries.ts              # 🔍 Database queries
```

### Data (`src/data/`)
```
data/
├── kiro_ready_stories.json # 📚 200 Telugu stories
│                           # - Panchatantra series
│                           # - 5 seasons, 40 stories each
│                           # - Music & pause markers
│
└── teluguStories.ts        # 📖 TypeScript wrapper
                            # - Story interface
                            # - Category definitions
                            # - Export stories
```

---

## 🎯 Key Architecture Decisions

### 1. Component Organization
- **Atomic design**: Small, reusable components
- **Page components**: Full page layouts
- **Feature components**: Complex features (CinematicPlayer)

### 2. State Management
- **Zustand**: Lightweight, no boilerplate
- **Persist middleware**: Auto-save to localStorage
- **Separate stores**: Each feature has its own store

### 3. Audio System
- **Two-layer architecture**:
  - `storyAudioParser.ts`: Parse story content
  - `cinematicAudioEngine.ts`: Play audio with effects
- **Smart ducking**: Music lowers during speech
- **Caching**: Generated audio cached in localStorage

### 4. Data Storage
- **Dexie (IndexedDB)**: User data, tasks, streaks
- **localStorage**: Settings, API keys, audio cache
- **JSON files**: Static story data

### 5. Styling
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Glassmorphism**: Premium UI aesthetic

---

## 📊 File Size Guidelines

### Keep Small (<100 lines)
- Store files
- Utility functions
- Simple components

### Medium (100-300 lines)
- Page components
- Feature components
- Complex utilities

### Large (300+ lines)
- `CinematicPlayer.tsx` (~400 lines) - Complex UI
- `cinematicAudioEngine.ts` (~400 lines) - Audio logic
- `Stories.tsx` (~450 lines) - Full feature page

---

## 🔄 Data Flow

```
User Action
    ↓
Component
    ↓
Store (Zustand)
    ↓
Database (Dexie) / localStorage
    ↓
Component Re-renders
```

### Example: Adding a Task
```
1. User types in TaskDrawer
2. TaskDrawer calls useTaskStore.addTask()
3. Store updates state
4. Store saves to Dexie database
5. TaskCard components re-render
```

### Example: Playing Story
```
1. User clicks ✨ on Stories page
2. Stories.tsx opens CinematicPlayer
3. CinematicPlayer creates CinematicAudioEngine
4. Engine parses story with storyAudioParser
5. Engine plays segments (text/music/pause)
6. Progress updates trigger UI re-renders
```

---

## 🎨 Styling Conventions

### Colors
- **Primary**: Cyan (400) - `text-cyan-400`
- **Secondary**: Violet (500) - `text-violet-500`
- **Accent**: Pink (500) - `text-pink-500`
- **Background**: Dark slate - `bg-[#080a0f]`

### Spacing
- **Small**: `p-3`, `gap-2`
- **Medium**: `p-6`, `gap-4`
- **Large**: `p-8`, `gap-6`

### Borders
- **Subtle**: `border-white/8`
- **Visible**: `border-white/16`
- **Highlighted**: `border-cyan-400`

### Glassmorphism
```css
bg-white/4 backdrop-blur-md border border-white/8
```

---

## 🚀 Build Process

```
npm run dev
    ↓
Vite dev server
    ↓
Hot Module Replacement (HMR)
    ↓
Fast refresh in browser
```

```
npm run build
    ↓
TypeScript compilation (tsc)
    ↓
Vite build (Rolldown)
    ↓
Optimized bundle in dist/
```

---

## 📝 Naming Conventions

### Files
- **Components**: PascalCase - `CinematicPlayer.tsx`
- **Utilities**: camelCase - `storyAudioParser.ts`
- **Stores**: camelCase with prefix - `useTaskStore.ts`
- **Types**: PascalCase - `Story`, `AudioSegment`

### Variables
- **State**: camelCase - `isPlaying`, `currentSegment`
- **Constants**: UPPER_SNAKE_CASE - `API_URL`
- **Functions**: camelCase - `playStory()`, `toggleFavorite()`

### CSS Classes
- **Tailwind**: kebab-case - `bg-white/4`
- **Custom**: kebab-case - `cinematic-player`

---

## 🎯 Best Practices

### 1. Component Design
- Keep components focused (single responsibility)
- Use TypeScript interfaces for props
- Extract reusable logic to hooks

### 2. State Management
- Use Zustand for global state
- Use useState for local component state
- Persist important data to database

### 3. Performance
- Lazy load heavy components
- Memoize expensive calculations
- Cache API responses

### 4. Code Quality
- TypeScript strict mode enabled
- ESLint for code quality
- Consistent formatting

---

## 🔮 Future Improvements

### Structure
- [ ] Split large components into smaller ones
- [ ] Create shared hooks folder
- [ ] Add tests folder

### Organization
- [ ] Group components by feature
- [ ] Create constants file
- [ ] Add types folder

### Performance
- [ ] Implement code splitting
- [ ] Add service worker
- [ ] Optimize bundle size

---

**This structure is clean, organized, and scalable!** ✨
