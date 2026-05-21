import { checkCertificate, getCertificateByCode, getCertificates } from '@/controllers/certificateController';
import { authenticate } from '@/middleware/authenticate';
import { verifyCertificateRoleRequired } from '@/middleware/verify-certificate';
import { Router } from 'express';

const router = Router();
router.use(authenticate);

router.get('/', getCertificates);
router.get('/:code', getCertificateByCode);
router.get('/verify/:code', verifyCertificateRoleRequired, checkCertificate);

export default router;
