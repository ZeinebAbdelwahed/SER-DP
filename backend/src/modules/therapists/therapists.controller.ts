import { Request, Response, NextFunction } from 'express';
import Therapist from '../../database/models/Therapist';

export const getTherapists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city, specialty, consultationType } = req.query;
    const filter: Record<string, unknown> = {};
    if (city) filter.city = new RegExp(city as string, 'i');
    if (specialty) filter.specialty = new RegExp(specialty as string, 'i');
    if (consultationType) filter.consultationType = consultationType;

    const therapists = await Therapist.find(filter).sort({ rating: -1 });
    res.json(therapists);
  } catch (err) { next(err); }
};

export const getTherapistById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const t = await Therapist.findById(req.params.id);
    if (!t) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(t);
  } catch (err) { next(err); }
};

export const getNearby = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simple city-based proximity placeholder
    const { city } = req.query;
    const filter = city ? { city: new RegExp(city as string, 'i') } : {};
    const therapists = await Therapist.find(filter).sort({ rating: -1 }).limit(10);
    res.json(therapists);
  } catch (err) { next(err); }
};
