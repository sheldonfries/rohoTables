import React from 'react';
import Paper from '@material-ui/core/Paper';

export default function SimpleTable(props) {
  const { title, rows } = props;
  return (
    <Paper style={{ textAlign: 'center', margin: '10px 0' }}>
      <p
        style={{
          marginTop: 0,
          paddingTop: 10,
          backgroundColor: 'black',
          color: 'white',
        }}
      >
        {title}
      </p>
      {rows.map((row, i) => (
        <p key={i}>{row} </p>
      ))}
    </Paper>
  );
}
