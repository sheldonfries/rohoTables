import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import MaterialTable from 'material-table';

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
  return <div></div>;
}

export default withRouter(TeamDetails);
