import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/ser_wellness',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PYTHON_AI_URL: process.env.PYTHON_AI_URL || 'http://localhost:8000',
  TMDB_API_KEY: process.env.TMDB_API_KEY || '',
  WATCHMODE_API_KEY: process.env.WATCHMODE_API_KEY || '',
  OMDB_API_KEY: process.env.OMDB_API_KEY || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
