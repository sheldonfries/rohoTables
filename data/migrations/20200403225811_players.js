exports.up = function (knex) {
  return knex.schema.createTable('players', (table) => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table.string('name').notNullable();
    table
      .integer('team_id')
      .references('teams.id')
      .unsigned()
      .onDelete('SET NULL');
    table.integer('age').notNullable();
    table.string('country').notNullable();
    table.string('pos').notNullable();
    table.float('salary');
    table.integer('contract_duration');
    table.string('contract_type').notNullable();
    // table.enu('contract_type',[''])
    table.string('expiry_type').notNullable();
    table.string('rating');
    table.enu('status', ['NHL', 'Minors', 'Retired', 'Waivers', 'Retained']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('players');
};
