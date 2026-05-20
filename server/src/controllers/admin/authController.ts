import { NextFunction, Request, Response } from 'express';

import { findAuthUserById } from '@/repositories/authRepository';

import { ApiResponse } from '@/types';

import { AppError } from '@/middleware/errorHandler';
import { baseLogin } from '@/services/auth';
import userResponse from '@/services/response';
import { loginRules } from '@/utils/authRules';

// LOGIN
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await baseLogin(email, password, loginRules.admin);

    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userResponse(user)
      }
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findAuthUserById((req as any).user?.user_id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    const response: ApiResponse = {
      success: true,
      message: 'Current user retrieved successfully',
      data: {
        user: userResponse(user)
      }
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
