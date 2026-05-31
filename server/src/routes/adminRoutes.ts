import { Router } from 'express';

import { getAnalytics } from '@/controllers/admin/analyticsController';
import {
  createAssessment,
  createAssessmentTopic,
  getAllAssessments,
  getAssessmentQuestionTopicByID,
  getAssessmentTopics,
  saveQuestionsController
} from '@/controllers/admin/assessmentController';
import { getCurrentUser, login } from '@/controllers/admin/authController';
import * as DashboardController from '@/controllers/admin/dashboardController';
import { getAllOnboardingCategories, getAllOnboardingQuestions } from '@/controllers/admin/onboardingController';
import { addRole, getAllRoles } from '@/controllers/admin/rolesController';
import { candidateProfile } from '@/controllers/candidateController';
import { getUsers } from '@/controllers/userController';
import { authenticate } from '@/middleware/authenticate';

const router = Router();

router.post('/login', login);

router.use(authenticate);

router.get('/me', getCurrentUser);
router.get('/roles', getAllRoles);
router.post('/roles', addRole);
router.get('/assessments', getAllAssessments);
router.post('/assessments', createAssessment);
router.post('/assessments', createAssessment);
router.post('/analytics', getAnalytics);
router.get('/users', getUsers);
router.get('/dashboard', DashboardController.getDashboard);
router.get('/users/:userId', candidateProfile);
router.get('/onboarding/categories', getAllOnboardingCategories);
router.get('/onboarding/questions/:category_id', getAllOnboardingQuestions);
router.get('/assessments/:assessmentId/topics', getAssessmentTopics);
router.post('/assessments/:assessmentId/topics', createAssessmentTopic);
router.post('/assessments/topics/:topicId/questions', saveQuestionsController);
router.get('/assessments/topics/:topicId/questions', getAssessmentQuestionTopicByID);

export default router;
