import React from 'react';
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  TextField,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close"

export default function TradePlayersSelector({
  players,
  selectedPlayers,
  setSelectedPlayers,
}) {
  function selectPlayer(id) {
    if (!id) return;
    const player = players.find((p) => p.id == id);
    setSelectedPlayers([
      ...selectedPlayers,
      { id: player.id, name: player.name, retained: 0 },
    ]);
  }

  function changeRetained(retained, playerId) {
    setSelectedPlayers(
      selectedPlayers.map((sPlayer) => {
        if (sPlayer.id == playerId) {
          sPlayer.retained = retained;
        }
        return sPlayer;
      })
    );
  }
  function removePlayer(id) {
    setSelectedPlayers(selectedPlayers.filter((sPlayer) => sPlayer.id != id));
  }
  return (
    <Paper elevation={2} style={{ padding: 16 }}>
      <Typography variant="subtitle1" gutterBottom>
        Select Players
      </Typography>

      {/* Player selector */}
      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel id="player-select-label">Player</InputLabel>
          <Select
            labelId="player-select-label"
            value=""
            onChange={(event) => selectPlayer(event.target.value)}
          >
            <MenuItem value="">
              <em>Select a player</em>
            </MenuItem>
            {players
              .filter(
                (player) =>
                  !selectedPlayers.find((sPlayer) => sPlayer.id === player.id)
              )
              .map((player) => (
                <MenuItem key={player.id} value={player.id}>
                  {player.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      {/* Selected players */}
      {selectedPlayers.map((sPlayer) => (
        <Box
          key={sPlayer.id}
          mb={1}
          p={1}
          border={1}
          borderColor="grey.300"
          borderRadius={4}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Typography>{sPlayer.name}</Typography>
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Retained"
                type="number"
                value={sPlayer.retained}
                onChange={(event) =>
                  changeRetained(event.target.value, sPlayer.id)
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={2}>
              <IconButton
                aria-label="remove"
                onClick={() => removePlayer(sPlayer.id)}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Paper>
  );
}
