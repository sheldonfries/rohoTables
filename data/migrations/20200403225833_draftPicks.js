exports.up = function (knex) {
  return knex.schema.createTable('draft_picks', (table) => {
    table.increments('id');
    table.timestamps();
    table
      .integer('team_id_original')
      .references('teams.id')
      .onDelete('SET NULL')
      .notNullable();
    table
      .integer('team_id_current')
      .references('teams.id')
      .onDelete('SET NULL')
      .notNullable();
    table.integer('season');
    table.integer('round');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('draft_picks');
};
