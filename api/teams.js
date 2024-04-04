const router = require('express').Router();
const db = require('../db');
const getTeamsSql = require('./sql/getTeams');
const {
  getPlayersSql,
  getTeamDetailsSql,
  getDraftPicksSQL,
} = require('./sql/getTeam');

async function queryTables(name, playerTable)
{
  const [[details]] = await db.raw(
    getTeamDetailsSql.replace('!!{teamName}!!', name)
  );
  const [players] = await db.raw(
    getPlayersSql.replace('!!{teamId}!!', details.id).replace('!!{playersTable}!!', playerTable)
  );
  const [draftPicks] = await db.raw(
    getDraftPicksSQL.replace('!!{teamId}!!', details.id)
  );
  const result = { ...details, players, draftPicks };
  return result;
}

router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const playerTable = "players";

    const output = await queryTables(name, playerTable);
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ message: 'server error', error });
  }
});

router.get('/:name/:season', async (req, res) => {
  try {
    const { name, season } = req.params;
    const seasonName = season.split("-")[0]
    const adjustedSeason = (+seasonName + 1).toString();
    const playerTable = "players_" + adjustedSeason;

    const output = await queryTables(name, playerTable);    
    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ message: 'server error', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const [teams] = await db.raw(getTeamsSql);
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'server error', error });
  }
});

module.exports = router;
