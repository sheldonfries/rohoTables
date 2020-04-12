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
    </div>
  );
}

export default withRouter(PlayerDetails);
