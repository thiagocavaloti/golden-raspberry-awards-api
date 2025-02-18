import request from 'supertest';
import { app, server } from '../src/server';
import db from '../src/config/db';

describe('Golden Raspberry Awards API Integration Tests', () => {

  afterAll((done) => {
    server.close(() => {
      db.close(() => done());
    });
  });

  let createdMovieId: number;

  it('POST /api/movies - should create new movie', async () => {
    const res = await request(app)
      .post('/api/movies')
      .send({ producers: 'HomeLand', studios: 'Warner', title: 'Test Movie', year: 2024, winner: 'yes' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    createdMovieId = res.body.id;
  });

  it('GET /api/movies - should return all films', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/movies/:id - should return a specific film', async () => {
    const res = await request(app).get(`/api/movies/${createdMovieId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toBe('Test Movie');
    expect(res.body.winner).toBe('yes');
  });

  it('PUT /api/movies/:id - should update the film', async () => {
    const res = await request(app)
      .put(`/api/movies/${createdMovieId}`)
      .send({ producers:'Test', studios: 'Test', title: 'Updated Movie', year: 2025, winner:'' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toBe('Updated Movie');
    expect(res.body.winner).toBe('');
  });

  it('PATCH /api/movies/:id - should partial update a film', async () => {
    const res = await request(app)
      .patch(`/api/movies/${createdMovieId}`)
      .send({ winner: '' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.winner).toBe('');
  });

  it('DELETE /api/movies/:id - should delete a film', async () => {
    const res = await request(app).delete(`/api/movies/${createdMovieId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('GET /api/movies/:id - should return 404 for a non-existent movie', async () => {
    const res = await request(app).get(`/api/movies/${createdMovieId}`);
    expect(res.statusCode).toEqual(404);
  });

  it('GET /api/movies/producers/intervals - should return producers with min and max intervals', async () => {
    const res = await request(app).get('/api/movies/producers/intervals');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('min');
    expect(res.body).toHaveProperty('max');

    const minIntervals = res.body.min;
    expect(Array.isArray(minIntervals)).toBe(true);
    minIntervals.forEach(interval => {
      expect(interval).toHaveProperty('producer');
      expect(interval).toHaveProperty('interval');
      expect(interval).toHaveProperty('previousWin');
    });

    const maxIntervals = res.body.max;
    expect(Array.isArray(maxIntervals)).toBe(true);
    maxIntervals.forEach(interval => {
      expect(interval).toHaveProperty('producer');
      expect(interval).toHaveProperty('interval');
      expect(interval).toHaveProperty('previousWin');
      expect(interval).toHaveProperty('followingWin');
    });
  });

  it('GET /api/movies/producers/intervals - should return expectedResponse data according with csv file', async () => {
    const res = await request(app).get('/api/movies/producers/intervals');
    const expectedResponse = {
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991
        }
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015
        }
      ]
    };

    expect(res.body).toEqual(expectedResponse);

  })

});
