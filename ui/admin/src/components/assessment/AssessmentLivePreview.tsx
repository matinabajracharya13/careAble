// components/assessment/AssessmentLivePreview.tsx

'use client';

import { useState } from 'react';
import { Progress } from '../ui/progress';

export function AssessmentLivePreview({ questions }: any) {
  const [answers, setAnswers] = useState<any>({});

  const answeredCount = Object.keys(answers).length;

  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className='space-y-6'>
      {/* HEADER */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h2 className='font-semibold'>Assessment Preview</h2>

          <span className='text-xs text-muted-foreground'>
            {answeredCount}/{questions.length}
          </span>
        </div>

        <Progress value={progress} />
      </div>

      {/* QUESTIONS */}
      <div className='space-y-6'>
        {questions.map((q: any, index: number) => (
          <div
            key={q.assessment_question_id}
            className='space-y-3 border rounded-xl p-4'
          >
            <div>
              <p className='font-medium text-sm'>
                {index + 1}. {q.question_text}
              </p>

              {q.helper_text && <p className='text-xs text-muted-foreground mt-1'>{q.helper_text}</p>}
            </div>

            {/* OPTIONS */}
            <div className='space-y-2'>
              {q.options?.map((option: any) => {
                const checked = answers[q.assessment_question_id] === option.option_value;

                return (
                  <label
                    key={option.assessment_question_options_id}
                    className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-all ${
                      checked ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'
                    }`}
                  >
                    <input
                      type='radio'
                      name={`question-${q.assessment_question_id}`}
                      checked={checked}
                      onChange={() =>
                        setAnswers((prev: any) => ({
                          ...prev,
                          [q.assessment_question_id]: option.option_value
                        }))
                      }
                    />

                    <span className='text-sm'>{option.option_label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
