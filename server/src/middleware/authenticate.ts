import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '@/middleware/errorHandler';

interface JwtPayload {
  user_id: number;
  email: string;
  role: string;
}

export const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication token missing', 401));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(new AppError('Authentication token missing', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const { user_id, email, role } = decoded;
    if (!user_id || !email || !role) {
      return next(new AppError('Invalid token payload', 401));
    }

    (req as any).user = {
      user_id,
      email,
      role
    };

    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};
