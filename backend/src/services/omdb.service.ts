import axios from 'axios';
import { ENV } from '../config/env';

const BASE = 'http://www.omdbapi.com/';

export const getOMDbMovie = async (title: string) => {
  if (!ENV.OMDB_API_KEY) return null;
  try {
    const { data } = await axios.get(BASE, {
      params: { apikey: ENV.OMDB_API_KEY, t: title },
    });
    return data.Response === 'True' ? data : null;
  } catch {
    return null;
  }
};
