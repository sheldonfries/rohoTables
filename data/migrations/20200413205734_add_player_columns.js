exports.up = function (knex) {
  return knex.schema.table('players', (table) => {
    table.integer('draft_team_id').references('teams.id').unsigned();
    table.integer('draft_overall');
    table.integer('draft_season_id').references('seasons.id').unsigned();
    table.string('draft_comparable');
  });
};

exports.down = function (knex) {
  return knex.schema.table('players', (table) => {
    table.dropColumn('draft_team_id');
    table.dropColumn('draft_overall');
    table.dropColumn('draft_season_id');
    table.dropColumn('draft_comparable');
  });
};
