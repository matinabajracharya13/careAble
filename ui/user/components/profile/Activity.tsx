// ── Activity tab ──────────────────────────────────────────────────────────────

import { cn, formatDate } from '@/lib/utils';
import { Trophy, BookOpen, User, Clock } from 'lucide-react';

// ── Mock profile data ─────────────────────────────────────────────────────────

const MOCK_ACTIVITY = [
  { id: 'a1', type: 'certificate', text: 'Earned JavaScript Fundamentals certificate', date: '2026-03-28', score: 87 },
  { id: 'a2', type: 'assessment', text: 'Completed Project Management Essentials', date: '2026-03-15', score: 62 },
  { id: 'a3', type: 'assessment', text: 'Started JavaScript Fundamentals assessment', date: '2026-03-28', score: null },
  { id: 'a4', type: 'profile', text: 'Completed profile onboarding', date: '2026-03-10', score: null }
];

export function Activity() {
  const iconMap: Record<string, React.ElementType> = {
    certificate: Trophy,
    assessment: BookOpen,
    profile: User
  };
  const colorMap: Record<string, string> = {
    certificate: 'bg-success/10 text-success',
    assessment: 'bg-primary/10 text-primary',
    profile: 'bg-accent/10 text-accent'
  };

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='font-display font-semibold text-lg'>Activity timeline</h3>
        <p className='text-sm text-muted-foreground'>Your recent actions on CareAble.</p>
      </div>

      <div className='relative'>
        {/* Vertical line */}
        <div className='absolute left-5 top-0 bottom-0 w-px bg-border' />

        <div className='space-y-6'>
          {MOCK_ACTIVITY.map((item) => {
            const Icon = iconMap[item.type] ?? Clock;
            return (
              <div
                key={item.id}
                className='flex gap-4 pl-0'
              >
                <div
                  className={cn(
                    'relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 border-background',
                    colorMap[item.type]
                  )}
                >
                  <Icon className='h-4 w-4' />
                </div>
                <div className='flex-1 pb-2 pt-1.5'>
                  <p className='text-sm font-medium'>{item.text}</p>
                  <div className='flex items-center gap-3 mt-1'>
                    <p className='text-xs text-muted-foreground'>{formatDate(item.date)}</p>
                    {item.score !== null && (
                      <span className={cn('text-xs font-semibold', item.score >= 70 ? 'text-success' : 'text-destructive')}>
                        Score: {item.score}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
