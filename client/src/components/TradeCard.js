import React from 'react';
import GeneralTransactionCard from './GeneralTransactionCard';
import { Link } from 'react-router-dom';
import { Divider } from '@material-ui/core';

export default function Trade({ trade }) {
  // Helper function to process items for a specific receiving team
  const formatItems = (receivingTeamId) => {
    const items = trade.trade_items
      .filter((item) => item.receiving_team_id === receivingTeamId)
      .map((item) => {
        // If it's a draft pick
        if (item.draft_round !== null) {
          return `${item.draft_season} ${item.draft_original_team_name} ${item.draft_round}`;
        }
        // If it's a player
        return item.name;
      });

    if (items.length === 0) return "future considerations";
    if (items.length === 1) return items[0];
    
    // Join all but the last item with commas, then add "and" before the last item
    const lastItem = items.pop();
    return `${items.join(", ")} and ${lastItem}`;
  };

  const items1String = formatItems(trade.team_id_2);
  const items2String = formatItems(trade.team_id_1);

  return (
    <>
      <GeneralTransactionCard
        date={trade.created_at}
        team1={trade.team_name_1}
        team2={trade.team_name_2}
        text={`${trade.team_name_1} trade ${items1String} to ${trade.team_name_2} in exchange for ${items2String}`}
      />
      <Divider style={{ marginBottom: 8 }} />
    </>
  );
}
// receiving_team_id: 29
// draft_original_team_name: "Hurricanes"
// draft_season: 2009
// draft_round: 2
// name: null

// id: 22
// created_at: "2020-04-18T13:26:52.000Z"
// updated_at: "2020-04-18T13:26:52.000Z"
// season_id: 3
// team_id_1: 7
// team_id_2: 29
// team_name_1: "Blackhawks"
// team_name_2: "Canucks"
// trade_items:

// receiving_team_id: 7
// draft_original_team_name: null
// draft_season: null
// draft_round: null
// name: "Jean-Pierre Dumont"
