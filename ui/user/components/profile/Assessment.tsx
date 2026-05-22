// ── Assessments tab ───────────────────────────────────────────────────────────

import { cn, getLevelBadgeClass, formatDate } from '@/lib/utils';
import { Progress } from '@radix-ui/react-progress';
import { Trophy, AlertTriangle, Award, BarChart2, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/ui-components';
import Link from 'next/link';
import { AssessmentListItem } from '@/types';
import { useRouter } from 'next/navigation';
import { assessmentApi } from '@/lib/api';

interface Props {
  assessments: AssessmentListItem[];
  loading: boolean;
}

export function Assessments({ assessments, loading }: Props) {
  const router = useRouter();
  const completed = assessments.filter((a) => a.status === 'completed');
  const available = assessments.filter((a) => a.status === 'available' || a.status === 'in_progress');

  const handleStartAssessment = async (assessmentId: string, attemptId: number, status: string) => {
    // Navigate to the assessment page (replace with actual route)

    if (status === 'in_progress') {
      router.push(`/assessment/${assessmentId}/${attemptId}`);
    } else {
      const response = await assessmentApi.startAssessment(Number(assessmentId));

      router.push(`/assessment/${assessmentId}/${response.attempt_id}`);
    }
  };
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
              className={cn('border-l-4', 'border-l-success')}
            >
              <CardContent className='p-5'>
                <div className='flex items-center gap-4'>
                  <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0', 'bg-success/10')}>
                    <Trophy className='h-5 w-5 text-success' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <p className='font-semibold text-sm'>{a.title}</p>
                    </div>
                    <p className='text-xs text-muted-foreground mt-0.5'>Completed {a.completedAt ? formatDate(a.completedAt) : '–'}</p>
                  </div>
                  <div className='text-right shrink-0'>
                    <div className={cn('text-xl font-display font-bold', 'text-success')}>{a.score}</div>
                  </div>
                </div>

                <div className='mt-3'>
                  <Button
                    size='sm'
                    variant='outline'
                    asChild
                  >
                    <Link href={`/certificate/${a.certificateCode}`}>
                      <Award className='h-3.5 w-3.5' />
                      View certificate
                    </Link>
                  </Button>
                </div>
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
                  </div>
                  <p className='text-xs text-muted-foreground mt-0.5'>Not started</p>
                </div>
                <Button
                  size='sm'
                  className='shrink-0'
                  onClick={() => handleStartAssessment(a.id, a.attemptId, a.status)}
                >
                  <>
                    {' '}
                    {a.status === 'in_progress' ? 'Continue' : 'Start'} <ChevronRight className='h-4 w-4' />
                  </>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
