import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/middleware/errorHandler';
import { findPublicRoles } from '@/repositories/roleRepository';
import { ApiResponse, Roles } from '@/types';

export const getRoles = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await findPublicRoles();

    const response: ApiResponse<Roles[]> = {
      success: true,
      message: 'Roles fetched successfully',
      data: roles
    };
    res.json(response);
  } catch (err) {
    console.error('Error fetching roles:', err);
    next(new AppError('Failed to fetch roles', 500));
  }
};
