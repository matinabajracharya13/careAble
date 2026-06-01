import { AppError } from '@/middleware/errorHandler';
import { findAllOnboardingQuestions, findCategories, getOnboardingRoles } from '@/repositories/onboardingRepository';
import { ApiResponse } from '@/types';
import { NextFunction, Request, Response } from 'express';

export const getAllOnBoarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await getOnboardingRoles();
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
    console.log(err);
    next(err);
  }
};

export const getAllOnboardingCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleID = req.params.roleId;

    const categories = await findCategories(Number(roleID));
    if (!categories) {
      return next(new AppError('categories not found', 404));
    }
    const response: ApiResponse = {
      success: true,
      message: 'categories retrieved successfully',
      data: categories
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
