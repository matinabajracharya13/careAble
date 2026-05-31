'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeLabel, icon, iconColor }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <Card className='hover:shadow-sm transition-shadow'>
      <CardContent className='p-4 flex items-center justify-between'>
        {/* LEFT */}
        <div className='space-y-1'>
          <p className='text-sm text-muted-foreground'>{title}</p>

          <p className='text-2xl font-bold'>{value}</p>

          {change !== undefined && (
            <p className={cn('text-xs font-medium', isPositive ? 'text-green-600' : 'text-red-500')}>
              {isPositive ? '+' : ''}
              {change}% {changeLabel}
            </p>
          )}
        </div>

        {/* ICON */}
        {icon && <div className={cn('p-2 rounded-lg', iconColor || 'bg-muted text-muted-foreground')}>{icon}</div>}
      </CardContent>
    </Card>
  );
}
