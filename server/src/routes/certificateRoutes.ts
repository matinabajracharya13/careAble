import { checkCertificate, getCertificateByCode, getCertificates } from '@/controllers/certificateController';
import { authenticate } from '@/middleware/authenticate';
import { verifyCertificateRoleRequired } from '@/middleware/verify-certificate';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, getCertificates);
router.get('/:code', authenticate, getCertificateByCode);
router.get('/verify/:code', checkCertificate);

export default router;
