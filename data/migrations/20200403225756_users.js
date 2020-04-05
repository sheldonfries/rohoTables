exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table.string('username', 100);
    table.string('profile_link', 300);
    table.string('profile_picture', 300);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
