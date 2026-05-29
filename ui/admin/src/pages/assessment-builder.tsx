'use client';

import { useEffect, useMemo, useState } from 'react';

import { AssessmentTopicSidebar } from '@/components/assessment/AssessmentTopicSidebar';
import { AssessmentQuestionCanvas } from '@/components/assessment/AssessmentQuestionCanvas';
import { AssessmentLivePreview } from '@/components/assessment/AssessmentLivePreview';
import { useAssessmentQuestions, useAssessmentTopics } from '@/hooks/use-assessment';
import { useParams } from 'react-router-dom';

export function AssessmentBuilderPage() {
  // =====================================================
  // FETCH TOPICS
  // =====================================================
  const { assessmentId } = useParams();

  const { data: topicsData } = useAssessmentTopics(Number(assessmentId));

  const topics = topicsData?.data ?? [];

  // =====================================================
  // ACTIVE TOPIC
  // =====================================================

  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);

  useEffect(() => {
    if (topics.length > 0 && !activeTopicId) {
      setActiveTopicId(topics[0].assessment_topic_id);
    }
  }, [topics, activeTopicId]);

  // =====================================================
  // FETCH QUESTIONS
  // =====================================================

  const { data: questionsData } = useAssessmentQuestions(activeTopicId as number);

  const questions = questionsData?.data ?? [];

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [questionsState, setQuestionsState] = useState<any[]>([]);

  useEffect(() => {
    if (!questions?.length) return;

    setQuestionsState((prev) => {
      const prevString = JSON.stringify(prev);
      const nextString = JSON.stringify(questions);

      if (prevString === nextString) {
        return prev;
      }

      return questions;
    });
  }, [questions]);

  // =====================================================
  // SCORING PREVIEW
  // =====================================================

  const totalPossibleScore = useMemo(() => {
    return questionsState.reduce((acc: number, q: any) => {
      const maxScore = Math.max(...(q.options?.map((o: any) => o.score_value || 0) || [0])) || 0;

      return acc + maxScore * (q.weight || 1);
    }, 0);
  }, [questionsState]);

  return (
    <div className='h-screen grid grid-cols-12 gap-4 p-4 bg-muted/20'>
      {/* =====================================================
          LEFT SIDEBAR
      ===================================================== */}

      <div className='col-span-3 border rounded-xl bg-background overflow-hidden'>
        <AssessmentTopicSidebar
          topics={topics}
          activeTopicId={activeTopicId}
          onSelect={setActiveTopicId}
          assessmentId={assessmentId}
        />
      </div>

      {/* =====================================================
          CENTER BUILDER
      ===================================================== */}

      <div className='col-span-6 border rounded-xl bg-background overflow-hidden flex flex-col'>
        {/* HEADER */}
        <div className='border-b px-4 py-3 flex items-center justify-between'>
          <div>
            <h2 className='font-semibold text-lg'>Assessment Builder</h2>

            <p className='text-sm text-muted-foreground'>Build questions, scales, scoring and assessment logic.</p>
          </div>

          <div className='flex gap-2'>
            <div className='px-3 py-2 rounded-md bg-muted text-sm'>{questionsState.length} Questions</div>

            <div className='px-3 py-2 rounded-md bg-primary/10 text-primary text-sm'>Max Score: {totalPossibleScore}</div>
          </div>
        </div>

        {/* BODY */}
        <div className='flex-1 overflow-auto p-4'>
          <AssessmentQuestionCanvas
            topicId={activeTopicId}
            questions={questionsState}
            setQuestions={setQuestionsState}
          />
        </div>
      </div>

      {/* =====================================================
          LIVE PREVIEW
      ===================================================== */}

      <div className='col-span-3 border rounded-xl bg-background overflow-hidden flex flex-col'>
        <div className='border-b px-4 py-3'>
          <h2 className='font-semibold'>Live Preview</h2>

          <p className='text-sm text-muted-foreground'>Real assessment experience preview</p>
        </div>

        <div className='flex-1 overflow-auto p-4'>
          <AssessmentLivePreview questions={questionsState} />
        </div>
      </div>
    </div>
  );
}
