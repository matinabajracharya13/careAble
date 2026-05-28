import { Router } from 'express';

import { getCurrentUser, login } from '@/controllers/admin/authController';
import { authenticate } from '@/middleware/authenticate';
import { addRole, getAllRoles } from '@/controllers/admin/rolesController';
import { getAllOnboardingCategories, getAllOnboardingQuestions } from '@/controllers/admin/onboardingController';

const router = Router();

router.post('/login', login);

router.get('/me', authenticate, getCurrentUser);
router.get('/roles', authenticate, getAllRoles);
router.post('/roles', authenticate, addRole);
router.get('/onboarding/categories', authenticate, getAllOnboardingCategories);
router.get('/onboarding/questions/:category_id', authenticate, getAllOnboardingQuestions);

export default router;
