import React, { useState, useEffect } from 'react';
import axios from '../requester';
import { Link, withRouter } from 'react-router-dom';
import converter from 'number-to-words';
import PlayersTable from '../components/PlayersTable';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import SimpleTable from '../components/SimpleTable';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';

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
    <div>
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
    <Grid container spacing={2}>
      <Grid item xs={9}>
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
      <Grid item xs={3}>
        <SimpleTable title='General Manager' rows={[team.gmName]} />
        <SimpleTable title='Total Cap Hit' rows={[team.capHit]} />
        <SimpleTable title='Cap Space' rows={[team.capSpace]} />
        <SimpleTable title='Salary Retained' rows={[team.retained]} />
        <SimpleTable title='Buyouts' rows={[team.buyout]} />
        <SimpleTable title='Average Age' rows={[team.averageAge]} />
        <SimpleTable
          title='Drafts'
          rows={team.draftPicks.map(
            ({ id, season, round, original_team_name }) =>
              `${season} ${original_team_name} ${converter.toOrdinal(round)}`
          )}
        />
      </Grid>
    </Grid>
    </div>
  );
}

export default withRouter(TeamDetails);
