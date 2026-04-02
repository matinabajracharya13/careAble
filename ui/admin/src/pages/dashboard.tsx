import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-lg" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={formatNumber(stats?.totalUsers ?? 0)}
              change={8.2}
              changeLabel="vs last month"
              icon={<Users className="h-5 w-5" />}
              iconColor="bg-primary/10 text-primary"
            />
            <StatCard
              title="Monthly Revenue"
              value={formatCurrency(stats?.monthlyRevenue ?? 0)}
              change={stats?.growthRate}
              changeLabel="vs last month"
              icon={<DollarSign className="h-5 w-5" />}
              iconColor="bg-success/10 text-success"
            />
            <StatCard
              title="Total Orders"
              value={formatNumber(stats?.totalOrders ?? 0)}
              change={-2.1}
              changeLabel="vs last month"
              icon={<ShoppingCart className="h-5 w-5" />}
              iconColor="bg-warning/10 text-warning"
            />
            <StatCard
              title="Active Users"
              value={formatNumber(stats?.activeUsers ?? 0)}
              change={5.4}
              changeLabel="vs last month"
              icon={<TrendingUp className="h-5 w-5" />}
              iconColor="bg-destructive/10 text-destructive"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
