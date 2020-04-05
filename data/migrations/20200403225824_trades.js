exports.up = function (knex) {
  return knex.schema.createTable('trades', (table) => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table.integer('season').notNullable();
    table.integer('team_id_1').notNullable().references('teams.id').unsigned();

    table.integer('team_id_2').notNullable().references('teams.id').unsigned();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('trades');
};
