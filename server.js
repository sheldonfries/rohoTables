const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const api = require('./api/index');
const server = express();

if (process.env.NODE_ENV !== 'development') {
  server.use(helmet());
}
server.use(cors());
server.use(express.json({ limit: '50mb' }));

// API routes first
server.use('/api', api);

// Serve public assets
server.use(express.static(path.join(__dirname, 'public')));

// Serve React build static files
server.use(express.static(path.join(__dirname, 'client', 'build')));

// Catch-all must be last — serves index.html for any unmatched route
server.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

module.exports = server;