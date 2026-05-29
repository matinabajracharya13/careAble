// components/assessment/AssessmentQuestionCanvas.tsx

'use client';

import { useState } from 'react';

import { Check, Pencil, Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';

const DEFAULT_LIKERT = [
  {
    option_label: 'Strongly Disagree',
    option_value: '1',
    score_value: 1
  },
  {
    option_label: 'Disagree',
    option_value: '2',
    score_value: 2
  },
  {
    option_label: 'Neutral',
    option_value: '3',
    score_value: 3
  },
  {
    option_label: 'Agree',
    option_value: '4',
    score_value: 4
  },
  {
    option_label: 'Strongly Agree',
    option_value: '5',
    score_value: 5
  }
];

export function AssessmentQuestionCanvas({ topicId, questions, setQuestions }: any) {
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

  const addQuestion = () => {
    const question = {
      assessment_question_id: Date.now(),
      assessment_topic_id: topicId,
      question_text: 'New Question',
      question_type: 'likert',
      input_type: 'radio',
      is_required: true,
      is_reverse_scored: false,
      weight: 1,
      helper_text: '',
      options: DEFAULT_LIKERT.map((o, i) => ({
        assessment_question_options_id: Date.now() + i,
        ...o
      }))
    };

    setQuestions((prev: any[]) => [...prev, question]);
  };

  const updateQuestion = (questionId: number, updated: any) => {
    setQuestions((prev: any[]) => prev.map((q) => (q.assessment_question_id === questionId ? { ...q, ...updated } : q)));
  };

  const deleteQuestion = (questionId: number) => {
    setQuestions((prev: any[]) => prev.filter((q) => q.assessment_question_id !== questionId));
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='font-semibold text-lg'>Questions</h2>

          <p className='text-sm text-muted-foreground'>Configure assessment questions</p>
        </div>

        <Button onClick={addQuestion}>
          <Plus className='h-4 w-4 mr-2' />
          Add Question
        </Button>
      </div>

      {questions.map((q: any) => (
        <Card
          key={q.assessment_question_id}
          className='p-5 space-y-4'
        >
          {/* QUESTION HEADER */}
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1 space-y-3'>
              {editingQuestionId === q.assessment_question_id ? (
                <>
                  <Textarea
                    defaultValue={q.question_text}
                    onChange={(e) =>
                      updateQuestion(q.assessment_question_id, {
                        question_text: e.target.value
                      })
                    }
                  />

                  <Input
                    placeholder='Helper text'
                    defaultValue={q.helper_text}
                    onChange={(e) =>
                      updateQuestion(q.assessment_question_id, {
                        helper_text: e.target.value
                      })
                    }
                  />

                  <div className='flex gap-2'>
                    <Input
                      type='number'
                      placeholder='Weight'
                      defaultValue={q.weight}
                      onChange={(e) =>
                        updateQuestion(q.assessment_question_id, {
                          weight: Number(e.target.value)
                        })
                      }
                    />

                    <label className='flex items-center gap-2 text-sm'>
                      <input
                        type='checkbox'
                        checked={q.is_reverse_scored}
                        onChange={(e) =>
                          updateQuestion(q.assessment_question_id, {
                            is_reverse_scored: e.target.checked
                          })
                        }
                      />
                      Reverse Scored
                    </label>
                  </div>

                  <Button
                    size='sm'
                    onClick={() => setEditingQuestionId(null)}
                  >
                    <Check className='h-4 w-4 mr-2' />
                    Done
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <p className='font-medium text-base'>{q.question_text}</p>

                    {q.helper_text && <p className='text-sm text-muted-foreground mt-1'>{q.helper_text}</p>}
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    <Badge variant='secondary'>{q.question_type}</Badge>

                    <Badge variant='outline'>Weight: {q.weight}</Badge>

                    {q.is_reverse_scored && <Badge variant='destructive'>Reverse Scored</Badge>}
                  </div>
                </>
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

          {/* OPTIONS */}
          <div className='space-y-2 border-t pt-4'>
            <p className='text-xs uppercase tracking-wide text-muted-foreground'>Likert Scale</p>

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
      ))}
    </div>
  );
}
