const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const filePath = path.join(__dirname, '../csv/awards.csv');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  return await knex('awards')
    .del()
    .then(async function () {
      // Inserts seed entries
      const rows = [];
      return await new Promise((resolve, reject) => {
        try {
          fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
              for (key in data) {
                if (data[key] === '') data[key] = null;
              }
              rows.push(data);
            })
            .on('end', async () => {
              await knex('awards').insert(rows);
              resolve();
            });
        } catch (error) {
          reject(error);
        }
      });
    });
};
