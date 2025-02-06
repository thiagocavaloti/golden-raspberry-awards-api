import sqlite3 from 'sqlite3';
import db from '../config/db';
import { Movie } from '../schemas/movie.schema';

export class MoviesRepository {

  private db: sqlite3.Database;
  
  constructor() {
    this.db = db;
  }

  getAll(limit: number, offset: number) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM movies LIMIT ? OFFSET ?`;

      this.db.all(query, [limit, offset], (err: any, rows: any) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  getById(id: number) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM movies WHERE id = ?`, [id], (err: any, row: any) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(row);
      });
    });
  }

  create({
    title,
    year,
    studios,
    producers,
    winner
  }: {
    title: string;
    year: number;
    studios: string;
    producers: string;
    winner: string;  
  }) {

    return new Promise((resolve, reject) => {
      const query = `INSERT INTO movies (title, year, studios, producers, winner) VALUES (?, ?, ?, ?, ?)`;
      this.db.run(query, [title, year, studios, producers, winner], function (err: any) {
        if (err) return reject(err);
        resolve({ id: this.lastID, title, year, studios, producers, winner });
      });
    });
  }

  update(
    id: number,
  {
    title,
    year,
    studios,
    producers,
    winner
  }: {
    title: string;
    year: number;
    studios: string;
    producers: string;
    winner: string
  }) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE movies SET title = ?, year = ?, studios = ?, producers = ?, winner = ? WHERE id = ?`;
      this.db.run(query, [title, year, studios, producers, winner, id], function (err: any) {
        if (err) return reject(err);
        resolve({ id, title, year, studios, producers, winner });
      });
    });
  }

  patch(id: number, updates: Partial<Movie>) {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map((field) => `${field} = ?`).join(', ');
      const values = Object.values(updates);

      const query = `UPDATE movies SET ${fields} WHERE id = ?`;
      this.db.run(query, [...values, id], function (err: any, row: any) {
        if (err) return reject(err);
        resolve({ id, ...updates });
      });
    });
  }

  delete(id: number) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM movies WHERE id = ?`;
      this.db.run(query, [id], function (err: any, row: any) {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(id);
      });
    });
  }

  search(key: string, value: string, order: string = 'id') {
    return new Promise((resolve, reject) => {
      const validColumns = ['title', 'year', 'studios', 'producers', 'winner', 'id'];
    
      if (!validColumns.includes(key) || !validColumns.includes(order)) {
        return reject(new Error("Invalid column name"));
      }

      const query = `SELECT producers, year, winner FROM movies WHERE ${key} = ? ORDER BY ${order}`;

      this.db.all(query, [value], (err: any, rows: any) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

}