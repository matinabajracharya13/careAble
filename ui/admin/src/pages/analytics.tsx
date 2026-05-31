'use client';

import { useAnalytics } from '@/hooks/use-dashboard';
import { Loader2 } from 'lucide-react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  const rows = data?.data || [];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='animate-spin' />
      </div>
    );
  }

  const chartData = rows.map((r: any) => ({
    domain: r.domain_title,
    avg_score: Number(r.avg_score),
    percent: Number(r.percent_above_4)
  }));

  return (
    <div className='space-y-10'>
      {/* HEADER */}
      <div>
        <h1 className='text-2xl font-bold'>Caregiver Competency Analytics</h1>
        <p className='text-muted-foreground text-sm'>Overview of domain performance across all carers</p>
      </div>

      {/* 📊 1. Average Score */}
      <div className='h-80'>
        <h2 className='font-semibold mb-2'>Average Score by Domain</h2>

        <ResponsiveContainer
          width='100%'
          height='100%'
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='domain' />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar
              dataKey='avg_score'
              fill='#4f46e5'
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 2. % above 4 */}
      <div className='h-80'>
        <h2 className='font-semibold mb-2'>% Carers Above 4.0</h2>

        <ResponsiveContainer
          width='100%'
          height='100%'
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='domain' />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey='percent'
              fill='#16a34a'
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
