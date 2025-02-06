import { Request, Response } from "express";
import {
  create,
  getAll,
  getById,
  getProducersWins,
  patch,
  remove,
  update,
} from "../services/movies";

export const createMovie = async (req: Request, res: Response) => {
  const { title, year, studios, producers, winner } = req.body;
  const movie = (await create({
    title,
    year,
    studios,
    producers,
    winner,
  })) as any;
  if (movie?.error) return res.status(400).send({ message: movie.message });
  return res.status(200).json(movie);
};

export const getAllMovies = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;
  const movies = await getAll(limit, offset);
  return res.status(200).json(movies);
};

export const getMovieById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const movie = await getById(parseInt(id));
  if (!movie) return res.status(404).json({ message: "Film not found" });
  return res.status(200).json(movie);
};

export const updateMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, year, studios, producers, winner } = req.body;
  const movie = (await update(parseInt(id), {
    title,
    year,
    studios,
    producers,
    winner,
  })) as any;
  if (movie?.error) return res.status(400).send({ message: movie.message });
  return res.status(201).json(movie);
};

export const patchMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const movie = (await patch(parseInt(id), updates)) as any;
  if (movie?.error) return res.status(400).send({ message: movie.message });
  return res.status(201).json(movie);
};

export const deleteMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  await remove(parseInt(id));
  return res.status(204).send({ message: "Film deleted" });
};

export const getProducersWithWinIntervals = async (
  _req: Request,
  res: Response
) => {
  const intervals = await getProducersWins();
  return res.status(200).json(intervals);
};
