import { Request, Response, NextFunction } from 'express';
import { RECOMMENDATIONS } from '../../data/recommendations.data';
import { Emotion } from '../../database/models/EmotionAnalysis';
import { AppError } from '../../middleware/errorHandler';

const getEmotion = (req: Request): Emotion => {
  const e = req.params.emotion as Emotion;
  if (!RECOMMENDATIONS[e]) throw new AppError('Invalid emotion', 400);
  return e;
};

export const getRecommendations = (req: Request, res: Response, next: NextFunction) => {
  try {
    const e = getEmotion(req);
    res.json(RECOMMENDATIONS[e]);
  } catch (err) {
    next(err);
  }
};

export const getActivities = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ activities: RECOMMENDATIONS[getEmotion(req)].activities });
  } catch (err) { next(err); }
};

export const getTherapy = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ therapy: RECOMMENDATIONS[getEmotion(req)].therapy });
  } catch (err) { next(err); }
};

export const getChatbotPrompts = (req: Request, res: Response, next: NextFunction) => {
  try {
    const rec = RECOMMENDATIONS[getEmotion(req)];
    res.json({ mode: rec.chatbotMode, prompt: rec.chatbotPrompt });
  } catch (err) { next(err); }
};
