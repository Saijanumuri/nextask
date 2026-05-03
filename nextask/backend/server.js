// NexTask Backend with Mongoose Authentication
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Admin data folder (for logging)
const ADMIN_FOLDER = path.join(__dirname, 'admin');
const ADMIN_FILE = path.join(ADMIN_FOLDER, 'admin.json');

// User Schema
const userSchema = new mongoose.Schema({
  passkey: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  totalLogins: {
    type: Number,
    default: 1
  }
});

const User = mongoose.model('User', userSchema);

// In-memory user storage (fallback if no MongoDB)
let users = [];
let useMongoose = false;

// MongoDB connection with Mongoose
async function connectMongoDB() {
  if (!MONGO_URI) {
    console.log('⚠️  No MONGO_URI found, using file-based storage');
    await loadUsersFromFile();
    return;
  }

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 Connection string (masked):', MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    useMongoose = true;
    console.log('✅ Connected to MongoDB with Mongoose');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('🔍 Error details:', error.name);
    if (error.reason) {
      console.error('🔍 Reason:', error.reason);
    }
    console.log('⚠️  Falling back to file-based storage');
    await loadUsersFromFile();
  }
}

// Load users from file (fallback)
async function loadUsersFromFile() {
  try {
    await fs.mkdir(ADMIN_FOLDER, { recursive: true });
    const fileContent = await fs.readFile(ADMIN_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    users = data.users || [];
    console.log(`📁 Loaded ${users.length} users from file`);
  } catch (error) {
    users = [];
    console.log('📁 No existing user file, starting fresh');
  }
}

// Save users to file (fallback)
async function saveUsersToFile() {
  try {
    await fs.mkdir(ADMIN_FOLDER, { recursive: true });
    let existingData = { users: [], loginHistory: [] };
    
    try {
      const fileContent = await fs.readFile(ADMIN_FILE, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist
    }
    
    existingData.users = users;
    existingData.lastUpdated = new Date().toISOString();
    
    await fs.writeFile(ADMIN_FILE, JSON.stringify(existingData, null, 2));
  } catch (error) {
    console.error('Error saving users to file:', error);
  }
}

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, dob, passkey } = req.body;
    
    if (!name || !dob || !passkey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, DOB, and passkey are required' 
      });
    }
    
    // Check if passkey already exists
    let existingUser;
    if (useMongoose) {
      existingUser = await User.findOne({ passkey });
    } else {
      existingUser = users.find(u => u.passkey === passkey);
    }
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Passkey already exists' 
      });
    }
    
    // Create new user
    let newUser;
    if (useMongoose) {
      newUser = await User.create({
        passkey,
        name,
        dob,
        createdAt: new Date(),
        lastLogin: new Date(),
        totalLogins: 1
      });
    } else {
      newUser = {
        passkey,
        name,
        dob,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalLogins: 1
      };
      users.push(newUser);
      await saveUsersToFile();
    }
    
    console.log(`✅ User registered: ${name} (${passkey})`);
    
    // Log to admin file
    await logLoginActivity(newUser, req, 'register');
    
    res.json({ 
      success: true, 
      user: {
        passkey: newUser.passkey,
        name: newUser.name,
        dob: newUser.dob,
        createdAt: newUser.createdAt,
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { passkey } = req.body;
    
    if (!passkey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Passkey is required' 
      });
    }
    
    // Find user
    let user;
    if (useMongoose) {
      user = await User.findOne({ passkey });
      
      if (user) {
        // Update last login
        user.lastLogin = new Date();
        user.totalLogins = (user.totalLogins || 0) + 1;
        await user.save();
      }
    } else {
      const userIndex = users.findIndex(u => u.passkey === passkey);
      
      if (userIndex >= 0) {
        users[userIndex].lastLogin = new Date().toISOString();
        users[userIndex].totalLogins = (users[userIndex].totalLogins || 0) + 1;
        await saveUsersToFile();
        user = users[userIndex];
      }
    }
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid passkey' 
      });
    }
    
    console.log(`✅ User logged in: ${user.name} (${passkey})`);
    
    // Log to admin file
    await logLoginActivity(user, req, 'login');
    
    res.json({ 
      success: true, 
      user: {
        passkey: user.passkey,
        name: user.name,
        dob: user.dob,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check if passkey exists (for frontend validation)
app.post('/api/auth/check-passkey', async (req, res) => {
  try {
    const { passkey } = req.body;
    
    let exists;
    if (useMongoose) {
      const user = await User.findOne({ passkey });
      exists = !!user;
    } else {
      exists = users.some(u => u.passkey === passkey);
    }
    
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ exists: false, error: error.message });
  }
});

// Log login activity to admin file
async function logLoginActivity(user, req, action) {
  try {
    await fs.mkdir(ADMIN_FOLDER, { recursive: true });
    
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
      // File doesn't exist yet
    }
    
    // Add to login history
    existingData.loginHistory.push({
      passkey: user.passkey,
      name: user.name,
      action: action,
      loginTime: new Date().toISOString(),
      loginTimeFormatted: new Date().toLocaleString(),
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
    
    // Update users list for admin view
    const userIndex = existingData.users.findIndex(u => u.passkey === user.passkey);
    const userData = {
      passkey: user.passkey,
      name: user.name,
      dob: user.dob,
      accountCreated: user.createdAt,
      lastLogin: user.lastLogin,
      lastLoginFormatted: new Date(user.lastLogin).toLocaleString(),
      totalLogins: user.totalLogins || 1,
      lastUserAgent: req.headers['user-agent'],
      lastIpAddress: req.ip || req.connection.remoteAddress,
    };
    
    if (userIndex >= 0) {
      existingData.users[userIndex] = userData;
    } else {
      existingData.users.push(userData);
    }
    
    await fs.writeFile(ADMIN_FILE, JSON.stringify(existingData, null, 2));
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: useMongoose ? 'MongoDB (Mongoose)' : 'File-based',
    timestamp: new Date().toISOString()
  });
});

// Start server
connectMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ NexTask Backend Server`);
    console.log(`📡 Running on http://localhost:${PORT}`);
    console.log(`🌐 Accepting requests from: ${FRONTEND_URL}`);
    console.log(`💾 Database: ${useMongoose ? 'MongoDB (Mongoose)' : 'File-based'}`);
    console.log(`📁 Admin logs: ${ADMIN_FILE}`);
    console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});
