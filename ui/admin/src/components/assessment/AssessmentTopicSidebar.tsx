'use client';

import { useEffect, useState } from 'react';
import { Brain, ChevronRight, Pencil, Plus, Trash2, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { useCreateAssessmentTopic } from '@/hooks/use-assessment';
import { useCompetencyDomains } from '@/hooks/use-competency';

export function AssessmentTopicSidebar({ topics, activeTopicId, onSelect, assessmentId }: any) {
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [localTopics, setLocalTopics] = useState<any[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<Record<string, number[]>>({});

  const createTopic = useCreateAssessmentTopic();

  const { data: domainData } = useCompetencyDomains();
  const domains = domainData?.data ?? [];

  // ======================================================
  // SYNC TOPICS FROM SERVER
  // ======================================================
  useEffect(() => {
    if (!topics?.length) return;

    setLocalTopics(topics);

    // hydrate selected domains from backend
    const mapped: Record<string, number[]> = {};

    for (const t of topics) {
      mapped[t.assessment_topic_id] = t.domains?.map((d: any) => d.domain_id) || [];
    }

    setSelectedDomains(mapped);
  }, [topics]);

  // ======================================================
  // ADD TOPIC
  // ======================================================
  const addTopic = () => {
    const draftId = `draft-${Date.now()}`;

    const draft = {
      assessment_topic_id: draftId,
      title: '',
      code: '',
      isDraft: true,
      domains: []
    };

    setLocalTopics((prev) => [...prev, draft]);
    setEditingId(draftId);
    setSelectedDomains((prev) => ({ ...prev, [draftId]: [] }));
  };

  // ======================================================
  // UPDATE FIELD
  // ======================================================
  const updateTopicField = (id: any, field: string, value: string) => {
    setLocalTopics((prev) => prev.map((t) => (t.assessment_topic_id === id ? { ...t, [field]: value } : t)));
  };

  // ======================================================
  // TOGGLE DOMAIN
  // ======================================================
  const toggleDomain = (topicId: any, domainId: number) => {
    setSelectedDomains((prev) => {
      const current = prev[topicId] || [];

      return {
        ...prev,
        [topicId]: current.includes(domainId) ? current.filter((d) => d !== domainId) : [...current, domainId]
      };
    });
  };

  // ======================================================
  // SAVE TOPIC
  // ======================================================
  const saveTopic = async (topic: any) => {
    if (!topic.title.trim()) return;

    const domain_ids = selectedDomains[topic.assessment_topic_id] || [];

    try {
      const response = await createTopic.mutateAsync({
        assessment_id: assessmentId,
        title: topic.title,
        code: topic.code,
        domain_ids
      });

      const newId = response?.data?.assessment_topic_id;

      // replace draft id
      setLocalTopics((prev) =>
        prev.map((t) => (t.assessment_topic_id === topic.assessment_topic_id ? { ...t, assessment_topic_id: newId, isDraft: false } : t))
      );

      // move selected domains
      setSelectedDomains((prev) => {
        const copy = { ...prev };
        copy[newId] = copy[topic.assessment_topic_id] || [];
        delete copy[topic.assessment_topic_id];
        return copy;
      });

      setEditingId(null);
      onSelect(newId);
    } catch (err) {
      console.error(err);
    }
  };

  // ======================================================
  // DELETE TOPIC (LOCAL ONLY)
  // ======================================================
  const deleteTopic = (topic: any) => {
    setLocalTopics((prev) => prev.filter((t) => t.assessment_topic_id !== topic.assessment_topic_id));
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

      {/* LIST */}
      <div className='flex-1 overflow-auto p-2 space-y-2'>
        {localTopics.map((topic: any) => {
          const active = activeTopicId === topic.assessment_topic_id;
          const editing = editingId === topic.assessment_topic_id;

          const selected = selectedDomains[topic.assessment_topic_id] || topic.domains?.map((d: any) => d.domain_id) || [];

          return (
            <div
              key={topic.assessment_topic_id}
              className={`rounded-xl border p-3 ${active ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
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
                        <Input
                          placeholder='Topic title'
                          value={topic.title}
                          onChange={(e) => updateTopicField(topic.assessment_topic_id, 'title', e.target.value)}
                        />

                        <Input
                          placeholder='Code'
                          value={topic.code}
                          onChange={(e) => updateTopicField(topic.assessment_topic_id, 'code', e.target.value)}
                        />

                        {/* DOMAIN SELECT */}
                        <div className='flex flex-wrap gap-2 pt-1'>
                          {domains.map((d: any) => {
                            const isActive = selected.includes(d.domain_id);

                            return (
                              <Badge
                                key={d.domain_id}
                                onClick={() => toggleDomain(topic.assessment_topic_id, d.domain_id)}
                                className={`cursor-pointer ${isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
                              >
                                {d.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={() => onSelect(topic.assessment_topic_id)}
                        className='cursor-pointer'
                      >
                        <p className='font-medium text-sm'>{topic.title}</p>
                        <p className='text-xs text-muted-foreground'>{topic.code || 'No code'}</p>

                        <div className='flex flex-wrap gap-1 mt-2'>
                          {selected.map((id: number) => {
                            const d = domains.find((x: any) => x.domain_id === id);

                            return (
                              <Badge
                                key={id}
                                variant='secondary'
                              >
                                {d?.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className='flex gap-1'>
                  {editing ? (
                    <>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => saveTopic(topic)}
                      >
                        <Check className='h-4 w-4 text-green-600' />
                      </Button>

                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => setEditingId(null)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => setEditingId(topic.assessment_topic_id)}
                      >
                        <Pencil className='h-3 w-3' />
                      </Button>

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
