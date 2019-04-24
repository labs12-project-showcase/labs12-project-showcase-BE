const knexConfig = require("../knexfile");

const dbEnv = process.env.DB_ENV || "development";

module.exports = require("knex")(knexConfig[dbEnv]);
