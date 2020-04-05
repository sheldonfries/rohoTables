const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const csv = require('csv-string');
const api = require('./api/index');

const db = require('./db');

const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json({ limit: '50mb' }));
server.use('/api', api);

server.use((req, res, next) => {
  if (req.path.indexOf('.') === -1) {
    req.url += '.html';
  }
  next();
}, express.static(path.join(__dirname, 'public')));

module.exports = server;
