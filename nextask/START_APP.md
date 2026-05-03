# 🚀 Start NexTask Fullstack App

## ✅ Prerequisites Installed
- ✅ Backend dependencies installed
- ✅ Environment files created (.env)
- ✅ Project ready to run

---

## 🎯 Quick Start (Development)

### Option 1: Start Both Frontend + Backend Together (Recommended)

```bash
cd nextask
npm run dev:all
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Option 2: Start Separately

**Terminal 1 - Frontend:**
```bash
cd nextask
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd nextask
npm run dev:backend
```

---

## 🧪 Test the App

1. **Open Browser**: http://localhost:5173
2. **Register a new user** (you'll get a 6-digit passkey)
3. **Login with the passkey**
4. **Check admin data**:
   - Open `nextask/backend/admin/admin.json` in VS Code
   - You'll see login data saved automatically

---

## 📁 Admin Data Location

User login data is automatically saved to:
```
nextask/backend/admin/admin.json
```

**Data includes:**
- Passkey
- Name
- Date of Birth
- Login times
- Browser info (User-Agent)
- IP address
- Total login count

---

## 🎵 ElevenLabs Setup (Optional)

For cinematic story narration with AI voices:

1. Get API key from: https://elevenlabs.io
2. In the app, click **Stories** → **✨ Sparkles** button
3. Click **Settings** (gear icon)
4. Enter your API key
5. Click **Test API** to verify
6. Select a voice (Adam, Sarah, Brian, Callum)
7. Enjoy AI-narrated stories!

---

## 🛠️ Available Commands

### Development
```bash
npm run dev              # Start frontend only
npm run dev:backend      # Start backend only
npm run dev:all          # Start both (recommended)
```

### Production Build
```bash
npm run build            # Build frontend
npm run preview          # Preview production build
npm run start:backend    # Start backend in production
```

### Installation
```bash
npm run install:all      # Install all dependencies
npm run build:backend    # Install backend dependencies only
```

---

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

### Backend (backend/.env)
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 📊 Features

### ✅ Completed Features
- ✅ User authentication (6-digit passkey)
- ✅ Task management with categories
- ✅ Calendar view
- ✅ Streak tracking
- ✅ Focus mode with timer
- ✅ Stopwatch
- ✅ 200+ Telugu stories (Panchatantra series)
- ✅ Cinematic story player with AI narration
- ✅ Background music and pause markers
- ✅ Admin data auto-save to disk
- ✅ Fullstack architecture (React + Express)

### 🎨 Luxury Features
- ✨ Cinematic fullscreen story player
- 🎵 Background music with smart ducking
- 🗣️ ElevenLabs AI voice narration
- ⏰ Sleep timer (10/20/30/60 minutes)
- 🌙 Bedtime mode (dims UI)
- 🎚️ Independent volume controls (voice & music)
- ✨ Floating particles animation
- 🌈 Animated gradient backgrounds

---

## 🐛 Troubleshooting

### Backend won't start
**Error**: `Cannot find module 'express'`

**Solution**:
```bash
cd nextask/backend
npm install
```

### Frontend can't connect to backend
**Error**: CORS or Network error

**Solution**:
1. Make sure backend is running on port 3001
2. Check `.env` file has `VITE_API_URL=http://localhost:3001`
3. Restart frontend: `npm run dev`

### Admin data not saving
**Solution**:
1. Check backend console for errors
2. Verify backend is running
3. Check `nextask/backend/admin/` folder exists (auto-created)

### ElevenLabs not working
**Solution**:
1. Click **Test API** button in Settings
2. Check browser console (F12) for error messages
3. Verify API key is correct
4. Check ElevenLabs account has credits

---

## 📦 Deployment

Ready to deploy? See **DEPLOYMENT.md** for:
- Vercel (monorepo)
- Netlify + Render
- Railway
- DigitalOcean
- VPS with PM2 and Nginx

---

## 🎉 You're All Set!

Run `npm run dev:all` and start using NexTask! 🚀

**Need help?** Check the docs:
- `DEPLOYMENT.md` - Deployment guide
- `PROJECT_STRUCTURE.md` - Architecture overview
- `docs/ADMIN_DATA_GUIDE.md` - Admin data details
- `docs/ELEVENLABS_SETUP.md` - AI voice setup
