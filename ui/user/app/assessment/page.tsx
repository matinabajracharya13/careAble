'use client';

import { RoleGuard } from '@/components/auth/RouteGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge, Card, CardContent } from '@/components/ui/ui-components';
import { UserRole } from '@/config/role';
import { ASSESSMENT_IN_PROGRESS_KEY } from '@/constants/app';
import { assessmentApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function AssessmentListPage() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  // 1. fetch assessments
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: assessmentApi.getAssessments
  });

  // 2. fetch progress
  const { data: progress } = useQuery({
    queryKey: ['assessment-progress'],
    queryFn: assessmentApi.getUserAssessmentProgress
  });

  const handleStartAssessment = async (assessmentId: number, status?: string, attemtpId?: string) => {
    try {
      if (status === ASSESSMENT_IN_PROGRESS_KEY && attemtpId) {
        router.push(`/assessment/${assessmentId}/${attemtpId}`);
        return;
      }
      const response = await assessmentApi.startAssessment(assessmentId);

      router.push(`/assessment/${assessmentId}/${response.attempt_id}`);
    } catch (error) {
      console.error(error);
    }
  };

  // 3. map progress by assessment_id
  const progressMap = useMemo(() => {
    return new Map(progress?.map((p: any) => [p.assessment_id, p]) || []);
  }, [progress]);

  return (
    <RoleGuard allowedRoles={[UserRole.CARER]}>
      <div className='min-h-screen bg-background pt-20 pb-12'>
        <div className='container mx-auto px-4 max-w-5xl'>
          {/* Header */}
          <div className='mb-10 space-y-2 animate-fade-in'>
            <Badge className='bg-primary/10 text-primary border-primary/20'>Skill assessments</Badge>
            <h1 className='text-4xl font-display font-bold'>Choose your assessment</h1>
            <p className='text-muted-foreground max-w-xl'>
              Each assessment is designed by industry experts. Pass to earn a verified certificate.
            </p>
          </div>

          {/* Filters */}
          <div className='flex flex-col sm:flex-row gap-3 mb-8'>
            <Input
              placeholder='Search by title or category…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='max-w-sm'
            />
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className='flex items-center justify-center h-48'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : (
            <div className='grid md:grid-cols-2 gap-5'>
              {assessments
                ?.filter((a: any) => (a.title + a.domain).toLowerCase().includes(search.toLowerCase()))
                .map((assessment) => {
                  const progress = progressMap.get(assessment.assessment_id);

                  const status = progress?.status;

                  return (
                    <Card
                      key={assessment.assessment_id}
                      className={cn('card-hover animate-fade-in')}
                      style={{
                        animationDelay: `0.07s`
                      }}
                    >
                      <CardContent className='p-6 space-y-4'>
                        {/* Icon */}
                        <div className='flex items-start justify-between gap-3'>
                          <div className='h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
                            <BookOpen className='h-6 w-6 text-primary' />
                          </div>

                          {/* Resume badge */}
                          {status === ASSESSMENT_IN_PROGRESS_KEY && <Badge variant='outline'>In Progress</Badge>}
                        </div>

                        {/* Title */}
                        <div>
                          <h3 className='font-display font-semibold text-lg'>{assessment.title}</h3>
                          <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>{assessment.description}</p>
                        </div>

                        {/* meta */}
                        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                          <span className='flex items-center gap-1'>
                            <BookOpen className='h-3.5 w-3.5' />
                            {assessment.totalQuestions} questions
                          </span>
                        </div>

                        {/* footer */}
                        <div className='flex items-center justify-between pt-2 border-t border-border'>
                          <span className='text-xs text-muted-foreground'>{assessment.domain}</span>

                          <Button
                            size='sm'
                            onClick={() => handleStartAssessment(assessment.assessment_id, status, progress?.attempt_id)}
                          >
                            <>
                              {status === ASSESSMENT_IN_PROGRESS_KEY ? 'Resume assessment' : 'Start assessment'}

                              <ChevronRight className='h-4 w-4' />
                            </>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
