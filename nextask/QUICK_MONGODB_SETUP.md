# ⚡ Quick MongoDB Setup (5 Minutes)

## 🎯 Goal
Enable cross-device login so your passkey works on laptop, mobile, and tablet!

---

## 📝 Step-by-Step

### 1. Create MongoDB Atlas Account (2 min)
1. Go to: https://mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create **M0 Free Cluster** (512MB, free forever)

### 2. Create Database User (1 min)
1. Click **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Username: `nextask_user`
4. Password: Click **Autogenerate Secure Password** (copy it!)
5. Privileges: **Read and write to any database**
6. Click **Add User**

### 3. Allow Network Access (30 sec)
1. Click **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

### 4. Get Connection String (1 min)
1. Click **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Add `/nextask` before the `?`:

**Example:**
```
mongodb+srv://nextask_user:MyPassword123@cluster0.abc123.mongodb.net/nextask?retryWrites=true&w=majority
```

### 5. Add to Render (30 sec)
1. Go to Render dashboard
2. Select your backend service
3. Click **Environment** tab
4. Click **Add Environment Variable**
5. Key: `MONGO_URI`
6. Value: Paste your connection string
7. Click **Save Changes**

**Render will auto-redeploy!**

---

## ✅ Test It

### After Render Redeploys:

1. **On laptop**: Open https://vnextask.netlify.app/
2. **Register**: Get passkey (e.g., `123456`)
3. **On mobile**: Open same URL
4. **Login**: Enter `123456` ✅ **IT WORKS!**

---

## 🎉 Done!

Your account now works on **all devices**! 🚀📱💻

---

## 🐛 Troubleshooting

### "Invalid passkey" on mobile
- Wait 1-2 minutes for Render to redeploy
- Check Render logs for "Connected to MongoDB"
- Verify `MONGO_URI` is set correctly

### "MongoServerError: bad auth"
- Check password in connection string
- Ensure no special characters (or URL encode them)
- Verify database user exists in Atlas

### Still using file-based storage
- Check Render environment variables
- Ensure `MONGO_URI` (not `MONGODB_URI`)
- Redeploy backend manually

---

## 📚 Need More Help?

See **MONGODB_SETUP.md** for detailed guide with screenshots and troubleshooting.

---

**Total Time: 5 minutes** ⏱️

**Result: Cross-device authentication!** 🎊
