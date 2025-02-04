import express from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  patchMovie,
  deleteMovie,
  getProducersWithWinIntervals
} from '../controllers/moviesController';

const router = express.Router();

router.get('/producers/intervals', getProducersWithWinIntervals);
router.get('/', getAllMovies);
router.post('/', createMovie);
router.get('/:id', getMovieById);
router.put('/:id', updateMovie);
router.patch('/:id', patchMovie);
router.delete('/:id', deleteMovie);


export default router;