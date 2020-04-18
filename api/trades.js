const router = require('express').Router();
const db = require('../db');

/*
{
    team1:{
        id,
        receivingPlayers:[{playerId, retained:number}],
        receivingDraftPicks:[draftId]
    },
    team2:{
        id,
        receivingPlayers:[playerId],
        receivingDraftPicks:[draftId]
    }
}
*/

router.post('/', async (req, res) => {
  const { team1, team2 } = req.body;
  const teams = [team1, team2];
  const { id: season_id } = await db('seasons').orderBy('id', 'desc').first();
  const { id: trade_id } = await db('trades')
    .insert({
      season_id,
      team_id_1: team1.id,
      team_id_2: team2.id,
    })
    .returning('id');

  for (let team of teams) {
    for (let rPlayer of team.receivingPlayers) {
      // trade_items
      await db('trade_items').insert({ trade_id, player_id: rPlayer.id });
      // players
      const oldPlayer = await db('players').where({ id: rPlayer.id });
      const updateObj = { team_id: team.id };
      if (rPlayer.retained) {
        updateObj.salary = parseFloat(oldPlayer.salary) - retained;
        delete oldPlayer.id;
        oldPlayer.status = 'Retained';
        oldPlayer.salary = retained;
        await db('players').insert(oldPlayer);
      }
      await db('players').update(updateObj).where({ id: rPlayer.id });
    }
    for (let rDraftId of team.receivingDraftPicks) {
      //trade_items
      await db('trade_items').insert({ trade_id, draft_pick_id: rDraftId });
      //draft_picks
      await db('draft_picks')
        .update({ team_id: team.id })
        .where({ id: rDraftId });
    }
  }
});

module.exports = router;
