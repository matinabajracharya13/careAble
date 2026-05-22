import { AppError } from '@/middleware/errorHandler';
import { findAuthUserById } from '@/repositories/authRepository';
import { findAllContact } from '@/repositories/contactRepository';
import userResponse from '@/services/response';
import { ApiResponse } from '@/types';
import { NextFunction, Request, Response } from 'express';

export const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await findAllContact();
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
