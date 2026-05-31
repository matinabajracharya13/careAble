import { getDomainAnalytics } from '@/repositories/analyticsRepository';
import { NextFunction, Request, Response } from 'express';

export const getAnalytics = async (_req: Request, res: Response) => {
  const data = await getDomainAnalytics();

  res.json({
    success: true,
    data
  });
};
