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
  try {
    const { team1, team2 } = req.body;
    const teams = [team1, team2];
    const { id: season_id } = await db('seasons').orderBy('id', 'desc').first();
    const [trade_id] = await db('trades')
      .insert({
        season_id,
        team_id_1: team1.id,
        team_id_2: team2.id,
      })
      .returning('id');

    for (let team of teams) {
      for (let rPlayer of team.receivingPlayers) {
        // trade_items
        await db('trade_items').insert({
          trade_id,
          player_id: rPlayer.id,
          receiving_team_id: team.id,
        });
        // players
        const oldPlayer = await db('players').where({ id: rPlayer.id }).first();
        const updateObj = { team_id: team.id };
        if (rPlayer.retained) {
          const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
          const retained = rPlayer.retained;
          updateObj.salary = parseFloat(oldPlayer.salary) - retained;
          delete oldPlayer.id;
          oldPlayer.status = 'Retained';
          oldPlayer.salary = retained;
          oldPlayer.created_at = currentDate;
          oldPlayer.updated_at = currentDate;
          await db('players').insert(oldPlayer);
        }
        await db('players').update(updateObj).where({ id: rPlayer.id });
      }
      for (let rDraftId of team.receivingDraftPicks) {
        //trade_items
        await db('trade_items').insert({
          trade_id,
          draft_pick_id: rDraftId,
          receiving_team_id: team.id,
        });
        //draft_picks
        await db('draft_picks')
          .update({ team_id_current: team.id })
          .where({ id: rDraftId });
      }
    }
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get('/', async (req, res) => {
  try {
    const { season_id } = req.query;
    const whereObj = {};
    if (season_id) {
      whereObj['trades.season_id'] = season_id;
    }
    const trades = await db('trades')
      .select('*')
      .select(
        db.raw(
          '(SELECT name FROM teams WHERE trades.team_id_1 = teams.id LIMIT 1) AS team_name_1'
        )
      )
      .select(
        db.raw(
          '(SELECT name FROM teams WHERE trades.team_id_2 = teams.id LIMIT 1) AS team_name_2'
        )
      )
      .where(whereObj)
      .orderBy('created_at', 'desc');
    for (let trade of trades) {
      const trade_items = await db('trade_items as ti')
        .select(
          'ti.receiving_team_id',
          'dpt.name as draft_original_team_name',
          'dp.season as draft_season',
          'dp.round as draft_round',
          'p.name'
        )
        .leftJoin('players as p', 'ti.player_id', '=', 'p.id')
        .leftJoin('draft_picks as dp', 'ti.draft_pick_id', '=', 'dp.id')
        .leftJoin('teams as dpt', 'dp.team_id_original', '=', 'dpt.id')
        .where({ ['ti.trade_id']: trade.id });
      trade.trade_items = trade_items;
    }
    res.status(200).send(trades);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});
module.exports = router;
