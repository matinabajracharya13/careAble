import { Router } from 'express';

import { signup, login, verifyEmail } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/verify-email', verifyEmail);

export default router;
