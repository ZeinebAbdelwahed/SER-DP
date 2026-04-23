import { Router } from 'express';
import { analyzeEmotion, getHistory, getAnalysisById } from './emotions.controller';
import { protect } from '../../middleware/auth';
import { upload } from '../../middleware/upload';

const router = Router();

router.use(protect);
router.post('/analyze', upload.single('audio'), analyzeEmotion);
router.get('/history', getHistory);
router.get('/:id', getAnalysisById);

export default router;
