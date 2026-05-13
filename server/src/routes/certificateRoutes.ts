import { getCertificateByCode, getCertificates } from '@/controllers/certificateController';
import { authenticate } from '@/middleware/authenticate';
import { Router } from 'express';

const router = Router();
router.use(authenticate);

router.get('/', getCertificates);
router.get('/:code', getCertificateByCode);

export default router;
