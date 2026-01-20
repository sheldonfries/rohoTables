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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Container from '@material-ui/core/Container';

function TeamDetails(props) {
  const { match } = props;
  const [team, setTeam] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [seasonName, setSeasonName] = useState("");
  const [currentSeasonName, setCurrentSeasonName] = useState("");
  useEffect(() => {
    fetchSeasons();
  }, []);
  useEffect(() => {
    fetchTeam(match.params.name);
  }, [seasonName]);

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

  if (team === null) return null;
  return (
    <Container maxWidth="xl" style={{ paddingTop: 16, paddingBottom: 16 }}>
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
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ order: 1, textAlign: "center" }}>
          <Card variant="outlined" style={{ marginBottom: 16, padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Team Info
            </Typography>
            <Grid container spacing={1} textAlign="center">
              <Grid item xs={6}>
                <Typography variant="caption">GENERAL MANAGER</Typography>
                <Typography variant="body1">{team.gmName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">AVERAGE AGE</Typography>
                <Typography variant="body1">{team.averageAge}</Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Cap Overview */}
          <Card variant="outlined" style={{ marginBottom: 16, padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Cap Overview
            </Typography>
            <Grid container spacing={1} textAlign="center">
              <Grid item xs={6}>
                <Typography variant="caption">TOTAL CAP HIT</Typography>
                <Typography variant="body1">${team.capHit}M</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">CAP SPACE</Typography>
                <Typography variant="body1">${team.capSpace}M</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">RETAINED</Typography>
                <Typography variant="body1">${team.retained}M</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">BURIED</Typography>
                <Typography variant="body1">${team.buried}M</Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Draft Picks */}
          <Card variant="outlined" style={{ marginBottom: 16, padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Draft Picks
            </Typography>
            <List dense>
              {team.draftPicks.map(({ id, season, round, original_team_name }) => (
                <ListItem key={id} style={{ justifyContent: "center" }}>
                  {season} {original_team_name} {converter.toOrdinal(round)}
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} style={{ order: 2 }}>
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
