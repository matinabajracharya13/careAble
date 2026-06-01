'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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

import { useUIStore } from '@/store/ui-store';

import { useCreateAssessment } from '@/hooks/use-assessment';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useRoles } from '@/hooks/use-roles';
import {
  createAssessmentSchema,
  CreateOnboardingFormValues,
  createOnboardingSchema,
  type CreateAssessmentFormValues
} from '@/lib/validations';

export function OnboardingPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);

  const { addToast } = useUIStore();

  // ======================================================
  // FETCH
  // ======================================================

  const { data, isLoading } = useOnboarding();

  const onboarding = data?.data ?? [];

  // ======================================================
  // MUTATIONS
  // ======================================================

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
          <h1 className='text-2xl font-bold'>Onboarding</h1>

          <p className='text-sm text-muted-foreground mt-1'>Manage onboarding for individual role.</p>
        </div>
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

            <Badge variant='secondary'>{onboarding?.length} onboarding</Badge>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/30'>
                  <th className='text-left px-6 py-3'>Role Name</th>

                  <th className='text-left px-4 py-3'>Total Categories</th>

                  <th className='text-left px-4 py-3'>Total Questions</th>

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
                  : onboarding?.map((o: any) => (
                      <tr
                        key={o.role_id}
                        className='hover:bg-muted/30 transition'
                      >
                        {/* TITLE */}
                        <td className='px-6 py-4'>
                          <div className='flex items-start gap-3'>
                            <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                              <Activity className='h-5 w-5 text-primary' />
                            </div>

                            <p className='font-medium'>{o.role_name}</p>
                          </div>
                        </td>

                        {/* DOMAIN */}
                        <td className='px-4 py-4'>
                          <Badge variant='secondary'>{o.category_count}</Badge>
                        </td>
                        <td className='px-4 py-4'>
                          <Badge variant='secondary'>{o.question_count}</Badge>
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
                                onClick={() => navigate(`/onboarding/${o.role_id}`)}
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
                                onClick={() => handleDelete(o)}
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

            {!isLoading && onboarding?.length === 0 && <div className='text-center py-12 text-muted-foreground'>No assessments found</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
