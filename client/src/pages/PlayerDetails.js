import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import PlayerStatsTable from '../components/PlayerStatsTable';

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
    </div>
  );
}

export default withRouter(PlayerDetails);
