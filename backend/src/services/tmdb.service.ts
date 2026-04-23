import axios from 'axios';
import { ENV } from '../config/env';

const BASE = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE,
  params: { api_key: ENV.TMDB_API_KEY, language: 'en-US' },
});

export const searchTMDb = async (query: string) => {
  const { data } = await tmdb.get('/search/movie', { params: { query } });
  return data.results;
};

export const getMovieDetails = async (tmdbId: number) => {
  const { data } = await tmdb.get(`/movie/${tmdbId}`);
  return data;
};

export const getPosterUrl = (posterPath: string | null) =>
  posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;
