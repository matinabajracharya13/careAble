import { Request, Response, NextFunction } from 'express';
import db from '@/db';

export const blockIfOnboardingCompleted = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.user_id;

    const user = await db('users').select('onboarding_completed').where({ user_id: userId }).first();
    console.log('User onboarding status:', user?.onboarding_completed);
    if (user?.onboarding_completed) {
      return res.status(200).json({
        message: 'Onboarding already completed',
        completed: true,
        categories: [],
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};
