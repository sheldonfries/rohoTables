import React from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
export default function GeneralTransactionCard(props) {
  const { date, team1, team2, text } = props;
  return (
    <Container>
      <p className="date">{formatDate(date)}</p>

      <div>
        <img src={`/assets/logos/${team1}.png`} width="30px" height="30px" />
        {team2 ? (
          <img src={`/assets/logos/${team2}.png`} width="30px" height="30px" />
        ) : null}
      </div>

      <p className="text">{text}</p>
    </Container>
  );
}

function formatDate(dateString) {
  return dateString.slice(0, 10);
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  .date {
    width: 100px;
  }
  div {
    width: 100px;
  }
  .text {
    width: 400px;
  }
  display: flex;
  justify-content: space-around;
  align-items: base;
`;
