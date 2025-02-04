import sqlite3 from 'sqlite3';
import csvParser from 'csv-parser';
import fs from 'fs';

const MOVIES_DATA = 'data/movies.csv';
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      title VARCHAR(255) NOT NULL,
      studios VARCHAR(500),
      producers VARCHAR(500),
      winner VARCHAR(3)
    )
  `);

  fs.createReadStream(MOVIES_DATA)
    .pipe(csvParser( { separator: ';' }))
    .on('data', (row) => {
      db.run(
        `INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)`,
        [row.year, row.title, row.studios, row.producers, row.winner]
      );
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
});

export default db;