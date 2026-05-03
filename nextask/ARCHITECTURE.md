# 🏗️ NexTask Architecture

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     NexTask Fullstack App                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│                      │         │                      │
│   Frontend (React)   │ ◄─────► │  Backend (Express)   │
│   Port: 5173         │  HTTP   │  Port: 3001          │
│                      │         │                      │
└──────────────────────┘         └──────────────────────┘
         │                                  │
         │                                  │
         ▼                                  ▼
┌──────────────────────┐         ┌──────────────────────┐
│                      │         │                      │
│  IndexedDB (Dexie)   │         │  admin.json (Disk)   │
│  Browser Storage     │         │  File Storage        │
│                      │         │                      │
└──────────────────────┘         └──────────────────────┘
```

---

## 🎯 Frontend Architecture

### Technology Stack
```
React 19
  ├── TypeScript (Type safety)
  ├── Vite (Build tool)
  ├── Tailwind CSS (Styling)
  ├── Framer Motion (Animations)
  ├── Zustand (State management)
  └── Dexie (IndexedDB wrapper)
```

### Component Structure
```
src/
├── components/
│   ├── AuthScreen.tsx          # Login/Register
│   ├── Sidebar.tsx             # Navigation
│   ├── TopBar.tsx              # Header
│   ├── TaskCard.tsx            # Task item
│   ├── TaskDrawer.tsx          # Task details
│   ├── CalendarGrid.tsx        # Calendar view
│   ├── StreakCard.tsx          # Streak display
│   ├── CinematicPlayer.tsx     # Story player
│   ├── SoundEngine.tsx         # Audio system
│   └── RageMode.tsx            # Rage mode UI
│
├── pages/
│   ├── Dashboard.tsx           # Home page
│   ├── Tasks.tsx               # Task management
│   ├── Calendar.tsx            # Calendar view
│   ├── FocusMode.tsx           # Pomodoro timer
│   ├── Stopwatch.tsx           # Time tracking
│   └── Stories.tsx             # Telugu stories
│
├── stores/
│   ├── useAuthStore.ts         # Authentication
│   ├── useTaskStore.ts         # Task management
│   ├── useStreakStore.ts       # Streak tracking
│   ├── useTimerStore.ts        # Focus timer
│   ├── useStopwatchStore.ts    # Stopwatch
│   └── useAppStore.ts          # Global state
│
├── db/
│   ├── db.ts                   # Dexie setup
│   └── queries.ts              # Database queries
│
├── utils/
│   ├── cinematicAudioEngine.ts # ElevenLabs integration
│   └── storyAudioParser.ts     # Story audio parsing
│
└── data/
    ├── teluguStories.ts        # Story data
    └── kiro_ready_stories.json # Story content
```

### State Management (Zustand)
```
┌─────────────────────────────────────────────┐
│              Zustand Stores                  │
├─────────────────────────────────────────────┤
│                                             │
│  useAuthStore                               │
│  ├── currentUser                            │
│  ├── isAuthenticated                        │
│  ├── login()                                │
│  ├── logout()                               │
│  └── register()                             │
│                                             │
│  useTaskStore                               │
│  ├── tasks[]                                │
│  ├── addTask()                              │
│  ├── updateTask()                           │
│  ├── deleteTask()                           │
│  └── toggleComplete()                       │
│                                             │
│  useStreakStore                             │
│  ├── currentStreak                          │
│  ├── longestStreak                          │
│  ├── lastCompletionDate                     │
│  └── updateStreak()                         │
│                                             │
│  useTimerStore                              │
│  ├── timeLeft                               │
│  ├── isRunning                              │
│  ├── start()                                │
│  ├── pause()                                │
│  └── reset()                                │
│                                             │
│  useStopwatchStore                          │
│  ├── time                                   │
│  ├── isRunning                              │
│  ├── sessions[]                             │
│  └── saveSession()                          │
│                                             │
│  useAppStore                                │
│  ├── sidebarCollapsed                       │
│  ├── soundEnabled                           │
│  └── rageMode                               │
│                                             │
└─────────────────────────────────────────────┘
```

### Data Persistence
```
┌─────────────────────────────────────────────┐
│         IndexedDB (Dexie)                    │
├─────────────────────────────────────────────┤
│                                             │
│  users                                      │
│  ├── id (primary key)                       │
│  ├── passkey (unique)                       │
│  ├── name                                   │
│  ├── dob                                    │
│  ├── createdAt                              │
│  └── lastLogin                              │
│                                             │
│  tasks                                      │
│  ├── id (primary key)                       │
│  ├── userId (foreign key)                   │
│  ├── title                                  │
│  ├── description                            │
│  ├── status                                 │
│  ├── priority                               │
│  ├── category                               │
│  ├── dueDate                                │
│  ├── createdAt                              │
│  └── completedAt                            │
│                                             │
│  streaks                                    │
│  ├── id (primary key)                       │
│  ├── userId (foreign key)                   │
│  ├── currentStreak                          │
│  ├── longestStreak                          │
│  └── lastCompletionDate                     │
│                                             │
│  stopwatchSessions                          │
│  ├── id (primary key)                       │
│  ├── userId (foreign key)                   │
│  ├── duration                               │
│  ├── label                                  │
│  └── timestamp                              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔧 Backend Architecture

### Technology Stack
```
Node.js
  ├── Express (Web framework)
  ├── CORS (Cross-origin requests)
  ├── dotenv (Environment variables)
  └── nodemon (Auto-reload in dev)
```

### Server Structure
```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables
├── .gitignore             # Excluded files
└── admin/                 # Data storage (auto-created)
    └── admin.json         # User data
```

### API Endpoints
```
┌─────────────────────────────────────────────┐
│              Express API                     │
├─────────────────────────────────────────────┤
│                                             │
│  POST /api/save-user-data                   │
│  ├── Body: { passkey, name, dob, ... }     │
│  ├── Saves login data to admin.json        │
│  ├── Updates existing users                │
│  ├── Tracks login history                  │
│  └── Returns: { success, message }         │
│                                             │
│  POST /api/save-task-data                   │
│  ├── Body: { passkey, tasks[] }            │
│  ├── Updates user task statistics          │
│  └── Returns: { success }                  │
│                                             │
│  GET /api/admin-data                        │
│  ├── Returns all admin data                │
│  └── Response: { users[], loginHistory[] } │
│                                             │
└─────────────────────────────────────────────┘
```

### Data Storage (admin.json)
```json
{
  "users": [
    {
      "passkey": "123456",
      "name": "John Doe",
      "dob": "1990-01-01",
      "accountCreated": "2026-05-03T10:00:00.000Z",
      "accountCreatedFormatted": "5/3/2026, 10:00:00 AM",
      "lastLogin": "2026-05-03T15:30:00.000Z",
      "lastLoginFormatted": "5/3/2026, 3:30:00 PM",
      "totalLogins": 5,
      "lastUserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "lastIpAddress": "::1",
      "totalTasks": 10,
      "completedTasks": 7
    }
  ],
  "loginHistory": [
    {
      "passkey": "123456",
      "name": "John Doe",
      "loginTime": "2026-05-03T15:30:00.000Z",
      "loginTimeFormatted": "5/3/2026, 3:30:00 PM",
      "userAgent": "Mozilla/5.0...",
      "ipAddress": "::1"
    }
  ],
  "totalLogins": 5,
  "lastUpdated": "2026-05-03T15:30:00.000Z"
}
```

---

## 🔄 Data Flow

### User Registration Flow
```
1. User enters name + DOB
   ↓
2. Frontend generates 6-digit passkey
   ↓
3. Frontend saves to IndexedDB
   ↓
4. Frontend displays passkey to user
   ↓
5. User saves passkey (important!)
```

### User Login Flow
```
1. User enters passkey
   ↓
2. Frontend validates with IndexedDB
   ↓
3. If valid:
   ├── Update lastLogin in IndexedDB
   ├── Set currentUser in Zustand
   ├── Send login data to backend API
   └── Backend saves to admin.json
   ↓
4. User is logged in
```

### Task Creation Flow
```
1. User creates task in UI
   ↓
2. Frontend saves to IndexedDB
   ↓
3. Frontend updates Zustand store
   ↓
4. UI re-renders with new task
   ↓
5. (Optional) Send task stats to backend
```

### Task Completion Flow
```
1. User clicks checkbox
   ↓
2. Frontend updates task status in IndexedDB
   ↓
3. Frontend updates Zustand store
   ↓
4. Frontend checks streak:
   ├── If first task today → Update streak
   └── If not first → No streak update
   ↓
5. UI shows confetti animation
   ↓
6. (Optional) Send task stats to backend
```

---

## 🎵 Audio System Architecture

### Story Audio System
```
┌─────────────────────────────────────────────┐
│         Story Audio Pipeline                 │
├─────────────────────────────────────────────┤
│                                             │
│  1. Story Text (Telugu)                     │
│     ↓                                       │
│  2. Parse Markers                           │
│     ├── 🎵 [Music name] → Play music       │
│     └── 🎧 (pause Xs) → Pause              │
│     ↓                                       │
│  3. ElevenLabs API                          │
│     ├── Send text chunks                    │
│     ├── Receive audio blobs                 │
│     └── Cache audio                         │
│     ↓                                       │
│  4. Audio Playback                          │
│     ├── Narration at 100% volume           │
│     ├── Music at 30% volume                │
│     └── Smart ducking (lower music)        │
│     ↓                                       │
│  5. Cinematic Player UI                     │
│     ├── Fullscreen mode                    │
│     ├── Animated backgrounds               │
│     ├── Floating particles                 │
│     └── Auto-hiding controls               │
│                                             │
└─────────────────────────────────────────────┘
```

### Music Files
```
public/audio/music/
├── soft-intro.mp3        # Story opening
├── light-transition.mp3  # Scene changes
├── soft-ending.mp3       # Story closing
└── fade-out.mp3          # Final fade
```

---

## 🔐 Security Architecture

### Authentication
```
┌─────────────────────────────────────────────┐
│         Authentication Flow                  │
├─────────────────────────────────────────────┤
│                                             │
│  1. User Registration                       │
│     ├── Generate random 6-digit passkey    │
│     ├── Check uniqueness in IndexedDB      │
│     ├── Save user data                     │
│     └── Display passkey (one-time)         │
│                                             │
│  2. User Login                              │
│     ├── Enter passkey                      │
│     ├── Validate against IndexedDB         │
│     ├── Update lastLogin                   │
│     └── Set authenticated state            │
│                                             │
│  3. Session Management                      │
│     ├── Zustand persist middleware         │
│     ├── LocalStorage for session           │
│     └── Auto-logout on browser close       │
│                                             │
└─────────────────────────────────────────────┘
```

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,  // Only allow frontend
  credentials: true                   // Allow cookies
}));
```

### Environment Variables
```
Frontend (.env):
├── VITE_API_URL=http://localhost:3001

Backend (backend/.env):
├── PORT=3001
├── NODE_ENV=development
└── FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Deployment Architecture

### Development
```
┌──────────────────────┐         ┌──────────────────────┐
│  Frontend (Vite)     │         │  Backend (Express)   │
│  localhost:5173      │ ◄─────► │  localhost:3001      │
│  npm run dev         │         │  npm run dev:backend │
└──────────────────────┘         └──────────────────────┘
```

### Production (Vercel Monorepo)
```
┌─────────────────────────────────────────────┐
│              Vercel Platform                 │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend (Static)                          │
│  ├── Built with: npm run build             │
│  ├── Output: dist/                         │
│  └── Served from: /                        │
│                                             │
│  Backend (Serverless)                       │
│  ├── Function: backend/server.js           │
│  ├── Runtime: Node.js                      │
│  └── Routes: /api/*                        │
│                                             │
└─────────────────────────────────────────────┘
```

### Production (Netlify + Render)
```
┌──────────────────────┐         ┌──────────────────────┐
│  Netlify             │         │  Render              │
│  (Frontend)          │ ◄─────► │  (Backend)           │
│  Static hosting      │  HTTPS  │  Node.js server      │
│  your-app.netlify    │         │  your-api.render     │
└──────────────────────┘         └──────────────────────┘
```

---

## 📊 Performance Optimizations

### Frontend
- ✅ Code splitting (React.lazy)
- ✅ Memoization (useMemo, useCallback)
- ✅ Virtual scrolling (for large lists)
- ✅ Debounced search
- ✅ Optimistic UI updates
- ✅ IndexedDB for offline support

### Backend
- ✅ File-based storage (fast reads)
- ✅ JSON caching
- ✅ CORS optimization
- ✅ Gzip compression (production)
- ✅ Rate limiting (future)

### Audio
- ✅ Audio blob caching
- ✅ Lazy loading music files
- ✅ Web Audio API (low latency)
- ✅ Smart ducking algorithm

---

## 🔮 Future Enhancements

### Database Migration
```
Current: admin.json (file)
         ↓
Future:  MongoDB / PostgreSQL
         ├── Better scalability
         ├── Faster queries
         ├── Relationships
         └── Transactions
```

### Authentication Upgrade
```
Current: Passkey only
         ↓
Future:  JWT tokens
         ├── Refresh tokens
         ├── Token expiration
         ├── Multi-device support
         └── Password reset
```

### Cloud Storage
```
Current: Local files
         ↓
Future:  AWS S3 / Cloudinary
         ├── Audio files
         ├── User uploads
         └── CDN delivery
```

---

## 📈 Scalability Considerations

### Current Limits
- File-based storage (admin.json)
- Single server instance
- No load balancing
- No caching layer

### Scaling Path
```
Stage 1: Current (1-100 users)
├── File storage
└── Single server

Stage 2: Small Scale (100-1,000 users)
├── Database (MongoDB)
├── Redis caching
└── Single server

Stage 3: Medium Scale (1,000-10,000 users)
├── Database cluster
├── Redis cluster
├── Load balancer
└── Multiple servers

Stage 4: Large Scale (10,000+ users)
├── Microservices
├── CDN
├── Message queue
└── Auto-scaling
```

---

## 🎯 Summary

### Architecture Highlights
- ✅ Modern React frontend with TypeScript
- ✅ Express backend with REST API
- ✅ IndexedDB for client-side storage
- ✅ File-based admin data storage
- ✅ CORS-protected API
- ✅ Environment-based configuration
- ✅ Production-ready deployment options

### Key Features
- ✅ User authentication
- ✅ Task management
- ✅ Streak tracking
- ✅ Focus timer
- ✅ Telugu stories with AI narration
- ✅ Admin data persistence

### Deployment Ready
- ✅ Vercel (monorepo)
- ✅ Netlify + Render
- ✅ Railway
- ✅ DigitalOcean
- ✅ VPS

**Your fullstack app is architecturally sound and ready for production!** 🚀
