# 🚀 Deployment Guide - NexTask Fullstack

## 📦 Project Structure

```
nextask/
├── backend/              # Node.js Express API
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   ├── .env.example     # Environment variables template
│   └── admin/           # User data (auto-created)
├── src/                 # React frontend
├── public/              # Static assets
├── dist/                # Built frontend (after build)
└── package.json         # Frontend dependencies
```

---

## 🛠️ Local Development

### 1. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

Or separately:
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Setup Environment Variables

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3001
```

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Start Development Servers

```bash
# Start both frontend and backend
npm run dev:all
```

Or separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:backend
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## 📦 Production Build

### 1. Build Frontend

```bash
npm run build
```

Output: `dist/` folder

### 2. Test Production Build

```bash
npm run preview
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Frontend + Backend)

#### Deploy as Monorepo

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Create `vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

**3. Deploy:**
```bash
vercel
```

**4. Set Environment Variables in Vercel:**
- `VITE_API_URL` = `https://your-app.vercel.app`
- `FRONTEND_URL` = `https://your-app.vercel.app`
- `NODE_ENV` = `production`

---

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend on Netlify

**1. Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`

**2. Environment Variables:**
- `VITE_API_URL` = `https://your-backend.onrender.com`

**3. Deploy:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Backend on Render

**1. Create `render.yaml`:**
```yaml
services:
  - type: web
    name: nextask-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: PORT
        value: 10000
      - key: NODE_ENV
        value: production
      - key: FRONTEND_URL
        value: https://your-frontend.netlify.app
```

**2. Deploy:**
- Connect GitHub repo to Render
- Render auto-deploys on push

---

### Option 3: Railway (Full Stack)

**1. Install Railway CLI:**
```bash
npm install -g @railway/cli
```

**2. Create `railway.json`:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run dev:all",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**3. Deploy:**
```bash
railway login
railway init
railway up
```

**4. Set Environment Variables:**
- `VITE_API_URL` = Railway backend URL
- `FRONTEND_URL` = Railway frontend URL
- `NODE_ENV` = `production`

---

### Option 4: DigitalOcean App Platform

**1. Create `.do/app.yaml`:**
```yaml
name: nextask
services:
  - name: backend
    source_dir: backend
    github:
      repo: your-username/nextask
      branch: main
    run_command: npm start
    environment_slug: node-js
    envs:
      - key: PORT
        value: "8080"
      - key: NODE_ENV
        value: production
  - name: frontend
    source_dir: /
    github:
      repo: your-username/nextask
      branch: main
    build_command: npm run build
    run_command: npm run preview
    environment_slug: node-js
```

**2. Deploy:**
- Connect GitHub repo
- DigitalOcean auto-deploys

---

### Option 5: VPS (Ubuntu Server)

#### Setup Server

**1. Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**2. Install PM2:**
```bash
sudo npm install -g pm2
```

**3. Clone Repository:**
```bash
git clone https://github.com/your-username/nextask.git
cd nextask
```

**4. Install Dependencies:**
```bash
npm run install:all
```

**5. Build Frontend:**
```bash
npm run build
```

**6. Setup Environment Variables:**
```bash
# Frontend
echo "VITE_API_URL=http://your-server-ip:3001" > .env

# Backend
echo "PORT=3001" > backend/.env
echo "NODE_ENV=production" >> backend/.env
echo "FRONTEND_URL=http://your-server-ip" >> backend/.env
```

**7. Start with PM2:**
```bash
# Start backend
pm2 start backend/server.js --name nextask-backend

# Serve frontend with nginx or serve
sudo npm install -g serve
pm2 start "serve -s dist -l 80" --name nextask-frontend

# Save PM2 config
pm2 save
pm2 startup
```

**8. Setup Nginx (Optional):**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/nextask/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001  # Development
# VITE_API_URL=https://api.yourdomain.com  # Production
```

### Backend (backend/.env)
```env
PORT=3001
NODE_ENV=development  # or production
FRONTEND_URL=http://localhost:5173  # Development
# FRONTEND_URL=https://yourdomain.com  # Production
```

---

## 📊 Admin Data in Production

### Important Notes:

1. **Data Storage:**
   - `admin/admin.json` stores user data
   - In production, use a database instead (MongoDB, PostgreSQL)
   - Current setup is for development/small scale

2. **Recommended for Production:**
   - Replace file storage with database
   - Add authentication for admin access
   - Implement proper backup system

3. **Current Limitations:**
   - File-based storage not scalable
   - No data replication
   - Manual backups needed

---

## ✅ Deployment Checklist

### Before Deployment:
- [ ] Build frontend: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Set environment variables
- [ ] Update API URLs
- [ ] Test backend API endpoints
- [ ] Check CORS settings

### After Deployment:
- [ ] Test user registration
- [ ] Test user login
- [ ] Verify admin.json is created
- [ ] Test all features
- [ ] Check browser console for errors
- [ ] Monitor server logs

---

## 🐛 Troubleshooting

### CORS Errors
**Problem:** Frontend can't connect to backend

**Solution:**
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### API Not Found
**Problem:** 404 on API calls

**Solution:**
- Check `VITE_API_URL` in frontend `.env`
- Verify backend is running
- Check API routes in `server.js`

### Build Fails
**Problem:** `npm run build` fails

**Solution:**
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

---

## 📈 Scaling Recommendations

### For Production:

1. **Database:**
   - Replace file storage with MongoDB/PostgreSQL
   - Use Prisma or TypeORM

2. **Authentication:**
   - Add JWT tokens
   - Implement refresh tokens
   - Add rate limiting

3. **File Storage:**
   - Use AWS S3 for audio files
   - CDN for static assets

4. **Monitoring:**
   - Add error tracking (Sentry)
   - Performance monitoring
   - Server logs

5. **Security:**
   - HTTPS only
   - Environment variables
   - Input validation
   - SQL injection prevention

---

## 🎉 Quick Deploy Commands

### Vercel:
```bash
vercel --prod
```

### Netlify:
```bash
netlify deploy --prod
```

### Railway:
```bash
railway up
```

### Manual VPS:
```bash
git pull
npm run install:all
npm run build
pm2 restart all
```

---

**Your fullstack app is ready to deploy!** 🚀
