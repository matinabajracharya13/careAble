import { candidateProfile, getCandidates } from '@/controllers/candidateController';
import { authenticate } from '@/middleware/authenticate';
import { requireEmployer } from '@/middleware/employer';
import { Router } from 'express';

const router = Router();
router.use(authenticate);

router.get('/', requireEmployer, getCandidates);
router.get('/:userId', candidateProfile);

export default router;
