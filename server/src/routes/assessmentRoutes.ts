import { Router } from 'express';
import {
  getAssessments,
  getAssessmentById,
  saveAssessmentProgress,
  getUserAssessmentProgress,
  getUserAssessmentProgressByID,
  submitAssessment
} from '../controllers/assessmentController';

const router = Router();

router.get('/', getAssessments);
router.get('/progress', getUserAssessmentProgress);
router.get('/:id', getAssessmentById);
router.post('/:id/save-progress', saveAssessmentProgress);
router.get('/:id/progress', getUserAssessmentProgressByID);
router.post('/:id/submit', submitAssessment);

export default router;
