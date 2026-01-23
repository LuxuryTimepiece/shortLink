// More detailed connection test
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

// Parse connection string to check format
const uriMatch = MONGODB_URI.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/);
if (uriMatch) {
  const [, username, password, cluster, database] = uriMatch;
  console.log('📋 Connection Details:');
  console.log('   Username:', username);
  console.log('   Password length:', password.length, 'characters');
  console.log('   Cluster:', cluster);
  console.log('   Database:', database);
  console.log('');
}

console.log('🔍 Attempting connection...');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.error('\n💡 Authentication Error - Check:');
      console.error('   1. Username is correct (should be: linkShort)');
      console.error('   2. Password is correct');
      console.error('   3. Special characters in password are URL-encoded');
      console.error('      (@ = %40, # = %23, % = %25, etc.)');
    }
    
    process.exit(1);
  });
