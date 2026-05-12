import { Router } from 'express';
import {
  getAssessments,
  getAssessmentById,
  saveAssessmentProgress,
  getUserAssessmentProgress,
  getUserAssessmentProgressByID,
  submitAssessmentResponses
} from '@/controllers/assessmentController';
import { authenticate } from '@/middleware/authenticate';

const router = Router();
router.use(authenticate)
router.get('/', getAssessments);
router.get('/progress', getUserAssessmentProgress);
router.get('/:id', getAssessmentById);
router.post('/:id/save-progress', saveAssessmentProgress);
router.get('/:id/progress', getUserAssessmentProgressByID);
router.post('/:id/submit', submitAssessmentResponses);

export default router;
