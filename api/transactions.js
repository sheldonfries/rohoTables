/* STATUS CHANGES
  players.status
        send down, call up, waive, cleared, retired, 
   Minor(cleared), NHL, Retired, waivers,
  TEAM CHANGE
  Claimed, Release, */

//   UPDATE player SET status='!!{newStatus}!!' WHERE id = !!{playerId}!!

//   INSERT INTO transactions (player_id ,team_id ,season_id , to) VALUES()

//   UPDATE player SET team_id='!!{team_id}!!' WHERE id = !!{playerId}!!

//   INSERT INTO transactions (player_id ,team_id ,season_id , to) VALUES()
const router = require('express').Router();
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    const { playerId, teamId, status, type } = req.body;
    const season = await db('seasons').orderBy('id', 'desc').first();
    const updateObj = {};
    if (teamId) updateObj.team_id = teamId;
    if (
      status === 'Minors' ||
      status === 'NHL' ||
      status === 'Retired' ||
      status === 'Waivers'
    ) {
      updateObj.status = status;
    }
    await db('players').update(updateObj).where({ id: playerId });

    await db('transactions').insert({
      player_id: playerId,
      team_id: teamId ? teamId : null,
      season_id: season.id,
      to: type,
    });
    res.status(204).send();
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

// /teams , /teams/:id/players
