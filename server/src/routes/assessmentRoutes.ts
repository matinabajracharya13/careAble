import { Router } from 'express';
import {
  getAssessments,
  getAssessmentById,
  saveAssessmentProgress,
  getUserAssessmentAttempt,
  submitAssessmentResponses,
  startAssessment,
  getUserAssessmentAttemptID
} from '@/controllers/assessmentController';
import { authenticate } from '@/middleware/authenticate';

const router = Router();
router.use(authenticate);
router.get('/', getAssessments);
router.get('/attempts', getUserAssessmentAttempt);
router.get('/:id', getAssessmentById);
router.post('/:id/attempts/:attemptId/save-progress', saveAssessmentProgress);
router.get('/:id/attempts/:attemptId/progress', getUserAssessmentAttemptID);
router.post('/:id/attempts/:attemptId/submit', submitAssessmentResponses);
router.post('/:id/start', startAssessment);

export default router;
