import React, { useState, useEffect } from 'react';
import axios from '../requester';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

function PlayerStats(props) {
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
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}></Grid>
      <Grid item xs={6}></Grid>
    </Grid>
  );
}

export default withRouter(PlayerStats);
