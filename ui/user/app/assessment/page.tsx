'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge, Card, CardContent } from '@/components/ui/ui-components';
import { assessmentApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ChevronRight, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AssessmentListPage() {
  const [search, setSearch] = useState('');

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: assessmentApi.getAssessments
  });

  return (
    <div className='min-h-screen bg-background pt-20 pb-12'>
      <div className='container mx-auto px-4 max-w-5xl'>
        {/* Header */}
        <div className='mb-10 space-y-2 animate-fade-in'>
          <Badge className='bg-primary/10 text-primary border-primary/20'>Skill assessments</Badge>
          <h1 className='text-4xl font-display font-bold'>Choose your assessment</h1>
          <p className='text-muted-foreground max-w-xl'>
            Each assessment is designed by industry experts. Pass to earn a verified certificate.
          </p>
        </div>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row gap-3 mb-8'>
          <Input
            placeholder='Search by title or category…'
            icon={<Search className='h-4 w-4' />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='max-w-sm'
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className='flex items-center justify-center h-48'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        ) : (
          <div className='grid md:grid-cols-2 gap-5'>
            {assessments?.map((assessment) => {
              return (
                <Card
                  key={assessment?.assessment_id}
                  className={cn('card-hover animate-fade-in')}
                  style={{ animationDelay: `${1 * 0.07}s` }}
                >
                  <CardContent className='p-6 space-y-4'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0'>
                        <BookOpen className='h-6 w-6 text-primary' />
                      </div>
                    </div>

                    <div>
                      <h3 className='font-display font-semibold text-lg'>{assessment?.title}</h3>
                      <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>{assessment.description}</p>
                    </div>

                    <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                      <span className='flex items-center gap-1'>
                        <BookOpen className='h-3.5 w-3.5' />
                        {assessment.totalQuestions} questions
                      </span>
                    </div>

                    <div className='flex items-center justify-between pt-2 border-t border-border'>
                      <span className='text-xs text-muted-foreground'>{assessment.domain}</span>
                      <Button
                        size='sm'
                        asChild
                      >
                        <Link href={`/assessment/${assessment.assessment_id}`}>
                          Start assessment
                          <ChevronRight className='h-4 w-4' />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
