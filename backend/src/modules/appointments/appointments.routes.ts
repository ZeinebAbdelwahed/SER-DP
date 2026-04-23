import { Router } from 'express';
import { createAppointment, getMyAppointments, cancelAppointment } from './appointments.controller';
import { protect } from '../../middleware/auth';

const router = Router();
router.use(protect);

router.post('/', createAppointment);
router.get('/my', getMyAppointments);
router.patch('/:id/cancel', cancelAppointment);

export default router;
