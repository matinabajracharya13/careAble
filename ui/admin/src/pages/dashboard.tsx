'use client';

import { Users, Briefcase, Award, ClipboardCheck } from 'lucide-react';

import { useDashboard } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { AssessmentTrendChart } from '@/components/dashboard/assessment-trend-chart';
import { AtRiskCarersCard } from '@/components/dashboard/at-risk-carers-card';
import { DomainAnalyticsChart } from '@/components/dashboard/domain-analytics-chart';
import { RecentCertificatesCard } from '@/components/dashboard/recent-certificates-card';
import { TopCarersCard } from '@/components/dashboard/top-carers-card';
import { StatCard } from '@/components/dashboard/stat-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

export function DashboardPage() {
  const { data, isLoading } = useDashboard();

  const dashboard = data;
  console.log(dashboard);

  return (
    <div className='space-y-6 animate-fade-in'>
      <div>
        <h1 className='text-2xl font-bold font-display tracking-tight'>Dashboard</h1>

        <p className='text-muted-foreground text-sm mt-1'>Caregiver platform overview and competency insights.</p>
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className='h-[120px] rounded-lg'
            />
          ))
        ) : (
          <>
            <StatCard
              title='Total Carers'
              value={dashboard?.stats?.total_carers ?? 0}
              icon={<Users className='h-5 w-5' />}
              iconColor='bg-primary/10 text-primary'
            />

            <StatCard
              title='Total Employers'
              value={dashboard?.stats?.total_employers ?? 0}
              icon={<Briefcase className='h-5 w-5' />}
              iconColor='bg-success/10 text-success'
            />

            <StatCard
              title='Assessments Completed'
              value={dashboard?.stats?.total_assessments ?? 0}
              icon={<ClipboardCheck className='h-5 w-5' />}
              iconColor='bg-warning/10 text-warning'
            />

            <StatCard
              title='Certificates Issued'
              value={dashboard?.stats?.total_certificates ?? 0}
              icon={<Award className='h-5 w-5' />}
              iconColor='bg-destructive/10 text-destructive'
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
        <DomainAnalyticsChart data={dashboard?.domainAnalytics ?? []} />

        <AssessmentTrendChart data={dashboard?.assessmentTrends ?? []} />
      </div>

      {/* Insights */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
        <TopCarersCard carers={dashboard?.topCarers ?? []} />

        <AtRiskCarersCard carers={dashboard?.atRiskCarers ?? []} />
      </div>

      {/* Activity */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
        <RecentCertificatesCard certificates={dashboard?.recentCertificates ?? []} />

        <ActivityFeed data={dashboard?.recentActivity ?? []} />
      </div>
    </div>
  );
}
