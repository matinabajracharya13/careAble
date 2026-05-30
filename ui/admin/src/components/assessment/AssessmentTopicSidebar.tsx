'use client';

import { useEffect, useState } from 'react';

import { Brain, ChevronRight, Pencil, Plus, Trash2, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useCreateAssessmentTopic, useUpdateAssessmentTopic } from '@/hooks/use-assessment';

export function AssessmentTopicSidebar({ topics, activeTopicId, onSelect, assessmentId }: any) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const [localTopics, setLocalTopics] = useState<any[]>([]);

  const createTopic = useCreateAssessmentTopic();
  const updateTopicApi = useUpdateAssessmentTopic();
  // const deleteTopicApi = useDeleteAssessmentTopic();

  // =========================
  // SYNC SERVER
  // =========================
  useEffect(() => {
    setLocalTopics(topics || []);
  }, [topics]);

  // =========================
  // ADD LOCAL DRAFT
  // =========================
  const addTopic = () => {
    const draft = {
      assessment_topic_id: `draft-${Date.now()}`,
      title: '',
      code: '',
      isDraft: true
    };

    setLocalTopics((prev) => [...prev, draft]);

    setEditingId(Number(draft?.assessment_topic_id));
  };

  // =========================
  // UPDATE LOCAL
  // =========================
  const updateTopicField = (id: any, field: string, value: string) => {
    setLocalTopics((prev) => prev.map((t) => (t.assessment_topic_id === id ? { ...t, [field]: value } : t)));
  };

  // =========================
  // SAVE TOPIC
  // =========================
  const saveTopic = async (topic: any) => {
    if (!topic.title.trim()) return;

    try {
      // =========================
      // CREATE
      // =========================
      if (topic.isDraft) {
        const response = await createTopic.mutateAsync({
          assessment_id: assessmentId,
          title: topic.title,
          code: topic.code
        });

        const newTopicId = response?.data?.topic_id;

        // replace draft with saved topic
        setLocalTopics((prev) =>
          prev.map((t) =>
            t.assessment_topic_id === topic.assessment_topic_id
              ? {
                  ...t,
                  assessment_topic_id: newTopicId,
                  isDraft: false
                }
              : t
          )
        );

        // auto select new topic
        onSelect(newTopicId);
      }

      // =========================
      // UPDATE
      // =========================
      else {
        return;
        // await updateTopicApi.mutateAsync({
        //   id: topic.assessment_topic_id,
        //   assessment_id: assessmentId,
        //   title: topic.title,
        //   code: topic.code
        // });
      }

      setEditingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteTopic = async (topic: any) => {
    // remove local draft only
    if (topic.isDraft) {
      setLocalTopics((prev) => prev.filter((t) => t.assessment_topic_id !== topic.assessment_topic_id));

      return;
    }

    // // remove DB topic
    // await deleteTopicApi.mutateAsync({
    //   id: topic.assessment_topic_id,
    //   assessment_id: assessmentId
    // });
  };

  return (
    <div className='h-full flex flex-col'>
      {/* HEADER */}
      <div className='p-4 border-b flex items-center justify-between'>
        <div>
          <h2 className='font-semibold'>Assessment Topics</h2>

          <p className='text-xs text-muted-foreground'>Organize questions by topic</p>
        </div>

        <Button
          size='icon'
          variant='secondary'
          onClick={addTopic}
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* TOPICS */}
      <div className='flex-1 overflow-auto p-2 space-y-2'>
        {localTopics.map((topic: any) => {
          const active = activeTopicId === topic.assessment_topic_id;

          const editing = editingId === topic.assessment_topic_id;

          return (
            <div
              key={topic.assessment_topic_id}
              className={`rounded-xl border p-3 transition-all ${active ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
            >
              <div className='flex justify-between gap-2'>
                {/* LEFT */}
                <div className='flex gap-3 flex-1'>
                  <div className='h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <Brain className='h-4 w-4 text-primary' />
                  </div>

                  <div className='flex-1 space-y-2'>
                    {editing ? (
                      <>
                        {/* TITLE */}
                        <Input
                          placeholder='Topic title'
                          value={topic.title}
                          onChange={(e) => updateTopicField(topic.assessment_topic_id, 'title', e.target.value)}
                        />

                        {/* CODE */}
                        <Input
                          placeholder='code (e.g. social)'
                          value={topic.code}
                          onChange={(e) => updateTopicField(topic.assessment_topic_id, 'code', e.target.value)}
                        />
                      </>
                    ) : (
                      <div
                        className='cursor-pointer'
                        onClick={() => onSelect(topic.assessment_topic_id)}
                      >
                        <p className='font-medium text-sm'>{topic.title}</p>

                        <p className='text-xs text-muted-foreground'>{topic.code || 'No code'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className='flex gap-1'>
                  {editing ? (
                    <>
                      {/* SAVE */}
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => saveTopic(topic)}
                      >
                        <Check className='h-4 w-4 text-green-600' />
                      </Button>

                      {/* CANCEL */}
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => {
                          if (topic.isDraft) {
                            setLocalTopics((prev) => prev.filter((t) => t.assessment_topic_id !== topic.assessment_topic_id));
                          }

                          setEditingId(null);
                        }}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* EDIT */}
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => setEditingId(topic.assessment_topic_id)}
                      >
                        <Pencil className='h-3 w-3' />
                      </Button>

                      {/* DELETE */}
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => deleteTopic(topic)}
                      >
                        <Trash2 className='h-3 w-3 text-red-500' />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {active && !editing && (
                <div className='flex justify-end mt-2'>
                  <ChevronRight className='h-4 w-4 text-primary' />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
