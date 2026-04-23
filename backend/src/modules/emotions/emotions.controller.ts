import { Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../../middleware/auth';
import { analyzeAudio } from '../../services/ai.service';
import EmotionAnalysis from '../../database/models/EmotionAnalysis';
import { AppError } from '../../middleware/errorHandler';

export const analyzeEmotion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw new AppError('Audio file is required', 400);

    const filePath = path.resolve(req.file.path);
    const result = await analyzeAudio(filePath);

    const analysis = await EmotionAnalysis.create({
      user: req.user!.id,
      emotion: result.emotion,
      confidence: result.confidence,
      probabilities: result.probabilities,
      audioFile: req.file.filename,
    });

    // Clean up uploaded file after analysis
    fs.unlink(filePath, () => {});

    res.status(201).json({ analysis });
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const analyses = await EmotionAnalysis.find({ user: req.user!.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(analyses);
  } catch (err) {
    next(err);
  }
};

export const getAnalysisById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const analysis = await EmotionAnalysis.findOne({ _id: req.params.id, user: req.user!.id });
    if (!analysis) throw new AppError('Not found', 404);
    res.json(analysis);
  } catch (err) {
    next(err);
  }
};
