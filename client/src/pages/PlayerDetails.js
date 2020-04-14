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
  }, []);
  async function fetchPlayer(name) {
    try {
      const res = await axios.get(`/api/players/${name}`);
      setPlayer(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  if (!player) return null;
  return (
    <div>
      <PlayerStatsTable title="Regular Season" stats={player.normalStats} />
      <PlayerStatsTable
        title="Regular Season"
        stats={player.goalieNormalStats}
        pos="G"
      />

      <PlayerStatsTable title="Playoffs" stats={player.playoffStats} />
      <PlayerStatsTable
        title="Playoffs"
        stats={player.goaliePlayoffStats}
        pos="G"
      />
      {player.awards.length > 0 ? (
        <MaterialTable
          title="Awards"
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
            { title: 'Team', field: 'team_name' },
            { title: 'Award', field: 'award' },
          ]}
          data={player.awards}
        />
      ) : null}
      <MaterialTable
        title="Draft Info"
        options={{
          search: false,
          paging: false,
          // showTitle: false,
          padding: 'dense',
          // toolbar: false,
        }}
        columns={[
          { title: 'Season', field: 'draft_season_name' },
          { title: 'Overall', field: 'draft_overall' },
          {
            title: 'Team',
            field: 'draft_team_name',
            render: (rowData) =>
              rowData.draft_team_name ? (
                <img
                  src={`/assets/logos/${rowData.draft_team_name}.png`}
                  width="30px"
                  height="30px"
                />
              ) : null,
          },
          { title: 'Grade', field: 'rating' },
          { title: 'Comparable', field: 'draft_comparable' },
        ]}
        data={[{ ...player }]}
        //         draft_team_id: 7
        // draft_overall: 1
        // draft_season_id: 1
        // draft_comparable: "Joe Mullen"
        // draft_team_name: "Blackhawks"
        // draft_season_name: "2006-07"
      />
    </div>
  );
}

export default withRouter(PlayerDetails);
