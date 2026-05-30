import { Router } from 'express';

import { signup, login, verifyEmail, getCurrentUser, forgotPassword, resetPassword } from '@/controllers/authController';
import { validate } from '@/middleware/validation';
import { signupSchema } from '@/schemas/signup.schema';
import { authenticate } from '@/middleware/authenticate';
import { getUserAssessments } from '@/controllers/userAssessmentController';

const router = Router();

router.post('/signup', validate(signupSchema), signup);

router.post('/login', login);

router.post('/verify-email', verifyEmail);

router.get('/me', authenticate, getCurrentUser);
router.get('/me/assessments', authenticate, getUserAssessments);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
