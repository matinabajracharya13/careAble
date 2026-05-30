'use client';

import { RoleGuard } from '@/components/auth/RouteGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge, Card, CardContent } from '@/components/ui/ui-components';
import { UserRole } from '@/config/role';
import { ASSESSMENT_IN_PROGRESS_KEY } from '@/constants/app';
import { assessmentApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function AssessmentListPage() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  // ─────────────────────────────
  // FETCH ASSESSMENTS
  // ─────────────────────────────
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: assessmentApi.getAssessments
  });

  // ─────────────────────────────
  // FETCH PROGRESS
  // ─────────────────────────────
  const { data: progress } = useQuery({
    queryKey: ['assessment-progress'],
    queryFn: assessmentApi.getUserAssessmentProgress
  });

  // ─────────────────────────────
  // START / RESUME
  // ─────────────────────────────
  const handleStartAssessment = async (assessmentId: number, status?: string, attemptId?: string) => {
    try {
      if (status === ASSESSMENT_IN_PROGRESS_KEY && attemptId) {
        router.push(`/assessment/${assessmentId}/${attemptId}`);
        return;
      }

      const response = await assessmentApi.startAssessment(assessmentId);

      router.push(`/assessment/${assessmentId}/${response.attempt_id}`);
    } catch (error) {
      console.error(error);
    }
  };

  // ─────────────────────────────
  // LATEST ATTEMPT MAP
  // ─────────────────────────────
  const progressMap = useMemo(() => {
    const map = new Map<number, any>();

    (progress || []).forEach((p: any) => {
      const existing = map.get(p.assessment_id);

      // keep latest attempt (simple max by attempt_id)
      if (!existing || existing.attempt_id < p.attempt_id) {
        map.set(p.assessment_id, p);
      }
    });

    return map;
  }, [progress]);

  // ─────────────────────────────
  // NORMALIZE STATUS
  // ─────────────────────────────
  const normalizeStatus = (status?: string) => {
    if (!status) return 'NOT_STARTED';
    return status.toUpperCase();
  };

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  return (
    <RoleGuard allowedRoles={[UserRole.CARER]}>
      <div className='min-h-screen bg-background pt-20 pb-12'>
        <div className='container mx-auto px-4 max-w-5xl'>
          {/* HEADER */}
          <div className='mb-10 space-y-2'>
            <Badge className='bg-primary/10 text-primary border-primary/20'>Skill assessments</Badge>

            <h1 className='text-4xl font-display font-bold'>Choose your assessment</h1>

            <p className='text-muted-foreground'>Each assessment is designed by industry experts.</p>
          </div>

          {/* SEARCH */}
          <div className='mb-8'>
            <Input
              placeholder='Search assessments…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='max-w-sm'
            />
          </div>

          {/* LOADING */}
          {isLoading ? (
            <div className='flex justify-center py-20'>
              <Loader2 className='animate-spin' />
            </div>
          ) : (
            <div className='grid md:grid-cols-2 gap-5'>
              {assessments
                ?.filter((a: any) => (a.title + a.domain).toLowerCase().includes(search.toLowerCase()))
                .map((assessment: any) => {
                  const progress = progressMap.get(assessment.assessment_id);

                  const status = normalizeStatus(progress?.status);
                  const attemptId = progress?.attempt_id;

                  // ─────────────────────────────
                  // ACTION BUTTONS
                  // ─────────────────────────────
                  const renderActions = () => {
                    // NOT STARTED
                    if (!progress) {
                      return (
                        <Button
                          size='sm'
                          onClick={() => handleStartAssessment(assessment.assessment_id)}
                        >
                          Start
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                      );
                    }

                    // IN PROGRESS
                    if (status === 'IN_PROGRESS') {
                      return (
                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => router.push(`/assessment/${assessment.assessment_id}/${attemptId}`)}
                          >
                            Resume
                          </Button>
                        </div>
                      );
                    }

                    // COMPLETED
                    if (status === 'COMPLETED') {
                      return (
                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            onClick={() => router.push(`/assessment/${assessment.assessment_id}/details`)}
                          >
                            Details
                          </Button>

                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => handleStartAssessment(assessment.assessment_id)}
                          >
                            Reattempt
                          </Button>
                        </div>
                      );
                    }

                    return null;
                  };

                  return (
                    <Card key={assessment.assessment_id}>
                      <CardContent className='p-6 space-y-4'>
                        {/* HEADER */}
                        <div className='flex justify-between'>
                          <div className='h-10 w-10 bg-primary/10 flex items-center justify-center rounded-lg'>
                            <BookOpen />
                          </div>

                          {status === 'IN_PROGRESS' && <Badge variant='outline'>In Progress</Badge>}

                          {status === 'COMPLETED' && <Badge className='bg-green-100 text-green-700'>Completed</Badge>}
                        </div>

                        {/* TITLE */}
                        <h3 className='font-semibold text-lg'>{assessment.title}</h3>

                        <p className='text-sm text-muted-foreground'>{assessment.description}</p>

                        {/* META */}
                        <div className='text-xs text-muted-foreground'>{assessment.totalQuestions} questions</div>

                        {/* FOOTER */}
                        <div className='flex items-center justify-between pt-2 border-t'>
                          <span className='text-xs text-muted-foreground'>{assessment.domain}</span>

                          {renderActions()}
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
