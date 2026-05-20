import { AppError } from '@/middleware/errorHandler';
import { getDashboardStats } from '@/repositories/dashboardRepository';
import { NextFunction, Request, Response } from 'express';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.user_id;

    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const stats = await getDashboardStats(userId);

    res.json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    next(error);
  }
};
