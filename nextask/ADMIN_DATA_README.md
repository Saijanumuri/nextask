# 📊 Admin Data - Auto-Save to Disk

## ✅ What Happens

Every time someone logs in through the website:
- ✅ Data automatically saved to `admin/admin.json`
- ✅ No UI panel needed
- ✅ Just open the file in VS Code/Kiro to view

---

## 🚀 Quick Start

```bash
# Start both servers
npm run dev:all
```

This starts:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001 (saves data)

---

## 📁 Where is Data Saved?

```
nextask/
└── admin/
    └── admin.json  ← All login data here
```

**This folder is in `.gitignore`** - won't be committed!

---

## 📊 What Gets Saved

### User Data:
- Passkey
- Name
- Date of birth
- Account created date
- Last login time
- Total login count
- Browser info
- IP address

### Login History:
- Every login recorded
- Last 500 logins kept
- Full details for each

---

## 🔍 View Data

### In VS Code/Kiro:
1. Open `nextask/admin/admin.json`
2. See all login data
3. File updates automatically

### Example Data:
```json
{
  "users": [
    {
      "passkey": "123456",
      "name": "John Doe",
      "lastLogin": "2026-05-03T09:15:00.000Z",
      "lastLoginFormatted": "5/3/2026, 9:15:00 AM",
      "totalLogins": 25,
      "lastUserAgent": "Mozilla/5.0...",
      "lastIpAddress": "::1"
    }
  ],
  "loginHistory": [
    {
      "passkey": "123456",
      "name": "John Doe",
      "loginTime": "2026-05-03T09:15:00.000Z",
      "loginTimeFormatted": "5/3/2026, 9:15:00 AM",
      "userAgent": "Mozilla/5.0...",
      "ipAddress": "::1"
    }
  ],
  "totalLogins": 25,
  "lastUpdated": "2026-05-03T09:15:30.000Z"
}
```

---

## ✅ Features

- ✅ **Auto-save** - No manual export
- ✅ **Complete data** - All login details
- ✅ **Browser info** - User-Agent tracked
- ✅ **IP address** - Connection info
- ✅ **Login count** - Total logins per user
- ✅ **History** - Last 500 logins
- ✅ **Timestamps** - Formatted dates
- ✅ **Git ignored** - Won't be committed

---

## 📖 Full Documentation

See `docs/ADMIN_DATA_GUIDE.md` for complete guide.

---

**That's it!** Login data automatically saves to `admin/admin.json` - just open it in VS Code! 📊✨
