import React, { useState, useEffect } from 'react';
import axios from '../requester';
import { Link, withRouter } from 'react-router-dom';
import PlayerStatsTable from '../components/PlayerStatsTable';
import MaterialTable from 'material-table';
import styled from 'styled-components';

function PlayerDetails(props) {
  const { match } = props;
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchPlayer(match.params.name);
  }, [match.params.name]);
  async function fetchPlayer(name) {
    try {
      setError(null);
      setPlayer(null);
      const res = await axios.get(`/api/players/${name}`);
      setPlayer(res.data);
    } catch (error) {
      if (error.response.status === 404) {
        setError('Player not found.');
      }
      console.log(error);
    }
  }
  if (error)
    return (
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 70px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {error}
      </div>
    );
  if (!player) return null;
  return (
    <div>
      <MaterialTable
        title='Player Profile'
        options={{
          search: false,
          paging: false,
          sorting: false,
          // showTitle: false,
          padding: 'dense',
          // toolbar: false,
        }}
        columns={[
          {
            title: 'Country',
            field: 'country',
            render: (rowData) => (
              <img src={`/assets/flags/${rowData.country}.png`} />
            ),
          },
          { title: 'Pos', field: 'pos' },
          {
            title: 'Type',
            field: 'type',
          },
          { title: 'Handedness', field: 'handedness' },
          { title: 'Age', field: 'age' },
          {
            title: 'Salary',
            field: 'salary',
          },
          { 
              title: 'Ret Count', 
              field: 'retention_count',
              cellStyle: (e, rowData) => {
                  if (rowData.retention_count == 2) {
                    return { color: "red", "font-weight": "bold" }
                  }
              }
            },
          { title: 'Years', field: 'contract_duration' },
          { title: 'Status', field: 'expiry_type' },
        ]}
        data={[{ ...player }]}
      />
      <PlayerStatsTable title='Regular Season' stats={player.normalStats} />
      <PlayerStatsTable
        title='Regular Season'
        stats={player.goalieNormalStats}
        pos='G'
      />

      <PlayerStatsTable title='Playoffs' stats={player.playoffStats} />
      <PlayerStatsTable
        title='Playoffs'
        stats={player.goaliePlayoffStats}
        pos='G'
      />
      {player.trades.length > 0 ? (
        <MaterialTable
          title='Trade History'
            options={{
              search: false,
              paging: false,
              // showTitle: false,
              padding: 'dense',
              // toolbar: false,
            }}
            columns={[
              {
                title: 'Season',
                field: 'season'
              },
              {
                title: 'Team',
                field: 'team_1',
                render: (rowData) =>
                rowData.team_1 ? (
                  <img
                    src={`/assets/logos/${rowData.team_1}.png`}
                    width='30px'
                    height='30px'
                  />
                ) : null,
              },
              {
                title: 'Received',
                field: 'players_1',
                render: (rowData) => {
                  const players = rowData.players_1.split(", ").map((player, index) => {
                    return (
                      <span key={index}>
                        {/\d/.test(player) ? (
                          player
                        ) : (
                          <Link to={`/players/${player}`}>
                            {player}
                          </Link>
                        )}
                        {index < rowData.players_1.split(", ").length - 1 ? ', ' : ''}
                      </span>
                    );
                  });
                  return <>{players}</>;
                },
              },
              {
                title: 'Team',
                field: 'team_2',
                render: (rowData) =>
                rowData.team_2 ? (
                  <img
                    src={`/assets/logos/${rowData.team_2}.png`}
                    width='30px'
                    height='30px'
                  />
                ) : null,
              },
              {
                title: 'Received',
                field: 'players_2',
                render: (rowData) => {
                  const players = rowData.players_2.split(", ").map((player, index) => {
                    return (
                      <span key={index}>
                        {/\d/.test(player) ? (
                          player
                        ) : (
                          <Link to={`/players/${player}`}>
                            {player}
                          </Link>
                        )}
                        {index < rowData.players_2.split(", ").length - 1 ? ', ' : ''}
                      </span>
                    );
                  });
                  return <>{players}</>;
                },
              },
            ]}
            data={player.trades}
          />
      ) : null}
      {player.awards.length > 0 ? (
        <MaterialTable
          title='Awards'
          options={{
            search: false,
            paging: false,
            sorting: false,
            // showTitle: false,
            padding: 'dense',
            // toolbar: false,
            // tableLayout: 'fixed',
          }}
          columns={[
            { title: 'Season', field: 'season' },
            {
              title: 'Team',
              field: 'team_name',
              render: (rowData) =>
                rowData.team_name ? (
                  <img
                    src={`/assets/logos/${rowData.team_name}.png`}
                    width='30px'
                    height='30px'
                  />
                ) : null,
            },
            { title: 'Award', field: 'award' },
          ]}
          data={player.awards}
        />
      ) : null}
      {player.draft_team_id ? (
        <MaterialTable
          title='Draft Info'
          options={{
            search: false,
            paging: false,
            // showTitle: false,
            padding: 'dense',
            // toolbar: false,
          }}
          columns={[
            { title: 'Season', field: 'draft_season_name' },
            {
              title: 'Team',
              field: 'draft_team_name',
              render: (rowData) =>
                rowData.draft_team_name ? (
                  <img
                    src={`/assets/logos/${rowData.draft_team_name}.png`}
                    width='30px'
                    height='30px'
                  />
                ) : null,
            },
            { title: 'Overall', field: 'draft_overall' },
            { title: 'Grade', field: 'rating' },
            {
              title: 'Comparable',
              field: 'draft_comparable',
              render: ({ is_draft_comparable_local, draft_comparable }) => {
                if (is_draft_comparable_local)
                  return (
                    <Link to={`/players/${draft_comparable}`}>
                      {draft_comparable}
                    </Link>
                  );
                return <p>{draft_comparable}</p>;
              },
            },
          ]}
          data={[{ ...player }]}
        />
      ) : null}
      {player.comparables.length > 0 ? (
        <MaterialTable
          title='Comparable For'
            options={{
              search: false,
              paging: false,
              // showTitle: false,
              padding: 'dense',
              // toolbar: false,
            }}
            columns={[
              {
                title: 'Name',
                field: 'comparable_for',
                render: ({ comparable_for }) => {
                  return (
                    <Link to={`/players/${comparable_for}`}>
                      {comparable_for}
                    </Link>
                  );
                },
              },
            ]}
            data={player.comparables}
          />
      ) : null}
    </div>
  );
}
// is_draft_comparable_local
export default withRouter(PlayerDetails);

const PlayerProfile = styled.div``;