# ✅ Deployment Checklist

## 🎯 Pre-Deployment Checklist

### Local Testing
- [ ] Backend starts successfully: `npm run dev:backend`
- [ ] Frontend starts successfully: `npm run dev`
- [ ] Both run together: `npm run dev:all`
- [ ] User registration works
- [ ] User login works
- [ ] Admin data saves to `backend/admin/admin.json`
- [ ] All features work (tasks, calendar, stories, etc.)
- [ ] No console errors in browser
- [ ] No errors in backend logs

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Build succeeds: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] Git repository clean (no uncommitted changes)

### Environment Variables
- [ ] `.env` created for frontend
- [ ] `backend/.env` created for backend
- [ ] `.env.example` files present
- [ ] Sensitive data not in git
- [ ] `.gitignore` includes `.env` and `admin/`

### Documentation
- [ ] README.md updated
- [ ] DEPLOYMENT.md reviewed
- [ ] START_APP.md accurate
- [ ] API endpoints documented

---

## 🚀 Deployment Steps

### Option 1: Vercel (Monorepo)

#### Prerequisites
- [ ] GitHub account
- [ ] Vercel account
- [ ] Git repository pushed to GitHub

#### Steps
1. [ ] Install Vercel CLI: `npm install -g vercel`
2. [ ] Create `vercel.json` in root (see DEPLOYMENT.md)
3. [ ] Run `vercel` in terminal
4. [ ] Follow prompts to link project
5. [ ] Set environment variables in Vercel dashboard:
   - [ ] `VITE_API_URL` = `https://your-app.vercel.app`
   - [ ] `FRONTEND_URL` = `https://your-app.vercel.app`
   - [ ] `NODE_ENV` = `production`
6. [ ] Deploy: `vercel --prod`
7. [ ] Test deployed app
8. [ ] Verify admin data saves

#### Post-Deployment
- [ ] Test user registration
- [ ] Test user login
- [ ] Test all features
- [ ] Check browser console for errors
- [ ] Monitor Vercel logs

---

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend on Netlify

**Prerequisites**
- [ ] Netlify account
- [ ] Git repository on GitHub

**Steps**
1. [ ] Connect GitHub repo to Netlify
2. [ ] Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. [ ] Set environment variables:
   - [ ] `VITE_API_URL` = `https://your-backend.onrender.com`
4. [ ] Deploy
5. [ ] Note frontend URL

#### Backend on Render

**Prerequisites**
- [ ] Render account
- [ ] Git repository on GitHub

**Steps**
1. [ ] Create new Web Service on Render
2. [ ] Connect GitHub repo
3. [ ] Set build settings:
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`
4. [ ] Set environment variables:
   - [ ] `PORT` = `10000`
   - [ ] `NODE_ENV` = `production`
   - [ ] `FRONTEND_URL` = `https://your-app.netlify.app`
5. [ ] Deploy
6. [ ] Note backend URL

#### Update Frontend
1. [ ] Update `VITE_API_URL` in Netlify to Render backend URL
2. [ ] Redeploy frontend

#### Post-Deployment
- [ ] Test user registration
- [ ] Test user login
- [ ] Verify admin data saves on Render
- [ ] Check CORS works
- [ ] Monitor logs on both platforms

---

### Option 3: Railway (Full Stack)

#### Prerequisites
- [ ] Railway account
- [ ] Git repository on GitHub

#### Steps
1. [ ] Install Railway CLI: `npm install -g @railway/cli`
2. [ ] Login: `railway login`
3. [ ] Initialize: `railway init`
4. [ ] Link GitHub repo
5. [ ] Set environment variables:
   - [ ] `VITE_API_URL` = Railway backend URL
   - [ ] `FRONTEND_URL` = Railway frontend URL
   - [ ] `NODE_ENV` = `production`
6. [ ] Deploy: `railway up`
7. [ ] Railway auto-detects Node.js and builds

#### Post-Deployment
- [ ] Test deployed app
- [ ] Verify admin data saves
- [ ] Check Railway logs
- [ ] Monitor resource usage

---

### Option 4: DigitalOcean App Platform

#### Prerequisites
- [ ] DigitalOcean account
- [ ] Git repository on GitHub

#### Steps
1. [ ] Create new App on DigitalOcean
2. [ ] Connect GitHub repo
3. [ ] Configure components:
   - [ ] Frontend: Node.js, build command `npm run build`
   - [ ] Backend: Node.js, run command `npm run start:backend`
4. [ ] Set environment variables for each component
5. [ ] Deploy
6. [ ] Note URLs

#### Post-Deployment
- [ ] Test deployed app
- [ ] Verify admin data saves
- [ ] Check DigitalOcean logs
- [ ] Monitor costs

---

### Option 5: VPS (Ubuntu Server)

#### Prerequisites
- [ ] VPS with Ubuntu (DigitalOcean, Linode, AWS EC2, etc.)
- [ ] SSH access
- [ ] Domain name (optional)

#### Server Setup
1. [ ] SSH into server: `ssh user@your-server-ip`
2. [ ] Update system: `sudo apt update && sudo apt upgrade -y`
3. [ ] Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. [ ] Install PM2: `sudo npm install -g pm2`
5. [ ] Install Nginx: `sudo apt install nginx -y`
6. [ ] Install Git: `sudo apt install git -y`

#### Deploy Application
1. [ ] Clone repository:
   ```bash
   cd /var/www
   sudo git clone https://github.com/your-username/nextask.git
   cd nextask
   ```
2. [ ] Install dependencies: `sudo npm run install:all`
3. [ ] Create `.env` files:
   ```bash
   echo "VITE_API_URL=http://your-server-ip:3001" > .env
   echo "PORT=3001" > backend/.env
   echo "NODE_ENV=production" >> backend/.env
   echo "FRONTEND_URL=http://your-server-ip" >> backend/.env
   ```
4. [ ] Build frontend: `sudo npm run build`
5. [ ] Start backend with PM2:
   ```bash
   cd backend
   pm2 start server.js --name nextask-backend
   pm2 save
   pm2 startup
   ```

#### Configure Nginx
1. [ ] Create Nginx config:
   ```bash
   sudo nano /etc/nginx/sites-available/nextask
   ```
2. [ ] Add configuration (see DEPLOYMENT.md)
3. [ ] Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/nextask /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### Setup SSL (Optional)
1. [ ] Install Certbot: `sudo apt install certbot python3-certbot-nginx -y`
2. [ ] Get certificate: `sudo certbot --nginx -d your-domain.com`
3. [ ] Auto-renewal: `sudo certbot renew --dry-run`

#### Post-Deployment
- [ ] Test app at `http://your-server-ip` or `https://your-domain.com`
- [ ] Verify admin data saves
- [ ] Check PM2 logs: `pm2 logs nextask-backend`
- [ ] Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- [ ] Setup monitoring

---

## 🔒 Security Checklist

### Environment Variables
- [ ] No hardcoded API keys
- [ ] No sensitive data in git
- [ ] `.env` files in `.gitignore`
- [ ] Production URLs set correctly

### CORS
- [ ] CORS origin set to frontend URL only
- [ ] No wildcard (`*`) in production
- [ ] Credentials enabled if needed

### HTTPS
- [ ] SSL certificate installed (production)
- [ ] HTTP redirects to HTTPS
- [ ] Secure cookies (if using)

### Admin Data
- [ ] `admin/` folder in `.gitignore`
- [ ] File permissions set correctly (VPS)
- [ ] Regular backups configured

---

## 📊 Post-Deployment Testing

### Functional Testing
- [ ] User registration works
- [ ] User login works
- [ ] Tasks can be created
- [ ] Tasks can be completed
- [ ] Streak updates correctly
- [ ] Calendar displays tasks
- [ ] Focus mode timer works
- [ ] Stopwatch works
- [ ] Stories load and play
- [ ] Cinematic player works
- [ ] ElevenLabs integration works (if API key set)

### Data Persistence
- [ ] Login data saves to admin.json
- [ ] User data persists in IndexedDB
- [ ] Tasks persist after refresh
- [ ] Streak persists after refresh

### Performance
- [ ] Page load time < 3 seconds
- [ ] No console errors
- [ ] No network errors
- [ ] Smooth animations
- [ ] Audio plays without lag

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Mobile Testing
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Mobile navigation works

---

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
**Problem:** Frontend can't connect to backend

**Solutions:**
- [ ] Check `FRONTEND_URL` in backend `.env`
- [ ] Verify CORS origin in `server.js`
- [ ] Ensure both URLs use same protocol (http/https)

#### API Not Found (404)
**Problem:** API endpoints return 404

**Solutions:**
- [ ] Check `VITE_API_URL` in frontend `.env`
- [ ] Verify backend is running
- [ ] Check API routes in `server.js`
- [ ] Check deployment platform routing

#### Build Fails
**Problem:** `npm run build` fails

**Solutions:**
- [ ] Clear cache: `rm -rf node_modules dist`
- [ ] Reinstall: `npm install`
- [ ] Check TypeScript errors
- [ ] Check ESLint errors

#### Admin Data Not Saving
**Problem:** Login data not in admin.json

**Solutions:**
- [ ] Check backend is running
- [ ] Verify API endpoint is called (Network tab)
- [ ] Check backend logs for errors
- [ ] Verify file permissions (VPS)

---

## 📈 Monitoring

### Logs to Monitor
- [ ] Backend server logs
- [ ] Frontend console errors
- [ ] API response times
- [ ] Error rates
- [ ] User activity

### Tools to Use
- [ ] Vercel Analytics (if using Vercel)
- [ ] Netlify Analytics (if using Netlify)
- [ ] PM2 monitoring (if using VPS)
- [ ] Browser DevTools
- [ ] Server logs

---

## 🎉 Success Criteria

### Deployment Successful When:
- ✅ App is accessible via public URL
- ✅ User registration works
- ✅ User login works
- ✅ Admin data saves correctly
- ✅ All features work as expected
- ✅ No console errors
- ✅ No server errors
- ✅ Performance is acceptable
- ✅ Mobile responsive
- ✅ HTTPS enabled (production)

---

## 📚 Next Steps After Deployment

### Immediate
1. [ ] Share app URL with users
2. [ ] Monitor logs for errors
3. [ ] Test all features thoroughly
4. [ ] Setup error tracking (Sentry)

### Short Term
1. [ ] Setup automated backups
2. [ ] Configure monitoring alerts
3. [ ] Add analytics (Google Analytics, Plausible)
4. [ ] Document API for future reference

### Long Term
1. [ ] Migrate to database (MongoDB/PostgreSQL)
2. [ ] Add authentication (JWT)
3. [ ] Implement rate limiting
4. [ ] Add caching layer (Redis)
5. [ ] Setup CI/CD pipeline
6. [ ] Add automated tests

---

## 🎊 Congratulations!

Once all checkboxes are complete, your NexTask app is successfully deployed! 🚀

**Need help?** Refer to `DEPLOYMENT.md` for detailed guides.
