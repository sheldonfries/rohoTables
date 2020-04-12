exports.up = function (knex) {
  return knex.schema.table('awards', (table) => {
    table.integer('team_id').references('teams.id').unsigned();
  });
};

exports.down = function (knex) {
  return knex.schema.table('awards', (table) => {
    table.dropColumn('team_id');
  });
};
