import { Router } from 'express';
import { getTherapists, getTherapistById, getNearby } from './therapists.controller';
import { protect } from '../../middleware/auth';

const router = Router();
router.use(protect);

router.get('/nearby', getNearby);
router.get('/', getTherapists);
router.get('/:id', getTherapistById);

export default router;
