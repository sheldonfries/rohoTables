exports.up = function (knex) {
  return knex.schema.createTable('awards', (table) => {
    table.increments('id');
    table.timestamps();
    table.integer('player_id').references('players.id').notNullable();
    // table.string('team_id').references('teams.id').notNullable();
    table.string('award').notNullable().unique();
    table.integer('season').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('awards');
};
