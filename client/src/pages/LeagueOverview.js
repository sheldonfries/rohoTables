import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import tableIcons from '../tableIcons';

import MaterialTable from 'material-table';

export default function LeagueOverview() {
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    try {
      const res = await axios.get('/api/teams');
      setTeams(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div style={{ maxWidth: '98%', margin: '10px auto' }}>
        <MaterialTable
          icons={tableIcons}
          options={{
            search: false,
            paging: false,
            showTitle: false,
            padding: 'dense',
            toolbar: false,
          }}
          columns={[
            {
              title: '',
              field: '',
              cellStyle: {
                // width: 35,
                // maxWidth: 35,
                paddingRight: 0,
              },
              headerStyle: {
                paddingRight: 0,
                // width: 35,
                // maxWidth: 35,
              },
              render: (rowData) => (
                <img
                  src={`/assets/logos/${rowData.name}.png`}
                  width="30px"
                  height="30px"
                />
              ),
            },
            {
              title: 'Team',
              field: 'name',
              render: (rowData) => (
                <Link to={`/teams/${rowData.name}`}>{rowData.name}</Link>
              ),
            },
            { title: 'Manager', field: 'gmName' },
            { title: 'Cap Hit', field: 'capHit', type: 'numeric' },
            { title: 'Cap Space', field: 'capSpace', type: 'numeric' },
            { title: 'Buyout', field: 'buyout', type: 'numeric' },
            { title: 'Retained', field: 'retained', type: 'numeric' },
            { title: 'Average Age', field: 'averageAge', type: 'numeric' },
            { title: 'Forwards', field: 'forwardCount', type: 'numeric' },
            { title: 'Defences', field: 'defenceCount', type: 'numeric' },
            { title: 'Goalies', field: 'goalieCount', type: 'numeric' },

            { title: 'Minors', field: 'minorsCount', type: 'numeric' },
            { title: 'Players', field: 'playerCount', type: 'numeric' },
            {
              title: 'Contracts',
              field: 'contractCount',
              type: 'numeric',
            },
          ]}
          data={teams}
        />
      </div>
    </div>
  );
}
// "name": "Avalanche",
// "gmName": "dough teeth",
// "capHit": 0,
// "retained": 0,
// "buyout": 0,
// "averageAge": 0,
// "forwardCount": 0,
// "defenceCount": 0,
// "goalieCount": 0,
// "contractCount": 0,
// "minorsCount": 0,
// "capSpace": 44,
// "playerCount": 0
