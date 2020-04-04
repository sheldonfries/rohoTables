exports.up = function (knex) {
  return knex.schema.createTable('trades', (table) => {
    table.increments('id');
    table.timestamps();
    table.integer('season').notNullable();
    table
      .integer('team_id_1')
      .references('teams.id')
      .onDelete('SET NULL')
      .notNullable();
    table
      .integer('team_id_2')
      .references('teams.id')
      .onDelete('SET NULL')
      .notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('trades');
};
