import React from 'react';
import GeneralTransactionCard from './GeneralTransactionCard';

export default function TransactionCard({ transaction }) {
  const { team_name, to, player_name, created_at } = transaction;

  let text = '';

  switch (to) {
    case 'Minors': {
      text = `${team_name} send ${player_name} to the minors`;
      break;
    }
    case 'NHL': {
      text = `${team_name} recall ${player_name} to the NHL`;
      break;
    }
    case 'Waivers': {
      text = `${team_name} place ${player_name} on waivers`;
      break;
    }
    case 'Cleared': {
      text = `${player_name} clears waivers for ${team_name}`;
      break;
    }
    case 'Claimed': {
      text = `${team_name} claim ${player_name} off waivers`;
      break;
    }
    case 'Sign': {
      text = `${team_name} signs ${player_name}`;
      break;
    }
    case 'Resign': {
      text = `${team_name} re-sign ${player_name}`;
      break;
    }
    case 'Release': {
      text = `${team_name} release ${player_name}`;
      break;
    }
    case 'Retired': {
      text = `${player_name} retires`;
      break;
    }
  }

  const Text = <> </>;
  return (
    <GeneralTransactionCard date={created_at} team1={team_name} text={text} />
  );
}

// created_at: "2020-05-01T03:06:47.000Z"
// id: 669
// player_id: 698
// player_name: "Scott Nichol"
// season_id: 4
// season_name: "2009-10"
// team_id: 27
// team_name: "Lightning"
// to: "Cleared"
// updated_at: "2020-05-01T03:06:47.000Z"
