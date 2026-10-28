/**
 * Cross-platform runner script to start backend & frontend simultaneously
 */
const { spawn } = require('child_process');
const path = require('path');

console.log('================================================================');
console.log('🥑 PackAI: Food Packaging Material Recommendation System');
console.log('   Rule-Based Explainable AI • MongoDB Atlas Ready');
console.log('================================================================\n');

// 1. Start Backend on Port 5001
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend on Port 3000
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

function handleExit(code) {
  backend.kill();
  frontend.kill();
  process.exit(code);
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
