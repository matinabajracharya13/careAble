import { AppError } from '@/middleware/errorHandler';
import {
  findAllOnboardingQuestions,
  findCategories,
  getAllOnboardingQuestions as findOnboardingQuestions
} from '@/repositories/onboardingRepository';
import { ApiResponse } from '@/types';
import { NextFunction, Request, Response } from 'express';

export const getAllOnboardingCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await findCategories();
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

export const getAllOnboardingQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cat = req.params.category_id;
    const questions = await findAllOnboardingQuestions(Number(cat));
    if (!questions) {
      return next(new AppError('Questions not found', 404));
    }
    const response: ApiResponse = {
      success: true,
      message: 'Questions retrieved successfully',
      data: questions
    };
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
