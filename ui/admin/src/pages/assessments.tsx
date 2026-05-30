'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, MoreHorizontal, Pencil, Plus, Search, Trash2, Eye, Layers3 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Skeleton } from '@/components/ui/skeleton';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { FormField } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';

import { useUIStore } from '@/store/ui-store';

import { useAssessments, useCreateAssessment } from '@/hooks/use-assessment';

import { createAssessmentSchema, type CreateAssessmentFormValues } from '@/lib/validations';

export function AssessmentsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);

  const { addToast } = useUIStore();

  // ======================================================
  // FETCH
  // ======================================================

  const { data, isLoading } = useAssessments();

  const assessments = data?.data ?? [];

  // ======================================================
  // MUTATIONS
  // ======================================================

  const createAssessment = useCreateAssessment();

  // ======================================================
  // FORM
  // ======================================================

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateAssessmentFormValues>({
    resolver: zodResolver(createAssessmentSchema),

    defaultValues: {
      is_active: true
    }
  });

  // ======================================================
  // CREATE
  // ======================================================

  async function onSubmit(values: CreateAssessmentFormValues) {
    try {
      const response = await createAssessment.mutateAsync(values);
      console.log(response);

      addToast({
        title: 'Assessment created',
        description: `${values.title} created successfully.`,
        variant: 'success'
      });

      setCreateOpen(false);

      reset();

      // optional redirect
      navigate(`/assessments/${response.data.assessment_id}`);
      return;
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to create assessment.',
        variant: 'destructive'
      });
    }
  }

  // ======================================================
  // DELETE
  // ======================================================

  async function handleDelete(assessment: any) {
    try {
      // await deleteAssessment.mutateAsync(assessment.assessment_id)

      addToast({
        title: 'Assessment deleted',
        description: `${assessment.title} removed`
      });
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to delete assessment',
        variant: 'destructive'
      });
    }
  }

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Assessments</h1>

          <p className='text-sm text-muted-foreground mt-1'>Manage assessment frameworks, psychometrics, and scoring systems.</p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className='gap-2'
        >
          <Plus className='h-4 w-4' />
          Create Assessment
        </Button>
      </div>

      {/* ====================================================== */}
      {/* LIST */}
      {/* ====================================================== */}

      <Card>
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-3'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />

              <Input
                placeholder='Search assessments...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-9'
              />
            </div>

            <Badge variant='secondary'>{assessments.length} assessments</Badge>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/30'>
                  <th className='text-left px-6 py-3'>Assessment</th>

                  <th className='text-left px-4 py-3'>Domain</th>

                  <th className='text-left px-4 py-3'>Version</th>

                  <th className='text-left px-4 py-3'>Status</th>

                  <th className='w-12 px-4 py-3' />
                </tr>
              </thead>

              <tbody className='divide-y'>
                {isLoading
                  ? Array.from({
                      length: 5
                    }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({
                          length: 6
                        }).map((_, j) => (
                          <td
                            key={j}
                            className='px-6 py-4'
                          >
                            <Skeleton className='h-4 w-full max-w-[120px]' />
                          </td>
                        ))}
                      </tr>
                    ))
                  : assessments.map((assessment: any) => (
                      <tr
                        key={assessment.assessment_id}
                        className='hover:bg-muted/30 transition'
                      >
                        {/* TITLE */}
                        <td className='px-6 py-4'>
                          <div className='flex items-start gap-3'>
                            <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                              <Activity className='h-5 w-5 text-primary' />
                            </div>

                            <div className='space-y-1'>
                              <p className='font-medium'>{assessment.title}</p>

                              <p className='text-xs text-muted-foreground line-clamp-1'>{assessment.description}</p>
                            </div>
                          </div>
                        </td>

                        {/* DOMAIN */}
                        <td className='px-4 py-4'>
                          <Badge variant='secondary'>{assessment.domain}</Badge>
                        </td>

                        {/* VERSION */}
                        <td className='px-4 py-4 text-muted-foreground'>{assessment.version || '-'}</td>

                        {/* STATUS */}
                        <td className='px-4 py-4'>
                          <Badge variant={assessment.is_active ? 'success' : 'secondary'}>
                            {assessment.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>

                        {/* ACTIONS */}
                        <td className='px-4 py-4'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                              >
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                className='gap-2'
                                onClick={() => navigate(`/assessments/${assessment.assessment_id}`)}
                              >
                                <Eye className='h-4 w-4' />
                                Open Builder
                              </DropdownMenuItem>

                              <DropdownMenuItem className='gap-2'>
                                <Pencil className='h-4 w-4' />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className='gap-2 text-destructive'
                                onClick={() => handleDelete(assessment)}
                              >
                                <Trash2 className='h-4 w-4' />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>

            {!isLoading && assessments.length === 0 && <div className='text-center py-12 text-muted-foreground'>No assessments found</div>}
          </div>
        </CardContent>
      </Card>

      {/* ====================================================== */}
      {/* CREATE DIALOG */}
      {/* ====================================================== */}

      <Dialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      >
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Create Assessment</DialogTitle>

            <DialogDescription>Create a new assessment framework and scoring system.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
          >
            {/* TITLE */}
            <FormField
              label='Title'
              error={errors.title?.message}
            >
              <Input
                {...register('title')}
                placeholder='Caregiver Wellbeing Assessment'
              />
            </FormField>

            {/* DOMAIN */}
            <FormField
              label='Domain'
              error={errors.domain?.message}
            >
              <Input
                {...register('domain')}
                placeholder='wellbeing'
              />
            </FormField>

            {/* VERSION */}
            <FormField
              label='Version'
              error={errors.version?.message}
            >
              <Input
                {...register('version')}
                placeholder='v1'
              />
            </FormField>

            {/* DESCRIPTION */}
            <FormField
              label='Description'
              error={errors.description?.message}
            >
              <Textarea
                {...register('description')}
                placeholder='Describe the purpose of this assessment...'
              />
            </FormField>

            {/* ACTIVE */}
            <label className='flex items-start gap-3 cursor-pointer'>
              <input
                type='checkbox'
                className='mt-1'
                {...register('is_active')}
              />

              <div>
                <p className='text-sm font-medium'>Active Assessment</p>

                <p className='text-xs text-muted-foreground'>Users can access this assessment</p>
              </div>
            </label>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setCreateOpen(false);

                  reset();
                }}
              >
                Cancel
              </Button>

              <Button
                type='submit'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Assessment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
