import React from 'react';
import Select from 'react-select';

export default function TradePickSelector({
  picks,
  setSelectedPicks,
  selectedPicks,
}) {
  return (
    <div>
      <Select
        isMulti
        options={picks.map((pick) => ({
          label: `${pick.season} ${pick.original_team_name}  Round: ${pick.round} `,
          value: pick,
        }))}
        value={selectedPicks.map((pick) => ({
          label: `${pick.season} ${pick.original_team_name}  Round: ${pick.round}`,
          value: pick,
        }))}
        onChange={(options) => {
          setSelectedPicks(
            options ? options.map((option) => option.value) : []
          );
        }}
      />
    </div>
  );
}
