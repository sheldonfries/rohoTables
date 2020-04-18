import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

export default function Trade({ trade }) {
  const players1String = trade.trade_items
    .filter(
      (item) =>
        item.draft_round === null && item.receiving_team_id === trade.team_id_2
    )
    .reduce((playersString, player) => `${playersString}, ${player.name}`, '')
    .slice(1);
  const draft1String = trade.trade_items
    .filter(
      (item) =>
        item.draft_round !== null && item.receiving_team_id === trade.team_id_2
    )
    .reduce(
      (draftString, draft) =>
        `${draftString}, ${draft.draft_season} ${draft.draft_original_team_name} ${draft.draft_round}`,
      ''
    )
    .slice(1);

  const items1String = (players1String + draft1String).replace(
    /,(?=[^,]*$)/,
    ' and'
  );
  const players2String = trade.trade_items
    .filter(
      (item) =>
        item.draft_round === null && item.receiving_team_id === trade.team_id_1
    )
    .reduce((playersString, player) => `${playersString}, ${player.name}`, '')
    .slice(1);
  const draft2String = trade.trade_items
    .filter(
      (item) =>
        item.draft_round !== null && item.receiving_team_id === trade.team_id_1
    )
    .reduce(
      (draftString, draft) =>
        `${draftString}, ${draft.draft_season} ${draft.draft_original_team_name} ${draft.draft_round}`,
      ''
    )
    .slice(1);
  const items2String = (players2String + draft2String).replace(
    /,(?=[^,]*$)/,
    ' and'
  );
  return (
    <Grid container spacing={2} style={{ padding: '0 30px' }}>
      <Grid column xs={2}>
        <p>{trade.created_at}</p>
      </Grid>

      <Grid column xs={2}>
        <img
          src={`/assets/logos/${trade.team_name_1}.png`}
          width="30px"
          height="30px"
        />
        <img
          src={`/assets/logos/${trade.team_name_2}.png`}
          width="30px"
          height="30px"
        />
      </Grid>
      <Grid column xs={8}>
        <p>{`${trade.team_name_1} trades ${items1String} to ${trade.team_name_2} in exchange for  ${items2String}`}</p>
      </Grid>
      {/* <Paper elevation={3}>
          <h2>{trade.team_name_1}</h2>
          <h3>Traded Players</h3>
          {trade.trade_items
            .filter(
              (item) =>
                item.draft_round === null &&
                item.receiving_team_id === trade.team_id_2
            )
            .map((player) => (
              <p>{player.name}</p>
            ))}
          <h3>Draft Picks</h3>
          {trade.trade_items
            .filter(
              (item) =>
                item.draft_round !== null &&
                item.receiving_team_id === trade.team_id_2
            )
            .map((draft) => (
              <p>
                {draft.draft_season} {draft.draft_original_team_name}{' '}
                {draft.draft_round}
              </p>
            ))}
        </Paper>
      </Grid>
      <Grid column xs={6}>
        <Paper elevation={3}>
          <h2>{trade.team_name_2}</h2>
          <h3>Traded Players</h3>
          {trade.trade_items
            .filter(
              (item) =>
                item.draft_round === null &&
                item.receiving_team_id === trade.team_id_1
            )
            .map((player) => (
              <p>{player.name}</p>
            ))}
          <h3>Draft Picks</h3>
          {trade.trade_items
            .filter(
              (item) =>
                item.draft_round !== null &&
                item.receiving_team_id === trade.team_id_1
            )
            .map((draft) => (
              <p>
                {draft.draft_season} {draft.draft_original_team_name}{' '}
                {draft.draft_round}
              </p>
            ))}
        </Paper> */}
      {/* </Grid> */}
    </Grid>
  );
}
// receiving_team_id: 29
// draft_original_team_name: "Hurricanes"
// draft_season: 2009
// draft_round: 2
// name: null

// id: 22
// created_at: "2020-04-18T13:26:52.000Z"
// updated_at: "2020-04-18T13:26:52.000Z"
// season_id: 3
// team_id_1: 7
// team_id_2: 29
// team_name_1: "Blackhawks"
// team_name_2: "Canucks"
// trade_items:

// receiving_team_id: 7
// draft_original_team_name: null
// draft_season: null
// draft_round: null
// name: "Jean-Pierre Dumont"
