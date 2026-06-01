'use client';

import { useQuery } from '@tanstack/react-query';
import { assessmentApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/ui-components';
import { Loader2, Award, RotateCcw, Play } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { queryKeys } from '@/lib/query-keys';

export default function AttemptDetailPage() {
  const params = useParams();
  const router = useRouter();

  const assessmentId = Number(params.assessmentId);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.assessments.attemptDetail(assessmentId),
    queryFn: () => assessmentApi.getAttemptDetail(assessmentId)
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
    );
  }

  const assessment = data?.assessment;
  const attempt = data?.attempt;
  const domainScores = data?.answers || [];
  const certificate = data?.certificate;

  const resume = () => {
    if (!attempt) return;
    router.push(`/assessment/${assessmentId}/${attempt.attempt_id}`);
  };

  const reattempt = async () => {
    const res = await assessmentApi.startAssessment(assessmentId);
    router.push(`/assessment/${assessmentId}/${res.attempt_id}`);
  };

  const openCertificate = () => {
    if (!certificate) return;
    router.push(`/certificate/${certificate.certificate_code}`);
  };

  return (
    <div className='min-h-screen pt-20 px-6 bg-background'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* ===================== */}
        {/* ASSESSMENT HEADER (ACTIONS MOVED HERE) */}
        {/* ===================== */}
        <Card>
          <CardContent className='p-6 space-y-4'>
            <div>
              <h1 className='text-2xl font-bold'>{assessment?.title}</h1>
              <p className='text-sm text-muted-foreground'>{assessment?.description}</p>

              <div className='flex gap-2 text-xs mt-2'>
                <span className='px-2 py-1 rounded bg-primary/10 text-primary'>{assessment?.domain}</span>
              </div>
            </div>

            {/* ACTIONS MOVED HERE */}
            <div className='flex flex-wrap gap-3 pt-2 border-t'>
              {!attempt && (
                <Button onClick={resume}>
                  <Play className='h-4 w-4 mr-2' />
                  Start Assessment
                </Button>
              )}

              {attempt?.status === 'in_progress' && (
                <Button onClick={resume}>
                  <Play className='h-4 w-4 mr-2' />
                  Resume
                </Button>
              )}

              <Button
                variant='outline'
                onClick={reattempt}
              >
                <RotateCcw className='h-4 w-4 mr-2' />
                Reattempt
              </Button>

              {certificate && (
                <Button onClick={openCertificate}>
                  <Award className='h-4 w-4 mr-2' />
                  View Certificate
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ===================== */}
        {/* ATTEMPT STATUS (SIMPLIFIED) */}
        {/* ===================== */}
        {attempt && (
          <Card>
            <CardContent className='p-6'>
              <h2 className='text-lg font-semibold'>Attempt Status</h2>

              <p className='text-sm text-muted-foreground mt-2'>
                Status: <span className='font-medium'>{attempt.status}</span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* ===================== */}
        {/* DOMAIN SCORES */}
        {/* ===================== */}
        {domainScores?.length > 0 && (
          <Card>
            <CardContent className='p-6 space-y-4'>
              <h2 className='text-lg font-semibold'>Your Results</h2>

              {domainScores.map((d: any) => {
                const percent = (d.average_score / 5) * 100;

                return (
                  <div
                    key={d.domain_score_id}
                    className='space-y-1'
                  >
                    <div className='flex justify-between text-sm'>
                      <span className='font-medium'>{d.competency_title}</span>
                      <span className='text-muted-foreground'>{d.average_score.toFixed(2)} / 5</span>
                    </div>

                    <div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-primary'
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
