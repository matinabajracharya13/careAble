import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';
import type { DashboardStats, RevenueDataPoint, ActivityItem } from '@/types';
import { adminApi } from '@/lib/admin';

export const dashboardKeys = {
  analytics: ['dashboard', 'analytics'] as const,
  dashboard: ['dashboard', 'view'] as const,
  stats: ['dashboard', 'stats'] as const,
  revenue: ['dashboard', 'revenue'] as const,
  activity: ['dashboard', 'activity'] as const
};

export function useAnalytics() {
  return useQuery({
    queryKey: dashboardKeys.analytics,
    queryFn: adminApi.getAnalytics
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.dashboard,
    queryFn: adminApi.getDashboard
  });
}
