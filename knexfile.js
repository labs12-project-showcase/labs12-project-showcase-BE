require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: process.env.LOCAL_DB,
      user: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      tableName: "knex_migrations",
      directory: "./data/seeds"
    }
  },
  testing: {
    client: "pg",
    connection: {
      database: process.env.LOCAL_DB,
      user: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      tableName: "knex_migrations",
      directory: "./data/seeds"
    }
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds/"
    }
  }
};
