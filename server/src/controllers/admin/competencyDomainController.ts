import { AppError } from '@/middleware/errorHandler';
import { findAllCompetencyDomain } from '@/repositories/competencyDomainRepository';
import { ApiResponse } from '@/types';
import { NextFunction, Response, Request } from 'express';

export const getAllCompetencyDomain = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await findAllCompetencyDomain();
    if (!messages) {
      return next(new AppError('Messages not found', 404));
    }
    const response: ApiResponse = {
      success: true,
      message: 'Messages retrieved successfully',
      data: messages
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
