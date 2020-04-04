exports.up = function (knex) {
  return knex.schema.createTable('teams', (table) => {
    table.increments('id');
    table.timestamps();
    table.integer('user_id_gm').references('users.id').onDelete('SET NULL');
    table.integer('user_id_agm').references('users.id').onDelete('SET NULL');
    table.string('name').notNullable().unique();
    table.string('city').notNullable();
    table.string('abbreviation').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('teams');
};
