import React from 'react';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';

const playerCols = [
  { title: 'Season', field: 'season' },
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
  { title: 'Season', field: 'season' },
  { title: 'Team', field: 'team_name' },
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

export default function PlayersTable(props) {
  const { stats, title, pos } = props;

  if (stats.length === 0) return null;
  // get total row

  const totalRow = stats.reduce((totals, stat) => {
    if (pos === 'G') {
      goalieCols.forEach((col) => {
        if (col.type === 'numeric') {
          totals[col.field] =
            typeof totals[col.field] === 'number'
              ? totals[col.field] + parseFloat(stat[col.field])
              : parseFloat(stat[col.field]);
        }
      });
    } else {
      playerCols.forEach((col) => {
        if (col.type === 'numeric') {
          totals[col.field] =
            typeof totals[col.field] === 'number'
              ? totals[col.field] + parseFloat(stat[col.field])
              : parseFloat(stat[col.field]);
        } else if (col.type === 'time') {
          totals[col.field] =
            typeof totals[col.field] === 'string'
              ? sumTimeString(totals[col.field], stat[col.field])
              : stat[col.field];
        }
      });
    }
    return totals;
  }, {});

  if (pos === 'G') {
    totalRow.gaa =
      totalRow.ga && totalRow.toi
        ? ((totalRow.ga * 60) / totalRow.toi).toFixed(2)
        : 0;
    totalRow.sv =
      totalRow.ga && totalRow.sha
        ? (1 - totalRow.ga / totalRow.sha).toFixed(3)
        : 0;
  } else {
    totalRow.shot_percent =
      totalRow.sog && totalRow.g
        ? Math.round((totalRow.g / totalRow.sog) * 100)
        : 0;
    totalRow.faceoff_percent = totalRow.faceoff_percent / stats.length;
    totalRow.atoi = divideTimeString(totalRow.atoi, stats.length);
    totalRow.appt = divideTimeString(totalRow.appt, stats.length);
    totalRow.apkt = divideTimeString(totalRow.apkt, stats.length);
  }
  totalRow.season = 'Total';
  stats.push(totalRow);
  return (
    <div>
      <div style={{ maxWidth: '100%' }}>
        <MaterialTable
          options={{
            search: false,
            paging: false,
            // showTitle: false,
            padding: 'dense',
            // toolbar: false,
          }}
          columns={pos === 'G' ? goalieCols : playerCols}
          data={stats}
          title={`${title}`}
        />
      </div>
    </div>
  );
}

function sumTimeString(time1, time2) {
  const time1Mins =
    parseInt(time1.split(':')[0]) * 60 + parseInt(time1.split(':')[1]);
  const time2Mins =
    parseInt(time2.split(':')[0]) * 60 + parseInt(time2.split(':')[1]);

  const grandTotalMins = time1Mins + time2Mins;

  //Now using your own code

  var bookH = `0${Math.floor(grandTotalMins / 60)}`;
  var bookM = `0${grandTotalMins % 60}`;

  return bookH.slice(1) + ':' + bookM.slice(1);
}

function divideTimeString(time, divisor) {
  const totalMins =
    parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
  const dividedMins = totalMins / divisor;
  var bookH = `0${Math.floor(dividedMins / 60)}`;
  var bookM = `0${Math.round(dividedMins % 60)}`;
  return bookH.slice(1) + ':' + bookM.slice(1);
}
// country: "ca"
// name: "Ray Whitney"
// position: "LW/RW"
// age: 35
// salary: 7
// contract_duration: 1
// expiry_type: "UFA"
