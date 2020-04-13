const router = require('express').Router();
const db = require('../db');

const {
  getPlayersStatsSql,
  getGoalieStatsSql,
} = require('./sql/getPlayersStats');

router.get('/:seasonId/stats/type/:seasonType/players', async (req, res) => {
  try {
    const { seasonId, seasonType } = req.params;
    const [stats] = await db.raw(
      getPlayersStatsSql
        .replace('!!{seasonId}!!', seasonId)
        .replace('!!{seasonType}!!', seasonType)
    );
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
  }
});

router.get('/:seasonId/stats/type/:seasonType/goalies', async (req, res) => {
  try {
    const { seasonId, seasonType } = req.params;
    const [stats] = await db.raw(
      getGoalieStatsSql
        .replace('!!{seasonId}!!', seasonId)
        .replace('!!{seasonType}!!', seasonType)
    );
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const seasons = await db('seasons');
    res.status(200).json(seasons);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
