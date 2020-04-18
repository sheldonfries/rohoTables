import React from 'react';

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
    <div>
      <select onChange={(event) => selectPlayer(event.target.value)}>
        <option value="">SELECT A PLAYER</option>
        {players
          .filter(
            (player) =>
              !selectedPlayers.find((sPlayer) => sPlayer.id == player.id)
          )
          .map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
      </select>
      {selectedPlayers.map((sPlayer) => (
        <div key={sPlayer.id}>
          <span>{sPlayer.name}</span>
          <input
            onChange={(event) => changeRetained(event.target.value, sPlayer.id)}
            type="number"
            value={sPlayer.retained}
          />
          <span onClick={() => removePlayer(sPlayer.id)}>x</span>
        </div>
      ))}
    </div>
  );
}
