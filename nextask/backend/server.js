// Simple Express server to save user data to admin.json
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Admin data folder
const ADMIN_FOLDER = path.join(__dirname, 'admin');
const ADMIN_FILE = path.join(ADMIN_FOLDER, 'admin.json');

// Ensure admin folder exists
async function ensureAdminFolder() {
  try {
    await fs.mkdir(ADMIN_FOLDER, { recursive: true });
  } catch (error) {
    console.error('Error creating admin folder:', error);
  }
}

// Save user data
app.post('/api/save-user-data', async (req, res) => {
  try {
    const data = req.body;
    
    // Add timestamp and request info
    const loginRecord = {
      passkey: data.passkey,
      name: data.name,
      dob: data.dob,
      accountCreated: data.createdAt,
      lastLogin: data.lastLogin,
      lastLoginFormatted: new Date(data.lastLogin).toLocaleString(),
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString(),
    };
    
    // Read existing data
    let existingData = { 
      users: [], 
      loginHistory: [],
      totalLogins: 0,
      lastUpdated: null
    };
    
    try {
      const fileContent = await fs.readFile(ADMIN_FILE, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet, use empty data
    }
    
    // Update or add user
    const userIndex = existingData.users.findIndex(u => u.passkey === data.passkey);
    
    if (userIndex >= 0) {
      // Update existing user
      existingData.users[userIndex] = {
        ...existingData.users[userIndex],
        name: data.name,
        lastLogin: data.lastLogin,
        lastLoginFormatted: new Date(data.lastLogin).toLocaleString(),
        totalLogins: (existingData.users[userIndex].totalLogins || 0) + 1,
        lastUserAgent: req.headers['user-agent'],
        lastIpAddress: req.ip || req.connection.remoteAddress,
      };
    } else {
      // Add new user
      existingData.users.push({
        passkey: data.passkey,
        name: data.name,
        dob: data.dob,
        accountCreated: data.createdAt,
        accountCreatedFormatted: new Date(data.createdAt).toLocaleString(),
        lastLogin: data.lastLogin,
        lastLoginFormatted: new Date(data.lastLogin).toLocaleString(),
        totalLogins: 1,
        lastUserAgent: req.headers['user-agent'],
        lastIpAddress: req.ip || req.connection.remoteAddress,
      });
    }
    
    // Add to login history
    existingData.loginHistory.push({
      passkey: data.passkey,
      name: data.name,
      loginTime: data.lastLogin,
      loginTimeFormatted: new Date(data.lastLogin).toLocaleString(),
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.connection.remoteAddress,
    });
    
    // Update totals
    existingData.totalLogins = (existingData.totalLogins || 0) + 1;
    existingData.lastUpdated = new Date().toISOString();
    
    // Keep only last 500 login records
    if (existingData.loginHistory.length > 500) {
      existingData.loginHistory = existingData.loginHistory.slice(-500);
    }
    
    // Save to file
    await fs.writeFile(ADMIN_FILE, JSON.stringify(existingData, null, 2));
    
    console.log(`✅ Login saved: ${data.name} (${data.passkey}) at ${new Date(data.lastLogin).toLocaleString()}`);
    
    res.json({ success: true, message: 'User data saved' });
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save task data
app.post('/api/save-task-data', async (req, res) => {
  try {
    const { passkey, tasks } = req.body;
    
    // Read existing data
    let existingData = { users: [], loginHistory: [] };
    try {
      const fileContent = await fs.readFile(ADMIN_FILE, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet
    }
    
    // Update user's task count
    const userIndex = existingData.users.findIndex(u => u.passkey === passkey);
    if (userIndex >= 0) {
      existingData.users[userIndex].totalTasks = tasks.length;
      existingData.users[userIndex].completedTasks = tasks.filter(t => t.status === 'completed').length;
      existingData.users[userIndex].lastTaskUpdate = new Date().toISOString();
    }
    
    // Save to file
    await fs.writeFile(ADMIN_FILE, JSON.stringify(existingData, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving task data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get admin data (for viewing in Kiro)
app.get('/api/admin-data', async (req, res) => {
  try {
    const fileContent = await fs.readFile(ADMIN_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    res.json(data);
  } catch (error) {
    res.json({ users: [], loginHistory: [] });
  }
});

// Start server
ensureAdminFolder().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ NexTask Backend Server`);
    console.log(`📡 Running on http://localhost:${PORT}`);
    console.log(`🌐 Accepting requests from: ${FRONTEND_URL}`);
    console.log(`📁 Admin data: ${ADMIN_FILE}`);
    console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});
