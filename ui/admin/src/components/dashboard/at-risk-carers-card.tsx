'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function AtRiskCarersCard({ carers }: { carers: any[] }) {
  const data = carers.map((c) => ({
    name: c.name,
    score: Number(c.average_score)
  }));

  return (
    <div className='w-full h-[350px] bg-white rounded-xl border p-4'>
      <h2 className='text-sm font-semibold mb-4 text-red-500'>At Risk Carers</h2>

      <ResponsiveContainer
        width='100%'
        height='100%'
      >
        <BarChart
          data={data}
          layout='vertical'
        >
          <XAxis
            type='number'
            domain={[0, 5]}
          />
          <YAxis
            type='category'
            dataKey='name'
            width={120}
          />
          <Tooltip />
          <Bar
            dataKey='score'
            fill='#ef4444'
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
