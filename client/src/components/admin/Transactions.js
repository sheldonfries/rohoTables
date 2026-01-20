import React, { useEffect, useState } from 'react';
import axios from '../../requester';
import {
  Box,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Button,
  Typography,
} from "@material-ui/core";
import Select from "react-select";

export default function Transactions() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayerOptions, setSelectedPlayerOptions] = useState([]);
  const [type, setType] = useState('');
  const [claimedTeamId, setClaimedTeamId] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (teamName) {
      fetchPlayers(teamName);
    }
  }, [teamName]);

  async function fetchTeams() {
    try {
      const res = await axios.get('/api/teams');
      setTeams(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPlayers(name) {
    try {
      const res = await axios.get(`/api/teams/${name}`);
      setPlayers(res.data.players);
    } catch (error) {
      console.log(error);
    }
  }

  async function submit() {
    const templateBody = { type };
    templateBody.teamId = teams.find((team) => team.name === teamName).id;
    if (type === 'Release') {
      templateBody.teamId = 31;
    } else if (type === 'Claimed') {
      templateBody.teamId = claimedTeamId;
      templateBody.status = 'NHL';
    }
    if (type === 'Cleared' || type === 'Minors') {
      templateBody.status = 'Minors';
    } else if (type === 'NHL') {
      templateBody.status = 'NHL';
    } else if (type === 'Waivers') {
      templateBody.status = 'Waivers';
    } else if (type === 'Retired') {
      templateBody.status = 'Retired';
    } else if (type === 'Buyout') {
      templateBody.status = 'Buyout';
    }
    for (let selectedPlayerOption of selectedPlayerOptions) {
      const { value: id } = selectedPlayerOption;
      try {
        await axios.post('/api/transactions', {
          playerId: id,
          ...templateBody,
        });
        setTeamName('');
        setPlayers([]);
        setSelectedPlayerOptions([]);
        setType('');
        setClaimedTeamId('');
      } catch (error) {
        console.log(error);
      }
    }
  }

  function filterPlayers() {
    return players.filter((player) => {
      switch (type) {
        case '': {
          return false;
        }
        case 'Release': {
          return player.salary === 0 && player.status !== 'Retired';
        }
        case 'Claimed': {
          return player.status === 'Waivers';
        }
        case 'Cleared': {
          return player.status === 'Waivers';
        }
        case 'Minors': {
          return (
            (player.pos === 'G') 
            ? player.totalGP < 45 && player.age < 25 && player.status === 'NHL'
            : player.totalGP < 140 && player.age < 25 && player.status === 'NHL'
          );
        }
        case 'NHL': {
          return player.status === 'Minors';
        }
        case 'Waivers': {
          return (
            (player.pos === 'G') 
            ? (player.totalGP >= 45 || player.age >= 25) && player.status === 'NHL'
            : (player.totalGP >= 140 || player.age >= 25) && player.status === 'NHL'
          );
        }

        case 'Retired': {
          return player.age > 34 && player.status !== 'Retired';
        }
        default:
          return true;
      }
    });
  }

  return (
    <Box maxWidth={700} mx="auto" mt={3}>
      <Paper elevation={3} style={{ padding: 24 }}>
        <Typography variant="h6" gutterBottom>
          Player Transaction
        </Typography>

        <Grid container spacing={2}>
          {/* Team */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Team</InputLabel>
              <MuiSelect
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              >
                <MenuItem disabled value="">
                  Select a team
                </MenuItem>
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.name}>
                    {team.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Grid>

          {/* Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Transaction Type</InputLabel>
              <MuiSelect
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem disabled value="">
                  Select a type
                </MenuItem>
                <MenuItem value="Minors">Send Down</MenuItem>
                <MenuItem value="NHL">Call Up</MenuItem>
                <MenuItem value="Waivers">Waive</MenuItem>
                <MenuItem value="Cleared">Cleared</MenuItem>
                <MenuItem value="Claimed">Claimed</MenuItem>
                <MenuItem value="Release">Released</MenuItem>
                <MenuItem value="Retired">Retired</MenuItem>
                <MenuItem value="Buyout">Buyout</MenuItem>
              </MuiSelect>
            </FormControl>
          </Grid>

          {/* Claimed Team */}
          {type === "Claimed" && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Claimed By</InputLabel>
                <MuiSelect
                  value={claimedTeamId}
                  onChange={(e) => setClaimedTeamId(e.target.value)}
                >
                  <MenuItem disabled value="">
                    Select a team
                  </MenuItem>
                  {teams
                    .filter((team) => team.name !== teamName)
                    .map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                </MuiSelect>
              </FormControl>
            </Grid>
          )}

          {/* Players */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Players
            </Typography>
            <Select
              isMulti
              value={selectedPlayerOptions}
              onChange={setSelectedPlayerOptions}
              options={filterPlayers().map((player) => ({
                value: player.id,
                label: player.name,
              }))}
            />
          </Grid>

          {/* Submit */}
          <Grid item xs={12} style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={submit}
              disabled={!teamName || !type || !selectedPlayerOptions || selectedPlayerOptions.length === 0}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
// send down, call up, waive, cleared, retired,
//    Minor(cleared), NHL, Retired, waivers,
//   TEAM CHANGE
//   Claimed, Release, */
