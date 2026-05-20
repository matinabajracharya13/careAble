import { Router } from 'express';

import { authenticate } from '@/middleware/authenticate';
import { getCurrentUser, login } from '@/controllers/admin/authController';

const router = Router();

router.post('/login', login);

router.get('/me', authenticate, getCurrentUser);

export default router;
