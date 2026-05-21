import { Router } from 'express';

import { getCurrentUser, login } from '@/controllers/admin/authController';
import { authenticate } from '@/middleware/authenticate';

const router = Router();

router.post('/login', login);

router.get('/me', authenticate, getCurrentUser);

export default router;
