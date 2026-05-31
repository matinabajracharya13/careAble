// controllers/candidate.controller.ts

import { UserRole } from '@/enums/user-role';
import { AppError } from '@/middleware/errorHandler';
import { findAllCandidates, getCandidateProfile, getUserDetail } from '@/repositories/candidatesRepository';
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
    const userDetail = await getUserDetail(userId);
    if (!userDetail) {
      res.json({
        success: true,
        data: null
      });
      return;
    }
    if (userDetail.role !== UserRole.CARER) {
      return res.json({
        success: true,
        data: userDetail
      });
    }
    const data = await getCandidateProfile(userId, userDetail);
    console.log(data);

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
    console.log(err);
    next(err);
  }
};
