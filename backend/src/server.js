require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'AI-Based Intelligent Food Packaging Material Recommendation System API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: [
      'GET  /api/health',
      'GET  /api/commodities',
      'POST /api/commodities',
      'GET  /api/materials',
      'POST /api/materials',
      'GET  /api/rules',
      'POST /api/recommend',
      'GET  /api/history',
      'POST /api/seed'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Bootstrapping
async function startServer() {
  // Connect to DB (Atlas or memory fallback)
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Food Packaging AI Recommendation Backend running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health\n`);
  });
}

startServer();

module.exports = app;
