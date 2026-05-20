// ── Password tab ──────────────────────────────────────────────────────────────

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-separator';
import { EyeOff, Eye, CheckCircle, Shield, Lock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/ui-components';
import z from 'zod';
import { Input } from '../ui/input';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function Password() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const newPw = watch('newPassword') ?? '';

  const strength = (() => {
    let score = 0;
    if (newPw.length >= 8) score++;
    if (/[A-Z]/.test(newPw)) score++;
    if (/[0-9]/.test(newPw)) score++;
    if (/[^A-Za-z0-9]/.test(newPw)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-destructive', 'bg-warning', 'bg-accent', 'bg-success'][strength];

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    // In real app: await authApi.changePassword(data.currentPassword, data.newPassword)
    toast({ variant: 'success', title: 'Password updated!', description: 'Your new password is active.' });
    reset();
    setLoading(false);
  };

  return (
    <div className='space-y-6 max-w-lg'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base flex items-center gap-2'>
            <Lock className='h-4 w-4 text-primary' />
            Change password
          </CardTitle>
          <CardDescription>Choose a strong password you don't use elsewhere.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>Current password</label>
              <Input
                type={showCurrent ? 'text' : 'password'}
                placeholder='Enter your current password'
                suffix={
                  <button
                    type='button'
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    {showCurrent ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                }
                {...register('currentPassword')}
                error={errors.currentPassword?.message}
              />
            </div>

            <Separator />

            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>New password</label>
              <Input
                type={showNew ? 'text' : 'password'}
                placeholder='8+ characters'
                suffix={
                  <button
                    type='button'
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                }
                {...register('newPassword')}
                error={errors.newPassword?.message}
              />
              {newPw.length > 0 && (
                <div className='space-y-1.5 mt-2'>
                  <div className='flex gap-1'>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cn('h-1 flex-1 rounded-full transition-all duration-300', i <= strength ? strengthColor : 'bg-border')}
                      />
                    ))}
                  </div>
                  <p className={cn('text-xs font-medium', strengthColor.replace('bg-', 'text-'))}>{strengthLabel} password</p>
                </div>
              )}
            </div>

            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>Confirm new password</label>
              <Input
                type='password'
                placeholder='Repeat new password'
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
            </div>

            {/* Requirements */}
            <div className='bg-secondary/50 rounded-xl p-4 space-y-1.5'>
              <p className='text-xs font-semibold text-muted-foreground mb-2'>PASSWORD REQUIREMENTS</p>
              {[
                { label: 'At least 8 characters', met: newPw.length >= 8 },
                { label: 'One uppercase letter', met: /[A-Z]/.test(newPw) },
                { label: 'One number', met: /[0-9]/.test(newPw) },
                { label: 'One special character', met: /[^A-Za-z0-9]/.test(newPw) }
              ].map((req) => (
                <div
                  key={req.label}
                  className='flex items-center gap-2 text-xs'
                >
                  {req.met ? (
                    <CheckCircle className='h-3.5 w-3.5 text-success' />
                  ) : (
                    <div className='h-3.5 w-3.5 rounded-full border border-muted-foreground/40' />
                  )}
                  <span className={req.met ? 'text-foreground' : 'text-muted-foreground'}>{req.label}</span>
                </div>
              ))}
            </div>

            <Button
              type='submit'
              loading={loading}
              className='w-full'
            >
              <Lock className='h-4 w-4' />
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security info */}
      <Card className='border-primary/20 bg-primary/5'>
        <CardContent className='p-5 flex gap-3'>
          <Shield className='h-5 w-5 text-primary shrink-0 mt-0.5' />
          <div className='space-y-1'>
            <p className='text-sm font-semibold text-primary'>Security tip</p>
            <p className='text-xs text-muted-foreground'>
              Use a password manager to generate and store unique passwords. Never reuse passwords across sites.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
