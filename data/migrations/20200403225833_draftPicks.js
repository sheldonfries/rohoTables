exports.up = function (knex) {
  return knex.schema.createTable('draft_picks', (table) => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table
      .integer('team_id_original')
      .references('teams.id')
      .unsigned()
      .notNullable();
    table
      .integer('team_id_current')
      .references('teams.id')
      .unsigned()
      .notNullable();
    table.integer('season');
    table.integer('round');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('draft_picks');
};
