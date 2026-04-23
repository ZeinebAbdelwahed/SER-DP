import { Request, Response, NextFunction } from 'express';
import Movie from '../../database/models/Movie';
import { Emotion } from '../../database/models/EmotionAnalysis';
import { searchTMDb, getMovieDetails, getPosterUrl } from '../../services/tmdb.service';
import { getWatchProviders } from '../../services/watchmode.service';
import { AppError } from '../../middleware/errorHandler';

export const getMoviesByEmotion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movies = await Movie.find({ emotion: req.params.emotion as Emotion });
    res.json(movies);
  } catch (err) { next(err); }
};

export const searchMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req.query;
    if (!query) throw new AppError('Query required', 400);
    const results = await searchTMDb(query as string);
    const formatted = results.slice(0, 10).map((m: any) => ({
      tmdbId: m.id,
      title: m.title,
      overview: m.overview,
      poster: getPosterUrl(m.poster_path),
      rating: m.vote_average,
    }));
    res.json(formatted);
  } catch (err) { next(err); }
};

export const getMovieById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) throw new AppError('Movie not found', 404);
    res.json(movie);
  } catch (err) { next(err); }
};

export const syncFromTMDb = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, emotion, whyRecommended } = req.body;
    const results = await searchTMDb(title);
    if (!results.length) throw new AppError('Movie not found on TMDb', 404);

    const m = results[0];
    const details = await getMovieDetails(m.id);
    const movie = await Movie.findOneAndUpdate(
      { tmdbId: m.id },
      {
        title: details.title,
        emotion,
        genre: details.genres?.map((g: any) => g.name) || [],
        whyRecommended,
        poster: getPosterUrl(details.poster_path),
        overview: details.overview,
        rating: details.vote_average,
        tmdbId: details.id,
      },
      { upsert: true, new: true }
    );
    res.json(movie);
  } catch (err) { next(err); }
};

export const getWatchProvidersByMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || !movie.tmdbId) throw new AppError('No TMDb ID for this movie', 404);
    const providers = await getWatchProviders(movie.tmdbId);
    res.json(providers);
  } catch (err) { next(err); }
};
