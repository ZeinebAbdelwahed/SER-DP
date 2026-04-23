import { Response, NextFunction } from 'express';
import Appointment from '../../database/models/Appointment';
import { AuthRequest } from '../../middleware/auth';
import { AppError } from '../../middleware/errorHandler';

export const createAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { therapist, consultationType, date, time, notes } = req.body;
    if (!therapist || !consultationType || !date || !time) throw new AppError('Missing fields', 400);
    const apt = await Appointment.create({ user: req.user!.id, therapist, consultationType, date, time, notes });
    res.status(201).json(apt);
  } catch (err) { next(err); }
};

export const getMyAppointments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apts = await Appointment.find({ user: req.user!.id })
      .populate('therapist', 'name city specialty')
      .sort({ date: -1 });
    res.json(apts);
  } catch (err) { next(err); }
};

export const cancelAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const apt = await Appointment.findOneAndUpdate(
      { _id: req.params.id, user: req.user!.id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!apt) throw new AppError('Appointment not found', 404);
    res.json(apt);
  } catch (err) { next(err); }
};
