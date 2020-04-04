exports.up = function (knex) {
  return knex.schema.createTable('seasons', (table) => {
    table.increments('id');
    table.timestamps();
    table.integer('season').notNullable().unique();
    table.float('salary_max').notNullable();
    table.float('salary_min').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('seasons');
};
