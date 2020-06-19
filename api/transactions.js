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
    let oldTeamId;
    if (teamId === 31) {
      player = await db('players')
        .select('team_id')
        .where({ id: playerId })
        .first();
      oldTeamId = player.team_id;
    }
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
      team_id: teamId ? (teamId !== 31 ? teamId : oldTeamId) : null,
      season_id: season.id,
      to: type,
    });
    res.status(204).send();
  } catch (error) {
    console.log(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const { season_id } = req.query;
    const whereObj = {};
    if (season_id) {
      whereObj['t.season_id'] = season_id;
    }
    const transactions = await db('transactions as t')
      .select(
        't.*',
        'p.name as player_name',
        'te.name as team_name',
        's.season as season_name'
      )
      .leftJoin('players as p', 't.player_id', '=', 'p.id')
      .leftJoin('teams as te', 'te.id', '=', 't.team_id')
      .leftJoin('seasons as s', 's.id', 't.season_id')
      .where(whereObj)
      .orderBy('created_at', 'desc');
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;

// /teams , /teams/:id/players
