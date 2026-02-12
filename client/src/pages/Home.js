import React, { useEffect, useState } from 'react';
import axios from '../requester';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { Box, Container, Grid } from '@material-ui/core';
import TradeCard from '../components/TradeCard';
import TransactionCard from '../components/TransactionCard';
import { PaginatedSection } from '../components/PaginatedSection';
import { PlayerSearch } from '../components/PlayerSearch';

export default function Home() {
  const [seasons, setSeasons] = useState([]);
  const [seasonId, setSeasonId] = useState('');
  const [trades, setTrades] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [waivers, setWaivers] = useState([]);
  useEffect(() => {
    axios
      .get('/api/seasons')
      .then((res) => {
        setSeasons(res.data);
        setSeasonId(res.data[res.data.length - 1].id);
      })
      .catch((error) => console.log(error));
  }, []);

  const sortEvents = React.useCallback((events) => {
    return [...events].sort(
      (a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });

  useEffect(() => {
    if (!seasonId) return;

    const tradesController = new AbortController();
    const transactionsController = new AbortController();

    axios.get(`/api/trades?season_id=${seasonId}`, {
      signal: tradesController.signal
    })
      .then(res => {
        const trades = sortEvents(res.data);
        setTrades(trades);
      })
      .catch(err => {
        if (err.name !== 'CanceledError') console.error(err);
      });

    axios.get(`/api/transactions?season_id=${seasonId}`, {
      signal: transactionsController.signal
    })
      .then(res => {
        const transactions = sortEvents(res.data);
        const [waivers, rest] = transactions.reduce((acc, tx) => {
          if (tx.to === 'Waivers' || tx.to === 'Cleared') {
            acc[0].push(tx);
          } else {
            acc[1].push(tx);
          }
          return acc;
        }, [[], []]);
        setWaivers(waivers);
        setTransactions(rest);
      })
      .catch(err => {
        if (err.name !== 'CanceledError') console.error(err);
      });

    return () => {
      tradesController.abort();
      transactionsController.abort();
    };
  }, [seasonId]);

  return (
    <Container maxWidth="xl" style={{ marginTop: 20, marginBottom: 20 }}>
      <Grid container spacing={2} alignItems="flex-end" style={{ padding: 2 }}>
        <Grid item xs={4} sm={1}>
          <Box className="input-select-container">
            <InputLabel id="season-select" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 0.5 }}>
              SEASON
            </InputLabel>
            <Select
              fullWidth
              size="small"
              labelId="season-select"
              value={seasonId}
              onChange={(event) => setSeasonId(event.target.value)}
              style={{ backgroundColor: '#fff', borderRadius: '8px' }}
            >
              {seasons.map((season) => (
                <MenuItem key={season.id} value={season.id}>
                  {season.season}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>
        {/* Spacer / Middle (Optional) */}
        <Grid item xs={false} sm={true} />

        {/* Right Side: Search */}
        <Grid item xs={8} sm={3}>
          <PlayerSearch />
        </Grid>
      </Grid>
      <Grid container spacing={3} alignItems="flex-start">
        
        {/* Transactions Section */}
        <PaginatedSection 
          title="Transactions"
          data={transactions}
          renderItem={(tx) => <TransactionCard key={tx.id} transaction={tx} />}
        />

        {/* Waivers Column */}
        <PaginatedSection 
          title="Waivers"
          data={waivers}
          renderItem={(tx) => <TransactionCard key={tx.id} transaction={tx} />}
        />

        {/* Trades Column */}
        <PaginatedSection 
          title="Trades"
          data={trades}
          renderItem={(trade) => <TradeCard key={trade.id} trade={trade} />}
        />

      </Grid>
    </Container>
  );
}
// to: ""
// player_name: "Bret Hedican"
// team_name: "Thrashers"
