// Simplified connection test without database name
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

let MONGODB_URI = process.env.MONGODB_URI;

// Try connection without database name first
if (MONGODB_URI.includes('/yakura')) {
  MONGODB_URI = MONGODB_URI.replace('/yakura', '');
  console.log('Testing connection without database name...');
}

console.log('Connection string:', MONGODB_URI.replace(/:[^@]+@/, ':***@'));

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('✅ Connection successful!');
    console.log('Connected to cluster:', mongoose.connection.host);
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Database user credentials are incorrect');
    console.error('2. Database user does not have proper permissions');
    console.error('3. Password contains special characters that need URL encoding');
    console.error('4. Network/firewall blocking connection');
    process.exit(1);
  });
