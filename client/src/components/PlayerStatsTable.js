import React from 'react';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';

const playerCols = [
  { title: 'Season', field: 'season' },
  {
    title: 'Team',
    field: 'team_name',
  },
  { title: 'GP', field: 'gp' },
  { title: 'G', field: 'g', type: 'numeric' },
  { title: 'A', field: 'a', type: 'numeric' },
  { title: 'P', field: 'p', type: 'numeric' },
  { title: '+/-', field: '+/-' },
  { title: 'PIM', field: 'pim', type: 'numeric' },
  { title: 'PPG', field: 'ppg', type: 'numeric' },
  { title: 'SHp', field: 'shp', type: 'numeric' },
  { title: 'Ht', field: 'ht', type: 'numeric' },
  { title: 'GWG', field: 'gwg', type: 'numeric' },
  { title: 'S', field: 's', type: 'numeric' },
  { title: 'S%', field: 'shot_percent', type: 'numeric' },
  { title: 'SB', field: 'sb', type: 'numeric' },
  { title: 'TOI/GP', field: 'time_by_goals', type: 'numeric' },
  { title: 'FO%', field: 'faceoff_percent', type: 'numeric' },
];
const goalieCols = [
  { title: 'Season', field: 'season' },
  { title: 'Team', field: 'team_name' },
  { title: 'GP', field: 'gp' },
  { title: 'W', field: 'w', type: 'numeric' },
  { title: 'L', field: 'l', type: 'numeric' },
  { title: 'T', field: 't', type: 'numeric' },
  { title: 'SHA', field: 'sha' },
  { title: 'GA', field: 'ga', type: 'numeric' },
  { title: 'GAA', field: 'gaa', type: 'numeric' },
  { title: 'SV', field: 'sv', type: 'numeric' },
  { title: 'SO', field: 'so', type: 'numeric' },
  { title: 'G', field: 'g', type: 'numeric' },
  { title: 'A', field: 'a', type: 'numeric' },
  { title: 'PIM', field: 'pim', type: 'numeric' },
  { title: 'TOI', field: 'toi', type: 'numeric' },
];

export default function PlayersTable(props) {
  const { stats, title, pos } = props;

  if (stats.length === 0) return null;
  return (
    <div>
      <div style={{ maxWidth: '100%' }}>
        <MaterialTable
          columns={pos === 'G' ? goalieCols : playerCols}
          data={stats}
          title={`${title}`}
        />
      </div>
    </div>
  );
}
// country: "ca"
// name: "Ray Whitney"
// position: "LW/RW"
// age: 35
// salary: 7
// contract_duration: 1
// expiry_type: "UFA"
