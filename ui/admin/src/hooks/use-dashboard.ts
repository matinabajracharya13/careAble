import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import type { DashboardStats, RevenueDataPoint, ActivityItem } from "@/types";

export const dashboardKeys = {
  stats: ["dashboard", "stats"] as const,
  revenue: ["dashboard", "revenue"] as const,
  activity: ["dashboard", "activity"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: () => get<DashboardStats>("/dashboard/stats"),
    // Demo fallback while no real API
    placeholderData: {
      totalUsers: 8_420,
      activeUsers: 6_130,
      totalRevenue: 1_240_000,
      monthlyRevenue: 94_500,
      totalOrders: 3_281,
      pendingOrders: 47,
      growthRate: 12.4,
    } as DashboardStats,
  });
}

export function useRevenueData() {
  return useQuery({
    queryKey: dashboardKeys.revenue,
    queryFn: () => get<RevenueDataPoint[]>("/dashboard/revenue"),
    placeholderData: [
      { month: "Jan", revenue: 65000, expenses: 42000 },
      { month: "Feb", revenue: 72000, expenses: 45000 },
      { month: "Mar", revenue: 68000, expenses: 43000 },
      { month: "Apr", revenue: 85000, expenses: 51000 },
      { month: "May", revenue: 91000, expenses: 54000 },
      { month: "Jun", revenue: 88000, expenses: 52000 },
      { month: "Jul", revenue: 96000, expenses: 57000 },
      { month: "Aug", revenue: 102000, expenses: 61000 },
      { month: "Sep", revenue: 94500, expenses: 56000 },
    ] as RevenueDataPoint[],
  });
}

export function useActivityFeed() {
  return useQuery({
    queryKey: dashboardKeys.activity,
    queryFn: () => get<ActivityItem[]>("/dashboard/activity"),
    placeholderData: [
      { id: "1", user: { id: "u1", name: "Alice Chen" }, action: "created user", target: "Bob Smith", createdAt: new Date(Date.now() - 5 * 60_000).toISOString() },
      { id: "2", user: { id: "u2", name: "Jordan Lee" }, action: "updated settings for", target: "Marketing Team", createdAt: new Date(Date.now() - 18 * 60_000).toISOString() },
      { id: "3", user: { id: "u3", name: "Sam Rivera" }, action: "deleted report", target: "Q2 Summary", createdAt: new Date(Date.now() - 45 * 60_000).toISOString() },
      { id: "4", user: { id: "u1", name: "Alice Chen" }, action: "exported data to", target: "analytics.csv", createdAt: new Date(Date.now() - 2 * 3600_000).toISOString() },
    ] as ActivityItem[],
  });
}
