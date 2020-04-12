const router = require('express').Router();
const db = require('../db');
const { getPlayersStatsSql } = require('./sql/getPlayersStats');

router.get('/seasons/:seasonId/type/:seasonType', async (req, res) => {
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

module.exports = router;
