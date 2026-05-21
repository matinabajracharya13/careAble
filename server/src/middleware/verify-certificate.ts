import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '@/middleware/errorHandler';
import { UserRole } from '@/enums/user-role';

const ALLOWED_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.EMPLOYER];

export const verifyCertificateRoleRequired: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  const user = (req as any).user;

  const isAuthorized = Boolean(user) && ALLOWED_ROLES.includes(user.role);

  return next(isAuthorized ? undefined : new AppError('Forbidden', 403));
};
