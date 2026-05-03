# 🗄️ MongoDB Setup Guide

## ✅ What Changed

Your app now uses **backend authentication** with MongoDB, so your account works across all devices!

### Before
- ❌ Each device had separate accounts (IndexedDB only)
- ❌ Passkey only worked on the device where you registered

### After
- ✅ One account works on all devices
- ✅ Login from laptop, mobile, tablet - same account
- ✅ Backend validates authentication
- ✅ Fallback to local storage if backend is offline

---

## 🚀 Quick Setup (MongoDB Atlas - Free)

### Step 1: Create MongoDB Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free
3. Create a **Free M0 Cluster** (512MB storage, free forever)

### Step 2: Create Database User

1. In Atlas dashboard, click **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `nextask_user`
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

### Step 3: Whitelist IP Address

1. Click **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
   - Or add your specific IP for production
4. Click **Confirm**

### Step 4: Get Connection String

1. Click **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string:
   ```
   mongodb+srv://nextask_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `nextask`
   ```
   mongodb+srv://nextask_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/nextask?retryWrites=true&w=majority
   ```

### Step 5: Update Backend Environment

**Local Development** (`nextask/backend/.env`):
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb+srv://nextask_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/nextask?retryWrites=true&w=majority
```

**Production (Render)** - Add environment variable:
- Key: `MONGO_URI`
- Value: `mongodb+srv://nextask_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/nextask?retryWrites=true&w=majority`

---

## 🧪 Test It

### 1. Start Backend
```bash
cd nextask/backend
npm start
```

You should see:
```
✅ NexTask Backend Server
📡 Running on http://localhost:3001
💾 Database: MongoDB
✅ Connected to MongoDB
```

### 2. Start Frontend
```bash
cd nextask
npm run dev
```

### 3. Register a New User
1. Open http://localhost:5173
2. Click **Register**
3. Enter name and DOB
4. Get your passkey (e.g., `123456`)
5. Save it!

### 4. Test Cross-Device Login

**On your laptop:**
1. Login with passkey ✅

**On your mobile:**
1. Open the same URL
2. Login with the SAME passkey ✅
3. It works! 🎉

---

## 🔄 How It Works

### Registration Flow
```
1. User enters name + DOB
   ↓
2. Frontend generates 6-digit passkey
   ↓
3. Frontend checks uniqueness with backend
   ↓
4. Backend saves to MongoDB
   ↓
5. Frontend also saves to IndexedDB (offline access)
   ↓
6. User gets passkey
```

### Login Flow
```
1. User enters passkey
   ↓
2. Frontend sends to backend API
   ↓
3. Backend checks MongoDB
   ↓
4. If valid:
   ├── Backend returns user data
   ├── Frontend saves to IndexedDB
   └── User is logged in ✅
   ↓
5. If backend offline:
   └── Frontend checks IndexedDB (offline mode)
```

---

## 🌐 Production Deployment

### Update Render Environment Variables

1. Go to Render dashboard
2. Select your backend service
3. Go to **Environment**
4. Add variable:
   - **Key**: `MONGO_URI`
   - **Value**: Your MongoDB connection string
5. Click **Save Changes**
6. Render will auto-redeploy

### Update Netlify (if needed)

Your frontend already has `VITE_API_URL` pointing to your Render backend, so no changes needed!

---

## 📊 Database Structure

### Users Collection
```javascript
{
  _id: ObjectId("..."),
  passkey: "123456",
  name: "John Doe",
  dob: "1990-01-01",
  createdAt: "2026-05-03T10:00:00.000Z",
  lastLogin: "2026-05-03T15:30:00.000Z",
  totalLogins: 5
}
```

### Indexes
- `passkey` (unique) - Fast login lookups

---

## 🔒 Security Features

### ✅ Implemented
- Unique passkey validation
- CORS protection
- Environment variables for secrets
- MongoDB connection encryption (SSL/TLS)
- IP whitelisting (MongoDB Atlas)

### 🔮 Future Enhancements
- Password hashing (bcrypt)
- JWT tokens
- Rate limiting
- Session management
- Password reset

---

## 🐛 Troubleshooting

### "Backend shows "No MONGO_URI found"
**Solution**: Add `MONGO_URI` to `backend/.env`

### "MongoServerError: bad auth"
**Solution**: 
1. Check username and password in connection string
2. Verify database user exists in Atlas
3. Ensure password doesn't contain special characters (URL encode if needed)

### "MongoNetworkError: connection refused"
**Solution**:
1. Check IP whitelist in MongoDB Atlas
2. Add `0.0.0.0/0` to allow all IPs (development)
3. Check firewall settings

### Backend works but login fails
**Solution**:
1. Check browser console for errors
2. Verify `VITE_API_URL` in frontend `.env`
3. Check CORS settings in backend
4. Verify backend is running

### "Fallback to file-based storage"
**Solution**: This is OK! Backend works without MongoDB, just uses local files instead. Add MongoDB URI to enable cross-device login.

---

## 💡 Without MongoDB (Fallback Mode)

If you don't set up MongoDB, the backend will:
- ✅ Still work
- ✅ Use file-based storage (`admin.json`)
- ❌ Won't sync across devices
- ❌ Each device needs separate registration

**This is fine for single-device use!**

---

## 🎯 Summary

### With MongoDB (Recommended)
- ✅ One account works everywhere
- ✅ Login from any device
- ✅ Scalable
- ✅ Production-ready

### Without MongoDB (Fallback)
- ✅ Still works
- ✅ File-based storage
- ❌ No cross-device sync
- ⚠️ Not recommended for production

---

## 📚 Next Steps

1. ✅ Set up MongoDB Atlas (free)
2. ✅ Add `MONGODB_URI` to backend `.env`
3. ✅ Test locally
4. ✅ Add `MONGODB_URI` to Render
5. ✅ Deploy and test on production
6. ✅ Login from multiple devices!

---

**Your app now supports cross-device authentication!** 🎉🚀
