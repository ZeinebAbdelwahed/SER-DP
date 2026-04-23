import { Router } from 'express';
import { getProfile, updateProfile } from './profile.controller';
import { protect } from '../../middleware/auth';

const router = Router();
router.use(protect);

router.get('/', getProfile);
router.patch('/', updateProfile);

export default router;
