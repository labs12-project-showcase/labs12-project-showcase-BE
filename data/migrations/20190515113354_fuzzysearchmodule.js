exports.up = function(knex, Promise) {
  return knex.schema.raw("CREATE EXTENSION IF NOT EXISTS fuzzystrmatch");
};

exports.down = function(knex, Promise) {
  return knex.schema.raw("DROP EXTENSION IF EXISTS fuzzystrmatch");
};
