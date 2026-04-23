import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../database/models/User';
import { ENV } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';

const signToken = (id: string) =>
  jwt.sign({ id }, ENV.JWT_SECRET as string, { expiresIn: (ENV.JWT_EXPIRES_IN as string) as any });

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw new AppError('All fields are required', 400);

    const exists = await User.findOne({ email });
    if (exists) throw new AppError('Email already in use', 409);

    const user = await User.create({ name, email, password });
    const token = signToken(user.id);
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, language: user.language } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Email and password required', 400);

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, language: user.language } });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request & { user?: { id: string } }, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) throw new AppError('Not found', 404);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (_req: Request, res: Response) => {
  // Placeholder — integrate email service as needed
  res.json({ message: 'If this email exists, a reset link was sent.' });
};