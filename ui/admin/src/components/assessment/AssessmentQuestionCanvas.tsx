'use client';

import { useState } from 'react';

import { Check, Pencil, Plus, Save, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { useSaveAssessmentQuestions } from '@/hooks/use-assessment';
import { useUIStore } from '@/store/ui-store';

const DEFAULT_LIKERT = [
  { option_label: 'Strongly Disagree', option_value: '1', score_value: 1 },
  { option_label: 'Disagree', option_value: '2', score_value: 2 },
  { option_label: 'Neutral', option_value: '3', score_value: 3 },
  { option_label: 'Agree', option_value: '4', score_value: 4 },
  { option_label: 'Strongly Agree', option_value: '5', score_value: 5 }
];

export function AssessmentQuestionCanvas({ topicId, assessmentId, questions, setQuestions }: any) {
  const [editingQuestionId, setEditingQuestionId] = useState<number | string | null>(null);

  const saveQuestionsApi = useSaveAssessmentQuestions();
  const { addToast } = useUIStore();

  // =========================
  // ADD QUESTION
  // =========================
  const addQuestion = () => {
    const now = Date.now();

    const question = {
      assessment_question_id: `draft-${now}`,
      assessment_topic_id: topicId,
      assessment_id: assessmentId,
      question_text: 'New Question',
      question_type: 'likert',
      display_order: questions.length + 1,
      options: DEFAULT_LIKERT.map((o, i) => ({
        assessment_question_options_id: `draft-option-${now}-${i}`,
        ...o
      }))
    };

    setQuestions((prev: any[]) => [...prev, question]);
    setEditingQuestionId(question.assessment_question_id);
  };

  // =========================
  // UPDATE QUESTION TEXT ONLY
  // =========================
  const updateQuestion = (questionId: any, updated: any) => {
    setQuestions((prev: any[]) => prev.map((q) => (q.assessment_question_id === questionId ? { ...q, ...updated } : q)));
  };

  // =========================
  // DELETE QUESTION
  // =========================
  const deleteQuestion = (questionId: any) => {
    setQuestions((prev: any[]) => prev.filter((q) => q.assessment_question_id !== questionId));
  };

  // =========================
  // SAVE ALL QUESTIONS
  // =========================
  const saveAllQuestions = async () => {
    if (!questions?.length) return;

    const payload = {
      assessment_topic_id: topicId,
      assessment_id: assessmentId,

      questions: questions.map((q: any, index: number) => ({
        assessment_question_id: typeof q.assessment_question_id === 'string' ? null : q.assessment_question_id,

        question_text: q.question_text,
        question_type: q.question_type,
        display_order: index + 1,

        options: q.options.map((o: any) => ({
          assessment_question_options_id: typeof o.assessment_question_options_id === 'string' ? null : o.assessment_question_options_id,

          option_label: o.option_label,
          option_value: o.option_value,
          score_value: o.score_value // still saved, but NOT editable
        }))
      }))
    };
    try {
      await saveQuestionsApi.mutateAsync(payload);

      addToast({
        title: 'Assessment questions saved successfully',
        variant: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Failed to save assessment questions',
        variant: 'destructive'
      });

      console.error(error);
    }
  };

  if (!topicId) {
    return <div className='h-full flex items-center justify-center text-sm text-muted-foreground'>Select a topic first</div>;
  }

  return (
    <div className='space-y-4'>
      {/* HEADER */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='font-semibold text-lg'>Questions</h2>
          <p className='text-sm text-muted-foreground'>Configure assessment questions</p>
        </div>

        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={addQuestion}
          >
            <Plus className='h-4 w-4 mr-2' />
            Add Question
          </Button>

          <Button
            onClick={saveAllQuestions}
            disabled={saveQuestionsApi.isPending || !questions?.length}
          >
            <Save className='h-4 w-4 mr-2' />
            {saveQuestionsApi.isPending ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      {/* QUESTIONS */}
      {questions.map((q: any) => {
        const editing = editingQuestionId === q.assessment_question_id;

        return (
          <Card
            key={q.assessment_question_id}
            className='p-5 space-y-4'
          >
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1 space-y-4'>
                {editing ? (
                  <>
                    <Textarea
                      value={q.question_text}
                      onChange={(e) =>
                        updateQuestion(q.assessment_question_id, {
                          question_text: e.target.value
                        })
                      }
                    />

                    <Button
                      size='sm'
                      onClick={() => setEditingQuestionId(null)}
                    >
                      <Check className='h-4 w-4 mr-2' />
                      Done
                    </Button>
                  </>
                ) : (
                  <p className='font-medium text-base'>{q.question_text}</p>
                )}
              </div>

              <div className='flex gap-2'>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => setEditingQuestionId(q.assessment_question_id)}
                >
                  <Pencil className='h-4 w-4' />
                </Button>

                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => deleteQuestion(q.assessment_question_id)}
                >
                  <Trash2 className='h-4 w-4 text-red-500' />
                </Button>
              </div>
            </div>

            {/* PREVIEW ONLY */}
            <div className='space-y-2 border-t pt-4'>
              <p className='text-xs uppercase text-muted-foreground'>Likert Scale (Fixed)</p>

              <div className='grid grid-cols-5 gap-2'>
                {q.options?.map((option: any) => (
                  <div
                    key={option.assessment_question_options_id}
                    className='border rounded-lg p-3 text-center bg-muted/30'
                  >
                    <p className='text-sm font-medium'>{option.option_label}</p>

                    <p className='text-xs text-muted-foreground mt-1'>Score: {option.score_value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
