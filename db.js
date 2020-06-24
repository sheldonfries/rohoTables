const knex = require('knex');
const config = require('./knexfile.js');
console.log(config[process.env.DB_ENV]);
module.exports = knex(config[process.env.DB_ENV]);
