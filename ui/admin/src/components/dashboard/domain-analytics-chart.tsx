'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function DomainAnalyticsChart({ data }: { data: any[] }) {
  const chartData = data.map((d) => ({
    domain: d.domain_title,
    avgScore: Number(d.avg_score)
  }));

  return (
    <div className='w-full h-[350px] bg-white rounded-xl border p-4'>
      <h2 className='text-sm font-semibold mb-4'>Domain Performance</h2>

      <ResponsiveContainer
        width='100%'
        height='100%'
      >
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='domain'
            textAnchor='end'
            angle={-20}
            height={80}
            interval={0}
          />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Bar
            dataKey='avgScore'
            fill='#6366f1'
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
