import sqlite3 from 'sqlite3';
import csvParser from 'csv-parser';
import fs from 'fs';

const MOVIES_DATA = 'data/movies.csv';
const db = new sqlite3.Database(':memory:');

/*

    CREATE TABLE studios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL
    ),

    CREATE TABLE producers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      minWinInterval INTEGER,
      maxWinInterval INTEGER,
      totalWin INTEGER DEFAULT 0
    ),

    CREATE TABLE studios_movies (
      studio_id INTEGER,
      movie_id INTEGER,
      PRIMARY KEY (studio_id, movie_id),
      FOREIGN KEY (studio_id) REFERENCES studios(id),
      FOREIGN KEY (movie_id) REFERENCES movies(id)
    ),

    CREATE TABLE producers_movies (
      producer_id INTEGER,
      movie_id INTEGER,
      PRIMARY KEY (producer_id, movie_id),
      FOREIGN KEY (producer_id) REFERENCES producers(id),
      FOREIGN KEY (movie_id) REFERENCES movies(id)
    ),

    CREATE TABLE producer_wins (
      producer_id INTEGER,
      year INTEGER,
      FOREIGN KEY (producer_id) REFERENCES producers(id)
    )

*/

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