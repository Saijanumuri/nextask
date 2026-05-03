# NexTask — Hi-Tech Productivity App (Full Kiro Spec)

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3
- **Database**: IndexedDB via Dexie.js (fully local, no backend)
- **State**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date utils**: date-fns
- **Fonts**: `Outfit` (UI) + `JetBrains Mono` (timers/numbers) — load from Google Fonts in index.html

---

## Install Commands

```bash
npm create vite@latest nextask -- --template react-ts
cd nextask
npm install dexie zustand framer-motion lucide-react date-fns tailwindcss @tailwindcss/vite
```

Add to `index.html` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

---

## Visual Design System

### Theme — Dark Glassmorphism
- **Background**: `#080a0f` (near-black with a hint of navy)
- **Surface cards**: `rgba(255,255,255,0.04)` with `backdrop-blur-md` and `border border-white/8`
- **Primary accent**: Neon Cyan `#00f5d4`
- **Secondary accent**: Electric Violet `#7b2fff`
- **Danger/rage**: Neon Red `#ff2244`
- **Success**: Lime `#a3ff4f`
- **Warning**: Amber `#ffb800`
- **Text primary**: `#e8eaf2`
- **Text muted**: `#6b7280`

### Typography
- UI font: `Outfit` — weights 300, 400, 500, 600, 700
- Numbers/timers: `JetBrains Mono` — weights 400, 600
- Base body: 14px/1.6, headings use 500 weight

### Cards
All cards: `bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl`
Hover: `border-white/16 bg-white/6`
Active glow: `shadow-[0_0_20px_rgba(0,245,212,0.15)]`

### Buttons
- Primary: `bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-600 rounded-xl px-5 py-2.5`
- Ghost: `border border-white/16 text-white/70 hover:bg-white/8 rounded-xl px-4 py-2`
- Danger: `bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30`

### Priority color map
- Low: `#4ade80` (green)
- Medium: `#facc15` (yellow)
- High: `#f97316` (orange)
- Critical: `#ef4444` with `animate-pulse` (red pulse)

### Neon glow utility
```css
.glow-cyan { box-shadow: 0 0 16px rgba(0, 245, 212, 0.4); }
.glow-violet { box-shadow: 0 0 16px rgba(123, 47, 255, 0.4); }
.glow-red { box-shadow: 0 0 20px rgba(255, 34, 68, 0.6); }
```

---

## Database Schema (Dexie.js)

Create `src/db/db.ts`:

```ts
import Dexie, { Table } from 'dexie';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  dueDate?: string;       // ISO string
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'completed';
  tag?: string;
  createdAt: string;
  completedAt?: string;
}

export interface FocusSession {
  id?: number;
  taskId?: number;
  startTime: string;
  endTime?: string;
  duration: number;       // seconds
}

export interface StreakRecord {
  id?: number;
  date: string;           // YYYY-MM-DD
  tasksCompleted: number;
}

export interface StopwatchSession {
  id?: number;
  label: string;
  elapsed: number;        // milliseconds
  laps: number[];
  savedAt: string;
}

export class NexTaskDB extends Dexie {
  tasks!: Table<Task>;
  focusSessions!: Table<FocusSession>;
  streaks!: Table<StreakRecord>;
  stopwatchSessions!: Table<StopwatchSession>;

  constructor() {
    super('NexTaskDB');
    this.version(1).stores({
      tasks: '++id, title, dueDate, priority, status, tag, createdAt',
      focusSessions: '++id, taskId, startTime',
      streaks: '++id, date',
      stopwatchSessions: '++id, savedAt',
    });
  }
}

export const db = new NexTaskDB();
```

---

## File Structure

```
src/
  db/
    db.ts
    queries.ts          # All DB helpers (getTodayTasks, completeTask, saveStreak, etc.)
  stores/
    useTaskStore.ts     # Zustand: tasks list, filters, CRUD
    useTimerStore.ts    # Zustand: focus mode state
    useStopwatchStore.ts
    useStreakStore.ts
    useAppStore.ts      # Zustand: rageMode, soundEnabled, currentPage
  pages/
    Dashboard.tsx
    Tasks.tsx
    Calendar.tsx
    FocusMode.tsx
    Stopwatch.tsx
  components/
    Sidebar.tsx
    TopBar.tsx          # Live clock + streak fire + rage mode button
    TaskCard.tsx
    TaskDrawer.tsx      # Slide-in add/edit form
    StreakCard.tsx
    SoundEngine.tsx     # Web Audio API soundtrack component
    RageMode.tsx        # Rage mode overlay
    CalendarGrid.tsx
  App.tsx
  main.tsx
```

---

## TOP BAR — Always Visible

`src/components/TopBar.tsx`

A fixed top bar across all pages:

```
[ NexTask logo ]   [ 🔥 12 day streak ]   [ 14:32:07 ]   [ 🎵 Sound ON ]   [ ⚡ RAGE ]
```

- **Live clock**: Updates every second. Display format: `HH:MM:SS` in `JetBrains Mono` font, size 22px, neon cyan color, with a subtle pulse animation on the seconds digit
- **Date below clock**: `Monday, 01 May 2026` in muted small text
- **Streak badge**: Fire emoji + number + "day streak" — glows amber when streak > 7
- **Sound toggle button**: Toggles the productivity soundtrack on/off
- **RAGE button**: Glowing red button — hold for 2 seconds to activate Rage Mode

---

## SIDEBAR NAVIGATION

`src/components/Sidebar.tsx`

- Collapsible (icon-only on collapse, icon+label on expand)
- Width: 220px expanded, 64px collapsed
- Logo at top: "NX" monogram in gradient cyan→violet
- Nav items with Lucide icons:
  - Dashboard (LayoutDashboard)
  - Tasks (CheckSquare)
  - Calendar (CalendarDays)
  - Focus Mode (Brain)
  - Stopwatch (Timer)
- Active item: left neon cyan border + background glow
- Bottom: version tag `v1.0.0` in muted text

---

## PAGE 1 — DASHBOARD

`src/pages/Dashboard.tsx`

### Layout
Full page with these sections:

#### Greeting header
- "Good morning / afternoon / evening" based on time
- Current date in large text
- Subtext: "You have X tasks due today"

#### Streak card (hero card, full width)
- Fire animation (CSS keyframe)
- Current streak number (huge, JetBrains Mono, 48px)
- "day streak" label
- Progress bar toward next milestone (7, 14, 30, 100 days)
- Longest streak stat
- Read from `streaks` table in DB

#### Stats row (3 cards)
- Tasks due today
- Completed today
- Total focus time today (in hours + mins, from `focusSessions`)

#### Quick add task
- Inline input at top: `Add a task... press Enter`
- Creates task with today's date, medium priority, pending status → saves to DB

#### Today's task list
- Tasks filtered to today's date from DB
- Each task card shows: checkbox, title, priority badge, tag chip, due time
- Click checkbox → marks complete, updates DB, increments streak record

---

## PAGE 2 — TASKS

`src/pages/Tasks.tsx`

### Filter bar
Tabs: All | Today | Upcoming | Completed | By Priority

### Sort options
Dropdown: Due Date | Priority | Created At | Tag

### Task cards
Each card in the list shows:
- Animated checkbox (Framer Motion spring on check)
- Title (strikethrough on complete)
- Due date + time
- Priority badge (color-coded)
- Tag chip
- Description preview (truncated, 2 lines)
- Three-dot menu: Edit | Delete

### Add Task button
Opens a slide-in right drawer (`TaskDrawer.tsx`) with:
- Title input (required, autofocus)
- Description textarea
- Due date + time: `<input type="datetime-local">` styled to match the dark theme
- Priority selector: 4 large clickable chips (Low / Medium / High / Critical)
- Tag input: freeform text
- Save button → writes to DB via `db.tasks.add()`
- Smooth Framer Motion slide-in/out animation

### Empty state
SVG illustration of a resting astronaut with text "Mission board is clear"

---

## PAGE 3 — CALENDAR

`src/pages/Calendar.tsx`

### Monthly grid
Build from scratch (no external library):
- 7-column grid, Mon–Sun headers
- Navigate months: `<` and `>` arrow buttons
- Today's cell: neon cyan border + subtle background
- Each day cell shows: day number + colored priority dots for tasks due that day (up to 3 dots, then "+N more")

### Day panel
Click any day to open a right side panel:
- Header: "Tasks for Mon, 28 Apr"
- List of tasks due on that date (from DB, filtered by `dueDate`)
- "Add task on this date" button → opens `TaskDrawer` pre-filled with that date

### Data
All tasks loaded from DB, grouped by date (use `date-fns/format` to compare `YYYY-MM-DD`)

---

## PAGE 4 — FOCUS MODE

`src/pages/FocusMode.tsx`

### Layout
Centered, minimal, immersive. Hide sidebar in this mode.

### Timer
- Large circular progress ring (SVG)
- Inner: current time remaining in `JetBrains Mono` (HH:MM:SS, 56px)
- Outer ring: animated stroke-dashoffset countdown
- Neon cyan when working, violet when break

### Controls
- Work duration slider: 5–90 min (default 25)
- Break duration slider: 1–30 min (default 5)
- Task selector dropdown: loads incomplete tasks from DB
- Start / Pause / Reset buttons
- Session counter: "Session 2 of 4 today"

### State machine
`idle → running → paused → break → done`

When session completes:
- Save to `focusSessions` table: `{ taskId, startTime, endTime, duration }`
- Show completion animation (confetti burst using canvas)

### Ambient sound
Use Web Audio API to generate soft brown noise (no external audio files):

```ts
const ctx = new AudioContext();
const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
const data = buffer.getChannelData(0);
let lastOut = 0;
for (let i = 0; i < data.length; i++) {
  const white = Math.random() * 2 - 1;
  data[i] = (lastOut + 0.02 * white) / 1.02;
  lastOut = data[i];
  data[i] *= 3.5;
}
const source = ctx.createBufferSource();
source.buffer = buffer;
source.loop = true;
source.connect(ctx.destination);
source.start();
```

Toggle ambient sound on/off with a button.

---

## PAGE 5 — STOPWATCH

`src/pages/Stopwatch.tsx`

### Display
- Giant `JetBrains Mono` display: `HH:MM:SS.ms` (64px)
- Neon cyan color, glow effect

### Controls
- Start / Pause (toggle)
- Lap button (records current time)
- Reset button

### Lap table
Columns: Lap # | Split | Total — scrollable, newest lap at top

### Session saving
- Text input: label this session (e.g. "Morning sprint")
- "Save Session" button → saves to DB: `{ label, elapsed, laps, savedAt }`

### Saved sessions list
Below controls — past sessions from DB:
- Label, date, total time
- Delete button per row

---

## FEATURE: PRODUCTIVITY SOUNDTRACK

`src/components/SoundEngine.tsx`

Pure Web Audio API — no external audio files needed.

### What it does
Generates a generative ambient soundtrack that reacts to your productivity:

```ts
// Base: continuous drone chord (A minor, 110hz + 165hz + 220hz)
// Melody layer: slow arpeggiated notes, tempo in BPM
// BPM starts at 60 (idle)
// When a task is completed: BPM increases by 8, up to max 120
// When idle for 5 min: BPM decays back down by 5 every minute
// When rage mode activates: tempo jumps to 140 + distortion filter added
```

Implementation:
- Create `OscillatorNode` array for the drone chord
- Create a `BiquadFilterNode` (lowpass, freq 400Hz) for warm filtering
- Create a `GainNode` for overall volume control (0.12 master gain — subtle)
- Track `completedTaskCount` in state; on change, update BPM
- Use `setInterval` to trigger arpeggiated notes on the melody oscillator
- Expose `start()`, `stop()`, `setBPM(bpm)`, `enableDistortion()` methods

Toggle button in TopBar: shows waveform icon when active, muted icon when off.

---

## FEATURE: RAGE MODE

`src/components/RageMode.tsx`

### Activation
- RAGE button in TopBar: hold for 2 seconds (use `onMouseDown` + `setTimeout`)
- 2-second hold progress fills the button with red
- On activation: play a bass-drop sound effect (Web Audio API) + screen flash

### What changes in Rage Mode
1. **UI**: Entire app background shifts to deep red `#1a0008`. All accents go red.
2. **Typography**: Font switches to `JetBrains Mono` bold everywhere — no frills
3. **Task list**: All descriptions, tags, dates are hidden — just checkboxes + titles
4. **Timer**: Focus timer auto-starts with a 15-minute blitz timer (no controls to change it)
5. **Sound**: Soundtrack tempo jumps to 140 BPM + distortion filter on
6. **Overlay text**: Large semi-transparent "RAGE MODE" text watermark behind content
7. **Cursor**: Changes to a custom red crosshair cursor

### Deactivation
- Rage Mode ends automatically after 15 minutes
- Or click a "CALM DOWN" button that appears in top right
- On exit: smooth CSS transition back to normal theme over 1.5 seconds

### Rage store (Zustand)
```ts
interface RageModeState {
  isActive: boolean;
  activatedAt: number | null;
  activate: () => void;
  deactivate: () => void;
}
```

---

## STREAK LOGIC

In `src/db/queries.ts`:

```ts
// On app load:
// 1. Get today's date as YYYY-MM-DD
// 2. Query streaks table, order by date DESC
// 3. Walk backwards: count consecutive days with tasksCompleted > 0
// 4. That count = current streak

// On task completion:
// 1. Upsert today's record in streaks table (increment tasksCompleted)
// 2. Recompute streak
// 3. Update useStreakStore

// Milestone thresholds: 3, 7, 14, 30, 60, 100, 365 days
// Show a toast notification + confetti when milestone hit
```

---

## ANIMATIONS GUIDE (Framer Motion)

### Page transitions
```tsx
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};
```
Wrap each page in `<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">`

### Task card entrance
```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, x: -40, height: 0 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
/>
```

### Task completion
- Checkbox: spring scale animation (0.8 → 1.2 → 1.0)
- Title: animate strikethrough width 0% → 100% using CSS `text-decoration` + custom underline pseudo

### Drawer slide-in
```tsx
initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
transition={{ type: 'spring', stiffness: 300, damping: 30 }}
```

### Streak fire pulse
```css
@keyframes firePulse {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.15); filter: brightness(1.3); }
}
```

---

## TOAST NOTIFICATIONS

Use a simple custom toast system (no library):
- Appears bottom-right, stacks vertically
- Auto-dismiss after 3 seconds
- Types: success (cyan), warning (amber), rage (red)
- Show toasts for: task completed, streak milestone, rage mode activated/deactivated, session saved

---

## App.tsx ROUTING

Use simple state-based routing (no React Router needed):

```tsx
const pages = {
  dashboard: <Dashboard />,
  tasks: <Tasks />,
  calendar: <Calendar />,
  focus: <FocusMode />,
  stopwatch: <Stopwatch />,
};

return (
  <div className="flex h-screen bg-[#080a0f] text-[#e8eaf2] font-['Outfit']">
    <Sidebar currentPage={page} onNavigate={setPage} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {pages[page]}
        </AnimatePresence>
      </main>
    </div>
    <RageMode />
    <SoundEngine />
  </div>
);
```

---

## DELIVERABLE CHECKLIST

Every item below must be fully wired to IndexedDB — no mock data anywhere:

- [ ] Live clock (HH:MM:SS) in TopBar, updates every second
- [ ] Date display in TopBar
- [ ] Streak badge in TopBar, reads from DB
- [ ] Sound toggle in TopBar, controls SoundEngine
- [ ] Rage Mode button in TopBar, 2-second hold activation
- [ ] Sidebar navigation, collapsible
- [ ] Dashboard: greeting, streak hero, stats, quick-add, today's task list
- [ ] Tasks page: full CRUD, filters, sort, add drawer
- [ ] Calendar: custom monthly grid, day click panel, add task on date
- [ ] Focus Mode: timer, task selector, ambient noise, session saving to DB
- [ ] Stopwatch: start/pause/lap/reset, session saving to DB, past sessions list
- [ ] Productivity soundtrack: generative Web Audio, BPM reacts to completions
- [ ] Rage Mode: full UI takeover, 15-min timer, CALM DOWN button, smooth exit
- [ ] Streak logic: computed from DB, milestone toasts
- [ ] Framer Motion page transitions and task animations
- [ ] All data persists across page refresh via IndexedDB
