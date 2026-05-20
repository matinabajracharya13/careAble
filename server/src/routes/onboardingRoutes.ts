import { Router } from 'express';
import { completeOnboarding, getOnboardingQuestions } from '@/controllers/onboardingController';
import { authenticate } from '@/middleware/authenticate';
import { blockIfOnboardingCompleted } from '@/middleware/onboarding';

const router = Router();

router.use(authenticate);
router.get('/questions', blockIfOnboardingCompleted, getOnboardingQuestions);
router.post('/complete', completeOnboarding);

export default router;