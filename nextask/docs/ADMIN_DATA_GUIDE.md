# 📁 Admin Data Storage Guide

## 🎯 Overview

User login data is automatically saved to `admin/admin.json` file on your disk. You can view this file directly in VS Code/Kiro.

---

## 🚀 Setup

### 1. Install Dependencies
```bash
cd nextask
npm install
```

This installs:
- `express` - Web server
- `cors` - Allow frontend to connect
- `concurrently` - Run multiple commands

### 2. Start Both Servers
```bash
npm run dev:all
```

This starts:
- ✅ Frontend (Vite) on `http://localhost:5173`
- ✅ Backend (Express) on `http://localhost:3001`

**Or start separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

---

## 📊 How It Works

### Automatic Data Saving

1. **User logs in** → Frontend sends data to backend
2. **Backend saves** to `admin/admin.json`
3. **You view file** in VS Code/Kiro anytime

## 📊 What Gets Saved

**On Every Login:**
- User passkey
- User name
- Date of birth
- Account created date
- Last login time (formatted)
- Total login count
- Browser info (User-Agent)
- IP address
- Timestamp

**Login History:**
- Every login is recorded
- Last 500 logins kept
- Full details for each login
- Browser and IP info

---

## 📁 File Location

```
nextask/
└── admin/
    └── admin.json    ← User data saved here
```

**This folder is in `.gitignore`** - won't be committed to Git!

---

## 📄 File Format

### admin.json Structure

```json
{
  "users": [
    {
      "passkey": "123456",
      "name": "John Doe",
      "dob": "1990-01-15",
      "accountCreated": "2026-04-01T08:00:00.000Z",
      "accountCreatedFormatted": "4/1/2026, 8:00:00 AM",
      "lastLogin": "2026-05-03T09:15:00.000Z",
      "lastLoginFormatted": "5/3/2026, 9:15:00 AM",
      "totalLogins": 25,
      "lastUserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "lastIpAddress": "::1",
      "totalTasks": 15,
      "completedTasks": 8,
      "lastTaskUpdate": "2026-05-03T10:00:00.000Z"
    }
  ],
  "loginHistory": [
    {
      "passkey": "123456",
      "name": "John Doe",
      "loginTime": "2026-05-03T09:15:00.000Z",
      "loginTimeFormatted": "5/3/2026, 9:15:00 AM",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "ipAddress": "::1"
    },
    {
      "passkey": "123456",
      "name": "John Doe",
      "loginTime": "2026-05-02T14:30:00.000Z",
      "loginTimeFormatted": "5/2/2026, 2:30:00 PM",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "ipAddress": "::1"
    }
  ],
  "totalLogins": 25,
  "lastUpdated": "2026-05-03T09:15:30.000Z"
}
```

---

## 🔍 View Data in Kiro/VS Code

### Method 1: Open File Directly
1. Open VS Code/Kiro
2. Navigate to `nextask/admin/admin.json`
3. View formatted JSON

### Method 2: Use Kiro Search
1. Press `Ctrl+P` (Quick Open)
2. Type `admin.json`
3. Open file

### Method 3: File Explorer
1. Open file explorer in VS Code
2. Expand `nextask` folder
3. Expand `admin` folder
4. Click `admin.json`

---

## 📊 Data Fields Explained

### User Object
| Field | Description | Example |
|-------|-------------|---------|
| passkey | 6-digit login code | "123456" |
| name | User's name | "John Doe" |
| dob | Date of birth | "1990-01-15" |
| accountCreated | When registered | "2026-04-01T08:00:00.000Z" |
| lastLogin | Last login timestamp | "2026-05-03T09:15:00.000Z" |
| lastLoginFormatted | Readable format | "5/3/2026, 9:15:00 AM" |
| totalLogins | Number of logins | 25 |
| lastUserAgent | Browser info | "Mozilla/5.0..." |
| lastIpAddress | IP address | "::1" or "192.168.1.1" |
| totalTasks | Number of tasks | 15 |
| completedTasks | Completed tasks | 8 |
| lastTaskUpdate | Last task change | "2026-05-03T10:00:00.000Z" |

### Login History Object
| Field | Description | Example |
|-------|-------------|---------|
| passkey | User's passkey | "123456" |
| name | User's name | "John Doe" |
| loginTime | Login timestamp | "2026-05-03T09:15:00.000Z" |
| loginTimeFormatted | Readable format | "5/3/2026, 9:15:00 AM" |
| userAgent | Browser info | "Mozilla/5.0..." |
| ipAddress | IP address | "::1" or "192.168.1.1" |

---

## 🔄 Data Updates

### When Data is Saved

1. **User logs in** → Immediately saved
2. **User creates account** → Saved on first login
3. **User completes task** → Task count updated

### Update Frequency

- **Login data**: Every login
- **Task data**: When tasks change
- **History**: Last 100 logins kept

---

## 🛠️ Troubleshooting

### File Not Created?

**Check:**
1. Is backend server running? (`npm run server`)
2. Check console for errors
3. Try logging in again

**Solution:**
```bash
# Restart backend
npm run server
```

### Can't Connect to Server?

**Error**: `Failed to fetch`

**Solution:**
1. Make sure backend is running on port 3001
2. Check if port is already in use
3. Restart both servers

### Data Not Updating?

**Check:**
1. Backend server logs
2. Browser console for errors
3. File permissions

**Solution:**
```bash
# Stop all servers
Ctrl+C

# Restart
npm run dev:all
```

---

## 🔐 Security

### What's Protected

✅ **File in .gitignore** - Won't be committed
✅ **Local only** - Data stays on your machine
✅ **No cloud** - Never sent to external servers

### What to Know

⚠️ **File is plain text** - Anyone with disk access can read
⚠️ **No encryption** - Data stored as-is
⚠️ **Local server** - Only accessible from localhost

### Recommendations

1. Don't share `admin/` folder
2. Don't commit to Git (already in .gitignore)
3. Backup file regularly
4. Keep server running only when needed

---

## 📈 Use Cases

### 1. Monitor User Activity
```bash
# Open admin.json in VS Code
# See who logged in and when
```

### 2. Track Login Patterns
```json
// Check loginHistory array
// See login times and frequency
```

### 3. User Analytics
```json
// Count total users
// See active vs inactive
// Track task completion
```

### 4. Backup User Data
```bash
# Copy admin.json to backup location
cp admin/admin.json backups/admin-2026-05-03.json
```

---

## 🎯 Quick Commands

### Start Everything
```bash
npm run dev:all
```

### View Data
```bash
# Windows
notepad admin/admin.json

# Mac/Linux
cat admin/admin.json
```

### Backup Data
```bash
# Create backup
cp admin/admin.json admin/backup-$(date +%Y-%m-%d).json
```

### Clear Data
```bash
# Delete file (will be recreated on next login)
rm admin/admin.json
```

---

## 📊 Example Queries

### Find User by Passkey
```javascript
const user = data.users.find(u => u.passkey === "123456");
```

### Get Recent Logins
```javascript
const recent = data.loginHistory.slice(-10); // Last 10 logins
```

### Count Active Users Today
```javascript
const today = new Date().toDateString();
const activeToday = data.loginHistory.filter(login => {
  return new Date(login.loginTime).toDateString() === today;
}).length;
```

---

## ✅ Checklist

Setup:
- [ ] Run `npm install`
- [ ] Start backend: `npm run server`
- [ ] Start frontend: `npm run dev`
- [ ] Login to app
- [ ] Check `admin/admin.json` exists

Verify:
- [ ] File has user data
- [ ] Login history is populated
- [ ] Timestamps are correct
- [ ] File updates on new login

---

## 🎉 You're Ready!

Now every time someone logs in:
- ✅ Data automatically saved to `admin/admin.json`
- ✅ You can view it anytime in VS Code/Kiro
- ✅ Login history tracked
- ✅ No manual export needed

**Just open the file and see all login data!** 📊✨
