// ── Assessments tab ───────────────────────────────────────────────────────────

import { cn, getLevelBadgeClass, formatDate } from '@/lib/utils';
import { Progress } from '@radix-ui/react-progress';
import { Trophy, AlertTriangle, Link, Award, BarChart2, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/ui-components';

const MOCK_ASSESSMENTS = [
  {
    id: 'assess1',
    title: 'JavaScript Fundamentals',
    level: 'intermediate',
    score: 87,
    passed: true,
    completedAt: '2026-03-28',
    status: 'completed'
  },
  {
    id: 'assess2',
    title: 'Project Management Essentials',
    level: 'beginner',
    score: 62,
    passed: false,
    completedAt: '2026-03-15',
    status: 'completed'
  },
  {
    id: 'assess3',
    title: 'Python Fundamentals',
    level: 'beginner',
    score: null,
    passed: null,
    completedAt: null,
    status: 'available'
  }
];

export function Assessments() {
  const completed = MOCK_ASSESSMENTS.filter((a) => a.status === 'completed');
  const available = MOCK_ASSESSMENTS.filter((a) => a.status === 'available');

  return (
    <div className='space-y-6'>
      {/* Completed */}
      <div>
        <h3 className='font-display font-semibold text-lg mb-4'>
          Completed assessments
          <span className='ml-2 text-sm text-muted-foreground font-sans font-normal'>({completed.length})</span>
        </h3>
        <div className='space-y-3'>
          {completed.map((a) => (
            <Card
              key={a.id}
              className={cn('border-l-4', a.passed ? 'border-l-success' : 'border-l-destructive')}
            >
              <CardContent className='p-5'>
                <div className='flex items-center gap-4'>
                  <div
                    className={cn(
                      'h-11 w-11 rounded-xl flex items-center justify-center shrink-0',
                      a.passed ? 'bg-success/10' : 'bg-destructive/10'
                    )}
                  >
                    {a.passed ? <Trophy className='h-5 w-5 text-success' /> : <AlertTriangle className='h-5 w-5 text-destructive' />}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <p className='font-semibold text-sm'>{a.title}</p>
                      <span
                        className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize', getLevelBadgeClass(a.level))}
                      >
                        {a.level}
                      </span>
                    </div>
                    <p className='text-xs text-muted-foreground mt-0.5'>Completed {a.completedAt ? formatDate(a.completedAt) : '–'}</p>
                  </div>
                  <div className='text-right shrink-0'>
                    <div className={cn('text-xl font-display font-bold', a.passed ? 'text-success' : 'text-destructive')}>{a.score}%</div>
                    <div className={cn('text-[10px] font-semibold', a.passed ? 'text-success' : 'text-destructive')}>
                      {a.passed ? 'PASSED' : 'FAILED'}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className='mt-3 space-y-1'>
                  <Progress
                    value={a.score ?? 0}
                    className={cn('h-1.5', !a.passed && '[&>div]:bg-destructive')}
                  />
                  <div className='flex justify-between text-[10px] text-muted-foreground'>
                    <span>0%</span>
                    <span>Pass: 70%</span>
                    <span>100%</span>
                  </div>
                </div>

                {a.passed && (
                  <div className='mt-3'>
                    <Button
                      size='sm'
                      variant='outline'
                      asChild
                    >
                      <Link href={`/certificate/${a.id}`}>
                        <Award className='h-3.5 w-3.5' />
                        View certificate
                      </Link>
                    </Button>
                  </div>
                )}
                {!a.passed && (
                  <div className='mt-3'>
                    <Button
                      size='sm'
                      variant='outline'
                      asChild
                    >
                      <Link href={`/assessment/${a.id}`}>
                        <BarChart2 className='h-3.5 w-3.5' />
                        Retry assessment
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available */}
      <div>
        <h3 className='font-display font-semibold text-lg mb-4'>
          Available to take
          <span className='ml-2 text-sm text-muted-foreground font-sans font-normal'>({available.length})</span>
        </h3>
        <div className='space-y-3'>
          {available.map((a) => (
            <Card
              key={a.id}
              className='card-hover border-dashed'
            >
              <CardContent className='p-5 flex items-center gap-4'>
                <div className='h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
                  <BookOpen className='h-5 w-5 text-primary' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <p className='font-semibold text-sm'>{a.title}</p>
                    <span
                      className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize', getLevelBadgeClass(a.level))}
                    >
                      {a.level}
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground mt-0.5'>Not started</p>
                </div>
                <Button
                  size='sm'
                  asChild
                  className='shrink-0'
                >
                  <Link href={`/assessment/${a.id}`}>
                    Start <ChevronRight className='h-4 w-4' />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
