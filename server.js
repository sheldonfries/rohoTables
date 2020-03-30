const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const csv = require('csv-string');

const db = require('./db');

const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json({ limit: '50mb' }));

server.get('/api/players', async (req, res) => {
  try {
    const isPlayoff = req.query.isPlayoff == '1';
    const players = await db('players').where({
      season: isPlayoff ? 'playoff' : 'normal'
    });
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.get('/api/goalies', async (req, res) => {
  try {
    const isPlayoff = req.query.isPlayoff == '1';
    const goalies = await db('goalies').where({
      season: isPlayoff ? 'playoff' : 'normal'
    });
    res.status(200).json(goalies);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post('/uploader', async (req, res) => {
  try {
    const isPlayoff = req.query.isPlayoff == '1';
    const { csvString } = req.body;
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
            headersPlayers = [...row, 'season'];
          } else {
            row.push('normal');
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
            headersGoalies = [...row, 'season'];
          } else {
            row.push('normal');
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
            headersPlayers = [...row, 'season'];
          } else {
            row.push('playoff');

            const rowObj = headersPlayers.reduce(
              (obj, header, i) => ({
                ...obj,
                [header]: row[i]
              }),
              {}
            );
            delete rowObj[''];
            players.push(rowObj);
          }
          // goalies playoff
        } else if (sectionCount === 7) {
          if (lastWasDevider) {
            headersGoalies = [...row, 'season'];
          } else {
            row.push('playoff');

            const rowObj = headersGoalies.reduce(
              (obj, header, i) => ({
                ...obj,
                [header]: row[i]
              }),
              {}
            );
            delete rowObj[''];
            goalies.push(rowObj);
          }
        }
        lastWasDevider = false;
      }
      await addNewData(
        isPlayoff ? 'playersplayoff' : 'players',
        players,
        headersPlayers
      );
      await addNewData(
        isPlayoff ? 'goaliesolayoff' : 'goalies',
        goalies,
        headersGoalies
      );
      res.status(204).send();
    } else {
      res.status(400).send();
    }
  } catch (error) {
    console.log(error);
  }
});

async function addNewData(table, data, headers) {
  try {
    if (await db.schema.hasTable('temp')) await db.schema.dropTable('temp');
    try {
      await db.schema.createTable('temp', table => {
        table.increments('id');
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

        await db('temp').insert(row);
      } catch (error) {
        console.log(error);
      }
    }
    if (await db.schema.hasTable(table)) await db.schema.dropTable(table);

    await db.raw(`ALTER TABLE temp RENAME TO ${table}`);
  } catch (error) {
    throw error;
  }
}

server.use((req, res, next) => {
  if (req.path.indexOf('.') === -1) {
    req.url += '.html';
  }
  next();
}, express.static(path.join(__dirname, 'public')));

function checkTeam(row) {
  switch (row.Team) {
    case 'Albany':
      row.Team = 'Devils';
      break;
    case 'Houston':
      row.Team = 'Wild';
      break;
    case 'Binghamton':
      row.Team = 'Senators';
      break;
    case 'Bridgeport':
      row.Team = 'Islanders';
      break;
    case 'Chicago':
      row.Team = 'Thrashers';
      break;
    case 'Grand Rapids':
      row.Team = 'Red Wings';
      break;
    case 'Hamilton':
      row.Team = 'Canadiens';
      break;
    case 'Hartford':
      row.Team = 'Rangers';
      break;
    case 'Hershey':
      row.Team = 'Capitals';
      break;
    case 'Iowa':
      row.Team = 'Stars';
      break;
    case 'Lowell':
      row.Team = 'Devils';
      break;
    case 'Manchester':
      row.Team = 'Kings';
      break;
    case 'Manitoba':
      row.Team = 'Canucks';
      break;
    case 'Milwaukee':
      row.Team = 'Predators';
      break;
    case 'Norfolk':
      row.Team = 'Blackhawks';
      break;
    case 'Omaha':
      row.Team = 'Flames';
      break;
    case 'Peoria':
      row.Team = 'Blues';
      break;
    case 'Philadelphia':
      row.Team = 'Flyers';
      break;
    case 'Portland':
      row.Team = 'Ducks';
      break;
    case 'Providence':
      row.Team = 'Bruins';
      break;
    case 'Rochester':
      row.Team = 'Sabres';
      break;
    case 'San Antonio':
      row.Team = 'Coyotes';
      break;
    case 'Springfield':
      row.Team = 'Lightning';
      break;
    case 'Syracuse':
      row.Team = 'Columbus';
      break;
    case 'Toronto':
      row.Team = 'Maple Leafs';
      break;
    case 'Wilkes-Barre/Scranton':
      row.Team = 'Penguins';
      break;
    case 'Worcester':
      row.Team = 'Sharks';
      break;
    case 'Wilkes-Barre/Scranton':
      row.Team = 'Penguins';
      break;
  }
}
module.exports = server;
