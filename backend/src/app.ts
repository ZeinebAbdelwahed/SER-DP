import express from 'express';
import cors from 'cors';
import path from 'path';

import { errorHandler } from './middleware/errorHandler';
import authRouter from './modules/auth/auth.routes';
import emotionsRouter from './modules/emotions/emotions.routes';
import recommendationsRouter from './modules/recommendations/recommendations.routes';
import moviesRouter from './modules/movies/movies.routes';
import therapistsRouter from './modules/therapists/therapists.routes';
import appointmentsRouter from './modules/appointments/appointments.routes';
import chatRouter from './modules/chat/chat.routes';
import profileRouter from './modules/profile/profile.routes';

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL].filter(Boolean) as string[], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/emotions', emotionsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/therapists', therapistsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/profile', profileRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
