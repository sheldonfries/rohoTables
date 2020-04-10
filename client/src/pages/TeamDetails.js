import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import PlayersTable from '../components/PlayersTable';

function TeamDetails(props) {
  const { match } = props;
  const [team, setTeam] = useState(null);
  useEffect(() => {
    fetchTeam(match.params.name);
  }, []);

  async function fetchTeam(name) {
    try {
      const res = await axios.get(`/api/teams/${name}`);
      setTeam(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  if (team === null) return null;
  return (
    <div>
      <PlayersTable
        title="Forwards"
        players={team.players.filter(
          (player) =>
            player.status === 'NHL' &&
            player.contract_type === 'signed' &&
            player.position.match(/^C|^LW|^RW/)
        )}
      />
      <PlayersTable
        title="Defense"
        players={team.players.filter(
          (player) =>
            player.status === 'NHL' &&
            player.contract_type === 'signed' &&
            player.position.match(/^LD|^RD/)
        )}
      />
      <PlayersTable
        title="Goaltenders"
        players={team.players.filter(
          (player) =>
            player.status === 'NHL' &&
            player.contract_type === 'signed' &&
            player.position.match(/^G/)
        )}
      />
      {/* retained */}
      <PlayersTable
        title="Retained"
        players={team.players.filter(
          (player) => player.contract_type === 'retained'
        )}
      />
      <PlayersTable
        title="Buyouts"
        players={team.players.filter(
          (player) => player.contract_type === 'buyout'
        )}
      />
      <PlayersTable
        title="In The System"
        players={team.players.filter(
          (player) =>
            player.status === 'Minors' && player.contract_type === 'signed'
        )}
      />
    </div>
  );
}

export default withRouter(TeamDetails);
