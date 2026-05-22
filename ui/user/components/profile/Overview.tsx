import { cn, formatDate } from '@/lib/utils';
import { Progress } from '@radix-ui/react-progress';
import { Award, BookOpen, TrendingUp, Calendar, CheckCircle, Trophy, ChevronRight, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/ui-components';
import { Certificate } from '@/types';
import Link from 'next/link';

interface Props {
  user: any;
  certificates: Certificate[];
  assessments: any[];
}

export function Overview({ user, certificates, assessments }: Props) {
  const completionItems = [
    // { label: 'Profile photo', done: !!user.avatar },
    { label: 'Personal info', done: user?.onboarding_completed },
    { label: 'Bio added', done: user?.onboarding_completed },
    { label: 'First assessment', done: true },
    { label: 'Certificate earned', done: true }
  ];
  const completion = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  return (
    <div className='space-y-6'>
      {/* Stats row */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {[
          { label: 'Certificates', value: certificates?.length, icon: Award, color: 'text-primary', bg: 'bg-primary/10' },
          {
            label: 'Assessments taken',
            value: assessments.filter((a) => a.status === 'completed').length,
            icon: BookOpen,
            color: 'text-accent',
            bg: 'bg-accent/10'
          },
          { label: 'Best score', value: '0%', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
          {
            label: 'Member since',
            value: formatDate(user?.created_at),
            icon: Calendar,
            color: 'text-warning',
            bg: 'bg-warning/10'
          }
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className='p-4 flex items-center gap-3'>
              <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', s.bg)}>
                <s.icon className={cn('h-5 w-5', s.color)} />
              </div>
              <div>
                <p className='text-xl font-display font-bold'>{s.value}</p>
                <p className='text-[11px] text-muted-foreground'>{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        {/* Profile completion */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Profile completion</CardTitle>
            <CardDescription>Complete your profile to get discovered by employers.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-3xl font-display font-bold gradient-text'>{completion}%</span>
              <span className='text-sm text-muted-foreground'>
                {completionItems.filter((i) => i.done).length}/{completionItems.length} complete
              </span>
            </div>
            <Progress
              value={completion}
              className='h-2'
            />
            <ul className='space-y-2'>
              {completionItems.map((item) => (
                <li
                  key={item.label}
                  className='flex items-center gap-2 text-sm'
                >
                  {item.done ? (
                    <CheckCircle className='h-4 w-4 text-success shrink-0' />
                  ) : (
                    <div className='h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0' />
                  )}
                  <span className={item.done ? 'text-muted-foreground line-through opacity-60' : ''}>{item.label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recent certs */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Recent certificates</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {certificates?.length === 0 ? (
              <div className='text-center py-6 text-muted-foreground'>
                <Award className='h-10 w-10 mx-auto mb-2 opacity-20' />
                <p className='text-sm'>No certificates yet</p>
                <Button
                  size='sm'
                  variant='outline'
                  className='mt-3'
                  asChild
                >
                  <Link href='/assessment'>Take an assessment</Link>
                </Button>
              </div>
            ) : (
              certificates?.map((cert) => (
                <div
                  key={cert.certificate_id}
                  className='flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20'
                >
                  <div className='h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0'>
                    <Trophy className='h-5 w-5 text-success' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold truncate'>{cert?.title}</p>
                    <p className='text-xs text-muted-foreground'>{formatDate(cert.issued_at)}</p>
                  </div>
                  <Button
                    size='sm'
                    variant='ghost'
                    asChild
                  >
                    <Link href={`/certificate/${cert.certificate_code}`}>
                      <ChevronRight className='h-4 w-4' />
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Score performance */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Assessment performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {assessments
              ?.filter((a) => a.status === 'completed')
              .map((a) => (
                <div
                  key={a.id}
                  className='space-y-1.5'
                >
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium'>{a.title}</span>
                    <div className='flex items-center gap-2'>
                      <span className={cn('text-xs font-semibold', a.passed ? 'text-success' : 'text-destructive')}>{a.score}%</span>
                      {a.passed ? (
                        <CheckCircle className='h-3.5 w-3.5 text-success' />
                      ) : (
                        <XCircle className='h-3.5 w-3.5 text-destructive' />
                      )}
                    </div>
                  </div>
                  <Progress
                    value={a.score ?? 0}
                    className={cn('h-1.5', a.passed ? '' : '[&>div]:bg-destructive')}
                  />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
