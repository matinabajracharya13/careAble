'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader, Send } from 'lucide-react';
import { Card, CardContent, Badge } from '@/components/ui/ui-components';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { assessmentApi } from '@/lib/api';
import { useParams } from 'next/navigation';

const QUESTIONS_PER_PAGE = 5;

const scaleLabels = {
  1: 'Never / Not at all true',
  2: 'Rarely true',
  3: 'Sometimes true',
  4: 'Often true',
  5: 'Always / Consistently true',
};

type AnswerValue = {
  value: number;
  label: string;
};

export default function TopicStepperAssessment() {
  const params = useParams();
  const id = params.id as string;

  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => assessmentApi.getAssessment(id),
  });

  const { data: progress } = useQuery({
    queryKey: ['assessment-progress', id],
    queryFn: () => assessmentApi.getProgress(id),
  });

  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const saveMutation = useMutation({
    mutationFn: () =>
      assessmentApi.saveProgress(id, {
        answers,
        currentTopicIndex,
        currentPage,
      }),
    onSuccess: () => {
      toast({
        title: 'Progress saved',
        description: 'You can continue later.',
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      assessmentApi.submitAssessment(id, {
        answers,
      }),
    onSuccess: () => {
      toast({
        title: 'Assessment submitted',
        description: 'Your responses have been saved.',
      });
    },
    onError: () => {
      toast({
        title: 'Submission failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const currentTopic = assessment?.topics[currentTopicIndex];

  const totalPages = Math.ceil(
    (currentTopic?.questions?.length ?? 0) / QUESTIONS_PER_PAGE
  );

  const visibleQuestions = currentTopic?.questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  // ── Restore state ───────────────────────────────
  useEffect(() => {
    if (!assessment) return;

    const defaults: Record<string, AnswerValue> = {};

    assessment.topics.forEach((t) => {
      t.questions.forEach((q) => {
        defaults[q.id] = {
          value: 3,
          label: scaleLabels[3],
        };
      });
    });

    let savedAnswers: Record<string, AnswerValue> = {};

    if (progress?.answers) {
      try {
        savedAnswers = JSON.parse(progress.answers);
      } catch (err) {
        console.error('Failed to parse saved answers', err);
      }
    }

    setAnswers({
      ...defaults,
      ...savedAnswers,
    });

    if (progress) {
      setCurrentTopicIndex(progress.current_topic_index ?? 0);
      setCurrentPage(progress.current_page ?? 0);
    }
  }, [assessment, progress]);

  // ── Change answer ───────────────────────────────
  const handleChange = (qid: string, value: string) => {
    const num = Number(value);

    setAnswers((prev) => ({
      ...prev,
      [qid]: {
        value: num,
        label: scaleLabels[num as keyof typeof scaleLabels],
      },
    }));
  };

  // ── Navigation ───────────────────────────────
  const next = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    } else if (
      currentTopicIndex <
      (assessment as any)?.topics?.length - 1
    ) {
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

  const isLastStep =
    currentTopicIndex === (assessment as any)?.topics?.length - 1 &&
    currentPage === totalPages - 1;

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  if (isLoading || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* HEADER */}
        <div className="text-center">
          <Badge>{assessment.category}</Badge>
          <h1 className="text-3xl font-bold">{assessment.title}</h1>
          <p className="text-muted-foreground">
            {assessment.description}
          </p>
        </div>

        {/* PROGRESS */}
        <div className="text-sm text-muted-foreground text-center">
          Topic {currentTopicIndex + 1} of {assessment.topics.length} · Page{' '}
          {currentPage + 1} of {totalPages}
        </div>

        {/* CARD */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">
              {currentTopic?.title}
            </h2>

            {visibleQuestions?.map((q, idx) => {
              const selected = answers[q.id];

              return (
                <div key={q.id} className="space-y-3">
                  <p className="font-medium">
                    {idx + 1 + currentPage * QUESTIONS_PER_PAGE}. {q.text}
                  </p>

                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={selected?.value ?? 3}
                    onChange={(e) =>
                      handleChange(q.id, e.target.value)
                    }
                    className="w-full accent-primary"
                  />

                  <div className="text-sm text-center text-primary">
                    {selected?.label}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* NAV */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {!isLastStep ? (
            <Button onClick={next}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Send className="h-4 w-4" />
              {submitMutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          )}

          {!isLastStep && (
            <Button
              variant="secondary"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Progress'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}