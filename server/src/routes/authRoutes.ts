import { Router } from 'express';

import { signup, login, verifyEmail, getCurrentUser } from '@/controllers/authController';
import { validate } from '@/middleware/validation';
import { signupSchema } from '@/schemas/signup.schema';
import { authenticate } from '@/middleware/authenticate';

const router = Router();

router.post('/signup', validate(signupSchema), signup);

router.post('/login', login);

router.post('/verify-email', verifyEmail);

router.get('/me', authenticate, getCurrentUser);

export default router;
