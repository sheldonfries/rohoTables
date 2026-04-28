import React, { useEffect, useState } from 'react';
import axios from '../../requester';
import TeamSelector from './TeamSelector';
import TradePickSelector from './TradePickSelector';
import TradePlayersSelector from './TradePlayersSelector';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Divider,
  Button,
  Container,
} from "@material-ui/core";

export default function Trades() {
  const [teams, setTeams] = useState([]);
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [players, setPlayers] = useState({ players1: [], players2: [] });
  const [drafts, setDrafts] = useState({ drafts1: [], drafts2: [] });
  const [leavingPlayers, setLeavingPlayers] = useState({ t1: [], t2: [] });
  const [leavingDrafts, setLeavingDrafts] = useState({ t1: [], t2: [] });
  const [confirmedTrade, setConfirmedTrade] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (team1Id) {
      fetchPlayers(team1Id, 1);
      setPlayers({ ...players, players1: [] });
      setDrafts({ ...drafts, drafts1: [] });
      setLeavingPlayers({ ...leavingPlayers, t1: [] });
      setLeavingDrafts({ ...leavingDrafts, t1: [] });
    }
  }, [team1Id]);

  useEffect(() => {
    if (team2Id) {
      fetchPlayers(team2Id, 2);
      setPlayers({ ...players, players2: [] });
      setDrafts({ ...drafts, drafts2: [] });
      setLeavingPlayers({ ...leavingPlayers, t2: [] });
      setLeavingDrafts({ ...leavingDrafts, t2: [] });
    }
  }, [team2Id]);

  async function fetchTeams() {
    try {
      const res = await axios.get('/api/teams');
      setTeams(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPlayers(id, teamNumber) {
    try {
      const team = teams.find((team) => team.id == id);
      const res = await axios.get(`/api/teams/${team.name}`);
      setPlayers({
        ...players,
        [`players${teamNumber}`]: res.data.players.filter(
          (player) => player.status !== 'Retained'
        ),
      });
      setDrafts({ ...drafts, [`drafts${teamNumber}`]: res.data.draftPicks });
    } catch (error) {
      console.log(error);
    }
  }
  /*
{
    team1:{
        id,
        receivingPlayers:[{id, retained:number}],
        receivingDraftPicks:[draftId]
    },
    team2:{
        id,
        receivingPlayers:[id, retained],
        receivingDraftPicks:[draftId]
    }
}
*/
  async function submit() {
    const body = {
      team1: {
        id: team1Id,
        receivingPlayers: leavingPlayers.t2.map((p) => ({
          id: p.id,
          retained: p.retained,
        })),
        receivingDraftPicks: leavingDrafts.t2.map((d) => d.id),
      },
      team2: {
        id: team2Id,
        receivingPlayers: leavingPlayers.t1.map((p) => ({
          id: p.id,
          retained: p.retained,
        })),
        receivingDraftPicks: leavingDrafts.t1.map((d) => d.id),
      },
    };
    try {
      await axios.post('/api/trades', body);
      reset();
    } catch (error) {
      debugger;
      console.log(error);
      alert('ERROR TELL ROHO');
    }
  }
  function reset() {
    setTeam1Id('');
    setTeam2Id('');
    setPlayers({ players1: [], players2: [] });
    setDrafts({ drafts1: [], drafts2: [] });
    setLeavingPlayers({ t1: [], t2: [] });
    setLeavingDrafts({ t1: [], t2: [] });
  }

  function undo() {

  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} mx="auto">
        {/* TEAM 1 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 16, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Team 1
            </Typography>

            <Divider style={{ marginBottom: 16 }} />

            <Box mb={2}>
              <TeamSelector
                teams={teams.filter((team) => team.id !== team2Id)}
                setSelectedTeam={setTeam1Id}
                value={team1Id}
              />
            </Box>

            {team1Id && (
              <>
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Players Leaving
                  </Typography>
                  <TradePlayersSelector
                    players={players.players1}
                    selectedPlayers={leavingPlayers.t1}
                    setSelectedPlayers={(players) =>
                      setLeavingPlayers({ ...leavingPlayers, t1: players })
                    }
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Draft Picks Leaving
                  </Typography>
                  <TradePickSelector
                    picks={drafts.drafts1}
                    selectedPicks={leavingDrafts.t1}
                    setSelectedPicks={(drafts) =>
                      setLeavingDrafts({ ...leavingDrafts, t1: drafts })
                    }
                  />
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* TEAM 2 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 16, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Team 2
            </Typography>

            <Divider style={{ marginBottom: 16 }} />

            <Box mb={2}>
              <TeamSelector
                teams={teams.filter((team) => team.id !== team1Id)}
                setSelectedTeam={setTeam2Id}
                value={team2Id}
              />
            </Box>

            {team2Id && (
              <>
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Players Leaving
                  </Typography>
                  <TradePlayersSelector
                    players={players.players2}
                    selectedPlayers={leavingPlayers.t2}
                    setSelectedPlayers={(players) =>
                      setLeavingPlayers({ ...leavingPlayers, t2: players })
                    }
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Draft Picks Leaving
                  </Typography>
                  <TradePickSelector
                    picks={drafts.drafts2}
                    selectedPicks={leavingDrafts.t2}
                    setSelectedPicks={(drafts) =>
                      setLeavingDrafts({ ...leavingDrafts, t2: drafts })
                    }
                  />
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* ACTIONS */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" mt={2} gridGap={16}>
            <Button
              variant="contained"
              color="primary"
              onClick={submit}
              disabled={!team1Id || !team2Id}
            >
              Submit Trade
            </Button>

            {confirmedTrade && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={undo}
              >
                Undo
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
