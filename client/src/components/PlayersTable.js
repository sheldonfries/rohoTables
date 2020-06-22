import React from 'react';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';

export default function PlayersTable(props) {
  const { players, title } = props;

  if (players.length === 0) return null;
  return (
    <div>
      <div style={{ margin: '10px 0' }}>
        <MaterialTable
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
            {
              title: '',
              field: 'country',
              render: (rowData) => (
                <img src={`/assets/flags/${rowData.country}.png`} />
              ),
              cellStyle: {
                width: 35,
                maxWidth: 35,
                // paddingRight: 0,
              },
              headerStyle: {
                // paddingRight: 0,
                width: 35,
                maxWidth: 35,
              },
            },
            {
              title: 'Name',
              field: 'name',
              render: (rowData) => (
                <Link to={`/players/${rowData.name}`}>{rowData.name}</Link>
              ),
            },
            { title: 'Pos', field: 'position' },
            { title: 'Type', field: 'type' },
            { title: 'Handedness', field: 'handedness' },
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
