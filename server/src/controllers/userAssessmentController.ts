import { AppError } from '@/middleware/errorHandler';
import { findUserAssessments } from '@/repositories/userAssessmentRepository';
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
