'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Checkbox from '@radix-ui/react-checkbox';

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

import { useCreateRole, useRoles } from '@/hooks/use-roles';
import { createRoleSchema, type CreateRoleFormValues } from '@/lib/validations';
import { ICON_MAP } from '@/lib/icon-map';

export function RolesPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const { addToast } = useUIStore();

  const { data, isLoading } = useRoles({ search, limit: 20 });
  const createRole = useCreateRole();
  // const deleteRole = useDeleteRole();

  const roles = data?.data ?? [];

  const renderIcon = (icon_key: string) => {
    const Icon = ICON_MAP[icon_key];
    return <Icon />;
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema)
  });

  async function onSubmit(values: CreateRoleFormValues) {
    try {
      await createRole.mutateAsync(values);
      addToast({
        title: 'Role created',
        description: `${values.role_name} has been added.`,
        variant: 'success'
      });
      setCreateOpen(false);
      reset();
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to create role.',
        variant: 'destructive'
      });
    }
  }

  async function handleDelete(role: any) {
    try {
      // await deleteRole.mutateAsync(role.role_id);
      addToast({
        title: 'Role deleted',
        description: `${role.role_name} removed.`
      });
    } catch {
      addToast({
        title: 'Error',
        description: 'Could not delete role.',
        variant: 'destructive'
      });
    }
  }

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Roles</h1>
          <p className='text-sm text-muted-foreground'>Manage system roles and permissions.</p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className='gap-2'
        >
          <Plus className='h-4 w-4' />
          Add Role
        </Button>
      </div>

      {/* Card */}
      <Card>
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-3'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search roles...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-9'
              />
            </div>

            <Badge variant='secondary'>{roles?.length} roles</Badge>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/30'>
                  <th className='text-left px-6 py-3'>Role Name</th>
                  <th className='text-left px-4 py-3'>Label</th>
                  <th className='text-left px-4 py-3'>Description</th>
                  <th className='text-left px-4 py-3'>Public Signup</th>
                  <th className='w-12 px-4 py-3' />
                </tr>
              </thead>

              <tbody className='divide-y'>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td
                            key={j}
                            className='px-6 py-4'
                          >
                            <Skeleton className='h-4 w-full max-w-[120px]' />
                          </td>
                        ))}
                      </tr>
                    ))
                  : roles.map((role: any) => (
                      <tr
                        key={role.role_id}
                        className='hover:bg-muted/30 transition'
                      >
                        <td className='px-6 py-4 font-medium'>
                          <>
                            {' '}
                            {renderIcon(role.icon_key)}
                            {role.role_name}
                          </>
                        </td>

                        <td className='px-4 py-4'>
                          <Badge variant='secondary'>{role.label || '-'}</Badge>
                        </td>

                        <td className='px-4 py-4 text-muted-foreground'>{role.description || '-'}</td>

                        <td className='px-4 py-4'>
                          <Badge variant={role.is_public_signup ? 'success' : 'secondary'}>{role.is_public_signup ? 'Yes' : 'No'}</Badge>
                        </td>

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
                              <DropdownMenuItem className='gap-2'>
                                <Pencil className='h-4 w-4' />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className='gap-2 text-destructive'
                                onClick={() => handleDelete(role)}
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

            {!isLoading && roles.length === 0 && <div className='text-center py-12 text-muted-foreground'>No roles found</div>}
          </div>
        </CardContent>
      </Card>

      {/* Create Role Dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
            <DialogDescription>Create a new system role.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              label='Role name'
              error={errors.role_name?.message}
            >
              <Input
                {...register('role_name')}
                placeholder='admin'
              />
            </FormField>

            <FormField
              label='Label'
              error={errors.label?.message}
            >
              <Input
                {...register('label')}
                placeholder='Administrator'
              />
            </FormField>

            <FormField
              label='Description'
              error={errors.description?.message}
            >
              <Input
                {...register('description')}
                placeholder='Full access role'
              />
            </FormField>

            <FormField
              label='Icon Key'
              error={errors.icon_key?.message}
            >
              <Input
                {...register('icon_key')}
                placeholder='shield, user, etc.'
              />
            </FormField>
            <label className='flex items-start gap-3 cursor-pointer'>
              <input
                type='checkbox'
                className='mt-1'
                {...register('is_public_signup')}
              />

              <div>
                <p className='text-sm font-medium'>Is Public Signup</p>
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
                {isSubmitting ? 'Creating...' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
