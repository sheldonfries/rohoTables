const router = require('express').Router();
const csv = require('csv-string');
const db = require('../db');
const removeAccents = require('remove-accents');

const AHL_TO_NHL = {
  'Albany': 'Devils',
  'Iowa': 'Wild',
  'Binghamton': 'Senators',
  'Bridgeport': 'Islanders',
  'Utica': 'Canucks',
  'Grand Rapids': 'Red Wings',
  "St. John's": 'Canadiens',
  'Hartford': 'Rangers',
  'Hershey': 'Capitals',
  'Texas': 'Stars',
  'Bakersfield': 'Oilers',
  'Ontario': 'Kings',
  'Manitoba': 'Jets',
  'Milwaukee': 'Predators',
  'Rockford': 'Blackhawks',
  'Stockton': 'Flames',
  'Chicago': 'Blues',
  'Lehigh Valley': 'Flyers',
  'San Diego': 'Ducks',
  'Providence': 'Bruins',
  'Rochester': 'Sabres',
  'San Antonio': 'Avalanche',
  'Springfield': 'Panthers',
  'Syracuse': 'Lightning',
  'Toronto': 'Maple Leafs',
  'Wilkes-Barre/Scranton': 'Penguins',
  'San Jose': 'Sharks',
  'Tucson': 'Coyotes',
  'Cleveland': 'Blue Jackets',
  'Charlotte': 'Hurricanes',
};

router.post('/playerStats', async (req, res) => {
  try {
    const { csvString } = req.body;
    // get the latest seasonId
    const { id: seasonId } = await db('seasons')
      .first()
      .orderBy('season', 'desc');
    if (typeof csvString === 'string') {
      const data = csv.parse(csvString);
      // handle first part
      let sectionCount = 1;
      let lastWasDevider = false;
      let headersPlayers = null;
      let headersGoalies = null;

      const players = [];
      const goalies = [];
      for (let row of data) {
        if (row[0].includes('-----')) {
          sectionCount++;
          lastWasDevider = true;
          continue;
        }
        // players
        else if (sectionCount === 3) {
          if (lastWasDevider) {
            headersPlayers = [...row, 'season_type', 'season_id'];
          } else {
            row.push('normal');
            row.push(seasonId);
            const rowObj = headersPlayers.reduce(
              (obj, header, i) => ({ ...obj, [header]: row[i] }),
              {}
            );
            delete rowObj[''];
            players.push(rowObj);
          }
          // goalies
        } else if (sectionCount === 4) {
          if (lastWasDevider) {
            headersGoalies = [...row, 'season_type', 'season_id'];
          } else {
            row.push('normal');
            row.push(seasonId);
            const rowObj = headersGoalies.reduce(
              (obj, header, i) => ({ ...obj, [header]: row[i] }),
              {}
            );
            delete rowObj[''];
            goalies.push(rowObj);
          }
          // players playoff
        } else if (sectionCount === 6) {
          if (lastWasDevider) {
            headersPlayers = [...row, 'season_type', 'season_id'];
          } else {
            row.push('playoff');
            row.push(seasonId);

            const rowObj = headersPlayers.reduce(
              (obj, header, i) => ({
                ...obj,
                [header]: row[i],
              }),
              {}
            );
            delete rowObj[''];
            players.push(rowObj);
          }
          // goalies playoff
        } else if (sectionCount === 7) {
          if (lastWasDevider) {
            headersGoalies = [...row, 'season_type', 'season_id'];
          } else {
            row.push('playoff');
            row.push(seasonId);

            const rowObj = headersGoalies.reduce(
              (obj, header, i) => ({
                ...obj,
                [header]: row[i],
              }),
              {}
            );
            delete rowObj[''];
            goalies.push(rowObj);
          }
        }
        lastWasDevider = false;
      }
      await addNewData('players_stats', players, headersPlayers, seasonId);
      await addNewData('goalies_stats', goalies, headersGoalies, seasonId);
      res.status(204).send();
    } else {
      res.status(400).send();
    }
  } catch (error) {
    console.log(error);
  }
});

async function addNewData(table, data, headers, season_id) {
  try {
    if (await db.schema.hasTable(table)) {
      await db(table).del().where({ season_id });
      for (row of data) {
        try {
          checkTeam(row);

          await db(table).insert(row);
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      const tempTable = 'temp' + Date.now().toString();
      if (await db.schema.hasTable(tempTable))
        await db.schema.dropTable(tempTable);
      try {
        await db.schema.createTable(tempTable, (table) => {
          table.increments('id').primary();
          for (key of headers) {
            if (key === '') continue;
            table.string(key);
          }
        });
      } catch (error) {
        console.log(error);
      }
      for (row of data) {
        try {
          checkTeam(row);

          await db(tempTable).insert(row);
        } catch (error) {
          console.log(error);
        }
      }
      if (await db.schema.hasTable(table)) await db.schema.dropTable(table);

      await db.raw(`ALTER TABLE ${tempTable} RENAME TO ${table}`);
    }
  } catch (error) {
    throw error;
  }
}

function checkTeam(row) {
  row.Name = removeAccents(row.Name);
  row.Team = AHL_TO_NHL[row.Team] ?? row.Team;
}

module.exports = router;
