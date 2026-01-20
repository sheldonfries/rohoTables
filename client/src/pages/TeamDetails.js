import React, { useState, useEffect } from 'react';
import axios from '../requester';
import { Link, withRouter } from 'react-router-dom';
import converter from 'number-to-words';
import PlayersTable from '../components/PlayersTable';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import CapStat from '../components/CapStat';

function TeamDetails(props) {
  const { match } = props;
  const [team, setTeam] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [seasonName, setSeasonName] = useState("");
  const [currentSeasonName, setCurrentSeasonName] = useState("");
  const [groupedPicks, setGroupedPicks] = useState({});
  useEffect(() => {
    fetchSeasons();
  }, []);
  useEffect(() => {
    fetchTeam(match.params.name);
  }, [seasonName]);
  useEffect(() => {
    if (team) {
      groupPicksBySeason(team.draftPicks);
    }
  }, [team]);

  async function fetchSeasons() {
    try {
      const res = await axios.get('/api/seasons');
      setSeasons(res.data);
      const name = res.data[res.data.length - 1].season;
      setSeasonName(name);
      setCurrentSeasonName(name);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchTeam(name) {
    try {
      let apiLocation = `/api/teams/${name}`;
      if (seasonName.length > 0 && currentSeasonName.length > 0 && seasonName != currentSeasonName)
        apiLocation += `/${seasonName}`;

      const res = await axios.get(apiLocation);
      setTeam(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function groupPicksBySeason(picks) {
    const picksBySeason = team.draftPicks.reduce((acc, pick) => {
      const { season } = pick;
      if (!acc[season]) {
        acc[season] = [];
      }
      acc[season].push(pick);
      return acc;
    }, {});
    setGroupedPicks(picksBySeason);
  }

  if (team === null) return null;
  return (
    <Container maxWidth="xl" style={{ paddingTop: 16, paddingBottom: 16 }}>
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ order: 1 }}>
          <Card variant="outlined" style={{ padding: 16, backgroundColor: `${team.primaryColor}`, color: `${team.secondaryColor}`, borderRadius: "15px 15px 0 0" }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={1}>
                <Avatar style={{ width: 125, height: 125, bgcolor: 'white', color: '#1a237e', fontSize: '2rem' }} src={`/assets/logos/${team.name}.png`} alt={team.name} imgProps={{ style: { objectFit: 'contain' } }}/>
              </Grid>
              <Grid item xs={12} md={7} sm container>
                <Grid item xs container direction="column">
                  <Typography variant="h3" fontWeight="bold">{team.city} {team.name}</Typography>
                  <Typography variant="subtitle1" style={{ opacity: 0.8 }}>General Manager: {team.gmName}</Typography>
                  <Typography variant="subtitle1" style={{ opacity: 0.8 }}>Average Age: {team.averageAge}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <CapStat label="Total Cap Hit" value={team.capHit} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <CapStat 
                        label="Cap Space" 
                        value={team.capSpace} 
                        color={team.capSpace > 0 ? 'success' : 'error'} 
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <CapStat label="Retained" value={team.retained} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <CapStat label="Buried" value={team.buried} />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* Draft Picks */}
          <Card variant="outlined" style={{ marginBottom: 16, padding: 16, borderRadius: "0 0 15px 15px" }}>
            <Typography variant="h6" gutterBottom>
              Draft Picks
            </Typography>
            <Box sx={{ mt: 2 }}>
              {Object.entries(groupedPicks)
                .sort(([yearA], [yearB]) => yearA - yearB)
                .map(([season, picks]) => (
                  <Box key={season} style={{ display: 'flex', marginBottom: 1, alignItems: 'baseline' }}>
                    <Typography 
                      variant="subtitle2" 
                      style={{ fontWeight: 'bold', minWidth: '50px', color: 'primary.main' }}
                    >
                      {season}:
                    </Typography>

                    <Typography variant="body2" style={{ marginLeft: 1, color: 'text.secondary' }}>
                      {picks.map((pick, index) => (
                        <span key={pick.id}>
                          {pick.original_team_name} {converter.toOrdinal(pick.round)}
                          {index < picks.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Card>
        </Grid>
        <Grid item  xs={12} style={{ order: 2 }}>
          <FormControl fullWidth margin='normal' style={{paddingLeft: "10px"}}>
          <FormGroup row>
            <Select
                style={{ marginRight: 10 }}
                value={seasonName}
                onChange={(event) => setSeasonName(event.target.value)}
              >
                <MenuItem disabled value=''>
                  SELECT A SEASON
                </MenuItem>
                {seasons.map((season) => (
                  <MenuItem key={season.season} value={season.season}>
                    {season.season}
                  </MenuItem>
                ))}
              </Select>
          </FormGroup>
        </FormControl>
      </Grid>
        <Grid item xs={12} style={{ order: 3 }}>
          <PlayersTable
            title='Forwards'
            players={team.players.filter(
              (player) =>
                player.status === 'NHL' &&
                player.contract_type === 'signed' &&
                player.position.match(/^C|^LW|^RW/)
            )}
          />
          <PlayersTable
            title='Defense'
            players={team.players.filter(
              (player) =>
                player.status === 'NHL' &&
                player.contract_type === 'signed' &&
                player.position.match(/^LD|^RD/)
            )}
          />
          <PlayersTable
            title='Goaltenders'
            players={team.players.filter(
              (player) =>
                player.status === 'NHL' &&
                player.contract_type === 'signed' &&
                player.position.match(/^G/)
            )}
          />
          {/* retained */}
          <PlayersTable
            title='Retained'
            players={team.players.filter(
              (player) => player.status === 'Retained'
            )}
          />
          <PlayersTable
            title='Buried'
            players={team.players.filter(
              (player) =>
                (player.position.match(/^G/)) ? 
                (player.totalGP >= 45 || player.age >= 24) && player.status === 'Minors' && player.salary > 1
                : (player.totalGP >= 140 || player.age >= 24) && player.status === 'Minors' && player.salary > 1
            ).map(
              (player) => ({ ...player, salary: Number((player.salary - 1).toFixed(4))})
            )}
          />
          <PlayersTable
            title='Buyouts'
            players={team.players.filter((player) => player.status === 'Buyout')}
          />
          <PlayersTable
            title='Waivers'
            players={team.players.filter((player) => player.status === 'Waivers')}
          />
          <PlayersTable
            title='In The System'
            players={team.players.filter(
              (player) =>
                player.status === 'Minors' && player.contract_type === 'signed'
            )}
          />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default withRouter(TeamDetails);
