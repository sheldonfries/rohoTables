import React from 'react';
import { Container, Grid } from '@material-ui/core';

export default function GeneralTransactionCard(props) {
  const { date, team1, team2, text } = props;

  return (
    <Container style={{ paddingTop: 8, paddingBottom: 8, border: '1px solid #eeeddd', borderRadius: 8 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Changed flexDirection to row and added a gap for spacing between logos */}
        <Grid 
          item 
          xs={2} 
          style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '4px' 
          }}
        >
          <img src={`/assets/logos/${team1}.png`} width="30px" height="30px" alt={team1} />
          {team2 && (
            <img src={`/assets/logos/${team2}.png`} width="30px" height="30px" alt={team2} />
          )}
        </Grid>

        <Grid item xs={10}>
          {/* Styled the date: smaller, grey, and reduced margin-bottom */}
          <p 
            className="date" 
            style={{ 
              fontSize: '0.75rem', 
              color: '#757575', 
              margin: '0 0 2px 0', // Tiny bottom margin to keep it close to the text
              fontWeight: 500 
            }}
          >
            {formatDate(date)}
          </p>
          <p 
            className="text" 
            style={{ margin: 0, lineHeight: '1.4' }}
          >
            {text}
          </p>
        </Grid>
      </Grid>
    </Container>
  );
}

function formatDate(dateString) {
  return dateString.slice(0, 10);
}