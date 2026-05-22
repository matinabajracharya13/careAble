// controllers/candidate.controller.ts

import { findAllCandidates } from '@/repositories/candidatesRepository';
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
