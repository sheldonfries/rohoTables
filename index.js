require('dotenv').config();

const port = process.env.PORT || 6000;

const server = require('./server');

server.listen(port, () =>
  console.log(`\n** server running on http://localhost:${port} **\n`)
);
