import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import PlayerStatsTable from '../components/PlayerStatsTable';
import SimpleTable from '../components/SimpleTable';
import MaterialTable from 'material-table';

function PlayerDetails(props) {
  const { match } = props;
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    fetchPlayer(match.params.name);
  }, [match.params.name]);
  async function fetchPlayer(name) {
    try {
      setPlayer(null);
      const res = await axios.get(`/api/players/${name}`);
      setPlayer(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  if (!player) return null;
  return (
    <div>
      <PlayerStatsTable title='Regular Season' stats={player.normalStats} />
      <PlayerStatsTable
        title='Regular Season'
        stats={player.goalieNormalStats}
        pos='G'
      />

      <PlayerStatsTable title='Playoffs' stats={player.playoffStats} />
      <PlayerStatsTable
        title='Playoffs'
        stats={player.goaliePlayoffStats}
        pos='G'
      />
      {player.awards.length > 0 ? (
        <MaterialTable
          title='Awards'
          options={{
            search: false,
            paging: false,
            sorting: false,
            // showTitle: false,
            padding: 'dense',
            // toolbar: false,
            // tableLayout: 'fixed',
          }}
          columns={[
            { title: 'Season', field: 'season' },
            {
              title: 'Team',
              field: 'team_name',
              render: (rowData) =>
                rowData.team_name ? (
                  <img
                    src={`/assets/logos/${rowData.team_name}.png`}
                    width='30px'
                    height='30px'
                  />
                ) : null,
            },
            { title: 'Award', field: 'award' },
          ]}
          data={player.awards}
        />
      ) : null}
      {player.draft_team_id ? (
        <MaterialTable
          title='Draft Info'
          options={{
            search: false,
            paging: false,
            // showTitle: false,
            padding: 'dense',
            // toolbar: false,
          }}
          columns={[
            { title: 'Season', field: 'draft_season_name' },
            {
              title: 'Team',
              field: 'draft_team_name',
              render: (rowData) =>
                rowData.draft_team_name ? (
                  <img
                    src={`/assets/logos/${rowData.draft_team_name}.png`}
                    width='30px'
                    height='30px'
                  />
                ) : null,
            },
            { title: 'Overall', field: 'draft_overall' },
            { title: 'Grade', field: 'rating' },
            {
              title: 'Comparable',
              field: 'draft_comparable',
              render: ({ is_draft_comparable_local, draft_comparable }) => {
                if (is_draft_comparable_local)
                  return (
                    <Link to={`/players/${draft_comparable}`}>
                      {draft_comparable}
                    </Link>
                  );
                return <p>{draft_comparable}</p>;
              },
            },
          ]}
          data={[{ ...player }]}
        />
      ) : null}
    </div>
  );
}
// is_draft_comparable_local
export default withRouter(PlayerDetails);
