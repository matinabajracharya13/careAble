import { Router } from 'express';

import { getCurrentUser, login } from '@/controllers/admin/authController';
import { authenticate } from '@/middleware/authenticate';
import { addRole, getAllRoles } from '@/controllers/admin/rolesController';
import { getAllOnboardingCategories, getAllOnboardingQuestions } from '@/controllers/admin/onboardingController';
import {
  createAssessment,
  createAssessmentTopic,
  getAllAssessments,
  getAssessmentQuestionTopicByID,
  getAssessmentTopics,
  saveQuestionsController
} from '@/controllers/admin/assessmentController';
import { candidateProfile, getCandidates } from '@/controllers/candidateController';
import { getUsers } from '@/controllers/userController';

const router = Router();

router.post('/login', login);

router.get('/me', authenticate, getCurrentUser);
router.get('/roles', authenticate, getAllRoles);
router.post('/roles', authenticate, addRole);
router.get('/assessments', authenticate, getAllAssessments);
router.post('/assessments', authenticate, createAssessment);
router.post('/assessments', authenticate, createAssessment);

router.get('/users', getUsers);
router.get('/users/:userId', candidateProfile);

router.get('/onboarding/categories', authenticate, getAllOnboardingCategories);
router.get('/onboarding/questions/:category_id', authenticate, getAllOnboardingQuestions);
router.get('/assessments/:assessmentId/topics', authenticate, getAssessmentTopics);
router.post('/assessments/:assessmentId/topics', authenticate, createAssessmentTopic);
router.post('/assessments/topics/:topicId/questions', authenticate, saveQuestionsController);
router.get('/assessments/topics/:topicId/questions', authenticate, getAssessmentQuestionTopicByID);

export default router;
