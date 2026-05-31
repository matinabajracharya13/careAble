'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

const TYPE_COLOR: Record<string, string> = {
  assessment_completed: 'bg-blue-500/10 text-blue-600',
  certificate_issued: 'bg-green-500/10 text-green-600',
  role_changed: 'bg-orange-500/10 text-orange-600',
  user_registered: 'bg-purple-500/10 text-purple-600',
  system_alert: 'bg-red-500/10 text-red-600'
};

export function ActivityFeed({ data }: any) {
  return (
    <Card className='p-4 space-y-4'>
      <h2 className='font-semibold text-lg'>Recent Activity</h2>

      <div className='space-y-3'>
        {data?.map((item: any) => (
          <div
            key={item.id}
            className='flex gap-3 border-b pb-3 last:border-0'
          >
            <div className='w-2 h-2 mt-2 rounded-full bg-primary' />

            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <p className='font-medium text-sm'>{item.title}</p>

                <Badge className={TYPE_COLOR[item.type]}>{item.type}</Badge>
              </div>

              {item.description && <p className='text-xs text-muted-foreground'>{item.description}</p>}

              <p className='text-xs text-muted-foreground mt-1'>
                {item.user} • {formatDate(item.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
