// controllers/candidate.controller.ts

import { AppError } from '@/middleware/errorHandler';
import { findAllCandidates, getCandidateProfile } from '@/repositories/candidatesRepository';
import { Request, Response, NextFunction } from 'express';

export const getCandidates = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const candidates = await findAllCandidates();

    res.json({
      success: true,
      message: 'Candidates fetched successfully',
      data: candidates
    });
  } catch (error) {
    next(error);
  }
};

export const candidateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return next(new AppError('Invalid user id', 400));
    }

    const data = await getCandidateProfile(userId);

    if (!data) {
      return res.json({
        success: true,
        data: null
      });
    }

    // transform output
    const response = {
      success: true,
      data
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
};
