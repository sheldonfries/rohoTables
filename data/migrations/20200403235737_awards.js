exports.up = function (knex) {
  return knex.schema.createTable('awards', (table) => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table
      .integer('player_id')
      .references('players.id')
      .unsigned()
      .notNullable();
    table
      .integer('season_id')
      .references('seasons.id')
      .unsigned()
      .notNullable();
    // table.string('team_id').references('teams.id').notNullable();
    table.string('award').notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('awards');
};
