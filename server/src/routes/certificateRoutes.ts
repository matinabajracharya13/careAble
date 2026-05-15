import { Router } from 'express';
import { getCertificate } from '../controllers/certificateController';

const router = Router();

router.get('/:id', getCertificate);

export default router;
