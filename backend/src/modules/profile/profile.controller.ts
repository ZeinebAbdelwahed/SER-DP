import { Response, NextFunction } from 'express';
import User from '../../database/models/User';
import { AuthRequest } from '../../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    res.json(user);
  } catch (err) { next(err); }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const allowed = ['name', 'language', 'notificationsEnabled'];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.user!.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) { next(err); }
};
