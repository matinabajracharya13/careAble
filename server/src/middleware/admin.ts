import { Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '@/middleware/errorHandler';
import { UserRole } from '@/enums/user-role';
import { AuthRequest } from '@/types/auth';

export const requireAdmin: RequestHandler = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const isAdmin = req.user?.role === UserRole.ADMIN;

  return next(isAdmin ? undefined : new AppError('Forbidden: Admins only', 403));
};
