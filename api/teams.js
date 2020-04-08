const router = require('express').Router();
const db = require('../db');
const getTeamsSql = require('./sql/getTeams');
const { getPlayersSql, getTeamDetailsSql } = require('./sql/getTeam');

router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;

    const [[details]] = await db.raw(
      getTeamDetailsSql.replace('!!{teamName}!!', name)
    );
    const [players] = await db.raw(
      getPlayersSql.replace('!!{teamId}!!', details.id)
    );
    res.status(200).json({ ...details, players });
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
