exports.up = function(knex, Promise) {
  return knex.schema.raw(`CREATE EXTENSION IF NOT EXISTS cube;
                            CREATE EXTENSION IF NOT EXISTS earthdistance;`);
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`DROP EXTENSION IF EXISTS cube;
                            DROP EXTENSION IF EXISTS earthdistance;`);
};
