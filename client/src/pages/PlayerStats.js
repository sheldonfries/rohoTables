import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import PlayersTable from '../components/PlayersTable';

function PlayerStats(props) {
  const { match } = props;
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    debugger;
    fetchPlayer(match.params.name);
  }, []);
  async function fetchPlayer(name) {
    try {
      debugger;
      const res = await axios.get(`/api/players/${name}`);
      setPlayer(res.data);
      debugger;
    } catch (error) {
      console.log(error);
    }
  }
  return <div></div>;
}

export default withRouter(PlayerStats);
