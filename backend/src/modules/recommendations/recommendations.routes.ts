import { Router } from 'express';
import { getRecommendations, getActivities, getTherapy, getChatbotPrompts } from './recommendations.controller';
import { protect } from '../../middleware/auth';

const router = Router();
router.use(protect);

router.get('/:emotion', getRecommendations);
router.get('/:emotion/activities', getActivities);
router.get('/:emotion/therapy', getTherapy);
router.get('/:emotion/chatbot-prompts', getChatbotPrompts);

export default router;
