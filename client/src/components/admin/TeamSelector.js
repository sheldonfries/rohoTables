import React from 'react';

export default function TeamSelector({ teams, selectedTeam, setSelectedTeam }) {
  return (
    <select
      value={selectedTeam}
      onChange={(event) => setSelectedTeam(event.target.value)}
    >
      <option value="">SELECT A TEAM</option>
      {teams.map((team) => (
        <option value={team.id} key={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  );
}
