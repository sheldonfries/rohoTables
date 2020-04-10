import React from 'react';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';

export default function PlayersTable(props) {
  const { players, title } = props;

  if (players.length === 0) return null;
  return (
    <div>
      <div style={{ maxWidth: '100%' }}>
        <MaterialTable
          columns={[
            //   {
            //       title :'',
            //       field:'country',

            //   }
            {
              title: 'Name',
              field: 'name',
              render: (rowData) => (
                <Link to={`/players/${rowData.name}`}>{rowData.name}</Link>
              ),
            },
            { title: 'Pos', field: 'position' },
            { title: 'Age', field: 'age', type: 'numeric' },
            { title: 'Cap', field: 'salary', type: 'numeric' },
            { title: 'Years', field: 'contract_duration', type: 'numeric' },
            { title: 'Status', field: 'expiry_type' },
          ]}
          data={players}
          title={`${title} (${players.length})`}
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
