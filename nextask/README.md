# 🎬 NexTask - Luxury Edition

A premium productivity + storytelling companion with cinematic Telugu stories.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## ✨ Features

### 📚 Productivity
- ✅ Todo List with priorities
- 📅 Calendar with events
- 🎯 Focus Mode (Pomodoro timer)
- ⏱️ Stopwatch with lap tracking
- 🔥 Daily streak system

### 🎬 Cinematic Stories
- 200 Telugu stories (Panchatantra)
- **Cinematic Mode** - Fullscreen immersive experience
- Smart audio ducking (music lowers during speech)
- Bedtime mode with sleep timer
- Floating particles & animations
- Music markers (🎵) and pause markers (🎧)

### 🎤 Audio Features
- Browser TTS (Telugu/Hindi/Tamil)
- **ElevenLabs integration** (optional premium voice)
- Background music with auto-ducking
- Independent volume controls
- Audio caching

## 🎯 How to Use

### Stories
1. Go to **Stories** page
2. Click **✨ Sparkles** button for cinematic mode
3. Or click **▶️ Play** for background listening

### ElevenLabs (Optional)
1. Get API key from https://elevenlabs.io
2. Click **Settings (⚙️)** in Stories page
3. Paste API key
4. Click **Test API** to verify
5. Select voice from dropdown

## 📁 Project Structure

```
nextask/
├── src/
│   ├── components/      # UI components
│   │   ├── CinematicPlayer.tsx  # Fullscreen story player
│   │   └── ...
│   ├── pages/          # Main pages
│   ├── stores/         # Zustand state management
│   ├── utils/          # Utilities
│   │   ├── cinematicAudioEngine.ts  # Premium audio engine
│   │   └── storyAudioParser.ts      # Story parser
│   ├── data/           # Story data
│   │   └── kiro_ready_stories.json  # 200 Telugu stories
│   └── db/             # Dexie database
├── public/
│   └── audio/
│       └── music/      # Background music files
└── docs/               # Documentation
```

## 🎨 Tech Stack

- **React** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Dexie** - IndexedDB wrapper
- **ElevenLabs API** - Premium voice (optional)

## 📖 Documentation

All documentation is in the `docs/` folder:

- `docs/LUXURY_QUICK_START.md` - Quick start guide
- `docs/LUXURY_EDITION_COMPLETE.md` - Full feature documentation
- `docs/ELEVENLABS_SETUP.md` - ElevenLabs setup & troubleshooting
- `docs/FEATURES_VISUAL_GUIDE.md` - Visual feature guide with diagrams
- `docs/HOW_TO_ADD_MORE_STORIES.md` - Guide to add more stories
- `docs/UPGRADE_SUMMARY.md` - What changed in luxury edition

## 🔧 Build

```bash
npm run build
```

Output in `dist/` folder.

## 🎉 Key Features

### Cinematic Mode
- Fullscreen immersive UI
- Animated gradient backgrounds
- Floating particles
- Subtitle-style text
- Auto-hiding controls
- Bedtime mode
- Sleep timer (10/20/30/60 min)

### Smart Audio
- Background music plays continuously
- Music automatically lowers during narration
- Smooth fade transitions
- Independent volume controls
- Audio caching for performance

### Story Format
Stories support special markers:
- `🎵 [Soft intro music]` - Plays music
- `🎧 (pause 1s)` - Pauses for 1 second
- Regular text - Narrated by TTS or ElevenLabs

## 🐛 Troubleshooting

### ElevenLabs Not Working?
1. Click **Test API** button in Settings
2. Check browser console (F12) for errors
3. Verify API key is correct
4. Check quota at elevenlabs.io
5. See `ELEVENLABS_SETUP.md` for details

### No Sound?
- Check volume sliders
- Check browser permissions
- Check system volume

### Stories Not Loading?
- Refresh page
- Check browser console
- Verify `kiro_ready_stories.json` exists

## 📊 Story Statistics

- **Total**: 200 Telugu stories
- **Series**: Panchatantra
- **Seasons**: 5 (40 stories each)
- **Features**: Music markers, pause markers, morals

## 💡 Tips

1. Use headphones for best audio experience
2. Try bedtime mode with sleep timer
3. Test ElevenLabs API before using
4. Dim lights for immersive experience
5. Let controls auto-hide in cinematic mode

## 🎯 What's Next?

- Add more story series (Tenali Rama, Vikram Betal, etc.)
- Replace placeholder music with real tracks
- Add more ElevenLabs voices
- Implement virtual scrolling for 500+ stories
- Add PWA support for offline mode

## 📝 License

Private project

## 🙏 Credits

Built with love for Telugu storytelling! ❤️

---

**Enjoy your luxury edition!** 🎬✨
