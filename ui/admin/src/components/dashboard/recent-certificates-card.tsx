'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function RecentCertificatesCard({ certificates }: { certificates: any[] }) {
  const data = certificates.map((c) => ({
    name: c.assessment_title,
    count: 1
  }));

  return (
    <div className='w-full h-[350px] bg-white rounded-xl border p-4'>
      <h2 className='text-sm font-semibold mb-4'>Recent Certificates</h2>

      <ResponsiveContainer
        width='100%'
        height='100%'
      >
        <BarChart
          data={data}
          layout='vertical'
        >
          <XAxis type='number' />
          <YAxis
            type='category'
            dataKey='name'
            width={150}
          />
          <Tooltip />
          <Bar
            dataKey='count'
            fill='#3b82f6'
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
