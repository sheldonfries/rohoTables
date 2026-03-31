import React, { useState, useEffect } from 'react';
import axios from '../requester';
import { Link, withRouter } from 'react-router-dom';
import PlayerStatsTable from '../components/PlayerStatsTable';
import MaterialTable from '@material-table/core';
import styled from 'styled-components';
import { Paper, Typography, Grid, Box, Container, Avatar } from '@material-ui/core';

function PlayerDetails(props) {
  const { match } = props;
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlayer(match.params.name);
  }, [match.params.name]);

  async function fetchPlayer(name) {
    try {
      setError(null);
      setPlayer(null);
      const res = await axios.get(`/api/players/${name}`);
      setPlayer(res.data);
      console.log(res.data);
    } catch (error) {
      if (error.response.status === 404) {
        setError('Player not found.');
      }
      console.log(error);
    }
  }

  if (error)
    return (
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 70px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {error}
      </div>
    );
  if (!player) return null;
  return (
    <Container maxWidth="xl" style={{ marginTop: 24 }}>
      {/* --- HERO SECTION --- */}
      <Paper elevation={0} style={{ padding: 24, marginBottom: 24, borderRadius: 12, border: '1px solid #e0e0e0' }}>
        <Grid container spacing={4} alignItems="center">
          {/* Column 1: Picture */}
          <Grid item xs={12} md={2} style={{ textAlign: 'center' }}>
            <Avatar 
              variant="rounded"
              //src={picture ?? null}
              style={{ width: 140, height: 140, margin: '0 auto' }}
            >
              {player.name ? player.name[0] : "P"}
            </Avatar>
          </Grid>

          {/* Column 2: Main Details */}
          <Grid item xs={12} md={5}>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h4" style={{ fontWeight: 800 }}>
                {player.name}
              </Typography>
            </Box>
            <Typography variant="h6" color="textSecondary">
              {player.team_name}
            </Typography>
            <Typography variant="subtitle1" style={{ marginTop: 4 }}>
              {player.pos} • {player.type}
            </Typography>
          </Grid>

          {/* Column 3: Secondary Details */}
          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="overline">Age</Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>{player.age}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">Salary / Years</Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>{player.salary} ({player.contract_duration} yrs)</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">Country</Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}><img src={`/assets/flags/${player.country}.png`} /></Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">Handedness</Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>{player.handedness}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">Expiry Status</Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>{player.expiry_type}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline">Ret Count</Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>{player.retention_count}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* --- MAIN CONTENT AREA --- */}
      <Grid container spacing={3}>
        {/* Left Side: Stats (70% width) */}
        <Grid item xs={12} md={8}>
          <Box mb={4}>
            <Paper elevation={0} style={{ padding: 20, marginBottom: 24, border: '1px solid #e0e0e0', borderRadius: 8 }}>
              <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 16 }}>Regular Season Stats</Typography>
              {player.normalStats.length > 0 || player.goalieNormalStats.length > 0 ? (
                <>
                  <PlayerStatsTable title='Regular Season' stats={player.normalStats} />
                  <PlayerStatsTable
                    title='Regular Season'
                    stats={player.goalieNormalStats}
                    pos='G'
                  />
                </>
              ) : <Typography variant="body1">No stats available.</Typography> }
            </Paper>
          </Box>
          {player.playoffStats.length > 0 || player.goaliePlayoffStats.length > 0 ? (
            <Box>
              <Paper elevation={0} style={{ padding: 20, marginBottom: 24, border: '1px solid #e0e0e0', borderRadius: 8 }}>
                <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 16 }}>Playoff Stats</Typography>
                <PlayerStatsTable title='Playoffs' stats={player.playoffStats} />
                <PlayerStatsTable
                  title='Playoffs'
                  stats={player.goaliePlayoffStats}
                  pos='G'
                />
              </Paper>
            </Box>
          ) : null}
        </Grid>

        {/* Right Side: Draft & Awards (30% width) */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} style={{ padding: 20, marginBottom: 24, border: '1px solid #e0e0e0', borderRadius: 8 }}>
            <Typography variant="h6" style={{ fontWeight: 700, borderBottom: '2px solid #f0f0f0', paddingBottom: 8, marginBottom: 16 }}>
              Draft Info
            </Typography>
            {player.draft_team_id ? (
              <>
                <Typography variant="body2"><img
                  src={`/assets/logos/${player.draft_team_name}.png`}
                  width='30px'
                  height='30px'
                /></Typography>
                <Typography variant="body2"><strong>Year:</strong> {player.draft_season_name}</Typography>
                <Typography variant="body2"><strong>Overall:</strong> {player.draft_overall}</Typography>
              </>
            ) : <Typography variant="body2">Undrafted</Typography>}
          </Paper>

          {player.trades.length > 0 ? (
            <Paper elevation={0} style={{ padding: 20, marginBottom: 24, border: '1px solid #e0e0e0', borderRadius: 8 }}>
              <Typography variant="h6" style={{ fontWeight: 700, borderBottom: '2px solid #f0f0f0', paddingBottom: 8, marginBottom: 16}}>
                Trade History
              </Typography>
              <MaterialTable
                title='Trade History'
                  options={{
                    search: false,
                    paging: false,
                    showTitle: false,
                    padding: 'dense',
                    toolbar: false,
                  }}
                  columns={[
                    {
                      title: 'Season',
                      field: 'season'
                    },
                    {
                      title: 'Team',
                      field: 'team_1',
                      render: (rowData) =>
                      rowData.team_1 ? (
                        <img
                          src={`/assets/logos/${rowData.team_1}.png`}
                          width='30px'
                          height='30px'
                        />
                      ) : null,
                    },
                    {
                      title: 'Received',
                      field: 'players_1',
                      render: (rowData) => {
                        const players = rowData.players_1.split(", ").map((player, index) => {
                          return (
                            <span key={index}>
                              {/\d/.test(player) ? (
                                player
                              ) : (
                                <Link to={`/players/${player}`}>
                                  {player}
                                </Link>
                              )}
                              {index < rowData.players_1.split(", ").length - 1 ? ', ' : ''}
                            </span>
                          );
                        });
                        return <>{players}</>;
                      },
                    },
                    {
                      title: 'Team',
                      field: 'team_2',
                      render: (rowData) =>
                      rowData.team_2 ? (
                        <img
                          src={`/assets/logos/${rowData.team_2}.png`}
                          width='30px'
                          height='30px'
                        />
                      ) : null,
                    },
                    {
                      title: 'Received',
                      field: 'players_2',
                      render: (rowData) => {
                        const players = rowData.players_2.split(", ").map((player, index) => {
                          return (
                            <span key={index}>
                              {/\d/.test(player) ? (
                                player
                              ) : (
                                <Link to={`/players/${player}`}>
                                  {player}
                                </Link>
                              )}
                              {index < rowData.players_2.split(", ").length - 1 ? ', ' : ''}
                            </span>
                          );
                        });
                        return <>{players}</>;
                      },
                    },
                  ]}
                  data={player.trades}
                />
            </Paper>
          ) : null}

          {player.awards.length > 0 ? (
            <Paper elevation={0} style={{ padding: 20, border: '1px solid #e0e0e0', borderRadius: 8 }}>
              <Typography variant="h6" style={{ fontWeight: 700, borderBottom: '2px solid #f0f0f0', paddingBottom: 8, marginBottom: 16 }}>
                Awards
              </Typography>
              <MaterialTable
                title='Awards'
                options={{
                  search: false,
                  paging: false,
                  sorting: false,
                  showTitle: false,
                  padding: 'dense',
                  toolbar: false,
                  // tableLayout: 'fixed',
                }}
                columns={[
                  { title: 'Season', field: 'season' },
                  {
                    title: 'Team',
                    field: 'team_name',
                    render: (rowData) =>
                      rowData.team_name ? (
                        <img
                          src={`/assets/logos/${rowData.team_name}.png`}
                          width='30px'
                          height='30px'
                        />
                      ) : null,
                  },
                  { title: 'Award', field: 'award' },
                ]}
                data={player.awards}
              />
            </Paper>
          ) : null}

          {player.draft_comparable || player.comparables.length > 0 ? (
            <Paper elevation={0} style={{ padding: 20, border: '1px solid #e0e0e0', borderRadius: 8 }}>
              <Typography variant="h6" style={{ fontWeight: 700, borderBottom: '2px solid #f0f0f0', paddingBottom: 8, marginBottom: 16 }}>
                Comparables
              </Typography>
              {player.draft_comparable ? (
                <Typography variant="body2">
                  <strong>Comparable: </strong> 
                  <Link to={`/players/${player.draft_comparable}`}>
                    {player.draft_comparable}
                  </Link>
                </Typography>
              ) : null}
              {player.comparables.length > 0 ? (
                <Typography variant="body2">
                  <strong>Comparable for: </strong>
                  {player.comparables.map((comp, index) => (
                    <React.Fragment key={index}>
                      <Link to={`/players/${comp.comparable_for}`}>
                        {comp.comparable_for}
                      </Link>
                      {/* Add a comma and space if it's not the last item in the list */}
                      {index < player.comparables.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </Typography>
              ) : null}
            </Paper>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
}
// is_draft_comparable_local
export default withRouter(PlayerDetails);