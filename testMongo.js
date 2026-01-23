// test-mongo.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in .env.local');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // helpful for transient/slow clusters
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 10000,
});

async function run() {
  try {
    console.log('Attempting to connect (URI will be hidden)...');
    console.log('URI (masked):', uri.replace(/:[^@]+@/, ':***@'));
    await client.connect();
    console.log('Connected to cluster.');
    // Ping the app DB for verification
    const res = await client.db('yakura').command({ ping: 1 });
    console.log('Ping result:', res);
  } catch (err) {
    console.error('Connection error (full object):');
    console.error(err);
    // Print short summary that's safe to share
    console.log('Summary:', err.message);
    if (err?.reason) {
      console.log('Topology reason:', err.reason.type || err.reason);
    }
  } finally {
    try { await client.close(); } catch (e) {}
  }
}

run().catch((e) => {
  console.error('Unhandled error:', e);
  process.exit(1);
});