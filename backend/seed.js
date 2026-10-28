/**
 * Standalone MongoDB Atlas Database Seeder
 * Run with: npm run seed
 */
require('dotenv').config();
const { connectDB } = require('./src/config/db');
const storage = require('./src/models/storage');
const mongoose = require('mongoose');

async function run() {
  console.log('--- Initializing Food Packaging Recommender Seeder ---');
  await connectDB();
  const res = await storage.seedAll();
  console.log('Result:', res);
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
  process.exit(0);
}

run().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
