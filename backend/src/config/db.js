const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isConnected = false;
let dbType = 'none';

async function connectDB(customUri) {
  const uri = customUri || process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI environment variable not set.');
    console.warn('ℹ️  Running in standalone in-memory fallback mode. Atlas connection can be configured at any time.');
    dbType = 'memory';
    isConnected = false;
    return { isConnected: false, mode: 'memory' };
  }

  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    dbType = uri.includes('mongodb+srv://') ? 'atlas' : 'mongodb';
    process.env.MONGODB_URI = uri;

    // Persist to backend/.env if customUri provided
    if (customUri) {
      try {
        const envPath = path.resolve(__dirname, '../../.env');
        let content = '';
        if (fs.existsSync(envPath)) {
          content = fs.readFileSync(envPath, 'utf8');
        }
        if (content.includes('MONGODB_URI=')) {
          content = content.replace(/MONGODB_URI=.*(\r?\n|$)/g, `MONGODB_URI=${customUri}\n`);
        } else {
          content += `\nMONGODB_URI=${customUri}\n`;
        }
        fs.writeFileSync(envPath, content, 'utf8');
        console.log('📝 Saved MONGODB_URI to backend/.env');
      } catch (err) {
        console.warn('Could not write to .env file:', err.message);
      }
    }

    console.log(`✅ MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return { isConnected: true, mode: dbType, host: conn.connection.host, name: conn.connection.name };
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    isConnected = false;
    dbType = 'memory_fallback';
    return { isConnected: false, mode: 'memory_fallback', error: error.message };
  }
}

function getDbStatus() {
  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    mode: isConnected ? dbType : 'memory',
    readyState: mongoose.connection.readyState,
    host: isConnected ? mongoose.connection.host : null,
    name: isConnected ? mongoose.connection.name : null,
  };
}

module.exports = { connectDB, getDbStatus };
