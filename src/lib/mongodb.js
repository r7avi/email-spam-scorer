const { MongoClient } = require('mongodb');
const path = require('path');

// Load environment variables from the correct path
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

let cachedClient = null;
let cachedDb = null;

// Define MongoDB URI with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ir7avi:QrDNheBivvUmZNBp@cluster0.cfyi8.mongodb.net/email-spam-scorer';

// Initialize connection
async function initConnection() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Export the initialization function
module.exports = { initConnection }; 