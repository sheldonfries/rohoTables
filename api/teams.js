const router = require('express').Router();
const db = require('../db');
const getTeamsSql = require('./sql/getTeams');
console.log('here');
router.get('/', async (req, res) => {
  try {
    const [teams] = await db.raw(getTeamsSql);
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'server error', error });
  }
});

module.exports = router;
