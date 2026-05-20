import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '@/middleware/errorHandler';

export const requireAdmin: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return next(new AppError('Unauthorized', 401));
  }

  if (user.role !== 'admin') {
    return next(new AppError('Forbidden: Admins only', 403));
  }

  next();
};
