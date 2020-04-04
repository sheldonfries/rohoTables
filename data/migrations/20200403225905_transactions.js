exports.up = function (knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id');
    table.timestamps();
    table.integer('player_id').references('players.id').notNullable();
    table.integer('team_id').references('teams.id').notNullable();
    table.integer('season').notNullable().unique();
    table
      .enu('from', [
        'Minor',
        'NHL',
        'Buyout',
        'Retained',
        'Waivers',
        'Claimed',
        'Cleared',
        'Captain',
        'Alternate Captain',
        'Player',
        'Resign',
        'Sign',
        'Release',
        'Drafted',
      ])
      .notNullable();
    table
      .enu('to', [
        'Minor',
        'NHL',
        'Buyout',
        'Retained',
        'Waivers',
        'Claimed',
        'Cleared',
        'Captain',
        'Alternate Captain',
        'Player',
        'Resign',
        'Sign',
        'Release',
        'Drafted',
      ])
      .notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('transactions');
};
