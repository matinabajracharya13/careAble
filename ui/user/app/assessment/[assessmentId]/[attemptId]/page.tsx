'use client';

import { RoleGuard } from '@/components/auth/RouteGuard';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { Badge, Card, CardContent } from '@/components/ui/ui-components';
import { UserRole } from '@/config/role';
import { assessmentApi } from '@/lib/api';
import { Assessment, AssessmentTopic } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader, Send } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const QUESTIONS_PER_PAGE = 5;

export default function TopicStepperAssessment() {
  const params = useParams();
  const id = params.assessmentId as string;
  const attemptID = params.attemptId as string;
  const router = useRouter();

  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => assessmentApi.getAssessment(id)
  });

  const { data: progress } = useQuery({
    queryKey: ['assessment-progress', attemptID],
    queryFn: () => assessmentApi.getProgress(id, attemptID),
    refetchOnMount: true
  });

  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [answers, setAnswers] = useState<
    Record<
      string,
      {
        topicId: number;
        value: number;
        optionId: number;
      }
    >
  >({});

  const saveMutation = useMutation({
    mutationFn: () =>
      assessmentApi.saveProgress(id, attemptID, {
        answers,
        currentTopicIndex,
        currentPage
      }),
    onSuccess: () => {
      toast({
        title: 'Progress saved',
        description: 'You can continue later.'
      });
    }
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      assessmentApi.submitAssessment(id, attemptID, {
        answers
      }),
    onSuccess: () => {
      toast({
        title: 'Assessment submitted',
        description: 'Your competency profile has been updated.'
      });

      router.push('/dashboard');
    },
    onError: () => {
      toast({
        title: 'Submission failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  });

  const currentTopic = (assessment as Assessment)?.topics[currentTopicIndex] as AssessmentTopic;

  const totalPages = Math.ceil((currentTopic?.questions?.length ?? 0) / QUESTIONS_PER_PAGE);

  const visibleQuestions = currentTopic?.questions.slice(currentPage * QUESTIONS_PER_PAGE, (currentPage + 1) * QUESTIONS_PER_PAGE);

  useEffect(() => {
    if (!assessment) return;

    let savedAnswers: Record<
      string,
      {
        topicId: number;
        value: number;
        optionId: number;
      }
    > = {};

    if (progress?.answers) {
      try {
        savedAnswers = JSON.parse(progress.answers);
      } catch (err) {
        console.error('Failed to parse saved answers', err);
      }
    }

    setAnswers(savedAnswers);

    if (progress) {
      setCurrentTopicIndex(progress.current_topic_index ?? 0);
      setCurrentPage(progress.current_page ?? 0);
    }
  }, [assessment, progress]);

  // ── Navigation ───────────────────────────────

  const next = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    } else if (currentTopicIndex < (assessment as Assessment)?.topics?.length - 1) {
      setCurrentTopicIndex((t) => t + 1);
      setCurrentPage(0);
    }
  };

  const prev = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    } else if (currentTopicIndex > 0) {
      const prevTopicIndex = currentTopicIndex - 1;
      const prevTopic = assessment?.topics[prevTopicIndex];

      const questionCount = prevTopic?.questions?.length ?? 0;
      const lastPage = Math.ceil(questionCount / QUESTIONS_PER_PAGE) - 1;

      setCurrentTopicIndex(prevTopicIndex);
      setCurrentPage(lastPage);
    }
  };

  const isLastStep = currentTopicIndex === (assessment as Assessment)?.topics?.length - 1 && currentPage === totalPages - 1;

  const allQuestionsAnswered = visibleQuestions?.every((q) => answers[q.id]);

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  if (isLoading || !assessment) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader className='animate-spin' />
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={[UserRole.CARER]}>
      <div className='min-h-screen pt-20 pb-12'>
        <div className='max-w-3xl mx-auto px-4 space-y-6'>
          {/* HEADER */}
          <div className='text-center space-y-2'>
            <Badge>{assessment.category}</Badge>

            <h1 className='text-3xl font-bold'>{assessment.title}</h1>

            <p className='text-muted-foreground'>{assessment.description}</p>
          </div>

          {/* PROGRESS */}
          <div className='text-sm text-muted-foreground text-center'>
            Topic {currentTopicIndex + 1} of {assessment.topics.length} · Page {currentPage + 1} of {totalPages}
          </div>

          {/* CARD */}
          <Card>
            <CardContent className='p-6 space-y-8'>
              <h2 className='text-xl font-semibold'>{currentTopic?.title}</h2>

              {visibleQuestions?.map((q, idx) => {
                const selected = answers[q.id];

                return (
                  <div
                    key={q.id}
                    className='space-y-4'
                  >
                    <p className='font-medium leading-relaxed'>
                      {idx + 1 + currentPage * QUESTIONS_PER_PAGE}. {q.text}
                    </p>

                    <div className='grid grid-cols-1 gap-2 sm:grid-cols-5'>
                      {q.options.map((opt) => {
                        const isSelected = selected?.optionId === opt.id;

                        return (
                          <label
                            key={opt.id}
                            className={`flex min-h-[56px] cursor-pointer items-center justify-center rounded-lg border p-3 text-center text-sm transition-all
                              ${
                                isSelected
                                  ? 'border-primary bg-primary/10 text-primary font-medium'
                                  : 'border-border hover:border-primary/40 hover:bg-muted/40'
                              }
                            `}
                          >
                            <input
                              type='radio'
                              name={`question-${q.id}`}
                              value={opt.id}
                              checked={isSelected}
                              onChange={() => {
                                setAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: {
                                    topicId: currentTopic?.id as number,
                                    value: opt.value,
                                    optionId: opt.id
                                  }
                                }));
                              }}
                              className='sr-only'
                            />

                            {opt.label}
                          </label>
                        );
                      })}
                    </div>

                    {!selected && <p className='text-sm text-destructive'>Please select an answer.</p>}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* NAVIGATION */}
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <Button
              variant='outline'
              onClick={prev}
              disabled={currentTopicIndex === 0 && currentPage === 0}
            >
              <ChevronLeft className='h-4 w-4' />
              Previous
            </Button>

            <div className='flex gap-3'>
              {!isLastStep && (
                <Button
                  variant='secondary'
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Progress'}
                </Button>
              )}

              {!isLastStep ? (
                <Button
                  onClick={next}
                  disabled={!allQuestionsAnswered}
                >
                  Next
                  <ChevronRight className='h-4 w-4' />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered || submitMutation.isPending}
                >
                  <Send className='h-4 w-4' />
                  {submitMutation.isPending ? 'Submitting...' : 'Submit'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
