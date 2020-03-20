require('dotenv').config();
const port = process.env.PORT || 6000;

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const server = require('./server');
server.listen(port, () =>
  console.log(`\n** server running on http://localhost:${port} **\n`)
);
