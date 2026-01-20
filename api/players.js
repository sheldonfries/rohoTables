const router = require('express').Router();
const db = require('../db');
const {
  getPlayerStatsSql,
  getGoalieStatsSql,
  getPlayerAwardsSql,
  getPlayerDetails,
  getPlayerComparables,
  getPlayerTrades
} = require('./sql/getPlayer');

router.get('/:name', async (req, res) => {
  try {
    let { name } = req.params;
    
    const [[details]] = await db.raw(getPlayerDetails, [name]);
    if (!details) {
      res.status(404).json({ message: 'not found' });
      return;
    }

    const [playerStats] = await db.raw(getPlayerStatsSql, [name]);
    const [goalieStats] = await db.raw(getGoalieStatsSql, [name]);
    const [awards] = await db.raw(getPlayerAwardsSql, [name]);
    const [comparables] = await db.raw(getPlayerComparables, [name]);
    const [trades] = await db.raw(getPlayerTrades, [name]);
    if (playerStats) {
      const returnObj = { ...details, awards, comparables, trades };

      returnObj.goalieNormalStats = goalieStats.filter(
        (stats) => stats.season_type === 'normal'
      );
      returnObj.goaliePlayoffStats = goalieStats.filter(
        (stats) => stats.season_type === 'playoff'
      );

      returnObj.normalStats = playerStats.filter(
        (stats) => stats.season_type === 'normal'
      );
      returnObj.playoffStats = playerStats.filter(
        (stats) => stats.season_type === 'playoff'
      );

      res.status(200).json(returnObj);
    } else {
      res.status(404).json({ message: `${name} not found` });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
