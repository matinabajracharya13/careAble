import { Request, Response } from 'express';

import {
  getDashboardStats,
  getDomainAnalytics,
  getAssessmentTrends,
  getTopCarers,
  getAtRiskCarers,
  getRecentCertificates,
  getRecentActivity
} from '@/repositories/admin/dashboardRepository';

export const getDashboard = async (_req: Request, res: Response) => {
  const [stats, domainAnalytics, assessmentTrends, topCarers, atRiskCarers, recentCertificates, recentActivity] = await Promise.all([
    getDashboardStats(),
    getDomainAnalytics(),
    getAssessmentTrends(),
    getTopCarers(),
    getAtRiskCarers(),
    getRecentCertificates(),
    getRecentActivity()
  ]);

  return res.status(200).json({
    success: true,
    data: {
      stats,
      domainAnalytics,
      assessmentTrends,
      topCarers,
      atRiskCarers,
      recentCertificates,
      recentActivity
    }
  });
};
