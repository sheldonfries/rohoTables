const router = require('express').Router();
const db = require('../db');
const { searchPlayers } = require('./sql/getPlayer');

router.get('/:name', async (req, res) => {
  try {
    let { name } = req.params;
    
    const [details] = await db.raw(searchPlayers, [`%${name}%`]);
    res.status(200).json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
