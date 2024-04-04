// Update with your config settings.
// console.log(process.env.DATABASE_IP);
if (process.env.NODE_ENV == "production") require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DATABASE_IP,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
    pool: {
      // propagateCreateError: false,
      // afterCreate: (conn, done) => {
      //   conn.run('PRAGMA foreign_keys = ON', done);
      // },
      min: 2,
      max: 10,
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: process.env.DATABASE_IP,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.DATABASE_IP,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
    searchPath: ['knex', 'public'],

    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },
};
