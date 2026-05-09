import { Router } from 'express'
import {
  getAssessments,
  getAssessmentById,
 
} from '../controllers/assessmentController'

const router = Router()

router.get('/', getAssessments)
router.get('/:id', getAssessmentById)

export default router