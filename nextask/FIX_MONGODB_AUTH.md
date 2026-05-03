# 🔧 Fix MongoDB Authentication Error

## ❌ Current Error
```
bad auth : authentication failed
```

This means the password in your connection string is incorrect.

---

## ✅ Solution: Reset MongoDB Password

### Step 1: Go to MongoDB Atlas
1. Open https://cloud.mongodb.com/
2. Login to your account

### Step 2: Reset Password
1. Click **Database Access** (left sidebar)
2. Find user `sai_janumuri`
3. Click **Edit** button (pencil icon)
4. Click **Edit Password**
5. Choose one:
   - **Option A**: Click **Autogenerate Secure Password** (recommended)
   - **Option B**: Enter a simple password like `MyPassword123` (no special characters)
6. **COPY THE PASSWORD** (you'll need it!)
7. Click **Update User**

### Step 3: Update Connection String

**If your new password is:** `MyPassword123`

**Your connection string should be:**
```
mongodb+srv://sai_janumuri:MyPassword123@mycluster.krlqmjm.mongodb.net/nextask?appName=myCluster
```

**If your password has special characters**, URL encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `/` → `%2F`
- `:` → `%3A`
- `=` → `%3D`
- `?` → `%3F`

**Example:** Password `Srk@123` becomes `Srk%40123`

---

## 🧪 Test Locally

### 1. Update `nextask/backend/.env`
```env
MONGO_URI=mongodb+srv://sai_janumuri:YOUR_NEW_PASSWORD@mycluster.krlqmjm.mongodb.net/nextask?appName=myCluster
```

### 2. Test Connection
```bash
cd nextask/backend
node test-mongo.js
```

You should see:
```
✅ SUCCESS! Connected to MongoDB
```

---

## 🚀 Update Render

Once local test works:

1. Go to Render dashboard
2. Select your backend service
3. Click **Environment** tab
4. Delete old `MONGO_URI` variable (trash icon)
5. Click **Add Environment Variable**
6. Key: `MONGO_URI`
7. Value: `mongodb+srv://sai_janumuri:YOUR_NEW_PASSWORD@mycluster.krlqmjm.mongodb.net/nextask?appName=myCluster`
8. Click **Save Changes**

Render will auto-redeploy.

---

## ✅ Verify Network Access

While you're in MongoDB Atlas:

1. Click **Network Access** (left sidebar)
2. Check if `0.0.0.0/0` is in the list
3. If not:
   - Click **Add IP Address**
   - Click **Allow Access from Anywhere**
   - Click **Confirm**

---

## 🎯 Checklist

- [ ] Reset password in MongoDB Atlas
- [ ] Copy new password
- [ ] Update `backend/.env` with new password
- [ ] Test locally: `node test-mongo.js`
- [ ] See "✅ SUCCESS!" message
- [ ] Update `MONGO_URI` in Render
- [ ] Wait for Render to redeploy
- [ ] Check Render logs for "✅ Connected to MongoDB"

---

## 💡 Recommended: Use Simple Password

For easier setup, use a simple password without special characters:

**Good passwords:**
- `MyPassword123`
- `NextaskDB2024`
- `SecurePass456`

**Avoid:**
- `Srk@vijju1122` (has `@`)
- `Pass#word!` (has `#` and `!`)
- `My$ecret` (has `$`)

---

## 🐛 Still Not Working?

### Check Database User
1. Go to **Database Access**
2. Verify `sai_janumuri` exists
3. Check "Built-in Role" is **Read and write to any database**

### Check Cluster Status
1. Go to **Database**
2. Verify cluster shows "Active" (not paused)

### Try Creating New User
1. Go to **Database Access**
2. Click **Add New Database User**
3. Username: `nextask_admin`
4. Password: `SimplePass123` (no special chars)
5. Privileges: **Read and write to any database**
6. Click **Add User**
7. Use this in connection string:
   ```
   mongodb+srv://nextask_admin:SimplePass123@mycluster.krlqmjm.mongodb.net/nextask?appName=myCluster
   ```

---

**Once you reset the password and test locally, let me know and I'll help you deploy!** 🚀
