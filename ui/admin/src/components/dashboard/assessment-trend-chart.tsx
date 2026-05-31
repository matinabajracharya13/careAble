'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function AssessmentTrendChart({ data }: { data: any[] }) {
  const chartData = data.map((d) => ({
    month: d.month,
    total: Number(d.total)
  }));

  return (
    <div className='w-full h-[350px] bg-white rounded-xl border p-4'>
      <h2 className='text-sm font-semibold mb-4'>Assessment Trends</h2>

      <ResponsiveContainer
        width='100%'
        height='100%'
      >
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
          <YAxis />
          <Tooltip />
          <Line
            type='monotone'
            dataKey='total'
            stroke='#10b981'
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
