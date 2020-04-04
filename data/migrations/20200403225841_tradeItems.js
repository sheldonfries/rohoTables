exports.up = function (knex) {
  return knex.schema.createTable('trade_items', (table) => {
    table.increments('id');
    table.timestamps();
    table
      .integer('trade_id')
      .references('trades.id')
      .onDelete('CASCADE')
      .notNullable();
    table.integer('draft_pick_id').references('draft_picks.id');
    table.integer('player_id').references('players.id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('trade_items');
};
