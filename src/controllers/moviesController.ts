import { Request, Response } from 'express';
import db from '../config/db';

export const createMovie = (req: Request, res: Response) => {
  const { title, year, studios, producers, winner } = req.body;
  const query = `INSERT INTO movies (title, year, studios, producers, winner) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [title, year, studios, producers, winner], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, year, studios, producers, winner });
  });
};

export const getAllMovies = (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  const query = `SELECT * FROM movies LIMIT ? OFFSET ?`;

  db.all(query, [limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

export const getMovieById = (req: Request, res: Response) => {
  const { id } = req.params;
  db.get(`SELECT * FROM movies WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Film not found' });
    res.json(row);
  });
};

export const updateMovie = (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, year, studios, producers, winner } = req.body;

  const query = `UPDATE movies SET title = ?, year = ?, studios = ?, producers = ?, winner = ? WHERE id = ?`;
  db.run(query, [title, year, studios, producers, winner, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Film not found' });
    res.json({ id, title, year, studios, producers, winner });
  });
};

export const patchMovie = (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
  const values = Object.values(updates);

  const query = `UPDATE movies SET ${fields} WHERE id = ?`;
  db.run(query, [...values, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Film not found' });
    res.json({ id, ...updates });
  });
};

export const deleteMovie = (req: Request, res: Response) => {
  const { id } = req.params;
  db.run(`DELETE FROM movies WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Film not found' });
    res.status(204).send();
  });
};

const extractProducers = (producers: string) => {
  return producers
    .split(/\s*,\s*|\s+and\s+/)
    .map(p => p.trim())
    .filter(Boolean);
};

const registerProducerWins = (rows: { producers: string; year: string }[]) => {
  const producerWins: { [key: string]: number[] } = {};

  for (const { producers, year } of rows) {
    const yearInt = parseInt(year);
    const producersList = extractProducers(producers);

    producersList.forEach(producer => {
      if (!producerWins[producer]) {
        producerWins[producer] = [];
      }

      // ✅ Garante que o ano não está duplicado
      if (!producerWins[producer].includes(yearInt)) {
        producerWins[producer].push(yearInt);
      }
    });
  }

  return producerWins;
};

const calculateIntervals = (producerWins: { [key: string]: number[] }) => {
  const intervals = [];

  for (const producer in producerWins) {
    const wins = producerWins[producer].sort((a, b) => a - b);
    for (let i = 1; i < wins.length; i++) {
      intervals.push({
        producer,
        interval: wins[i] - wins[i - 1],
        previousWin: wins[i - 1],
        followingWin: wins[i]
      });
    }
  }

  return intervals;
};

export const getProducersWithWinIntervals = (req: Request, res: Response) => {
  const query = `
    SELECT producers, year, winner
    FROM movies
    WHERE winner = 'yes'
    ORDER BY year;
`;

  db.all(query, [], (err, rows: { producers: string; year: string }[]) => {
    if (err) return res.status(500).json({ error: err.message });

    const producerWins = registerProducerWins(rows);
    const intervals = calculateIntervals(producerWins);

    const minInterval = Math.min(...intervals.map(i => i.interval));
    const maxInterval = Math.max(...intervals.map(i => i.interval));

    res.status(200).json({
      min: intervals.filter(i => i.interval === minInterval),
      max: intervals.filter(i => i.interval === maxInterval)
    });
  });
};
