import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { AppError } from '@/middleware/errorHandler';

export const validate =
  (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return next(
          new AppError(
            errors.map((e) => `${e.field}: ${e.message}`).join(', '),
            400
          )
        );
      }
      return next(new AppError('Validation failed', 400));
    }
};