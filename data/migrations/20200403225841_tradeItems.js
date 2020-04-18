exports.up = function (knex) {
  return knex.schema.createTable('trade_items', (table) => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table
      .integer('trade_id')
      .unsigned()
      .notNullable()
      .references('trades.id')
      .onDelete('CASCADE');
    table
      .integer('receiving_team_id')
      .notNullable()
      .references('teams.id')
      .unsigned();

    table.integer('draft_pick_id').references('draft_picks.id').unsigned();
    table.integer('player_id').references('players.id').unsigned();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('trade_items');
};
