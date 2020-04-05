exports.up = function (knex) {
  return knex.schema.createTable('teams', (table) => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table.integer('user_id_gm').references('users.id').unsigned().nullable(); //.onDelete('SET NULL');
    table.integer('user_id_agm').references('users.id').unsigned(); //.onDelete('SET NULL');
    table.string('name').notNullable().unique();
    table.string('city').notNullable();
    table.string('abbreviation').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('teams');
};
