import { Router } from 'express';
import { getMoviesByEmotion, searchMovies, getMovieById, syncFromTMDb, getWatchProvidersByMovie } from './movies.controller';
import { protect } from '../../middleware/auth';

const router = Router();
router.use(protect);

router.get('/by-emotion/:emotion', getMoviesByEmotion);
router.get('/search', searchMovies);
router.post('/sync/tmdb', syncFromTMDb);
router.get('/:id/watch-providers', getWatchProvidersByMovie);
router.get('/:id', getMovieById);

export default router;
