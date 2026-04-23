import { Router } from 'express';
import { chat, getChatHistory } from './chat.controller';
import { protect } from '../../middleware/auth';

const router = Router();
router.use(protect);

router.post('/', chat);
router.get('/history', getChatHistory);

export default router;
