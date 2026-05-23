'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Plus, Trash2, Pencil, Check } from 'lucide-react';

export function QuestionCanvas({ questions, setQuestions }: any) {
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editingOption, setEditingOption] = useState<any>(null);

  const [newOptionText, setNewOptionText] = useState('');

  // =========================
  // UPDATE QUESTION
  // =========================
  const updateQuestion = (questionId: number, updated: any) => {
    setQuestions((prev: any[]) => prev.map((q) => (q.question_id === questionId ? { ...q, ...updated } : q)));
  };
  console.log('Questions in Canvas:', questions); // Debug log to check the structure of questions

  // =========================
  // ADD OPTION
  // =========================
  const addOption = (questionId: number) => {
    if (!newOptionText.trim()) return;

    setQuestions((prev: any[]) =>
      prev.map((q) => {
        if (q.question_id !== questionId) return q;

        return {
          ...q,
          options: [
            ...(q.options || []),
            {
              option_id: Date.now(),
              option_text: newOptionText,
              option_value: newOptionText
            }
          ]
        };
      })
    );

    setNewOptionText('');
  };

  // =========================
  // DELETE OPTION
  // =========================
  const deleteOption = (questionId: number, optionId: number) => {
    setQuestions((prev: any[]) =>
      prev.map((q) => {
        if (q.question_id !== questionId) return q;

        return {
          ...q,
          options: q.options.filter((o: any) => o.option_id !== optionId)
        };
      })
    );
  };

  // =========================
  // UPDATE OPTION
  // =========================
  const updateOption = (questionId: number, optionId: number, text: string) => {
    setQuestions((prev: any[]) =>
      prev.map((q) => {
        if (q.question_id !== questionId) return q;

        return {
          ...q,
          options: q.options.map((o: any) => (o.option_id === optionId ? { ...o, option_text: text, option_value: text } : o))
        };
      })
    );

    setEditingOption(null);
  };

  return (
    <div className='space-y-4'>
      <h2 className='font-semibold'>Questions Builder</h2>

      {questions.map((q: any) => {
        const isBoolean = q.question_type === 'boolean';

        return (
          <Card
            key={q.question_id}
            className='p-4 space-y-4'
          >
            {/* ================= QUESTION HEADER ================= */}
            <div className='space-y-2'>
              {/* EDIT QUESTION MODE */}
              {editingQuestionId === q.question_id ? (
                <div className='space-y-2'>
                  <Input
                    defaultValue={q.question_text}
                    onChange={(e) =>
                      updateQuestion(q.question_id, {
                        question_text: e.target.value
                      })
                    }
                  />

                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      onClick={() => setEditingQuestionId(null)}
                    >
                      <Check className='h-4 w-4' />
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='font-medium'>{q.question_text}</p>

                    {/* PROFILE META */}
                    <p className='text-xs text-muted-foreground'>
                      {q.profile_label} • {q.profile_key}
                    </p>

                    <div className='flex gap-2 text-xs mt-2'>
                      <span className='px-2 py-1 bg-muted rounded'>{q.question_type}</span>

                      <span className='px-2 py-1 bg-muted rounded'>{q.input_type}</span>

                      {q.is_required && <span className='px-2 py-1 bg-red-100 text-red-600 rounded'>required</span>}
                    </div>
                  </div>

                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => setEditingQuestionId(q.question_id)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                </div>
              )}
            </div>

            {/* ================= OPTIONS ================= */}
            {!isBoolean && (
              <div className='space-y-2 border-t pt-3'>
                <p className='text-xs font-medium text-muted-foreground'>Options</p>

                {q.options?.map((option: any) => (
                  <div
                    key={option.option_id}
                    className='flex items-center justify-between border rounded-md p-2'
                  >
                    {/* EDIT OPTION */}
                    {editingOption?.option_id === option.option_id ? (
                      <div className='flex gap-2 w-full'>
                        <Input
                          defaultValue={option.option_text}
                          onChange={(e) =>
                            setEditingOption({
                              ...option,
                              questionId: q.question_id,
                              option_text: e.target.value
                            })
                          }
                        />

                        <Button
                          size='sm'
                          onClick={() => updateOption(q.question_id, option.option_id, editingOption.option_text)}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className='text-sm'>{option.option_text}</span>

                        <div className='flex gap-2'>
                          <Button
                            size='icon'
                            variant='ghost'
                            onClick={() => setEditingOption(option)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>

                          <Button
                            size='icon'
                            variant='ghost'
                            onClick={() => deleteOption(q.question_id, option.option_id)}
                          >
                            <Trash2 className='h-4 w-4 text-red-500' />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* ADD OPTION */}
                <div className='flex gap-2'>
                  <Input
                    placeholder='Add option...'
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                  />

                  <Button
                    size='sm'
                    onClick={() => addOption(q.question_id)}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}

            {/* ================= BOOLEAN UI ================= */}
            {isBoolean && <div className='border-t pt-3 text-xs text-muted-foreground'>Boolean question (fixed Yes / No)</div>}
          </Card>
        );
      })}
    </div>
  );
}
