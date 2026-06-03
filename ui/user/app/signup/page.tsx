'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Card,
  CardContent,
  Badge
} from '@/components/ui/ui-components';

import { toast } from '@/components/ui/toast';

import { authApi, roleApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

import { cn } from '@/lib/utils';

import { useQuery } from '@tanstack/react-query';

import { ICON_MAP } from '@/lib/icon-map';

import { APP_PERKS } from '@/config/site';
import { DEFAULT_SIGNUP_ROLE } from '@/constants/roles';
import { MESSAGES } from '@/constants/messages';
import { APP_SHORT_NAME } from '@/constants/app';
import { SignupPayload } from '@/types';

const schema = z
  .object({
    first_name: z
      .string()
      .min(2, 'First name must be at least 2 characters'),

    last_name: z
      .string()
      .min(2, 'Last name must be at least 2 characters'),

    email: z
      .string()
      .email('Invalid email'),

    phone: z
      .string()
      .min(8, 'Phone number is required')
      .max(20, 'Phone number too long'),

    date_of_birth: z
      .string()
      .min(1, 'Date of birth is required'),

    postcode: z
      .string()
      .min(3, 'Postcode is required'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),

    confirmPassword: z.string(),

    role: z.string(),

    accepted_terms: z
      .boolean()
      .refine((v) => v === true, {
        message: 'You must accept terms and conditions'
      }),

    research_consent: z.boolean()
  })

  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [selectedRole, setSelectedRole] =
    useState<string>(DEFAULT_SIGNUP_ROLE);

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: roleApi.getRoles
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      role: DEFAULT_SIGNUP_ROLE,
      accepted_terms: false,
      research_consent: false
    }
  });

  const selectRole = (role: string) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const response = await authApi.signup(data as SignupPayload);

      login(response.token, response.user);

      toast({
        variant: 'success',
        title: MESSAGES.auth.signupSuccess(
          response.user.name
        )
      });

      if (!response.user.onboarding_completed) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Signup failed',
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background relative overflow-hidden pt-16 py-10'>
      <div className='absolute inset-0 bg-mesh-gradient pointer-events-none' />

      <div className='absolute top-1/4 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl' />

      <div className='w-full max-w-5xl px-4 relative z-10 animate-fade-in'>
        {/* BACK */}
        <div className='mb-6'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to home
          </Link>
        </div>

        <div className='grid md:grid-cols-5 gap-8'>
          {/* LEFT */}
          <div className='md:col-span-2 space-y-8 pt-4'>
            <div>
              <div className='h-10 w-10 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-md shadow-primary/20'>
                <span className='text-primary-foreground font-display font-bold text-sm'>
                  {APP_SHORT_NAME}
                </span>
              </div>

              <Badge className='mb-3'>
                Join CareAble
              </Badge>

              <h1 className='text-3xl font-display font-bold mb-2'>
                Create your account
              </h1>

              <p className='text-muted-foreground text-sm'>
                Join thousands of professionals and
                companies on CareAble.
              </p>
            </div>

            <ul className='space-y-3'>
              {APP_PERKS.map((p) => (
                <li
                  key={p}
                  className='flex items-center gap-3 text-sm'
                >
                  <CheckCircle className='h-4 w-4 text-success shrink-0' />
                  {p}
                </li>
              ))}
            </ul>

            <p className='text-xs text-muted-foreground'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-primary font-medium hover:underline'
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* FORM */}
          <Card className='md:col-span-3 border-border/60 shadow-xl'>
            <CardContent className='p-8 space-y-6'>
              {/* ROLE */}
              <div className='space-y-3'>
                <label className='text-sm font-medium'>
                  I am a…
                </label>

                <div className='grid grid-cols-2 gap-3'>
                  {roles?.map((opt: any) => {
                    const Icon =
                      ICON_MAP[opt.icon_key];

                    return (
                      <button
                        key={opt.role_name}
                        type='button'
                        onClick={() =>
                          selectRole(opt.role_name)
                        }
                        className={cn(
                          'flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',

                          selectedRole ===
                            opt.role_name
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground/30'
                        )}
                      >
                        <div
                          className={cn(
                            'h-9 w-9 rounded-lg flex items-center justify-center',

                            selectedRole ===
                              opt.role_name
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary'
                          )}
                        >
                          {Icon && (
                            <Icon className='h-4 w-4' />
                          )}
                        </div>

                        <div>
                          <p className='text-sm font-semibold'>
                            {opt.label}
                          </p>

                          <p className='text-xs text-muted-foreground'>
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <input
                type='hidden'
                {...register('role')}
              />

              {/* FORM */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='space-y-5'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <label className='text-sm font-medium'>
                      First name
                    </label>

                    <Input
                      placeholder='Jane'
                      {...register('first_name')}
                      error={
                        errors.first_name?.message
                      }
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-sm font-medium'>
                      Last name
                    </label>

                    <Input
                      placeholder='Smith'
                      {...register('last_name')}
                      error={
                        errors.last_name?.message
                      }
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className='space-y-1.5'>
                  <label className='text-sm font-medium'>
                    Email address
                  </label>

                  <Input
                    type='email'
                    placeholder='jane@example.com'
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>

                {/* PHONE + DOB */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <label className='text-sm font-medium'>
                      Phone number
                    </label>

                    <Input
                      placeholder='+61 400 000 000'
                      {...register('phone')}
                      error={errors.phone?.message}
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-sm font-medium'>
                      Date of birth
                    </label>

                    <Input
                      type='date'
                      {...register('date_of_birth')}
                      error={errors.date_of_birth?.message}
                    />
                  </div>
                </div>

                {/* POSTCODE */}
                <div className='space-y-1.5'>
                  <label className='text-sm font-medium'>
                    Postal code
                  </label>

                  <Input
                    placeholder='3073'
                    {...register('postcode')}
                    error={
                      errors.postcode?.message
                    }
                  />
                </div>

                {/* PASSWORDS */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <label className='text-sm font-medium'>
                      Password
                    </label>

                    <Input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      placeholder='8+ characters'
                      suffix={
                        <button
                          type='button'
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                      }
                      {...register('password')}
                      error={
                        errors.password?.message
                      }
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-sm font-medium'>
                      Confirm password
                    </label>

                    <Input
                      type='password'
                      placeholder='Repeat password'
                      {...register(
                        'confirmPassword'
                      )}
                      error={
                        errors.confirmPassword
                          ?.message
                      }
                    />
                  </div>
                </div>

                {/* CONSENTS */}
                <div className='space-y-3 rounded-xl border p-4 bg-muted/20'>
                  <label className='flex items-start gap-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      className='mt-1'
                      {...register(
                        'accepted_terms'
                      )}
                    />

                    <div>
                      <p className='text-sm font-medium'>
                        I agree to the Terms &
                        Privacy Policy
                      </p>

                      <p className='text-xs text-muted-foreground'>
                        Required to create your
                        account.
                      </p>
                    </div>
                  </label>

                  {errors.accepted_terms && (
                    <p className='text-xs text-destructive'>
                      {
                        errors.accepted_terms
                          .message
                      }
                    </p>
                  )}

                  <label className='flex items-start gap-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      className='mt-1'
                      {...register(
                        'research_consent'
                      )}
                    />

                    <div>
                      <p className='text-sm font-medium'>
                        I consent to research
                        participation
                      </p>

                      <p className='text-xs text-muted-foreground'>
                        Required. Helps improve
                        support services and
                        platform insights.
                      </p>
                    </div>
                  </label>
                </div>

                {/* SUBMIT */}
                <Button
                  type='submit'
                  className='w-full'
                  size='lg'
                  loading={loading}
                >
                  <UserPlus className='h-4 w-4' />
                  Create account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}