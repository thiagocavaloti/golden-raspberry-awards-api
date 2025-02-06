import { Singleton } from 'typescript-singleton';
import { MoviesRepository } from '../repositories/movies.repository';
import { Movie, MovieSchema } from '../schemas/movie.schema';
import { HttpZodParserError } from '../interface/error';

const instance = Singleton.getInstance<MoviesRepository>(
  'MoviesRepository',
  MoviesRepository
);

export const getAll = (limit: number, offset: number ) => {
  return instance.getAll(limit, offset);
}

export const getById = (id: number) => {
  return instance.getById(id);
}

export const create = (movie: Movie) => {
  const parseResult = MovieSchema.safeParse({ ...movie });
  if (!parseResult.success) {
    return new HttpZodParserError(parseResult.error);
  }
  return instance.create(movie);
}

export const update = (id: number, movie: Movie) => {
  const parseResult = MovieSchema.safeParse({ ...movie });
  if (!parseResult.success) {
    return new HttpZodParserError(parseResult.error);
  }
  return instance.update(id, movie);
}

export const patch = (id: number, updates: Partial<Movie>) => {
  return instance.patch(id, updates);
}

export const remove = (id: number) => {
  return instance.delete(id);
}

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

export const getProducersWins = async () => {
  const key = 'winner';
  const value = 'yes';
  const order = 'year';
  const rows: any = await instance.search(key, value, order);
  const producerWins = registerProducerWins(rows);
  const intervals = calculateIntervals(producerWins);

  const minInterval = Math.min(...intervals.map(i => i.interval));
  const maxInterval = Math.max(...intervals.map(i => i.interval));


  return {
    min: intervals.filter(i => i.interval === minInterval),
    max: intervals.filter(i => i.interval === maxInterval)
  };
}