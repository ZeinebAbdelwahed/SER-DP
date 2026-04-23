import axios from 'axios';
import { ENV } from '../config/env';

const BASE = 'https://api.watchmode.com/v1';

export const getWatchProviders = async (tmdbId: number) => {
  if (!ENV.WATCHMODE_API_KEY) return [];
  try {
    const { data } = await axios.get(`${BASE}/search/`, {
      params: { apiKey: ENV.WATCHMODE_API_KEY, search_type: 'movie', search_value: tmdbId },
    });
    return data.title_results || [];
  } catch {
    return [];
  }
};
