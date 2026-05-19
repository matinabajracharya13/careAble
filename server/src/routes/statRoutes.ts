import { getStats } from '@/controllers/statsController';
import { authenticate } from '@/middleware/authenticate';
import { Router } from 'express';

const router = Router();
router.use(authenticate);

router.get('/', getStats);

export default router;
