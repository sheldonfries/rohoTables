import React, { useEffect, useState } from 'react';
import axios from '../requester';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TradeCard from '../components/TradeCard';
import TransactionCard from '../components/TransactionCard';
import styled from 'styled-components';

export default function Home() {
  const [seasons, setSeasons] = useState([]);
  const [seasonId, setSeasonId] = useState('');
  const [trades, setTrades] = useState([]);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    axios
      .get('/api/seasons')
      .then((res) => {
        setSeasons(res.data);
        setSeasonId(res.data[res.data.length - 1].id);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (seasonId) {
      axios
        .get(`/api/trades?season_id=${seasonId}`)
        .then((res) => {
          setTrades(res.data);
        })
        .catch((error) => console.log(error));
      axios
        .get(`/api/transactions?season_id=${seasonId}`)
        .then((res) => {
          setTransactions(res.data);
        })
        .catch((error) => console.log(error));
    }
  }, [seasonId]);

  const events = [...transactions, ...trades].sort((a, b) => {
    const t =
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return t;
  });

  return (
    <Container>
      <div className='input-select-container'>
        <InputLabel id='season-select'>Season</InputLabel>
        <Select
          placeholder='Season'
          labelId='season-select'
          value={seasonId}
          onChange={(event) => setSeasonId(event.target.value)}
        >
          {seasons.map((season) => (
            <MenuItem key={season.id} value={season.id}>
              {season.season}
            </MenuItem>
          ))}
        </Select>
      </div>
      {events.map((event) =>
        !!('to' in event) ? (
          <TransactionCard transaction={event} />
        ) : (
          <TradeCard trade={event} />
        )
      )}
    </Container>
  );
}

const Container = styled.div`
  margin: 10px;
`;
// to: ""
// player_name: "Bret Hedican"
// team_name: "Thrashers"
