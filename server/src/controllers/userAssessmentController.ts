import { AppError } from '@/middleware/errorHandler';
import { findAssessmentById } from '@/repositories/assessmentRepository';
import {
  findUserAssessments,
  getAttemptDomainScores,
  getAttemptStats,
  getCertificateByAttempt,
  getLatestAttempt
} from '@/repositories/userAssessmentRepository';
import { ApiResponse } from '@/types';
import { NextFunction, Request, Response } from 'express';

export const getUserAssessments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.user_id;

    const data = await findUserAssessments(userId);

    const response: ApiResponse = {
      success: true,
      message: 'Assessments fetched successfully',
      data
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    next(new AppError('Failed to fetch assessments', 500));
  }
};

export const getUserAssessmentAttemptDetail = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.user_id;
    const assessmentId = Number(req.params.id);

    // 1. latest attempt
    const attempt = await getLatestAttempt(userId, assessmentId);

    if (!attempt) {
      return res.json({
        success: true,
        data: {
          attempt: null,
          answers: [],
          certificate: null
        }
      });
    }

    console.log(attempt);
    // 2. answers + stats + cert
    const [ds, stats, certificate, assessment] = await Promise.all([
      getAttemptDomainScores(attempt.attempt_id),
      getAttemptStats(attempt.attempt_id),
      getCertificateByAttempt(attempt.attempt_id),
      findAssessmentById(assessmentId)
    ]);

    return res.json({
      success: true,
      data: {
        assessment,
        attempt: stats,
        answers: ds,
        certificate
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
