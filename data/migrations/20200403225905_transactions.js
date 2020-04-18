exports.up = function (knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table
      .integer('player_id')
      .references('players.id')
      .unsigned()
      .notNullable();
    table.integer('team_id').references('teams.id').unsigned().notNullable();
    table
      .integer('season_id')
      .references('seasons.id')
      .unsigned()
      .notNullable();
    // table.enu('from', [
    //   'Minor',
    //   'NHL',
    //   'Buyout',
    //   'Retained',
    //   'Waivers',
    //   'Claimed',
    //   'Cleared',
    //   'Captain',
    //   'Alternate Captain',
    //   'Player',
    //   'Resign',
    //   'Sign',
    //   'Release',
    //   'Drafted',
    // ]);

    /*
   
  STATUS CHANGES
  players.status
   Minor(cleared), NHL, Retired, waivers,
  TEAM CHANGE
  Claimed, Release, 
 */

    // .notNullable();
    table
      .enu('to', [
        'Minors',
        'NHL',
        'Buyout',
        'Retired',
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
