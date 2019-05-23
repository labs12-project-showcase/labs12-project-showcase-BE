
exports.up = function(knex, Promise) {
  return knex.schema.table('students', table => {
    table.boolean('highlighted').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('students', table => {
    table.dropColumn('highlighted');
  });
};
