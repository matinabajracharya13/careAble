import db from '@/db';
import { AppError } from '@/middleware/errorHandler';
import { getCandidateProfile } from '@/repositories/candidatesRepository';
import { getAttemptDomainScores, getCertificateByAttempt, getLatestAttempt } from '@/repositories/userAssessmentRepository';
import { NextFunction, Request, Response } from 'express';

export const getUserAssessmentDetailForAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return next(new AppError('Invalid params', 400));
    }

    const result = await userId;
  } catch (err) {
    next(err);
  }
};
