// Test MongoDB Connection
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

console.log('🧪 Testing MongoDB Connection...\n');

if (!MONGO_URI) {
  console.error('❌ No MONGO_URI found in environment variables');
  console.log('💡 Make sure you have MONGO_URI in your .env file');
  process.exit(1);
}

console.log('📍 Connection string (masked):', MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
console.log('\n🔄 Connecting...\n');

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ SUCCESS! Connected to MongoDB');
  console.log('📊 Database:', mongoose.connection.db.databaseName);
  console.log('🌐 Host:', mongoose.connection.host);
  console.log('\n🎉 Your MongoDB connection is working!\n');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ FAILED! Could not connect to MongoDB\n');
  console.error('Error:', error.message);
  console.error('Error name:', error.name);
  
  if (error.reason) {
    console.error('Reason:', error.reason);
  }
  
  console.log('\n🔍 Common issues:');
  console.log('1. Wrong password in connection string');
  console.log('2. IP address not whitelisted (add 0.0.0.0/0 in MongoDB Atlas)');
  console.log('3. Database user doesn\'t exist');
  console.log('4. Cluster is paused or deleted');
  console.log('5. Connection string format is incorrect');
  
  console.log('\n💡 Check your MongoDB Atlas:');
  console.log('- Database Access: Verify user exists');
  console.log('- Network Access: Add 0.0.0.0/0');
  console.log('- Database: Verify cluster is active\n');
  
  process.exit(1);
});
