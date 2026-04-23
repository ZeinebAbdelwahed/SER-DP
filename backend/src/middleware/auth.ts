import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import User from '../database/models/User';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    req.user = { id: user.id };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
