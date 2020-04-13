import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import tableIcons from '../tableIcons';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';

const playerCols = [
  {
    title: 'Name',
    field: 'name',
    cellStyle: { whiteSpace: 'nowrap' }, //minWidth: 200, width: 200 },
    // headerStyle: { whiteSpace: 'nowrap', minWidth: 200, width: 200 },
  },
  {
    title: 'Team',
    field: 'team_name',
    sorting: false,
    cellStyle: { padding: 0 },
    headerStyle: { padding: 0 },
    render: (rowData) =>
      rowData.team_name ? (
        <img
          src={`/assets/logos/${rowData.team_name}.png`}
          width="30px"
          height="30px"
        />
      ) : null,
  },
  { title: 'GP', field: 'gp', type: 'numeric' },
  { title: 'G', field: 'g', type: 'numeric' },
  { title: 'A', field: 'a', type: 'numeric' },
  { title: 'P', field: 'p', type: 'numeric' },
  { title: '+/-', field: '+/-', type: 'numeric' },
  { title: 'PIM', field: 'pim', type: 'numeric' },
  { title: 'PPP', field: 'ppp', type: 'numeric' },
  { title: 'SHp', field: 'shp', type: 'numeric' },
  { title: 'Ht', field: 'ht', type: 'numeric' },
  { title: 'GA', field: 'ga', type: 'numeric' },
  { title: 'TA', field: 'ta', type: 'numeric' },
  { title: 'SOG', field: 'sog', type: 'numeric' },
  { title: 'S%', field: 'shot_percent', type: 'numeric' },
  { title: 'SB', field: 'sb', type: 'numeric' },
  { title: 'ATOI', field: 'atoi', type: 'time' },
  { title: 'APPT', field: 'appt', type: 'time' },
  { title: 'APKT', field: 'apkt', type: 'time' },
  { title: 'FO%', field: 'faceoff_percent', type: 'numeric' },
];

const goalieCols = [
  { title: 'Name', field: 'name', cellStyle: { whiteSpace: 'nowrap' } },
  {
    title: 'Team',
    field: 'team_name',
    render: (rowData) =>
      rowData.team_name ? (
        <img
          src={`/assets/logos/${rowData.team_name}.png`}
          width="30px"
          height="30px"
        />
      ) : null,
  },
  { title: 'GP', field: 'gp', type: 'numeric' },
  { title: 'W', field: 'w', type: 'numeric' },
  { title: 'L', field: 'l', type: 'numeric' },
  { title: 'T', field: 't', type: 'numeric' },
  { title: 'SHA', field: 'sha', type: 'numeric' },
  { title: 'GA', field: 'ga', type: 'numeric' },
  { title: 'GAA', field: 'gaa', type: 'numeric' },
  { title: 'SV%', field: 'sv', type: 'numeric' },
  { title: 'SO', field: 'so', type: 'numeric' },
  { title: 'G', field: 'g', type: 'numeric' },
  { title: 'A', field: 'a', type: 'numeric' },
  { title: 'PIM', field: 'pim', type: 'numeric' },
  { title: 'TOI', field: 'toi', type: 'numeric' },
];

export default function MasterStats() {
  const [seasons, setSeasons] = useState([]);
  const [seasonId, setSeasonId] = useState('');
  const [seasonType, setSeasonType] = useState('normal');
  const [playerType, setPlayerType] = useState('players');
  const [players, setPlayers] = useState([]);
  useEffect(() => {
    fetchSeasons();
  }, []);
  useEffect(() => {
    fetchPlayers();
  }, [seasonId, seasonType, playerType]);

  async function fetchSeasons() {
    try {
      const res = await axios.get('/api/seasons');
      setSeasons(res.data);
      // set last season as current
      setSeasonId(res.data[res.data.length - 1].id);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPlayers() {
    try {
      setPlayers([]);
      const res = await axios.get(
        `/api/seasons/${seasonId}/stats/type/${seasonType}/${playerType}`
      );
      setPlayers(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <FormControl fullWidth margin="normal">
        <FormGroup row>
          <Select
            value={playerType}
            onChange={(event) => setPlayerType(event.target.value)}
            style={{ marginLeft: 10, marginRight: 10 }}
          >
            <MenuItem disabled value="">
              SELECT A PLAYER TYPE
            </MenuItem>
            <MenuItem value="players">Players</MenuItem>
            <MenuItem value="goalies">Goalies</MenuItem>
          </Select>
          <Select
            style={{ marginRight: 10 }}
            value={seasonId}
            onChange={(event) => setSeasonId(event.target.value)}
          >
            <MenuItem disabled value="">
              SELECT A SEASON
            </MenuItem>
            {seasons.map((season) => (
              <MenuItem key={season.id} value={season.id}>
                {season.season}
              </MenuItem>
            ))}
          </Select>
          <Select
            style={{ marginRight: 10 }}
            value={seasonType}
            onChange={(event) => setSeasonType(event.target.value)}
          >
            <MenuItem disabled value="">
              SELECT A SEASON TYPE
            </MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="playoff">Playoffs</MenuItem>
          </Select>
        </FormGroup>
      </FormControl>
      {
        <MaterialTable
          icons={tableIcons}
          data={players}
          columns={playerType === 'players' ? playerCols : goalieCols}
          options={{
            pageSize: 25,
            pageSizeOptions: [25, 50, 100, 500, 1000],
            emptyRowsWhenPaging: false,
            padding: 'dense',

            // fixedColumns: {
            //   // left: 1,
            //   //   // right: 0
            // },
          }}
        />
      }
    </div>
  );
}
