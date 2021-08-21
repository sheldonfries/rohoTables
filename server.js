const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const api = require('./api/index');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json({ limit: '50mb' }));
server.use('/api', api);

server.use((req, res, next) => {
  console.log('here');
  if (req.path.indexOf('.') === -1) {
    req.url += '.html';
  }
  next();
}, express.static(path.join(__dirname, 'public')));

server.use('/client', express.static(path.join(__dirname, 'client', 'build')));
server.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

module.exports = server;
